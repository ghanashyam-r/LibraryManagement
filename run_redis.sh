#!/bin/bash

# Print welcome message
echo "======================================================================"
echo "Starting Redis server..."
echo "======================================================================"

sudo service redis-server start
redis-cli