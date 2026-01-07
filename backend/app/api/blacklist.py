from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.blacklist_monitor import blacklist_monitor
from app.services.credit_manager import credit_manager, InsufficientCreditsError
from app.core.database import get_db
from app.core.dependencies import get_current_user_id

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
