"""
Configuration settings for the application
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "ZeroBounce AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API
    API_V1_PREFIX: str = "/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "postgresql://zerobounce:password@localhost/zerobounce"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Email Verification
    SMTP_TIMEOUT: int = 10
    DNS_TIMEOUT: int = 5
    MAX_BULK_SIZE: int = 100000
    VERIFICATION_WORKERS: int = 10
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Credits & Pricing
    CREDIT_COST_USD: float = 0.0003
    FREE_TRIAL_CREDITS: int = 100
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://zerobounce.ai"
    ]
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
