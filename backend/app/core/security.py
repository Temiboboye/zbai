"""
Security utilities for Authentication
Handles password hashing and JWT token generation
"""

import os
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
from passlib.context import CryptContext

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "")
if not SECRET_KEY or SECRET_KEY in ("your_secret_key_change_me", "your-secret-key-change-in-production"):
    import warnings
    warnings.warn("SECRET_KEY is not set or is using a default value. Set a strong SECRET_KEY in production!", RuntimeWarning)
    if os.getenv("ENVIRONMENT", "development") == "production":
        raise RuntimeError("SECRET_KEY must be set to a secure random value in production")
    SECRET_KEY = "dev-only-insecure-key-do-not-use-in-production"
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)


def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def generate_verification_token() -> str:
    """Generate a random token for email verification"""
    import secrets
    return secrets.token_urlsafe(32)


def generate_reset_token() -> str:
    """Generate a random token for password reset"""
    import secrets
    return secrets.token_urlsafe(32)
