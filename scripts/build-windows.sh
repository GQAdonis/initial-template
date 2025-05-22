#!/bin/bash

# Script to build the Tauri application for Windows
# This script can be used for both native Windows builds and cross-compilation

# Exit on error
set -e

# Display help message
function show_help {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  --cross-compile    Enable cross-compilation mode (for macOS/Linux)"
  echo "  --release          Build in release mode (default)"
  echo "  --debug            Build in debug mode"
  echo "  --help             Show this help message"
  echo ""
}

# Default options
CROSS_COMPILE=false
BUILD_MODE="release"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --cross-compile)
      CROSS_COMPILE=true
      shift
      ;;
    --release)
      BUILD_MODE="release"
      shift
      ;;
    --debug)
      BUILD_MODE="debug"
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  echo "Running on Windows - using native build"
  CROSS_COMPILE=false
fi

# Setup for cross-compilation if needed
if [ "$CROSS_COMPILE" = true ]; then
  echo "Setting up cross-compilation environment for Windows..."
  
  # Check if Windows target is installed
  if ! rustup target list | grep -q "x86_64-pc-windows-msvc (installed)"; then
    echo "Installing Windows target..."
    rustup target add x86_64-pc-windows-msvc
  fi
  
  # Copy Windows-specific Cargo config
  cp src-tauri/.cargo/config-windows.toml src-tauri/.cargo/config.toml
  
  # Set target flag for cross-compilation
  TARGET_FLAG="--target x86_64-pc-windows-msvc"
else
  # Use default config for native Windows builds
  TARGET_FLAG=""
fi

# Build frontend
echo "Building frontend..."
yarn build

# Build Tauri application
echo "Building Tauri application for Windows in $BUILD_MODE mode..."
if [ "$BUILD_MODE" = "release" ]; then
  yarn tauri build $TARGET_FLAG
else
  yarn tauri build --debug $TARGET_FLAG
fi

# Restore original config if cross-compiling
if [ "$CROSS_COMPILE" = true ]; then
  echo "Restoring original Cargo configuration..."
  git checkout -- src-tauri/.cargo/config.toml 2>/dev/null || true
fi

echo "Build completed successfully!"
echo "Windows executable can be found in src-tauri/target/$BUILD_MODE/bundle/"