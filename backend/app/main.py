"""
FastAPI Main Application
Comprehensive Email Verification Platform Backend
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict
import asyncio
from datetime import datetime
import uuid
import os
from sqlalchemy.orm import Session
import structlog
import sentry_sdk

from app.core.database import engine, Base, get_db
from app.core.rate_limiter import limiter, RATE_LIMITS
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.services.email_verifier import email_verifier
from app.services.email_sorter import email_sorter
from app.services.credit_manager import credit_manager, InsufficientCreditsError
from app.models.models import BulkJob, ApiKey, User
from app.api import blacklist, sort, analytics, keys

# Initialize Sentry for error tracking (optional - only if DSN provided)
SENTRY_DSN = os.getenv('SENTRY_DSN')
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=0.1,
        environment=os.getenv('ENVIRONMENT', 'development')
    )

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logger = structlog.get_logger()

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ZeroBounce AI API",
    description="Comprehensive Email Verification & Deliverability Intelligence Platform",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(blacklist.router, prefix="/v1/blacklist", tags=["blacklist"])
app.include_router(sort.router, prefix="/v1/sort", tags=["sort"])
app.include_router(analytics.router, prefix="/v1/analytics", tags=["analytics"])
app.include_router(keys.router, prefix="/v1/keys", tags=["keys"])

# CORS middleware - Production ready with environment configuration
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
    
    @validator('emails')
    def validate_emails(cls, v):
        if len(v) == 0:
            raise ValueError('At least 1 email required')
        if len(v) > 100000:
            raise ValueError('Maximum 100,000 emails per batch')
        # Remove duplicates while preserving order
        seen = set()
        unique = []
        for email in v:
            if email.lower() not in seen:
                seen.add(email.lower())
                unique.append(email)
        return unique


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


@app.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check with component status"""
    import redis
    import os
    
    health = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "components": {}
    }
    
    # Check database
    try:
        db.execute("SELECT 1")
        health["components"]["database"] = {"status": "healthy"}
    except Exception as e:
        health["components"]["database"] = {"status": "unhealthy", "error": str(e)}
        health["status"] = "degraded"
    
    # Check Redis
    try:
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
        r = redis.from_url(redis_url)
        r.ping()
        health["components"]["redis"] = {"status": "healthy"}
    except Exception as e:
        health["components"]["redis"] = {"status": "unhealthy", "error": str(e)}
        health["status"] = "degraded"
    
    # Check external API (Microsoft Login API)
    try:
        import requests
        resp = requests.get("https://login.microsoftonline.com/common/", timeout=5)
        health["components"]["microsoft_api"] = {
            "status": "healthy" if resp.status_code < 500 else "degraded"
        }
    except Exception as e:
        health["components"]["microsoft_api"] = {"status": "unreachable", "error": str(e)}
    
    return health


