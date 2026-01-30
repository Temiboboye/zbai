"""
API Key Manager Service
Handles API key generation, validation, storage, and usage tracking via Database.
Uses SHA-256 hashing for secure key storage.
"""

import secrets
import string
import hashlib
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import ApiKey, User


class APIKeyManager:
    
    def _hash_key(self, key_string: str) -> str:
        """Hash an API key using SHA-256"""
        return hashlib.sha256(key_string.encode()).hexdigest()
    
    def _get_key_prefix(self, key_string: str) -> str:
        """Get first 12 chars of key for display (e.g., 'zb_live_Ab12...')"""
        return key_string[:12] + "..."
    
    def generate_key_string(self, prefix: str = "zb_live_") -> str:
        """Generate a secure random API key string"""
        chars = string.ascii_letters + string.digits
        random_part = ''.join(secrets.choice(chars) for _ in range(32))
        return f"{prefix}{random_part}"

    def create_key(self, db: Session, user_id: int, name: str, limit: int = 1000) -> Dict:
        """Create a new API key - returns plain key once, stores hash"""
        key_string = self.generate_key_string()
        key_hash = self._hash_key(key_string)
        key_prefix = self._get_key_prefix(key_string)
        
        new_key = ApiKey(
            name=name,
            key=key_hash,  # Store hash, not plain key
            key_prefix=key_prefix,  # Store prefix for display
            created_at=datetime.utcnow(),
            rate_limit=limit,
            usage_count=0,
            status="active",
            user_id=user_id
        )
        
        db.add(new_key)
        db.commit()
        db.refresh(new_key)
        
        # Return with plain key (only time user sees it)
        result = self._to_dict(new_key)
        result['key'] = key_string  # Show plain key on creation
        result['key_prefix'] = key_prefix
        return result

    def get_keys(self, db: Session, user_id: int) -> List[Dict]:
        """List all API keys for user (shows prefix only, not full key)"""
        keys = db.query(ApiKey).filter(ApiKey.user_id == user_id, ApiKey.status == 'active').all()
        return [self._to_dict(k, hide_key=True) for k in keys]

    def revoke_key(self, db: Session, user_id: int, key_string: str) -> bool:
        """Revoke (delete) an API key by matching hash"""
        key_hash = self._hash_key(key_string)
        key = db.query(ApiKey).filter(
            ApiKey.key == key_hash, 
            ApiKey.user_id == user_id
        ).first()
        
        if key:
            key.status = 'revoked'  # Soft delete
            db.commit()
            return True
        return False

    def validate_key(self, db: Session, key_string: str) -> Optional[ApiKey]:
        """Validate key by comparing hash"""
        key_hash = self._hash_key(key_string)
        key = db.query(ApiKey).filter(
            ApiKey.key == key_hash, 
            ApiKey.status == 'active'
        ).first()
        return key

    def record_usage(self, db: Session, key_string: str):
        """Record usage for a key"""
        key_hash = self._hash_key(key_string)
        key = db.query(ApiKey).filter(ApiKey.key == key_hash).first()
        if key:
            key.usage_count += 1
            key.last_used = datetime.utcnow()
            db.commit()
            
    def _to_dict(self, key_obj: ApiKey, hide_key: bool = False) -> Dict:
        return {
            "id": str(key_obj.id),
            "name": key_obj.name,
            "key": key_obj.key_prefix if hide_key else key_obj.key,  # Show prefix or hash
            "key_prefix": getattr(key_obj, 'key_prefix', None),
            "created_at": key_obj.created_at.isoformat(),
            "last_used": key_obj.last_used.isoformat() if key_obj.last_used else None,
            "usage_count": key_obj.usage_count,
            "rate_limit": key_obj.rate_limit,
            "status": key_obj.status
        }


api_key_manager = APIKeyManager()
