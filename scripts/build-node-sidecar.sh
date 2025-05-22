#!/bin/bash

# Exit on error
set -e

echo "Building Node.js AI service sidecar..."

# Create the binaries directory if it doesn't exist
mkdir -p src-tauri/binaries

# Get the target triple
TARGET_TRIPLE=$(rustc -Vv | grep host | cut -d' ' -f2)

# Install dependencies for the Node.js AI service
cd apps/node-ai-service
npm install
cd ../..

# Get the current platform and architecture
PLATFORM=$(uname -s)
ARCH=$(uname -m)

# Define target triples
MACOS_ARM64_TRIPLE="aarch64-apple-darwin"
MACOS_X64_TRIPLE="x86_64-apple-darwin"
WINDOWS_X64_TRIPLE="x86_64-pc-windows-msvc"
LINUX_X64_TRIPLE="x86_64-unknown-linux-gnu"

# Use pkg to build the binary with correct output names
echo "Packaging Node.js AI service with pkg..."

# For macOS
if [[ "$PLATFORM" == "Darwin" ]]; then
  if [[ "$ARCH" == "arm64" ]]; then
    # Apple Silicon (M1/M2)
    npx @yao-pkg/pkg apps/node-ai-service/main.js \
      --targets node18-macos-arm64 \
      --output src-tauri/binaries/node-ai-service-$MACOS_ARM64_TRIPLE
    
    # Also build x64 version for Intel Macs
    npx @yao-pkg/pkg apps/node-ai-service/main.js \
      --targets node18-macos-x64 \
      --output src-tauri/binaries/node-ai-service-$MACOS_X64_TRIPLE
  else
    # Intel Mac
    npx @yao-pkg/pkg apps/node-ai-service/main.js \
      --targets node18-macos-x64 \
      --output src-tauri/binaries/node-ai-service-$MACOS_X64_TRIPLE
  fi
fi

# For Windows (always build)
npx @yao-pkg/pkg apps/node-ai-service/main.js \
  --targets node18-win-x64 \
  --output src-tauri/binaries/node-ai-service-$WINDOWS_X64_TRIPLE

# For Linux (always build)
npx @yao-pkg/pkg apps/node-ai-service/main.js \
  --targets node18-linux-x64 \
  --output src-tauri/binaries/node-ai-service-$LINUX_X64_TRIPLE

echo "Node.js AI service sidecar built successfully!"
