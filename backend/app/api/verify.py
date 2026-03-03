from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.core.deps import get_db, get_current_user
from app.models.models import User, BulkJob, VerificationHistory
from app.services.email_verifier import email_verifier
from app.services.credit_manager import CreditManager
from app.tasks import process_bulk_job
from typing import List, Dict, Any, Optional
import uuid
import structlog
from datetime import datetime

router = APIRouter()
logger = structlog.get_logger()

from pydantic import BaseModel, EmailStr, validator

class VerifyRequest(BaseModel):
    email: EmailStr

class BulkVerifyRequest(BaseModel):
    emails: List[str]
    
    @validator('emails')
    def validate_emails(cls, v):
        import re
        email_re = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
        cleaned = []
        seen = set()
        for e in v:
            e = e.strip()
            if email_re.match(e) and e.lower() not in seen:
                seen.add(e.lower())
                cleaned.append(e)
        if len(cleaned) == 0:
            raise ValueError('At least 1 valid email required')
        if len(cleaned) > 100000:
            raise ValueError('Maximum 100,000 emails per batch')
        return cleaned


def _save_to_history(db: Session, user_id: int, result: dict, source: str = "single", bulk_job_id: str = None):
    """Save a verification result to the history table"""
    try:
        entry = VerificationHistory(
            user_id=user_id,
            email=result.get('email', ''),
            final_status=result.get('final_status', 'unknown'),
            safety_score=result.get('safety_score', 0),
            smtp_provider=result.get('smtp_provider'),
            is_catch_all=result.get('catch_all', False),
            is_disposable=result.get('disposable', False),
            is_role_based=result.get('role_based', False),
            source=source,
            bulk_job_id=bulk_job_id,
            result_json=result,
        )
        db.add(entry)
        db.commit()
    except Exception as e:
        logger.error("save_history_failed", error=str(e))
        db.rollback()


@router.post("")
async def verify_single(
    req: VerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cm = CreditManager()
    if not cm.has_sufficient_credits(db, current_user.id, 1):
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    try:
        cm.deduct_credits(db, current_user.id, 1, "single_verification", {"email": req.email})
        result = await email_verifier.verify_email(req.email)
        
        # Save to history
        _save_to_history(db, current_user.id, result, source="single")
        
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
        cm.deduct_credits(db, current_user.id, count, "bulk_verification", {"count": count})
        
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
        
        process_bulk_job.delay(job_id, req.emails, current_user.id)
        
        return {
            "job_id": job_id,
            "status": "processing",
            "total_emails": count
        }
    except Exception as e:
        logger.error("bulk_verification_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ── History Endpoints ──────────────────────────────────────────────

@router.get("/history")
async def get_verification_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get paginated verification history for the current user"""
    query = db.query(VerificationHistory).filter(
        VerificationHistory.user_id == current_user.id
    )
    
    # Apply filters
    if status:
        query = query.filter(VerificationHistory.final_status == status)
    if source:
        query = query.filter(VerificationHistory.source == source)
    if search:
        query = query.filter(VerificationHistory.email.ilike(f"%{search}%"))
    
    # Count total
    total = query.count()
    
    # Paginate
    items = (
        query
        .order_by(desc(VerificationHistory.created_at))
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    
    return {
        "items": [
            {
                "id": item.id,
                "email": item.email,
                "final_status": item.final_status,
                "safety_score": item.safety_score,
                "smtp_provider": item.smtp_provider,
                "is_catch_all": item.is_catch_all,
                "is_disposable": item.is_disposable,
                "is_role_based": item.is_role_based,
                "source": item.source,
                "bulk_job_id": item.bulk_job_id,
                "created_at": item.created_at.isoformat() if item.created_at else None,
            }
            for item in items
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/history/stats")
async def get_history_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get aggregate verification stats for the current user"""
    base = db.query(VerificationHistory).filter(
        VerificationHistory.user_id == current_user.id
    )
    
    total = base.count()
    valid = base.filter(VerificationHistory.final_status.in_(["valid_safe", "valid_risky"])).count()
    invalid = base.filter(VerificationHistory.final_status.in_(["invalid", "invalid_syntax", "invalid_domain", "no_mx", "user_not_found"])).count()
    risky = base.filter(VerificationHistory.final_status.in_(["risky", "disposable"])).count()
    
    return {
        "total": total,
        "valid": valid,
        "invalid": invalid,
        "risky": risky,
    }


@router.get("/history/{history_id}")
async def get_history_detail(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get full detail for a single verification history entry"""
    entry = db.query(VerificationHistory).filter(
        VerificationHistory.id == history_id,
        VerificationHistory.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="History entry not found")
    
    return {
        "id": entry.id,
        "email": entry.email,
        "final_status": entry.final_status,
        "safety_score": entry.safety_score,
        "smtp_provider": entry.smtp_provider,
        "is_catch_all": entry.is_catch_all,
        "is_disposable": entry.is_disposable,
        "is_role_based": entry.is_role_based,
        "source": entry.source,
        "bulk_job_id": entry.bulk_job_id,
        "result_json": entry.result_json,
        "created_at": entry.created_at.isoformat() if entry.created_at else None,
    }


# ── Existing bulk status endpoints ─────────────────────────────────

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
