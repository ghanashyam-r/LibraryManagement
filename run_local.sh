#!/bin/bash

# Print welcome message
echo "======================================================================"
echo "Welcome to the setup. This will setup the local virtual environment."
echo "======================================================================"

# Define the virtual environment directory
VENV_DIR="venv"

# Check if the virtual environment directory exists
if [ -d "$VENV_DIR" ]; then
    echo "Virtual environment found. Activating..."
    source "$VENV_DIR/bin/activate"
else
    echo "Virtual environment not found. Creating and setting up..."
    # Create the virtual environment
    python3 -m venv "$VENV_DIR"
    # Activate the virtual environment
    source "$VENV_DIR/bin/activate"
    # Install requirements from requirements.txt
    if [ -f "requirements.txt" ]; then
        echo "Installing requirements..."
        pip install -r requirements.txt
    else
        echo "No requirements.txt file found. Skipping installation."
    fi
fi

# Inform the user that the virtual environment is active
echo "Virtual environment is now active. Running main.py..."

# Run main.py
python3 main.py

# Optional: deactivate the virtual environment after running main.py
deactivate
