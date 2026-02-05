from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.core.deps import get_db, get_current_admin_user
from app.models.models import User, Transaction, BulkJob
from app.services.credit_manager import credit_manager

router = APIRouter()

class UserAdminResponse(BaseModel):
    id: int
    email: str
    credits: int
    is_active: bool
    is_admin: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CreditUpdate(BaseModel):
    amount: int
    description: str

class AdminStats(BaseModel):
    total_users: int
    total_credits: int
    total_transactions: int
    total_jobs: int

@router.get("/users", response_model=List[UserAdminResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """List all users (Admin only)"""
    return db.query(User).offset(skip).limit(limit).all()

@router.post("/users/{user_id}/credits")
async def update_user_credits(
    user_id: int,
    data: CreditUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Add or set credits for a user (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Use credit manager to add credits and record transaction
    # We'll treat this as a 'bonus' or 'admin_adjustment'
    result = credit_manager.add_credits(
        db,
        user_id=user_id,
        credits=data.amount,
        source="admin_adjustment",
        transaction_id=f"admin_{int(datetime.utcnow().timestamp())}",
        details={"reason": data.description, "admin_id": admin.id}
    )
    return result

@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Enable or disable a user account (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    return {"id": user.id, "email": user.email, "is_active": user.is_active}

@router.get("/stats", response_model=AdminStats)
async def get_system_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Get global system overview (Admin only)"""
    total_users = db.query(func.count(User.id)).scalar()
    total_credits = db.query(func.sum(User.credits)).scalar() or 0
    total_transactions = db.query(func.count(Transaction.id)).scalar()
    total_jobs = db.query(func.count(BulkJob.id)).scalar()
    
    return {
        "total_users": total_users,
        "total_credits": total_credits,
        "total_transactions": total_transactions,
        "total_jobs": total_jobs
    }
