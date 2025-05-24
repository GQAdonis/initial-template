# SQLCipher Database Setup for Tauri

## Problem: "Error initializing database: The provided `database` option is invalid"

This error occurs when running `yarn dev:tauri` with SQLCipher-enabled rusqlite. The issue is that SQLCipher requires an encryption key to be set before any database operations.

## Solution Overview

1. Generate a secure encryption key on first run
2. Store the key securely in the app's data directory
3. Use the key for all database operations

## Implementation Details

### 1. Cargo.toml Dependencies

```toml
[dependencies]
rusqlite = { version = "0.35.0", features = ["bundled-sqlcipher"] }
rand = "0.8"
base64 = "0.22"
```

### 2. Key Generation and Storage

```rust
// Generate a secure 256-bit encryption key
fn generate_encryption_key() -> String {
    use rand::{Rng, thread_rng};
    
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    const KEY_LEN: usize = 32; // 256-bit key
    
    let mut rng = thread_rng();
    (0..KEY_LEN)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

// Get or create encryption key stored in app data directory
fn get_or_create_encryption_key(app_handle: &tauri::AppHandle) -> Result<String, String> {
    use std::fs;
    use std::io::{Read, Write};
    
    // Get app data directory using Tauri v2 API
    let data_dir = app_handle.path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    // Create directory if it doesn't exist
    fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
    
    // Key file path
    let key_file = data_dir.join(".encryption_key");
    
    // Try to read existing key
    if key_file.exists() {
        let mut file = fs::File::open(&key_file).map_err(|e| e.to_string())?;
        let mut key = String::new();
        file.read_to_string(&mut key).map_err(|e| e.to_string())?;
        
        if !key.trim().is_empty() {
            return Ok(key.trim().to_string());
        }
    }
    
    // Generate new key if none exists
    let new_key = generate_encryption_key();
    
    // Write key to file
    let mut file = fs::File::create(&key_file).map_err(|e| e.to_string())?;
    file.write_all(new_key.as_bytes()).map_err(|e| e.to_string())?;
    
    // Set restrictive permissions on Unix systems
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let metadata = file.metadata().map_err(|e| e.to_string())?;
        let mut permissions = metadata.permissions();
        permissions.set_mode(0o600); // Read/write for owner only
        fs::set_permissions(&key_file, permissions).map_err(|e| e.to_string())?;
    }
    
    Ok(new_key)
}
```

### 3. Database Initialization

```rust
#[tauri::command]
async fn init_database(
    app_handle: tauri::AppHandle,
    db_path: String, 
    state: State<'_, DatabaseConnection>
) -> Result<SqlResponse, String> {
    let db_path = Path::new(&db_path);
    
    // Create parent directory if it doesn't exist
    if let Some(parent) = db_path.parent() {
        if !parent.exists() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }
    
    // Get or create encryption key
    let encryption_key = get_or_create_encryption_key(&app_handle)?;
    
    // Open connection with SQLCipher
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    // Set encryption key - THIS IS CRITICAL!
    conn.execute_batch(&format!("PRAGMA key = '{}';", encryption_key))
        .map_err(|e| e.to_string())?;
    
    // Enable foreign keys
    conn.execute_batch("PRAGMA foreign_keys = ON;")
        .map_err(|e| e.to_string())?;
    
    // Store the connection
    let mut db_conn = state.0.lock().map_err(|e| e.to_string())?;
    *db_conn = Some(conn);
    
    Ok(SqlResponse {
        success: true,
        message: "Database initialized successfully with encrypted storage".to_string(),
        rows: None,
    })
}
```

### 4. Important Notes

- **Tauri v2 API**: Use `app_handle.path().app_data_dir()` not `app_handle.path_resolver().app_data_dir()`
- **Key Storage**: The encryption key is stored in `~/.config/com.tauri.one-app/.encryption_key` on Linux/macOS
- **Security**: The key file has restrictive permissions (0o600) on Unix systems
- **First Run**: A new key is generated on first run and reused thereafter
- **No Stronghold**: This solution doesn't require tauri-plugin-stronghold

## Common Pitfalls

1. **Wrong API**: Using `path_resolver()` instead of `path()` in Tauri v2
2. **Missing PRAGMA**: Not setting the encryption key with `PRAGMA key = '...'` before any DB operations
3. **Key Storage**: Storing the key in an insecure location or with wrong permissions
4. **Async Issues**: Make sure to pass `app_handle` to commands that need it

## Testing

After implementing this solution, run `yarn dev:tauri` and check the console for:
- "Successfully loaded encryption key from storage" (on subsequent runs)
- "Successfully created and stored new encryption key" (on first run)
- No "database option is invalid" errors

The database file will be encrypted and can only be accessed with the correct key.
