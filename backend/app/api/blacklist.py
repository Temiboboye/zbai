from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.services.blacklist_monitor import blacklist_monitor
from app.services.credit_manager import credit_manager, InsufficientCreditsError
from app.core.database import get_db
from app.core.dependencies import get_current_user_id
from app.models.models import BlacklistEntry

router = APIRouter()

class BlacklistCheckRequest(BaseModel):
    target: str

class BlacklistCheckResponse(BaseModel):
    target: str
    resolved_ip: str
    total_checks: int
    listed_count: int
    is_clean: bool
    results: list
    credits_used: int
    credits_remaining: int = 0

class AddBlacklistRequest(BaseModel):
    email: str
    reason: Optional[str] = None

@router.post("/check", response_model=BlacklistCheckResponse)
async def check_blacklist(
    request: BlacklistCheckRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cost = 2 # Cost for blacklist check
    
    # Check credits
    if not credit_manager.has_sufficient_credits(db, user_id, cost):
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient credits. Required: {cost}",
        )

    try:
        # Perform check
        result = await blacklist_monitor.check_blacklist(request.target)
        
        if 'error' in result:
             raise HTTPException(status_code=400, detail=result['error'])

        # Deduct credits
        transaction = credit_manager.deduct_credits(
            db,
            user_id=user_id,
            credits=cost,
            operation_type='blacklist_check',
            operation_details={'target': request.target}
        )
        
        result['credits_remaining'] = transaction['new_balance']
        
        return result
        
    except InsufficientCreditsError:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_blacklist_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Get all blacklist entries for the user"""
    entries = db.query(BlacklistEntry).filter(
        BlacklistEntry.user_id == user_id
    ).offset(skip).limit(limit).all()
    
    total = db.query(BlacklistEntry).filter(
        BlacklistEntry.user_id == user_id
    ).count()
    
    return {
        "entries": [
            {
                "id": entry.id,
                "email": entry.email,
                "reason": entry.reason,
                "created_at": entry.created_at.isoformat() if entry.created_at else None
            }
            for entry in entries
        ],
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.post("/add")
async def add_to_blacklist(
    request: AddBlacklistRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Add an email/domain to the blacklist"""
    # Check if already exists
    existing = db.query(BlacklistEntry).filter(
        BlacklistEntry.user_id == user_id,
        BlacklistEntry.email == request.email
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already in blacklist"
        )
    
    entry = BlacklistEntry(
        user_id=user_id,
        email=request.email,
        reason=request.reason,
        created_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    
    return {
        "success": True,
        "entry": {
            "id": entry.id,
            "email": entry.email,
            "reason": entry.reason,
            "created_at": entry.created_at.isoformat() if entry.created_at else None
        }
    }


@router.delete("/{entry_id}")
async def remove_from_blacklist(
    entry_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Remove an entry from the blacklist"""
    entry = db.query(BlacklistEntry).filter(
        BlacklistEntry.id == entry_id,
        BlacklistEntry.user_id == user_id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(entry)
    db.commit()
    
    return {"success": True, "deleted_id": entry_id}
