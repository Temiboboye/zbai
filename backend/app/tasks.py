"""
Celery Tasks for ZeroBounce AI
Async task processing for email verification
"""

from celery import shared_task
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.services.email_verifier import email_verifier
from app.models.models import BulkJob, VerificationHistory
from datetime import datetime
import asyncio
import structlog

logger = structlog.get_logger()

BATCH_SIZE = 5  # Process 5 emails concurrently


@celery_app.task(bind=True, name='app.tasks.verify_email', max_retries=3)
def verify_email_task(self, email: str) -> dict:
    """Verify a single email address asynchronously."""
    try:
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
        raise self.retry(exc=e, countdown=2 ** self.request.retries)


async def _verify_batch(emails: list) -> list:
    """Verify a batch of emails concurrently"""
    tasks = [email_verifier.verify_email(email) for email in emails]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    final = []
    for email, res in zip(emails, results):
        if isinstance(res, Exception):
            logger.error("batch_email_failed", email=email, error=str(res))
            final.append({
                "email": email,
                "error": str(res),
                "final_status": "error",
                "safety_score": 0
            })
        else:
            final.append(res)
    return final


def _save_bulk_history(db, user_id: int, results: list, job_id: str):
    """Save a batch of verification results to history"""
    try:
        for result in results:
            entry = VerificationHistory(
                user_id=user_id,
                email=result.get('email', ''),
                final_status=result.get('final_status', 'unknown'),
                safety_score=result.get('safety_score', 0),
                smtp_provider=result.get('smtp_provider'),
                is_catch_all=result.get('catch_all', False),
                is_disposable=result.get('disposable', False),
                is_role_based=result.get('role_based', False),
                source="bulk",
                bulk_job_id=job_id,
                result_json=result,
            )
            db.add(entry)
        db.commit()
    except Exception as e:
        logger.error("save_bulk_history_failed", error=str(e))
        db.rollback()


@celery_app.task(bind=True, name='app.tasks.process_bulk_job', max_retries=1)
def process_bulk_job(self, job_id: str, emails: list, user_id: int) -> dict:
    """Process a bulk email verification job with batched parallelism."""
    db = SessionLocal()
    
    try:
        job = db.query(BulkJob).filter(BulkJob.id == job_id).first()
        if not job:
            logger.error("bulk_job_not_found", job_id=job_id)
            return {"error": "Job not found"}

        all_results = []
        processed = 0
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            # Process in batches of BATCH_SIZE
            for i in range(0, len(emails), BATCH_SIZE):
                batch = emails[i:i + BATCH_SIZE]
                batch_results = loop.run_until_complete(_verify_batch(batch))
                
                all_results.extend(batch_results)
                processed += len(batch)
                
                # Save batch to history
                _save_bulk_history(db, user_id, batch_results, job_id)
                
                # Log progress
                for res in batch_results:
                    logger.info("bulk_email_verified",
                               job_id=job_id,
                               email=res.get('email'),
                               status=res.get('final_status'))
                
                # Update progress
                job.processed_count = processed
                job.results = all_results.copy()
                db.commit()

            # Mark job as completed
            job.results = all_results
            job.processed_count = processed
            job.status = 'completed'
            job.completed_at = datetime.utcnow()
            db.commit()
            
            logger.info("bulk_job_completed",
                        job_id=job_id,
                        total_processed=processed,
                        user_id=user_id)
            
            # Send completion email
            try:
                import os
                if os.getenv('ENABLE_EMAIL_NOTIFICATIONS', 'true').lower() == 'true':
                    from app.services.email_service import email_service
                    from app.models.models import User
                    
                    user = db.query(User).filter(User.id == user_id).first()
                    if user:
                        valid_count = len([r for r in all_results if r.get('final_status') == 'valid_safe'])
                        invalid_count = len([r for r in all_results if r.get('final_status') in ['invalid', 'invalid_syntax', 'invalid_domain', 'user_not_found']])
                        
                        email_service.send_bulk_job_complete(
                            to=user.email,
                            name=user.email.split('@')[0],
                            job_id=job_id,
                            total_emails=processed,
                            valid_count=valid_count,
                            invalid_count=invalid_count
                        )
            except Exception as e:
                logger.error("bulk_completion_email_failed", job_id=job_id, error=str(e))
            
            return {
                "job_id": job_id,
                "status": "completed",
                "total_processed": processed,
                "results_count": len(all_results)
            }
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error("bulk_job_failed", job_id=job_id, error=str(e))
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
