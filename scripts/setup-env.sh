#!/bin/bash

# Check if .env file exists
if [ -f ".env" ]; then
  echo "Backing up existing .env file to .env.backup"
  cp .env .env.backup
fi

# Create a new .env file with the correct variable names
echo "Creating new .env file with correct variable names"
cat > .env << EOL
# CopilotKit API URL
VITE_COPILOT_API_URL=http://localhost:3000/api/copilot
# PowerSync variables
VITE_POWERSYNC_URL=http://localhost:3000/api/powersync
VITE_POWERSYNC_TOKEN=local-development-token
# Stronghold password
STRONGHOLD_PASSWORD=development-password
EOL

# Create a copy for the Tauri app
echo "Creating copy of .env for Tauri app"
cp .env src-tauri/.env

echo "Environment files created successfully!"
