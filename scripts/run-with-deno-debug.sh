#!/bin/bash

# Script to run the web application and Deno debugger together
# This script starts both the web application and the Deno AI service in debug mode

# Set colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}Error: OPENAI_API_KEY environment variable is not set${NC}"
    echo -e "Please set it using: ${YELLOW}export OPENAI_API_KEY=your_api_key${NC}"
    exit 1
fi

# Function to clean up processes on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down processes...${NC}"
    kill $VITE_PID $DENO_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start Vite development server in the background
echo -e "${GREEN}Starting Vite development server...${NC}"
yarn dev &
VITE_PID=$!

# Wait a moment to ensure Vite starts properly
sleep 2

# Check if Vite started successfully
if ! ps -p $VITE_PID > /dev/null; then
    echo -e "${RED}Failed to start Vite development server${NC}"
    cleanup
fi

# Start Deno in debug mode
echo -e "${GREEN}Starting Deno AI service in debug mode...${NC}"
echo -e "${BLUE}You can connect to the debugger at chrome://inspect or in VS Code${NC}"
deno run --inspect --allow-all apps/ai-service/main.ts &
DENO_PID=$!

# Check if Deno started successfully
if ! ps -p $DENO_PID > /dev/null; then
    echo -e "${RED}Failed to start Deno AI service${NC}"
    kill $VITE_PID
    exit 1
fi

echo -e "${GREEN}Both services are running:${NC}"
echo -e "  - ${BLUE}Vite: http://localhost:1420${NC}"
echo -e "  - ${BLUE}Deno Debugger: chrome://inspect${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"

# Wait for both processes to finish
wait $VITE_PID $DENO_PID