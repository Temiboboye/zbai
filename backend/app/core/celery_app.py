"""
Celery configuration for async task processing
"""

from celery import Celery
import os

REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

celery_app = Celery(
    'zerobounce',
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['app.tasks']
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
)

celery_app.conf.task_routes = {
    'app.tasks.verify_email': {'queue': 'verification'},
    'app.tasks.process_bulk_job': {'queue': 'bulk'},
}
