from typing import Optional
from fastapi import Header, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import ApiKey

# Helper: Get User ID from API Key (Mock Auth for now)
def get_current_user_id(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> int:
    # For demo purposes, we treat the hardcoded key as User 1
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
