from celery import Celery

# Initialize Celery app
app = Celery(__name__)
app.config_from_object('celeryconfig')

# Print the current Beat schedule
print("Current Beat Schedule:")
for key, value in app.conf.beat_schedule.items():
    print(f"Task Name: {key}, Schedule: {value['schedule']}")
