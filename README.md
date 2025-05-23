# One App - Multi-Platform Application

This project is configured to run on multiple platforms:
- Web (React/Vite)
- Desktop (Tauri)
- iOS (Capacitor)
- Android (Capacitor)

## Prerequisites

### For All Platforms
- [Node.js](https://nodejs.org/) (v18 or later)
- [Yarn](https://yarnpkg.com/) (v4 or later)

### For Desktop (Tauri)
- [Rust](https://www.rust-lang.org/tools/install)
- Platform-specific dependencies:
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: Various system libraries (see [Tauri docs](https://tauri.app/v1/guides/getting-started/prerequisites))

### For iOS
- macOS
- Xcode (latest version)
- CocoaPods (`sudo gem install cocoapods`)

### For Android
- [Android Studio](https://developer.android.com/studio)
- Android SDK
- Java Development Kit (JDK)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd one-app
```

2. Install dependencies
```bash
yarn install
```

3. Install Capacitor plugins (for mobile development)
```bash
yarn add @capacitor/filesystem @capacitor/core @capacitor/ios @capacitor/android @capawesome/capacitor-file-picker
```

## Development

### Web Development
```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Desktop Development (Tauri)
```bash
# Start development server with Tauri
yarn dev:tauri

# Build for production
yarn build:tauri

# Preview debug build
yarn preview:tauri
```

### iOS Development
```bash
# Initialize iOS project (first time only)
yarn cap add ios

# Sync web code to iOS project and open in Xcode
yarn dev:ios

# Build for production
yarn build:ios
```

### Android Development
```bash
# Initialize Android project (first time only)
yarn cap add android

# Sync web code to Android project and open in Android Studio
yarn dev:android

# Build for production
yarn build:android
```

## Project Structure

- `/src` - React application code
  - `/src/utils` - Utility functions including platform detection
- `/public` - Static assets for web
- `/src-tauri` - Tauri desktop application code
- `/ios` - iOS application code (generated by Capacitor)
- `/android` - Android application code (generated by Capacitor)

## Platform Detection

The project includes utilities for detecting the current platform and conditionally executing code:

```typescript
import { getPlatform, platformSpecific } from './src/utils/platform';

// Check current platform
const platform = getPlatform(); // 'desktop', 'ios', 'android', or 'web'

// Execute platform-specific code
const result = platformSpecific({
  desktop: () => {
    // Desktop-specific code
    return 'Running on desktop';
  },
  ios: () => {
    // iOS-specific code
    return 'Running on iOS';
  },
  android: () => {
    // Android-specific code
    return 'Running on Android';
  },
  web: () => {
    // Web-specific code
    return 'Running on web';
  }
});
```

## API Adapters

The project includes adapters for platform-specific APIs, allowing you to use a consistent interface across platforms:

```typescript
import { getFileSystemAdapter, getDialogAdapter } from './src/utils/api-adapter';

// Get platform-specific file system adapter
const fs = getFileSystemAdapter();

// Use consistent API across platforms
await fs.writeTextFile('example.txt', 'Hello, world!');
const content = await fs.readTextFile('example.txt');

// Get platform-specific dialog adapter
const dialog = getDialogAdapter();

// Open file dialog (works on all platforms)
const filePath = await dialog.open({ multiple: false });
```

## License

[MIT](LICENSE)
