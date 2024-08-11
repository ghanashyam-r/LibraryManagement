#!/bin/bash

# Print welcome message
echo "======================================================================"
echo "Starting Celery worker..."
echo "======================================================================"

# Activate the virtual environment
source venv/bin/activate

# Run Celery worker
celery -A tasks.celery worker --loglevel=info

