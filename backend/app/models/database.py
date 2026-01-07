"""
Database models for ZeroBounce AI
"""

from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    credits_balance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    api_keys = relationship("APIKey", back_populates="user")
    verifications = relationship("Verification", back_populates="user")
    bulk_jobs = relationship("BulkJob", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")


class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_hash = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class Verification(Base):
    __tablename__ = "verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    email = Column(String, index=True, nullable=False)
    
    # Verification results
    syntax = Column(String)
    domain = Column(String)
    mx = Column(String)
    smtp = Column(String)
    catch_all = Column(Boolean, default=False)
    disposable = Column(Boolean, default=False)
    role_based = Column(Boolean, default=False)
    is_o365 = Column(Boolean, default=False)
    spam_risk = Column(String)
    final_status = Column(String, index=True)
    safety_score = Column(Integer)
    
    # Metadata
    details = Column(JSON)
    credits_used = Column(Integer, default=1)
    processing_time_ms = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="verifications")


class BulkJob(Base):
    __tablename__ = "bulk_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(String, unique=True, index=True, nullable=False)
    filename = Column(String)
    
    # Job status
    status = Column(String, default="pending", index=True)  # pending, processing, completed, failed
    total_emails = Column(Integer, default=0)
    processed_emails = Column(Integer, default=0)
    valid_emails = Column(Integer, default=0)
    invalid_emails = Column(Integer, default=0)
    risky_emails = Column(Integer, default=0)
    
    # Timing
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Results
    results_file_path = Column(String, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="bulk_jobs")


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    
    # Transaction details
    type = Column(String, nullable=False)  # purchase, refund, bonus
    credits = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)  # in USD
    currency = Column(String, default="USD")
    
    # Payment details
    payment_method = Column(String)  # stripe, paypal, etc.
    payment_id = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, completed, failed, refunded
    
    # Metadata
    description = Column(String)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="transactions")


class DisposableDomain(Base):
    __tablename__ = "disposable_domains"
    
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True, nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String)  # manual, api, community


class SpamTrap(Base):
    __tablename__ = "spam_traps"
    
    id = Column(Integer, primary_key=True, index=True)
    email_hash = Column(String, unique=True, index=True, nullable=False)
    domain = Column(String, index=True)
    risk_level = Column(String)  # high, medium, low
    added_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String)
