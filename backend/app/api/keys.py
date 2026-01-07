from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user_id
from app.services.api_key_manager import api_key_manager

router = APIRouter()

class CreateKeyRequest(BaseModel):
    name: str
    limit: Optional[int] = 1000

class APIKeyResponse(BaseModel):
    id: str
    name: str
    key: str
    created_at: str
    last_used: Optional[str]
    usage_count: int
    rate_limit: int
    status: str

@router.get("/", response_model=List[APIKeyResponse])
async def list_keys(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return api_key_manager.get_keys(db, user_id)

@router.post("/", response_model=APIKeyResponse)
async def create_key(
    request: CreateKeyRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return api_key_manager.create_key(db, user_id, request.name, request.limit)

@router.delete("/{key_string}")
async def revoke_key(
    key_string: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    success = api_key_manager.revoke_key(db, user_id, key_string)
    if not success:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"success": True}
