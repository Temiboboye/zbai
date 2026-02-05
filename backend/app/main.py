from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
import structlog
import sentry_sdk

from app.core.database import engine, Base, get_db
from app.core.rate_limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api import blacklist, sort, analytics, keys, auth, payment, verify, admin
from app.core.deps import get_current_user_id

# Initialize Sentry for error tracking
SENTRY_DSN = os.getenv('SENTRY_DSN')
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=0.1,
        environment=os.getenv('ENVIRONMENT', 'development')
    )

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logger = structlog.get_logger()

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ZeroBounce AI API",
    description="Comprehensive Email Verification & Deliverability Intelligence Platform",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Routes
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
app.include_router(verify.router, prefix="/v1/verify", tags=["verify"])
app.include_router(blacklist.router, prefix="/v1/blacklist", tags=["blacklist"])
app.include_router(sort.router, prefix="/v1/sort", tags=["sort"])
app.include_router(analytics.router, prefix="/v1/analytics", tags=["analytics"])
app.include_router(keys.router, prefix="/v1/keys", tags=["keys"])
app.include_router(payment.router, prefix="/v1/payment", tags=["payment"])
app.include_router(admin.router, prefix="/v1/admin", tags=["admin"])

# CORS middleware
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "name": "ZeroBounce AI API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check with component status"""
    from sqlalchemy.orm import Session
    import redis
    
    health = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "components": {}
    }
    
    # Check database
    try:
        db.execute("SELECT 1")
        health["components"]["database"] = {"status": "healthy"}
    except Exception as e:
        health["components"]["database"] = {"status": "unhealthy", "error": str(e)}
        health["status"] = "degraded"
    
    # Check Redis
    try:
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
        r = redis.from_url(redis_url)
        r.ping()
        health["components"]["redis"] = {"status": "healthy"}
    except Exception as e:
        health["components"]["redis"] = {"status": "unhealthy", "error": str(e)}
        health["status"] = "degraded"
    
    return health

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


