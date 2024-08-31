Run these in separate terminals

1.To start main.py 
./run_local.sh

2.Activating Mailhog
mailhog

3.Redis Server
redis-cli

4.Celery worker
celery -A tasks.celery worker --loglevel=info

5.Celery Beat
celery -A tasks.celery beat --loglevel=info

6.Triggering scheduled tasks
python3 trigger_task.py