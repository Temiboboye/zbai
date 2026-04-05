"""
Microsoft Login API Email Checker — Backend API Endpoint
Uses GetCredentialType to validate ANY email address regardless of domain.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.models import User, VerificationHistory
from app.services.office365_checker import office365_checker
from app.services.credit_manager import CreditManager
from typing import List
import structlog

router = APIRouter()
logger = structlog.get_logger()

from pydantic import BaseModel, validator
import re

class MSCheckRequest(BaseModel):
    emails: List[str]
    
    @validator('emails')
    def validate_emails(cls, v):
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
        if len(cleaned) > 500:
            raise ValueError('Maximum 500 emails per request')
        return cleaned


@router.post("")
async def ms_check_emails(
    req: MSCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate emails using Microsoft Login API (GetCredentialType).
    Works with ANY domain — not limited to Office 365.
    Deducts 1 credit per email.
    """
    count = len(req.emails)
    
    cm = CreditManager()
    if not cm.has_sufficient_credits(db, current_user.id, count):
        raise HTTPException(status_code=402, detail="Insufficient credits")
    
    try:
        cm.deduct_credits(db, current_user.id, count, "ms_check", {"count": count})
    except Exception as e:
        logger.error("ms_check_credit_deduction_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Credit deduction failed")
    
    results = []
    
    for email in req.emails:
        try:
            check = office365_checker.check_user_via_login_api(email)
            
            exists = check.get('exists')
            if_exists_result = check.get('if_exists_result', -1)
            details = check.get('details', '')
            
            if exists is True:
                status = 'valid'
            elif exists is False:
                status = 'invalid'
            else:
                status = 'unknown'
            
            result_entry = {
                'email': email,
                'status': status,
                'exists': exists,
                'if_exists_result': if_exists_result,
                'details': details,
            }
            results.append(result_entry)
            
            # Save to history
            try:
                entry = VerificationHistory(
                    user_id=current_user.id,
                    email=email,
                    final_status='valid_safe' if exists else ('invalid' if exists is False else 'unknown'),
                    safety_score=90 if exists else (10 if exists is False else 50),
                    smtp_provider='Microsoft Login API',
                    is_catch_all=False,
                    is_disposable=False,
                    is_role_based=False,
                    source='ms_check',
                    result_json=result_entry,
                )
                db.add(entry)
            except Exception as e:
                logger.error("ms_check_history_save_failed", email=email, error=str(e))
        
        except Exception as e:
            logger.error("ms_check_failed", email=email, error=str(e))
            results.append({
                'email': email,
                'status': 'error',
                'exists': None,
                'if_exists_result': -1,
                'details': f'Error: {str(e)}',
            })
    
    # Commit all history entries
    try:
        db.commit()
    except Exception as e:
        logger.error("ms_check_commit_failed", error=str(e))
        db.rollback()
    
    # Summary
    valid_count = sum(1 for r in results if r['status'] == 'valid')
    invalid_count = sum(1 for r in results if r['status'] == 'invalid')
    unknown_count = sum(1 for r in results if r['status'] in ('unknown', 'error'))
    
    return {
        'total': count,
        'valid': valid_count,
        'invalid': invalid_count,
        'unknown': unknown_count,
        'results': results,
        'credits_used': count,
    }
