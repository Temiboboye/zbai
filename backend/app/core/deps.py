import hashlib
from typing import Generator, Optional, Union
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core import security
from app.models.models import User, ApiKey
from app.core.security import ALGORITHM, SECRET_KEY
from datetime import datetime

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login", auto_error=False)

def get_db_session() -> Generator:
    db = get_db()
    try:
        yield next(db)
    finally:
        pass # Database session management handled by get_db

async def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    authorization: Optional[str] = Header(None)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. Try JWT (Bearer token)
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == int(user_id)).first()
                if user:
                    return user
        except JWTError:
            pass

    # 2. Try API Key (X-API-Key or Bearer-less Authorization header)
    api_key_str = x_api_key
    if not api_key_str and authorization and not authorization.startswith("Bearer "):
        api_key_str = authorization
    
    if api_key_str:
        # Check for demo key
        if api_key_str == "zb_live_demo_key_123456":
            # For demo user, return user with ID 1
            user = db.query(User).filter(User.id == 1).first()
            if user:
                return user
        
        # Hash the provided key to match stored hash
        key_hash = hashlib.sha256(api_key_str.encode()).hexdigest()
        key_record = db.query(ApiKey).filter(
            ApiKey.key == key_hash,
            ApiKey.status == "active"
        ).first()
        
        if key_record:
            user = db.query(User).filter(User.id == key_record.user_id).first()
            if user:
                # Update key usage stats
                key_record.usage_count += 1
                key_record.last_used = datetime.utcnow()
                db.commit()
                return user

    raise credentials_exception

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )
    return current_user

async def get_current_user_id(
    current_user: User = Depends(get_current_user)
) -> int:
    return current_user.id

