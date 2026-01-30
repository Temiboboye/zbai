"""
Rate Limiting Middleware for FastAPI
Uses SlowAPI with Redis backend for distributed rate limiting
"""

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import os

# Use Redis for distributed rate limiting in production
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Create limiter with Redis storage
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=REDIS_URL,
    default_limits=["200/minute"]
)

# Rate limit configurations per endpoint type
RATE_LIMITS = {
    'verify_single': "60/minute",      # Single email verification
    'verify_bulk': "10/minute",        # Bulk verification jobs
    'credits': "100/minute",           # Credits and status checks
    'email_finder': "30/minute",       # Email finder operations
    'default': "100/minute"            # Default for other endpoints
}

def get_rate_limit(endpoint_type: str) -> str:
    """Get rate limit string for endpoint type"""
    return RATE_LIMITS.get(endpoint_type, RATE_LIMITS['default'])
