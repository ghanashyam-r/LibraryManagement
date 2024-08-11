#!/bin/bash

# Print welcome message
echo "======================================================================"
echo "Starting Celery Beat..."
echo "======================================================================"

# Activate the virtual environment
source venv/bin/activate
celery -A tasks.celery beat --loglevel=info