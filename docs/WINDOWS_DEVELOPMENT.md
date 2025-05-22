# Windows Development Guide

This document provides guidance for developing and building the application on Windows.

## Development Environment Setup

### Prerequisites

1. **Install Node.js and Yarn**
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)
   - Install Yarn by running:
     ```
     npm install -g yarn
     ```

2. **Install Rust and Cargo**
   - Download and run the Rust installer from [rustup.rs](https://rustup.rs/)
   - Follow the on-screen instructions

3. **Install Visual Studio Build Tools**
   - Download from [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Select "Desktop development with C++" workload
   - Ensure Windows 10/11 SDK is selected

4. **Install WebView2**
   - Download from [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

5. **Install Windows App SDK**
   - Download from [Windows App SDK](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/downloads)

### Project Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd one-app
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Development Workflow

### Running the Development Server

To start the development server:

```
yarn dev:tauri
```

This will launch the application in development mode with hot reloading.

### Building the Application

To build the application for Windows:

```
yarn build:tauri:windows
```

The built application will be available in `src-tauri/target/release/bundle/`.

## Troubleshooting

### Common Issues

1. **Build Errors**

   If you encounter build errors, try cleaning the build cache:
   ```
   cd src-tauri
   cargo clean
   ```

2. **WebView2 Not Found**

   Ensure WebView2 Runtime is installed correctly. You can verify by checking if the following registry key exists:
   ```
   HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}
   ```

3. **DLL Not Found Errors**

   If you encounter "DLL not found" errors when running the application, ensure all required DLLs are in your PATH or in the same directory as your executable.

4. **Permission Issues**

   If you encounter permission issues, try running your terminal or IDE as administrator.

## Additional Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Rust Documentation](https://doc.rust-lang.org/book/)
- [Windows App SDK Documentation](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/)