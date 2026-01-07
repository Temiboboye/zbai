"""
API Key Manager Service
Handles API key generation, validation, storage, and usage tracking via Database.
"""

import secrets
import string
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import ApiKey, User

class APIKeyManager:
    
    def generate_key_string(self, prefix: str = "zb_live_") -> str:
        """Generate a secure random API key string"""
        chars = string.ascii_letters + string.digits
        random_part = ''.join(secrets.choice(chars) for _ in range(32))
        return f"{prefix}{random_part}"

    def create_key(self, db: Session, user_id: int, name: str, limit: int = 1000) -> Dict:
        """Create a new API key"""
        key_string = self.generate_key_string()
        
        new_key = ApiKey(
            name=name,
            key=key_string,
            created_at=datetime.utcnow(),
            rate_limit=limit,
            usage_count=0,
            status="active",
            user_id=user_id
        )
        
        db.add(new_key)
        db.commit()
        db.refresh(new_key)
        
        return self._to_dict(new_key)

    def get_keys(self, db: Session, user_id: int) -> List[Dict]:
        """List all API keys for user"""
        keys = db.query(ApiKey).filter(ApiKey.user_id == user_id, ApiKey.status == 'active').all()
        return [self._to_dict(k) for k in keys]

    def revoke_key(self, db: Session, user_id: int, key_string: str) -> bool:
        """Revoke (delete) an API key"""
        key = db.query(ApiKey).filter(
            ApiKey.key == key_string, 
            ApiKey.user_id == user_id
        ).first()
        
        if key:
            key.status = 'revoked' # Soft delete
            db.commit()
            return True
        return False

    def validate_key(self, db: Session, key_string: str) -> Optional[ApiKey]:
        """Validate key and return Key object if valid"""
        key = db.query(ApiKey).filter(
            ApiKey.key == key_string, 
            ApiKey.status == 'active'
        ).first()
        return key

    def record_usage(self, db: Session, key_string: str):
        """Record usage for a key"""
        key = db.query(ApiKey).filter(ApiKey.key == key_string).first()
        if key:
            key.usage_count += 1
            key.last_used = datetime.utcnow()
            db.commit()
            
    def _to_dict(self, key_obj: ApiKey) -> Dict:
        return {
            "id": str(key_obj.id),
            "name": key_obj.name,
            "key": key_obj.key,
            "created_at": key_obj.created_at.isoformat(),
            "last_used": key_obj.last_used.isoformat() if key_obj.last_used else None,
            "usage_count": key_obj.usage_count,
            "rate_limit": key_obj.rate_limit,
            "status": key_obj.status
        }

api_key_manager = APIKeyManager()
