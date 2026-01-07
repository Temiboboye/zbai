"""
Credit Management Service
Handles credit balance tracking, deduction, and transaction history using Database Persistence
"""

from typing import Dict, Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.models.models import User, Transaction

class CreditManager:
    """Manages user credit balance and transactions via Database"""
    
    def _get_user(self, db: Session, user_id: int) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            # For demo: create user if not exists
            user = User(id=user_id, email=f"user_{user_id}@example.com", credits=142500)
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    def get_balance(self, db: Session, user_id: int) -> int:
        """Get current credit balance for user"""
        user = self._get_user(db, user_id)
        return user.credits
    
    def has_sufficient_credits(self, db: Session, user_id: int, required_credits: int) -> bool:
        """Check if user has enough credits"""
        user = self._get_user(db, user_id)
        return user.credits >= required_credits
    
    def deduct_credits(
        self,
        db: Session,
        user_id: int,
        credits: int,
        operation_type: str,
        operation_details: Dict
    ) -> Dict:
        """Deduct credits from user balance"""
        user = self._get_user(db, user_id)
        
        if user.credits < credits:
             raise InsufficientCreditsError(
                f"Insufficient credits. Required: {credits}, Available: {user.credits}"
            )
        
        old_balance = user.credits
        user.credits -= credits
        
        # Record transaction
        transaction = Transaction(
            user_id=user.id,
            type='debit',
            amount=credits, # Store as positive amount for debit record
            description=f"Used for {operation_type}",
            source=operation_type,
            timestamp=datetime.utcnow()
        )
        
        db.add(transaction)
        db.commit()
        db.refresh(user)
        
        return {
            'success': True,
            'credits_deducted': credits,
            'old_balance': old_balance,
            'new_balance': user.credits,
            'transaction_id': transaction.id
        }
    
    def add_credits(
        self,
        db: Session,
        user_id: int,
        credits: int,
        source: str,
        transaction_id: Optional[str] = None,
        details: Optional[Dict] = None
    ) -> Dict:
        """Add credits to user balance"""
        user = self._get_user(db, user_id)
        old_balance = user.credits
        user.credits += credits
        
        transaction = Transaction(
            user_id=user.id,
            type='credit',
            amount=credits,
            description=f"Purchased/Added from {source}",
            source=source,
            timestamp=datetime.utcnow()
        )
        
        db.add(transaction)
        db.commit()
        db.refresh(user)
        
        return {
            'success': True,
            'credits_added': credits,
            'old_balance': old_balance,
            'new_balance': user.credits,
            'transaction_id': transaction.id
        }
    
    def get_transaction_history(
        self,
        db: Session,
        user_id: int,
        limit: int = 50,
        offset: int = 0
    ) -> Dict:
        """Get transaction history for user"""
        total = db.query(Transaction).filter(Transaction.user_id == user_id).count()
        
        txs = db.query(Transaction)\
            .filter(Transaction.user_id == user_id)\
            .order_by(desc(Transaction.timestamp))\
            .offset(offset)\
            .limit(limit)\
            .all()
            
        return {
            'transactions': [
                {
                    'id': t.id,
                    'type': t.type,
                    'credits': t.amount if t.type == 'credit' else -t.amount,
                    'source': t.source,
                    'timestamp': t.timestamp.isoformat(),
                    'description': t.description
                } for t in txs
            ],
            'total': total,
            'limit': limit,
            'offset': offset,
            'has_more': offset + limit < total
        }

class InsufficientCreditsError(Exception):
    """Raised when user doesn't have enough credits"""
    pass

# Singleton instance
credit_manager = CreditManager()
