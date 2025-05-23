# Setting Up Windows Build Support for Tauri Application

This guide will walk you through the process of setting up your development environment to build the Tauri application for Windows.

## Prerequisites

Before you can build for Windows, you need to install the following tools:

### 1. Install Rust and Cargo

1. Download and run the Rust installer from [rustup.rs](https://rustup.rs/)
2. Follow the on-screen instructions to install Rust
3. After installation, open a new command prompt and verify the installation:
   ```
   rustc --version
   cargo --version
   ```

### 2. Install Visual Studio Build Tools

1. Download the [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. During installation, make sure to select the following components:
   - "Desktop development with C++"
   - Windows 10/11 SDK
   - MSVC build tools

### 3. Install WebView2

1. Download and install the [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### 4. Install Windows App SDK

1. Download and install the [Windows App SDK](https://learn.microsoft.com/en-us/windows/apps/windows-app-sdk/downloads)

## Building for Windows

Once you have set up your development environment, you can build the application for Windows using the following command:

```bash
yarn build:tauri:windows
```

This will create a Windows executable in the `src-tauri/target/release/bundle/` directory.

## Cross-Compiling from macOS or Linux

To cross-compile for Windows from macOS or Linux, you'll need to set up a cross-compilation environment:

### 1. Install the Windows target

```bash
rustup target add x86_64-pc-windows-msvc
```

### 2. Install MinGW

On macOS:
```bash
brew install mingw-w64
```

On Linux:
```bash
sudo apt-get install mingw-w64
```

### 3. Configure Cargo for cross-compilation

Create or edit `~/.cargo/config.toml` and add:

```toml
[target.x86_64-pc-windows-msvc]
linker = "x86_64-w64-mingw32-gcc"
ar = "x86_64-w64-mingw32-ar"
```

### 4. Build for Windows

```bash
yarn build:tauri:windows
```

## Troubleshooting

### Common Issues

1. **Missing Windows SDK**: Ensure you have installed the Windows 10/11 SDK during Visual Studio Build Tools installation.

2. **WebView2 Not Found**: Make sure WebView2 Runtime is installed correctly.

3. **Build Errors**: If you encounter build errors, try running:
   ```bash
   cargo clean
   ```
   Then attempt the build again.

4. **DLL Not Found Errors**: Ensure all required DLLs are in your PATH or in the same directory as your executable.

### Getting Help

If you encounter issues not covered in this guide, refer to the [Tauri documentation](https://tauri.app/v1/guides/building/windows) or open an issue in the project repository.
