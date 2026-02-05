from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.deps import get_db, get_current_user
from app.models.models import User
from app.services.payment_service import payment_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class PurchaseRequest(BaseModel):
    pack_id: str
    credits: Optional[int] = None # Ignored, used for frontend validation
    amount: Optional[float] = None # Ignored

@router.post("/stripe/create-checkout")
async def stripe_checkout(
    req: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await payment_service.create_stripe_checkout(db, current_user.id, req.pack_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/crypto/create-invoice")
async def crypto_invoice(
    req: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await payment_service.create_nowpayments_invoice(db, current_user.id, req.pack_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Crypto error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    payload = await request.body()
    try:
        await payment_service.handle_stripe_webhook(db, payload, stripe_signature)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Stripe webhook error: {e}")
        # Return 200 to Stripe so they don't retry endlessly if it's a logic error?
        # Standard: 400 for signature error, 500 for server error.
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/crypto/webhook")
async def crypto_webhook(
    request: Request,
    x_nowpayments_sig: str = Header(None),
    db: Session = Depends(get_db)
):
    data = await request.json()
    try:
        await payment_service.handle_nowpayments_webhook(db, x_nowpayments_sig, data)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Crypto webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
