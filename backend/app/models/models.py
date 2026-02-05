from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    credits = Column(Integer, default=100)  # Sign up bonus (updated to 100 as per EXPECTED.md)
    created_at = Column(DateTime, default=datetime.utcnow)

    api_keys = relationship("ApiKey", back_populates="owner")
    transactions = relationship("Transaction", back_populates="user")
    bulk_jobs = relationship("BulkJob", back_populates="user")


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)  # Now stores SHA-256 hash
    key_prefix = Column(String, nullable=True)  # Display prefix (e.g., "zb_live_Ab12...")
    name = Column(String)
    rate_limit = Column(Integer, default=1000)
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active")
    
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    owner = relationship("User", back_populates="api_keys")



class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    type = Column(String)  # 'credit', 'debit'
    amount = Column(Integer)  # Number of credits
    currency_amount = Column(Float, nullable=True)  # Payment amount if applicable
    description = Column(String)
    source = Column(String)  # 'stripe', 'crypto', 'bonus', 'verification'
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    user = relationship("User", back_populates="transactions")


class BulkJob(Base):
    __tablename__ = "bulk_jobs"

    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    status = Column(String, index=True)  # 'processing', 'completed', 'failed'
    file_name = Column(String, nullable=True)
    total_emails = Column(Integer)
    processed_count = Column(Integer, default=0)
    results = Column(JSON, nullable=True)  # Store results as JSON blob for now
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="bulk_jobs")


class BlacklistEntry(Base):
    __tablename__ = "blacklist_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    email = Column(String, index=True)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
