# Tauri Database Path Resolution and Stronghold Integration

## Overview

This document details the resolution of a database initialization error in a Tauri v2 application that uses SQLCipher for encrypted database storage and Stronghold for secure password management. The error message was:

```
Error initializing database: The provided `database` option is invalid.
```

## Problem Analysis

### Root Cause

The error occurred because the database path was not being properly resolved in the Tauri application. The code was passing a relative path (`powersync.db`) to the SQLite driver without converting it to a full, platform-specific path.

### Key Issues Identified

1. **Path Resolution**: The `TauriSQLiteDatabase` adapter was not using Tauri's path resolution APIs to convert relative paths to absolute paths
2. **Stronghold Password Callback**: The Stronghold plugin's password callback couldn't access the password provided during initialization
3. **API Deprecation**: The code was using deprecated rand crate APIs

## Solution Architecture

### 1. Database Path Resolution

The fix involved using Tauri's built-in path resolution APIs to properly construct the full database path:

```typescript
// Before (incorrect)
const options = { database: this.dbPath };

// After (correct)
const appDataPath = await appDataDir();
const fullDbPath = await join(appDataPath, this.dbPath);
const options = { database: fullDbPath };
```

#### Theory

Tauri applications run in a sandboxed environment where file paths must be properly resolved relative to the application's designated directories. The `appDataDir()` function returns the platform-specific application data directory:

- **macOS**: `~/Library/Application Support/<app-identifier>/`
- **Windows**: `%APPDATA%/<app-identifier>/`
- **Linux**: `~/.config/<app-identifier>/`

Using `join()` ensures proper path construction with the correct separators for each platform.

### 2. Stronghold Password Management

The Stronghold plugin requires a password callback function that provides the encryption password. However, this callback runs in a different context than the password initialization, creating a state-sharing challenge.

#### Solution: Shared State with Arc<Mutex>

```rust
// Create shared password state
let shared_password: Arc<Mutex<Option<String>>> = Arc::new(Mutex::new(None));
let password_for_callback = shared_password.clone();

// Use in Stronghold plugin
.plugin(tauri_plugin_stronghold::Builder::new(move |_password| {
    if let Ok(password_guard) = password_for_callback.lock() {
        if let Some(password) = password_guard.as_ref() {
            return password.as_bytes().to_vec();
        }
    }
    b"default_stronghold_password".to_vec()
})
.build())

// Manage in app state
.manage(AppState {
    stronghold_password: shared_password,
})
```

#### Theory

- **Arc (Atomically Reference Counted)**: Allows multiple ownership of the same data across threads
- **Mutex (Mutual Exclusion)**: Ensures thread-safe access to the shared password
- **Clone**: Creates a new Arc pointer to the same data, not a copy of the data itself

This pattern allows the password to be:
1. Set during the `init_stronghold` command
2. Accessed from the Stronghold callback closure
3. Loaded from the system keyring at startup
4. Shared safely across multiple threads

### 3. System Keyring Integration

The implementation supports three password storage options:

1. **never**: Password must be entered each time
2. **os-keychain**: Password stored in system keyring
3. **stronghold**: Password stored in Stronghold (future implementation)

```rust
// Store in keyring
if remember_option == "os-keychain" {
    match Entry::new(KEYRING_SERVICE, KEYRING_USER) {
        Ok(entry) => {
            if let Err(e) = entry.set_password(&password) {
                println!("Failed to store password in keyring: {}", e);
            }
        }
        Err(e) => {
            println!("Failed to access keyring: {}", e);
        }
    }
}
```

## Implementation Details

### Frontend (TypeScript)

1. **TauriSQLiteDatabase Adapter**
   - Implements PowerSync's database interface
   - Handles path resolution using Tauri APIs
   - Manages database lifecycle (open, close, execute, query)

2. **StrongholdStore**
   - Manages password dialog UI state
   - Handles password persistence options
   - Coordinates with Tauri backend

### Backend (Rust)

1. **Database Commands**
   - `init_database`: Initializes SQLCipher database with encryption
   - `execute_sql`: Executes non-query SQL statements
   - `query_sql`: Executes queries and returns results
   - `close_database`: Properly closes database connection

2. **Stronghold Commands**
   - `init_stronghold`: Sets password and storage preference
   - `try_auto_unlock_stronghold`: Attempts to unlock using stored password
   - `check_stronghold_status`: Returns current Stronghold state
   - `get_password_storage_option`: Retrieves user's storage preference

### Encryption Key Management

The system uses a dual-key approach:

1. **Database Encryption Key**: Generated randomly and stored in a protected file
2. **Stronghold Password**: User-provided, optionally stored in system keyring

```rust
fn get_or_create_encryption_key(app_handle: &tauri::AppHandle) -> Result<String, String> {
    let data_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let key_file = data_dir.join(".encryption_key");
    
    if key_file.exists() {
        // Load existing key
    } else {
        // Generate new key
        let new_key = generate_encryption_key();
        // Store with restrictive permissions (0600 on Unix)
    }
}
```

## Security Considerations

1. **Key Storage**: Database encryption keys are stored with restrictive file permissions
2. **Password Handling**: Passwords are never logged or stored in plain text
3. **Memory Safety**: Rust's ownership system prevents memory leaks and data races
4. **Platform Integration**: Uses native OS keyrings for secure password storage

## Future Enhancements

1. **Stronghold Storage**: Implement password storage within Stronghold itself
2. **Key Rotation**: Add support for rotating encryption keys
3. **Biometric Authentication**: Integrate with platform biometric APIs
4. **Multi-User Support**: Allow multiple password-protected profiles

## Debugging Tips

1. **Path Issues**: Check console logs for resolved paths
2. **Permission Errors**: Ensure app has write access to data directory
3. **Keyring Access**: Some platforms require additional permissions
4. **Database Locks**: Ensure only one connection is active at a time

## References

- [Tauri v2 Path APIs](https://v2.tauri.app/reference/javascript/api/namespacecore/#join)
- [SQLCipher Documentation](https://www.zetetic.net/sqlcipher/)
- [Stronghold Documentation](https://github.com/iotaledger/stronghold.rs)
- [PowerSync Documentation](https://docs.powersync.com/)
