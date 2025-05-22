# Actix-web Server for One-App

This directory contains an Actix-web server that serves the React/Vite application and provides API endpoints for the Copilot functionality.

## Overview

The Actix-web server:
- Serves static files from the `dist` directory
- Provides API endpoints for Copilot functionality
- Integrates with a Deno runtime for processing Copilot requests

## Building the React/Vite Application for Actix-web

The project includes scripts to build the React/Vite application and place it in the correct directory for the Actix-web server to serve.

### Using npm/yarn scripts

```bash
# Build the React/Vite application for Actix-web
npm run build:actix
# or
yarn build:actix

# Build and start the Actix-web server
npm run dev:actix
# or
yarn dev:actix
```

### Manual Build Process

If you prefer to build manually:

1. Set the `BUILD_TARGET` environment variable to `actix`
2. Build the React/Vite application
3. Start the Actix-web server

```bash
# Build the React/Vite application
BUILD_TARGET=actix npm run build
# or
BUILD_TARGET=actix yarn build

# Start the Actix-web server
cd apps/webserver
cargo run
```

## Configuration

The Actix-web server can be configured using command line arguments or environment variables:

### Command Line Arguments

- `--addr` or `-a`: Address to bind the server to (default: 127.0.0.1:3000)
- `--static-dir` or `-s`: Path to the static files directory (default: dist)
- `--worker-threads` or `-w`: Number of worker threads to use (default: number of CPU cores)
- `--log-level` or `-l`: Log level (default: info)

Example:
```bash
cargo run -- --addr 0.0.0.0:8080 --static-dir ../dist --log-level debug
```

### Environment Variables

The server also reads configuration from a `.env` file or environment variables:

- `OPENAI_API_KEY`: Required for Deno application
- `DENO_APP_PATH`: Path to the Deno application (default: ../apps/ai-service/main.ts)

## Development Workflow

1. Make changes to the React/Vite application
2. Run `npm run build:actix` or `yarn build:actix` to build the application
3. Run `cd apps/webserver && cargo run` to start the Actix-web server
4. Or use `npm run dev:actix` or `yarn dev:actix` to do both steps at once

## Production Deployment

For production deployment:

1. Build the React/Vite application with `npm run build:actix` or `yarn build:actix`
2. Build the Actix-web server with `cd apps/webserver && cargo build --release`
3. Deploy the `apps/webserver/target/release/webserver` binary along with the `apps/webserver/dist` directory
4. Set the required environment variables or create a `.env` file
5. Run the server with appropriate arguments for your production environment

Example:
```bash
./webserver --addr 0.0.0.0:80 --static-dir ./dist