@app.post("/v1/verify", response_model=EmailVerifyResponse)
@limiter.limit(RATE_LIMITS['verify_single'])
async def verify_email(
    request: Request,
    email_request: EmailVerifyRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Verify a single email address"""
    try:
        # Check credits first
        if not credit_manager.has_sufficient_credits(db, user_id, 1):
             raise HTTPException(status_code=402, detail="Insufficient credits")

        # Perform verification
        result = await email_verifier.verify_email(email_request.email)
        
        # Deduct credits & Record transaction
        credit_manager.deduct_credits(
            db, 
            user_id, 
            1, 
            "verify_email", 
            {"email": email_request.email}
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
    """Background task to process bulk email verification"""
    # Need new session for background thread
    from app.core.database import SessionLocal
    import asyncio
    
    db = SessionLocal()
    try:
        job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
        if not job:
            print(f"Job {job_id} not found")
            return

        results = []
        processed = 0
        
        # Create new event loop for this thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            for email in emails:
                try:
                    # Run async verification
                    res = loop.run_until_complete(email_verifier.verify_email(email))
                    results.append(res)
                    print(f"Verified: {email} -> {res.get('final_status', 'unknown')}")
                except Exception as e:
                    print(f"Error verifying {email}: {e}")
                    results.append({
                        "email": email, 
                        "error": str(e), 
                        "final_status": "error",
                        "safety_score": 0
                    })
                
                processed += 1
                
                # Update progress in database (every email for better real-time feedback)
                job.processed_count = processed
                job.results = results.copy()  # Copy to ensure it's updated
                db.commit()
                db.refresh(job)  # Refresh to ensure changes are persisted

            # Mark job as completed
            job.results = results
            job.processed_count = processed
            job.status = 'completed'
            job.completed_at = datetime.utcnow()
            db.commit()
            print(f"Job {job_id} completed! Processed {processed} emails.")
            
        finally:
            loop.close()
            
    except Exception as e:
        print(f"Bulk Job {job_id} Failed: {e}")
        import traceback
        traceback.print_exc()
        # Mark job as failed
        try:
            job.status = 'failed'
            db.commit()
        except:
            pass
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
    
    # Return partial results even if job is still processing
    results = job.results or []
    
    # Calculate dynamic summary based on available results
    valid_count = len([r for r in results if r.get('final_status') == 'valid_safe'])
    risky_count = len([r for r in results if 'risky' in r.get('final_status', '') or r.get('final_status') == 'valid_risky'])
    catch_all_count = len([r for r in results if r.get('final_status') == 'risky'])
    mailbox_full_count = len([r for r in results if r.get('final_status') == 'mailbox_full'])
    role_based_count = len([r for r in results if r.get('role_based', False)])
    invalid_count = len([r for r in results if r.get('final_status') in ['invalid', 'invalid_syntax', 'invalid_domain', 'user_not_found']])
    disposable_count = len([r for r in results if r.get('final_status') == 'disposable'])
    
    return {
        "job_id": job.id,
        "status": job.status,
        "results": results,
        "summary": {
            "total": job.total_emails,
            "processed": job.processed_count,
            "valid": valid_count,
            "risky": risky_count,
            "catch_all": catch_all_count,
            "mailbox_full": mailbox_full_count,
            "role_based": role_based_count,
            "invalid": invalid_count,
            "disposable": disposable_count,
            "pending": job.total_emails - job.processed_count
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


# ============================================================
# EMAIL FINDER ENDPOINTS
# ============================================================

from app.services.email_finder import EmailFinderService

# Initialize email finder with verifier for optional verification
email_finder_service = EmailFinderService(email_verifier=email_verifier)


class EmailFindRequest(BaseModel):
    name: str
    domain: str
    verify: bool = False


class EmailFindBulkRequest(BaseModel):
    entries: List[Dict]  # List of {name, domain} dicts
    verify: bool = False


@app.post("/v1/email-finder/find")
async def find_email(
    request: EmailFindRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Find email address for a person at a company.
    
    Generates possible email patterns based on name and domain,
    optionally verifies using SMTP.
    """
    # Check credits (1 credit for find, 2 for find+verify)
    credits_needed = 2 if request.verify else 1
    if not credit_manager.has_sufficient_credits(db, user_id, credits_needed):
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Need {credits_needed}")
    
    # Find email
    result = await email_finder_service.find_email(
        full_name=request.name,
        domain_or_website=request.domain,
        verify=request.verify,
        max_patterns=10
    )
    
    # Deduct credits
    credit_manager.deduct_credits(db, user_id, credits_needed, "email_find", {
        "name": request.name,
        "domain": request.domain,
        "verified": request.verify
    })
    
    result['credits_used'] = credits_needed
    return result


@app.post("/v1/email-finder/bulk")
async def find_emails_bulk(
    request: EmailFindBulkRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Find emails for multiple people from a list of name/domain pairs.
    
    Request body should contain:
    - entries: List of dicts with 'name' and 'domain' keys
    - verify: Whether to verify emails with SMTP
    """
    if not request.entries:
        raise HTTPException(status_code=400, detail="No entries provided")
    
    # Check credits
    credits_per_entry = 2 if request.verify else 1
    credits_needed = len(request.entries) * credits_per_entry
    
    if not credit_manager.has_sufficient_credits(db, user_id, credits_needed):
        raise HTTPException(status_code=402, detail=f"Insufficient credits. Need {credits_needed}")
    
    # Deduct credits upfront
    credit_manager.deduct_credits(db, user_id, credits_needed, "email_find_bulk", {
        "count": len(request.entries),
        "verified": request.verify
    })
    
    # Process all entries
    results = await email_finder_service.find_emails_bulk(
        entries=request.entries,
        verify=request.verify,
        max_patterns=10
    )
    
    # Calculate summary stats
    total = len(results)
    found = len([r for r in results if r.get('email')])
    verified = len([r for r in results if r.get('verified')])
    high_confidence = len([r for r in results if r.get('confidence') == 'high'])
    
    return {
        "results": results,
        "summary": {
            "total": total,
            "found": found,
            "verified": verified,
            "high_confidence": high_confidence,
            "credits_used": credits_needed
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

