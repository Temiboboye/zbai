from datetime import timedelta
from typing import Any, Optional
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core import security, deps
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.models import User
from app.services.email_service import email_service
from app.core.database import get_db

router = APIRouter()

# --- Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordReset(BaseModel):
    token: str
    new_password: str

# --- Endpoints ---

@router.post("/signup", response_model=Token)
async def signup(
    user_in: UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    
    # Create user
    verification_token = security.generate_verification_token()
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
        is_verified=False,
        verification_token=verification_token,
        credits=100  # Free credits on signup
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Send verification email
    try:
        email_service.send_verification_email(user.email, verification_token)
        # Send welcome email (maybe delay this until verification? 
        # But for now, let's send it immediately to engage user)
        email_service.send_welcome_email(user.email, user.email.split('@')[0])
    except Exception as e:
        print(f"Failed to send email: {e}")
        
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Verify email address using token
    """
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
    
    if user.is_verified:
        return {"message": "Email already verified"}
        
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
async def forgot_password(
    email: str = Body(..., embed=True),
    db: Session = Depends(get_db)
) -> Any:
    """
    Password recovery
    """
    user = db.query(User).filter(User.email == email).first()
    
    # Always return success even if user not found (security)
    if user:
        reset_token = security.generate_reset_token()
        user.reset_token = reset_token
        # Token valid for 1 hour
        import datetime
        user.reset_token_expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        db.commit()
        
        try:
            email_service.send_password_reset_email(user.email, reset_token)
        except Exception as e:
            print(f"Failed to send reset email: {e}")
            
    return {"message": "If this email exists in our system, you will receive instructions to reset your password."}


@router.post("/reset-password")
async def reset_password(
    data: PasswordReset,
    db: Session = Depends(get_db)
) -> Any:
    """
    Reset password using token
    """
    import datetime
    user = db.query(User).filter(
        User.reset_token == data.token,
        User.reset_token_expires > datetime.datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    user.hashed_password = get_password_hash(data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password updated successfully"}


@router.get("/me")
def read_users_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "credits": current_user.credits
    }
