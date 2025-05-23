# Build and Run Scripts

This directory contains various scripts for building and running the application in different modes.

## Development Scripts

### `run-with-node-debug.sh`

Runs the application with the Node.js AI service in debug mode. This script:

- Starts the Vite development server
- Starts the Node.js AI service with the inspector enabled
- Handles cleanup of processes on exit

Usage:
```bash
./scripts/run-with-node-debug.sh
```

Requirements:
- `OPENAI_API_KEY` environment variable must be set

### `run-with-deno-debug.sh` (Deprecated)

Runs the application with the Deno AI service in debug mode. This script is kept for backward compatibility but is deprecated in favor of the Node.js version.

Usage:
```bash
./scripts/run-with-deno-debug.sh
```

Requirements:
- `OPENAI_API_KEY` environment variable must be set

## Build Scripts

### `build-node-sidecar.sh`

Builds the Node.js AI service as a Tauri sidecar. This script:

- Installs dependencies for the Node.js AI service
- Uses pkg to build binaries for multiple platforms
- Renames the binaries to match Tauri's target triple format

Usage:
```bash
./scripts/build-node-sidecar.sh
```

### `build-for-axum.sh`

Builds the application for use with the Axum web server.

### `build-windows.sh`

Builds the application for Windows, with an option for cross-compilation.

Usage:
```bash
./scripts/build-windows.sh [--cross-compile]
