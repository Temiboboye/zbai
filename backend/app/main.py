"""
FastAPI Main Application
Comprehensive Email Verification Platform Backend
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
import asyncio
from datetime import datetime
import uuid
from sqlalchemy.orm import Session

from app.core.database import engine, Base, get_db
from app.services.email_verifier import email_verifier
from app.services.email_sorter import email_sorter
from app.services.credit_manager import credit_manager, InsufficientCreditsError
from app.models.models import BulkJob, ApiKey, User
from app.api import blacklist, sort, analytics, keys

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ZeroBounce AI API",
    description="Comprehensive Email Verification & Deliverability Intelligence Platform",
    version="1.0.0"
)

app.include_router(blacklist.router, prefix="/v1/blacklist", tags=["blacklist"])
app.include_router(sort.router, prefix="/v1/sort", tags=["sort"])
app.include_router(analytics.router, prefix="/v1/analytics", tags=["analytics"])
app.include_router(keys.router, prefix="/v1/keys", tags=["keys"])

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Models
class EmailVerifyRequest(BaseModel):
    email: EmailStr


class EmailVerifyResponse(BaseModel):
    email: str
    syntax: str
    domain: str
    mx: str
    mx_records: list = []  # List of MX records
    smtp: str
    smtp_provider: Optional[str] = None  # SMTP provider name
    catch_all: bool
    disposable: bool
    role_based: bool
    is_o365: bool
    spam_risk: str
    final_status: str
    safety_score: int
    credits_used: int = 1
    timestamp: str
    reason: Optional[str] = None  # Reason for the status


class BulkVerifyRequest(BaseModel):
    emails: List[EmailStr]


class BulkJobResponse(BaseModel):
    job_id: str
    status: str
    total_emails: int
    processed: int
    created_at: str


# Helper: Get User ID from API Key (Mock Auth for now)
def get_current_user_id(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> int:
    # For demo purposes, we treat the hardcoded key as User 1
    # In production, look up the API key in the DB
    if not authorization:
         # Default demo user for frontend ease
         return 1
    
    token = authorization.replace("Bearer ", "")
    if token == "zb_live_demo_key_123456":
         return 1
         
    # Check DB for key
    key_record = db.query(ApiKey).filter(ApiKey.key == token).first()
    if key_record:
        return key_record.user_id # type: ignore
        
    return 1 # Fallback to demo user


@app.get("/")
async def root():
    return {
        "name": "ZeroBounce AI API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/v1/verify", response_model=EmailVerifyResponse)
async def verify_email(
    request: EmailVerifyRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Verify a single email address"""
    try:
        # Check credits first
        if not credit_manager.has_sufficient_credits(db, user_id, 1):
             raise HTTPException(status_code=402, detail="Insufficient credits")

        # Perform verification
        result = await email_verifier.verify_email(request.email)
        
        # Deduct credits & Record transaction
        credit_manager.deduct_credits(
            db, 
            user_id, 
            1, 
            "verify_email", 
            {"email": request.email}
        )
        
        result['timestamp'] = datetime.utcnow().isoformat()
        result['credits_used'] = 1
        return EmailVerifyResponse(**result)
    
    except InsufficientCreditsError:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Background Task for Bulk
def process_bulk_job_task(job_id: str, emails: List[str], user_id: int):
    # Need new session for background thread
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
        if not job:
            return

        results = []
        processed = 0
        
        for email in emails:
            try:
                # We do NOT deduct per email here to avoid 1000s of DB writes 
                # Credits should be deducted in batch upfront
                res = asyncio.run(email_verifier.verify_email(email))
                results.append(res)
            except Exception as e:
                results.append({"email": email, "error": str(e), "final_status": "error"})
            
            processed += 1
            # Update progress periodically
            if processed % 10 == 0:
                job.processed_count = processed
                db.commit()

        job.results = results
        job.processed_count = processed
        job.status = 'completed'
        job.completed_at = datetime.utcnow()
        db.commit()
    except Exception as e:
        print(f"Bulk Job Failed: {e}")
    finally:
        db.close()


@app.post("/v1/bulk", response_model=BulkJobResponse)
async def create_bulk_job(
    request: BulkVerifyRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Create a bulk verification job"""
    # check credits upfront
    count = len(request.emails)
    if not credit_manager.has_sufficient_credits(db, user_id, count):
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Need {count}")

    # Deduct credits
    credit_manager.deduct_credits(db, user_id, count, "bulk_verify", {"count": count})

    job_id = str(uuid.uuid4())
    new_job = BulkJob(
        id=job_id,
        user_id=user_id,
        status="processing",
        total_emails=count,
        processed_count=0,
        results=[],
        created_at=datetime.utcnow()
    )
    db.add(new_job)
    db.commit()

    background_tasks.add_task(process_bulk_job_task, job_id, request.emails, user_id)
    
    return BulkJobResponse(
        job_id=job_id,
        status="processing",
        total_emails=count,
        processed=0,
        created_at=new_job.created_at.isoformat()
    )


@app.get("/v1/bulk/{job_id}", response_model=BulkJobResponse)
async def get_bulk_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return BulkJobResponse(
        job_id=job.id,
        status=job.status,
        total_emails=job.total_emails,
        processed=job.processed_count,
        created_at=job.created_at.isoformat()
    )


@app.get("/v1/bulk/{job_id}/results")
async def get_bulk_job_results(
    job_id: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != 'completed':
        raise HTTPException(status_code=400, detail="Job not completed yet")
    
    results = job.results or []
    
    return {
        "job_id": job.id,
        "results": results,
        "summary": {
            "total": job.total_emails,
            "valid": len([r for r in results if r.get('final_status') == 'valid_safe']),
            "risky": len([r for r in results if 'risky' in r.get('final_status', '')]),
            "invalid": len([r for r in results if r.get('final_status') == 'invalid'])
        }
    }

@app.get("/v1/credits")
async def get_credits(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    balance = credit_manager.get_balance(db, user_id)
    return {
        "credits_remaining": balance,
        "user_id": user_id
    }

class AddCreditsRequest(BaseModel):
    user_id: int
    credits: int
    amount: float
    transaction_id: str
    payment_method: str
    pack_id: Optional[str] = None

@app.post("/v1/credits/add")
async def add_credits(
    request: AddCreditsRequest,
    db: Session = Depends(get_db)
):
    """Add credits to user account after successful payment"""
    try:
        result = credit_manager.add_credits(
            db,
            user_id=request.user_id,
            credits=request.credits,
            source=request.payment_method,
            transaction_id=request.transaction_id,
            details={
                "amount": request.amount,
                "pack_id": request.pack_id
            }
        )
        return {
            "success": True,
            "credits_added": result['credits_added'],
            "new_balance": result['new_balance']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
