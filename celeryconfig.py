
from datetime import timedelta
broker_url = "redis://localhost:6379/1"
result_backend = "redis://localhost:6379/2"
timezone = "Asia/Kolkata"
broker_connection_retry_on_startup = True

from celery.schedules import crontab


beat_schedule = {
    'test-task': {
        'task': 'tasks.send_daily_reminders',
        'schedule': timedelta(seconds=10),  # Run every 10 seconds
        'options': {
            'expires': 3600,
        },
    },
}




