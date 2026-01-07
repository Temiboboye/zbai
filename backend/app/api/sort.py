"""
Email Sorting API Endpoint
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List
from sqlalchemy.orm import Session
from app.services.email_sorter import email_sorter
from app.services.credit_manager import credit_manager, InsufficientCreditsError
from app.core.database import get_db
from app.core.dependencies import get_current_user_id

router = APIRouter()


class SortRequest(BaseModel):
    emails: List[EmailStr]


@router.post("/")
async def sort_emails(
    request: SortRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Sort emails by provider (Office 365, G Suite, Titan, Other)
    Uses MX record analysis for accurate detection
    """
    try:
        if not request.emails:
            raise HTTPException(status_code=400, detail="Email list cannot be empty")
        
        if len(request.emails) > 10000:
            raise HTTPException(
                status_code=400,
                detail="Maximum 10,000 emails per request"
            )
        
        # Calculate cost (e.g., 1 credit per 2 emails, or 0.5 per)
        # For simplicity in integer credits: 1 credit per email for now, or free?
        # Let's say 1 credit per email to be safe, or 1 credit per 10.
        # Product requirement says: "Sorting... credits"
        # Let's assume 1 credit per email for consistency with Verify for now.
        cost = len(request.emails) 
        
        if not credit_manager.has_sufficient_credits(db, user_id, cost):
             raise HTTPException(status_code=402, detail=f"Insufficient credits. Required: {cost}")

        # Sort emails using the email sorter service
        results = email_sorter.sort_emails(request.emails)
        
        # Deduct credits
        credit_manager.deduct_credits(
            db, 
            user_id, 
            cost, 
            "sort_emails", 
            {"count": len(request.emails)}
        )
        
        results['credits_used'] = cost
        return results
        
    except InsufficientCreditsError:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_sorting_stats():
    """
    Get statistics about email sorting service
    """
    return {
        "supported_providers": [
            "Microsoft 365 / Office 365",
            "Google Workspace / G Suite",
            "Titan Email",
            "Zoho Mail",
            "ProtonMail",
            "Yahoo Mail",
            "Other Custom Domains"
        ],
        "detection_methods": [
            "Known consumer domains",
            "MX record analysis",
            "Domain pattern matching"
        ],
        "max_batch_size": 10000
    }
