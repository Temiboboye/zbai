
import stripe
import requests
import hashlib
import hmac
import json
import logging
from typing import Dict, Optional, Any

logger = logging.getLogger(__name__)
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import Transaction, User
from app.services.credit_manager import CreditManager
from app.services.email_service import email_service # Optional: send confirmation email

CREDIT_PACKS = {
    'pack_1k': {'credits': 1000, 'price': 8.40, 'name': 'Starter'},
    'pack_10k': {'credits': 10000, 'price': 55.30, 'name': 'Professional'},
    'pack_50k': {'credits': 50000, 'price': 209.30, 'name': 'Business'},
    'pack_250k': {'credits': 250000, 'price': 839.30, 'name': 'Enterprise'},
    'pack_1m': {'credits': 1000000, 'price': 2799.30, 'name': 'Volume'},
}

class PaymentService:
    def __init__(self):
        self.nowpayments_api_key = settings.NOWPAYMENTS_API_KEY
        self.nowpayments_ipn_secret = settings.NOWPAYMENTS_IPN_SECRET
        self.nowpayments_base_url = "https://api.nowpayments.io/v1"
        self.app_url = "https://zerobounceai.com" # Should come from settings
        
        if settings.STRIPE_SECRET_KEY:
            stripe.api_key = settings.STRIPE_SECRET_KEY

    def validate_pack(self, pack_id: str) -> Optional[Dict]:
        return CREDIT_PACKS.get(pack_id)

    async def create_nowpayments_invoice(self, db: Session, user_id: int, pack_id: str) -> Dict:
        """Create a NOWPayments invoice for a credit pack"""
        pack = self.validate_pack(pack_id)
        if not pack:
            raise ValueError("Invalid credit pack")

        if not self.nowpayments_api_key:
            raise ValueError("NOWPayments API key not configured")

        # Create Pending Transaction
        transaction = Transaction(
            user_id=user_id,
            type="credit",
            amount=pack['credits'],
            currency_amount=float(pack['price']),
            description=f"Crypto Purchase - {pack_id}",
            source="crypto",
            status="pending"
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        # Call NOWPayments API
        headers = {
            "x-api-key": self.nowpayments_api_key,
            "Content-Type": "application/json"
        }
        
        # Order ID format: "txn_{id}_{timestamp}"
        order_id = f"txn_{transaction.id}"
        
        payload = {
            "price_amount": pack['price'],
            "price_currency": "usd",
            "order_id": order_id,
            "order_description": f"{pack['credits']} Credits",
            "ipn_callback_url": f"{self.app_url}/api/payment/crypto/webhook",
            "success_url": f"{self.app_url}/billing?payment=success&source=crypto",
            "cancel_url": f"{self.app_url}/billing?payment=cancel"
        }

        try:
            response = requests.post(
                f"{self.nowpayments_base_url}/invoice",
                json=payload,
                headers=headers,
                timeout=15
            )
            response.raise_for_status()
            data = response.json()
            
            # Update transaction with external ID
            transaction.reference_id = data.get("id")
            db.commit()
            
            return {
                "payment_url": data.get("invoice_url"),
                "invoice_id": data.get("id"),
                "order_id": order_id
            }
        except Exception as e:
            # Mark failed
            transaction.status = "failed"
            db.commit()
            raise e

    async def handle_nowpayments_webhook(self, db: Session, signature: str, data: Dict):
        """Handle IPN callback from NOWPayments"""
        # 1. Verify Signature (if secret set)
        if self.nowpayments_ipn_secret:
            # NOWPayments IPN signature verification
            # The signature is sent in the x-nowpayments-sig header
            # It's an HMAC-SHA512 of the JSON body (sorted keys) using the IPN secret
            
            # 1. Sort the data by keys
            sorted_data = dict(sorted(data.items()))
            # 2. Stringify the data
            msg = json.dumps(sorted_data, separators=(',', ':'))
            # 3. Calculate HMAC-SHA512
            calculated_sig = hmac.new(
                self.nowpayments_ipn_secret.encode(),
                msg.encode(),
                hashlib.sha512
            ).hexdigest()
            
            if calculated_sig != signature:
                logger.error("nowpayments_signature_mismatch", 
                             received=signature, 
                             calculated=calculated_sig)
                raise ValueError("Invalid NOWPayments signature")

        payment_status = data.get("payment_status")
        order_id = data.get("order_id") # txn_123
        
        if not order_id or not order_id.startswith("txn_"):
            return # Not ours
            
        txn_id = int(order_id.split("_")[1])
        
        transaction = db.query(Transaction).filter(Transaction.id == txn_id).first()
        if not transaction:
            return
            
        if transaction.status == "completed":
            return # Already processed
            
        if payment_status in ["finished", "confirmed"]:
            # Mark completed
            transaction.status = "completed"
            
            # Add Credits
            credit_manager = CreditManager()
            user = db.query(User).filter(User.id == transaction.user_id).first()
            if user:
                # We use CreditManager to add, but CreditManager logic adds Transaction? 
                # Duplicate transaction?
                # CreditManager.add_credits(user_id, amount, description) creates a transaction.
                # Here we ALREADY have a transaction. We just need to update user balance.
                
                # Manual update to avoid double transaction
                user.credits += transaction.amount
                
                # Send email
                try:
                    email_service.send_purchase_confirmation(
                        user.email,
                        user.email.split('@')[0],
                        transaction.amount,
                        transaction.currency_amount,
                        transaction.reference_id or "crypto",
                        "Crypto"
                    )
                except Exception:
                    pass
            
            db.commit()
            
        elif payment_status in ["failed", "expired"]:
            transaction.status = "failed"
            db.commit()

    async def create_stripe_checkout(self, db: Session, user_id: int, pack_id: str) -> Dict:
        """Create Stripe Checkout Session"""
        pack = self.validate_pack(pack_id)
        if not pack:
            raise ValueError("Invalid pack")
            
        if not settings.STRIPE_SECRET_KEY:
             raise ValueError("Stripe not configured")

        # Create Pending Transaction
        transaction = Transaction(
            user_id=user_id,
            type="credit",
            amount=pack['credits'],
            currency_amount=float(pack['price']),
            description=f"Stripe Purchase - {pack_id}",
            source="stripe",
            status="pending"
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f"{pack['credits']:,} Credits",
                        },
                        'unit_amount': int(pack['price'] * 100), # cents
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{self.app_url}/billing?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{self.app_url}/billing?payment=cancel",
                metadata={
                    "transaction_id": transaction.id,
                    "user_id": user_id,
                    "pack_id": pack_id
                }
            )
            
            transaction.reference_id = session.id
            db.commit()
            
            return {"sessionId": session.id, "url": session.url}
            
        except Exception as e:
            transaction.status = "failed"
            db.commit()
            raise e

    async def handle_stripe_webhook(self, db: Session, payload: bytes, sig_header: str):
        """Handle Stripe Webhook"""
        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            raise e
        except stripe.error.SignatureVerificationError as e:
            raise e

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            metadata = session.get('metadata', {})
            txn_id = metadata.get('transaction_id')
            
            if txn_id:
                transaction = db.query(Transaction).filter(Transaction.id == int(txn_id)).first()
                if transaction and transaction.status != 'completed':
                    transaction.status = 'completed'
                    
                    # Update User Credits
                    user = db.query(User).filter(User.id == transaction.user_id).first()
                    if user:
                        user.credits += transaction.amount
                        
                        # Email
                        try:
                            email_service.send_purchase_confirmation(
                                user.email,
                                user.email.split('@')[0],
                                transaction.amount,
                                transaction.currency_amount,
                                transaction.reference_id or "stripe",
                                "Stripe (Card)"
                            )
                        except Exception:
                            pass
                    
                    db.commit()

            # Handle YC Lead Gen Service (Direct Checkout without pre-transaction)
            elif metadata.get('service_type') == 'yc_lead_gen':
                # Check if we already processed this session to prevent duplicates
                existing_txn = db.query(Transaction).filter(Transaction.reference_id == session['id']).first()
                if not existing_txn:
                    # Create Transaction Record
                    # Note: We might not have a user_id if they haven't logged in/signed up?
                    # The current Next.js route doesn't force login? 
                    # Assuming we get email from Stripe customer_details
                    
                    customer_email = session.get('customer_details', {}).get('email')
                    customer_name = session.get('customer_details', {}).get('name', 'Customer')
                    amount_paid = float(session['amount_total']) / 100.0
                    
                    # Find or create user? Or just log transaction with null user for now?
                    # For this specific service, we just want to alert admin.
                    
                    user = db.query(User).filter(User.email == customer_email).first()
                    user_id = user.id if user else None
                    
                    transaction = Transaction(
                        user_id=user_id, # Can be null if model allows, checking model...
                        # Model user_id is ForeignKey("users.id")... might fail if null.
                        # For now, let's assume we alert admin regardless.
                        type="service",
                        amount=0, # No credits
                        currency_amount=amount_paid,
                        description="YC Lead Gen Service",
                        source="stripe",
                        status="completed",
                        reference_id=session['id']
                    )
                    
                    # Only add transaction if we have a user, otherwise we might error on FK
                    if user_id:
                        db.add(transaction)
                        db.commit()
                        txn_db_id = str(transaction.id)
                    else:
                        txn_db_id = f"EXT-{session['id'][-8:]}"

                    # Send Fulfillment Emails
                    try:
                        # 1. Receipt to Customer
                        email_service.send_service_receipt(
                            customer_email,
                            "YC Outbound Growth Package",
                            amount_paid,
                            txn_db_id
                        )
                        
                        # 2. Alert to Admin (Temiboboye/workwithtems@gmail.com)
                        email_service.send_new_service_order_alert(
                            "workwithtems@gmail.com", # Hardcoded admin for now or env var
                            customer_email,
                            "YC Outbound Growth Package",
                            amount_paid,
                            txn_db_id
                        )
                    except Exception as e:
                        logger.error(f"Failed to send service emails: {e}")

payment_service = PaymentService()
