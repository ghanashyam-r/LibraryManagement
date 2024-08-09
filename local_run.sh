#!/bin/bash

# Print welcome message
echo "======================================================================"
echo "Welcome to the setup. This will setup the local virtual env."

source venv/bin/activate

celery -A tasks.celery worker --loglevel=info
