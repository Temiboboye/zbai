"""
Celery Tasks for ZeroBounce AI
Async task processing for email verification
"""

from celery import shared_task
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.services.email_verifier import email_verifier
from app.models.models import BulkJob
from datetime import datetime
import asyncio
import structlog

logger = structlog.get_logger()


@celery_app.task(bind=True, name='app.tasks.verify_email', max_retries=3)
def verify_email_task(self, email: str) -> dict:
    """
    Verify a single email address asynchronously.
    
    Args:
        email: The email address to verify
        
    Returns:
        Dict with verification results
    """
    try:
        # Create event loop for async verification
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            result = loop.run_until_complete(email_verifier.verify_email(email))
            logger.info("email_verified", email=email, status=result.get('final_status'))
            return result
        finally:
            loop.close()
            
    except Exception as e:
        logger.error("email_verification_failed", email=email, error=str(e))
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=2 ** self.request.retries)


@celery_app.task(bind=True, name='app.tasks.process_bulk_job', max_retries=1)
def process_bulk_job(self, job_id: str, emails: list, user_id: int) -> dict:
    """
    Process a bulk email verification job.
    
    Args:
        job_id: UUID of the bulk job
        emails: List of email addresses to verify
        user_id: ID of the user who submitted the job
        
    Returns:
        Dict with job completion summary
    """
    db = SessionLocal()
    
    try:
        job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
        if not job:
            logger.error("bulk_job_not_found", job_id=job_id)
            return {"error": "Job not found"}

        results = []
        processed = 0
        
        # Create event loop for async verification
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            for email in emails:
                try:
                    res = loop.run_until_complete(email_verifier.verify_email(email))
                    results.append(res)
                    logger.info("bulk_email_verified", 
                               job_id=job_id, 
                               email=email, 
                               status=res.get('final_status'))
                except Exception as e:
                    logger.error("bulk_email_failed", 
                                job_id=job_id, 
                                email=email, 
                                error=str(e))
                    results.append({
                        "email": email,
                        "error": str(e),
                        "final_status": "error",
                        "safety_score": 0
                    })
                
                processed += 1
                
                # Update progress every 10 emails or on last email
                if processed % 10 == 0 or processed == len(emails):
                    job.processed_count = processed
                    job.results = results.copy()
                    db.commit()

            # Mark job as completed
            job.results = results
            job.processed_count = processed
            job.status = 'completed'
            job.completed_at = datetime.utcnow()
            db.commit()
            
            logger.info("bulk_job_completed", 
                       job_id=job_id, 
                       total_processed=processed,
                       user_id=user_id)
            
            return {
                "job_id": job_id,
                "status": "completed",
                "total_processed": processed,
                "results_count": len(results)
            }
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error("bulk_job_failed", job_id=job_id, error=str(e))
        
        # Mark job as failed
        try:
            job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
            if job:
                job.status = 'failed'
                db.commit()
        except:
            pass
            
        raise self.retry(exc=e, countdown=30)
        
    finally:
        db.close()


@celery_app.task(name='app.tasks.health_check')
def health_check_task() -> dict:
    """Simple health check task for monitoring"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
