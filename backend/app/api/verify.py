from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.models import User, BulkJob
from app.services.email_verifier import email_verifier
from app.services.credit_manager import CreditManager
from app.tasks import process_bulk_job
from typing import List, Dict, Any
import uuid
import structlog
from datetime import datetime

router = APIRouter()
logger = structlog.get_logger()

from pydantic import BaseModel, EmailStr, validator

class VerifyRequest(BaseModel):
    email: EmailStr

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

@router.post("")
async def verify_single(
    req: VerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check status
    cm = CreditManager()
    if not cm.has_sufficient_credits(db, current_user.id, 1):
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    try:
        # Deduct credit
        cm.deduct_credits(
            db, 
            current_user.id, 
            1, 
            "single_verification", 
            {"email": req.email}
        )
        
        # Verify
        result = await email_verifier.verify_email(req.email)
        return result
    except Exception as e:
        logger.error("verification_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Verification failed")

@router.post("/bulk")
async def verify_bulk(
    req: BulkVerifyRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = len(req.emails)
    if count == 0:
        raise HTTPException(status_code=400, detail="No emails provided")
        
    cm = CreditManager()
    if not cm.has_sufficient_credits(db, current_user.id, count):
        raise HTTPException(status_code=402, detail="Insufficient credits")
        
    try:
        # Deduct credits
        cm.deduct_credits(
            db, 
            current_user.id, 
            count, 
            "bulk_verification", 
            {"count": count}
        )
        
        # Create Job
        job_id = str(uuid.uuid4())
        job = BulkJob(
            id=job_id,
            user_id=current_user.id,
            status="processing",
            total_emails=count,
            processed_count=0,
            results=[]
        )
        db.add(job)
        db.commit()
        
        # Trigger Celery Task
        process_bulk_job.delay(job_id, req.emails, current_user.id)
        
        return {
            "job_id": job_id,
            "status": "processing",
            "total_emails": count
        }
    except Exception as e:
        logger.error("bulk_verification_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bulk/{job_id}")
async def get_bulk_status(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(BulkJob).filter(BulkJob.id == job_id, BulkJob.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {
        "job_id": job.id,
        "status": job.status,
        "total_emails": job.total_emails,
        "processed": job.processed_count,
        "created_at": job.created_at
    }

@router.get("/bulk/{job_id}/results")
async def get_bulk_results(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(BulkJob).filter(BulkJob.id == job_id, BulkJob.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {
        "results": job.results or []
    }
