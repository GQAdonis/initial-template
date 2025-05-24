// This file is used to block any WASM imports in the Tauri environment
// It will be used as an alias in the build configuration

throw new Error('WASM components are not supported in Tauri environment. Use native SQLite instead.');
