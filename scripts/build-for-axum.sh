#!/bin/bash
set -e

# Build script for React/Vite application to be served by Actix-web server
# This script builds the React/Vite application and copies the built files to the Actix-web server's static directory

# Print colored output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building React/Vite application for Actix-web server...${NC}"

# Determine the package manager (yarn or npm)
if [ -f "yarn.lock" ]; then
  PACKAGE_MANAGER="yarn"
elif [ -f "package-lock.json" ]; then
  PACKAGE_MANAGER="npm"
else
  PACKAGE_MANAGER="npm"
  echo -e "${YELLOW}No lock file found, defaulting to npm${NC}"
fi

# Build the React/Vite application
echo -e "${YELLOW}Building React/Vite application...${NC}"
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
  BUILD_TARGET=actix yarn build
else
  BUILD_TARGET=actix npm run build
fi

# Check if build was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed!${NC}"
  exit 1
fi

echo -e "${GREEN}Build successful!${NC}"

# The Vite build will output directly to apps/webserver/dist when BUILD_TARGET=actix
ACTIX_STATIC_DIR="apps/webserver/dist"

# Ensure the directory exists
mkdir -p "$ACTIX_STATIC_DIR"

# Verify the build was successful
if [ ! -f "$ACTIX_STATIC_DIR/index.html" ]; then
  echo -e "${RED}Build failed! index.html not found in $ACTIX_STATIC_DIR${NC}"
  exit 1
fi

echo -e "${GREEN}Successfully built files to $ACTIX_STATIC_DIR!${NC}"
echo -e "${GREEN}React/Vite application is now ready to be served by the Actix-web server.${NC}"
echo -e "${YELLOW}You can start the Actix-web server with: cd apps/webserver && cargo run${NC}"