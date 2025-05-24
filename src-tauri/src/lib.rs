use std::env;
use std::path::Path;
use std::sync::{Arc, Mutex};

// Learn more about Tauri commands at https://tauri.app/develop/
use serde::{Deserialize, Serialize};
use rusqlite::{Connection, types::Value as SqlValue};
use dotenv::dotenv;
use tauri::{State, Manager};
use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use keyring::Entry;

// Constants for keyring storage
const KEYRING_SERVICE: &str = "prometheus-one-app";
const KEYRING_USER: &str = "stronghold-password";

// Database connection wrapper with mutex for thread safety
struct DatabaseConnection(Mutex<Option<Connection>>);

// App state to store Stronghold password
struct AppState {
    stronghold_password: Arc<Mutex<Option<String>>>,
}

// Response structs for better type safety and debugging
#[derive(Debug, Serialize)]
pub struct GreetResponse {
    message: String,
}

#[derive(Debug, Serialize)]
pub struct SqlResponse {
    success: bool,
    message: String,
    rows: Option<Vec<serde_json::Value>>,
}

#[derive(Debug, Deserialize)]
pub struct SqlParams {
    params: Vec<serde_json::Value>,
}

// Generate a secure random encryption key
fn generate_encryption_key() -> String {
    use rand::Rng;
    
    // Use a more secure character set for the key
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    const KEY_LEN: usize = 32; // 256-bit key
    
    let mut rng = rand::rng();
    (0..KEY_LEN)
        .map(|_| {
            let idx = rng.random_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

// Convert serde_json::Value to rusqlite Value
fn json_to_sql(json: &serde_json::Value) -> SqlValue {
    match json {
        serde_json::Value::Null => SqlValue::Null,
        serde_json::Value::Bool(b) => SqlValue::Integer(*b as i64),
        serde_json::Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                SqlValue::Integer(i)
            } else if let Some(f) = n.as_f64() {
                SqlValue::Real(f)
            } else {
                SqlValue::Text(n.to_string())
            }
        },
        serde_json::Value::String(s) => SqlValue::Text(s.clone()),
        _ => SqlValue::Text(json.to_string()),
    }
}

// Get or create encryption key using file storage (fallback from Stronghold)
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
            println!("Rust: Successfully loaded encryption key from storage");
            return Ok(key.trim().to_string());
        }
    }
    
    // Generate new key if none exists
    println!("Rust: No encryption key found, generating new one");
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
    
    println!("Rust: Successfully created and stored new encryption key");
    Ok(new_key)
}

// Initialize the database with encryption
#[tauri::command]
async fn init_database(
    app_handle: tauri::AppHandle,
    db_path: String, 
    state: State<'_, DatabaseConnection>
) -> Result<SqlResponse, String> {
    println!("Rust: Initializing encrypted database at: {}", db_path);
    
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
    
    // Set encryption key
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

// Execute SQL query that doesn't return data
#[tauri::command]
async fn execute_sql(sql: String, params_json: Option<SqlParams>, state: State<'_, DatabaseConnection>) -> Result<SqlResponse, String> {
    println!("Rust: Executing SQL: {}", sql);
    
    let db_conn = state.0.lock().map_err(|e| e.to_string())?;
    let conn = db_conn.as_ref().ok_or("Database not initialized")?;
    
    // Convert JSON values to SQL values
    let sql_values: Vec<SqlValue> = if let Some(p) = params_json {
        p.params.iter().map(json_to_sql).collect()
    } else {
        vec![]
    };
    
    let params: Vec<&dyn rusqlite::ToSql> = sql_values.iter()
        .map(|v| v as &dyn rusqlite::ToSql)
        .collect();
    
    match conn.execute(&sql, &params[..]) {
        Ok(rows_affected) => Ok(SqlResponse {
            success: true,
            message: format!("Query executed successfully. Rows affected: {}", rows_affected),
            rows: None,
        }),
        Err(e) => Err(e.to_string()),
    }
}

// Query SQL that returns data
#[tauri::command]
async fn query_sql(sql: String, params_json: Option<SqlParams>, state: State<'_, DatabaseConnection>) -> Result<SqlResponse, String> {
    println!("Rust: Querying SQL: {}", sql);
    
    let db_conn = state.0.lock().map_err(|e| e.to_string())?;
    let conn = db_conn.as_ref().ok_or("Database not initialized")?;
    
    // Convert JSON values to SQL values
    let sql_values: Vec<SqlValue> = if let Some(p) = params_json {
        p.params.iter().map(json_to_sql).collect()
    } else {
        vec![]
    };
    
    let params: Vec<&dyn rusqlite::ToSql> = sql_values.iter()
        .map(|v| v as &dyn rusqlite::ToSql)
        .collect();
    
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    
    // Get column names
    let column_names: Vec<String> = stmt.column_names().into_iter().map(String::from).collect();
    
    // Execute query
    let rows_result = stmt.query_map(&params[..], |row| {
        let mut row_obj = serde_json::Map::new();
        
        for (i, column_name) in column_names.iter().enumerate() {
            let value: rusqlite::Result<rusqlite::types::Value> = row.get(i);
            match value {
                Ok(val) => {
                    let json_val = match val {
                        rusqlite::types::Value::Null => serde_json::Value::Null,
                        rusqlite::types::Value::Integer(i) => serde_json::Value::Number(serde_json::Number::from(i)),
                        rusqlite::types::Value::Real(f) => {
                            if let Some(num) = serde_json::Number::from_f64(f) {
                                serde_json::Value::Number(num)
                            } else {
                                serde_json::Value::String(f.to_string())
                            }
                        },
                        rusqlite::types::Value::Text(s) => serde_json::Value::String(s),
                        rusqlite::types::Value::Blob(b) => {
                            // Convert blob to base64 string
                            let base64 = STANDARD.encode(&b);
                            serde_json::Value::String(base64)
                        },
                    };
                    row_obj.insert(column_name.clone(), json_val);
                },
                Err(e) => return Err(e),
            }
        }
        
        Ok(serde_json::Value::Object(row_obj))
    }).map_err(|e| e.to_string())?;
    
    // Collect results
    let mut rows = Vec::new();
    for row_result in rows_result {
        match row_result {
            Ok(row) => rows.push(row),
            Err(e) => return Err(e.to_string()),
        }
    }
    
    Ok(SqlResponse {
        success: true,
        message: format!("Query returned {} rows", rows.len()),
        rows: Some(rows),
    })
}

// Close the database connection
#[tauri::command]
async fn close_database(state: State<'_, DatabaseConnection>) -> Result<SqlResponse, String> {
    println!("Rust: Closing database connection");
    
    let mut db_conn = state.0.lock().map_err(|e| e.to_string())?;
    *db_conn = None;
    
    Ok(SqlResponse {
        success: true,
        message: "Database connection closed".to_string(),
        rows: None,
    })
}

// Stronghold initialization response
#[derive(Debug, Serialize)]
pub struct StrongholdResponse {
    initialized: bool,
    unlocked: bool,
}

// Initialize Stronghold with password
#[tauri::command]
async fn init_stronghold(
    password: String, 
    remember_option: String,
    app_state: State<'_, AppState>
) -> Result<StrongholdResponse, String> {
    println!("Rust: Initializing Stronghold with remember option: {}", remember_option);
    
    // Store the password in app state
    let mut stronghold_password = app_state.stronghold_password.lock().map_err(|e| e.to_string())?;
    *stronghold_password = Some(password.clone());
    
    // If remember option is "os-keychain", store in system keyring
    if remember_option == "os-keychain" {
        match Entry::new(KEYRING_SERVICE, KEYRING_USER) {
            Ok(entry) => {
                if let Err(e) = entry.set_password(&password) {
                    println!("Rust: Failed to store password in keyring: {}", e);
                }
            }
            Err(e) => {
                println!("Rust: Failed to access keyring: {}", e);
            }
        }
    }
    
    Ok(StrongholdResponse {
        initialized: true,
        unlocked: true,
    })
}

// Try to auto-unlock Stronghold using stored password
#[tauri::command]
async fn try_auto_unlock_stronghold(app_state: State<'_, AppState>) -> Result<serde_json::Value, String> {
    println!("Rust: Attempting to auto-unlock Stronghold");
    
    // Try to get password from keyring
    match Entry::new(KEYRING_SERVICE, KEYRING_USER) {
        Ok(entry) => {
            match entry.get_password() {
                Ok(password) => {
                    // Store the password in app state
                    let mut stronghold_password = app_state.stronghold_password.lock().map_err(|e| e.to_string())?;
                    *stronghold_password = Some(password);
                    
                    Ok(serde_json::json!({
                        "success": true,
                        "storageOption": "os-keychain"
                    }))
                }
                Err(_) => {
                    Ok(serde_json::json!({
                        "success": false,
                        "storageOption": "never"
                    }))
                }
            }
        }
        Err(e) => {
            println!("Rust: Failed to access keyring: {}", e);
            Ok(serde_json::json!({
                "success": false,
                "storageOption": "never"
            }))
        }
    }
}

// Check Stronghold status
#[tauri::command]
async fn check_stronghold_status(app_state: State<'_, AppState>) -> Result<StrongholdResponse, String> {
    let stronghold_password = app_state.stronghold_password.lock().map_err(|e| e.to_string())?;
    let is_initialized = stronghold_password.is_some();
    
    Ok(StrongholdResponse {
        initialized: is_initialized,
        unlocked: is_initialized,
    })
}

// Get password storage option
#[tauri::command]
async fn get_password_storage_option() -> Result<String, String> {
    // Check if password exists in keyring
    match Entry::new(KEYRING_SERVICE, KEYRING_USER) {
        Ok(entry) => {
            match entry.get_password() {
                Ok(_) => Ok("os-keychain".to_string()),
                Err(_) => Ok("never".to_string()),
            }
        }
        Err(_) => Ok("never".to_string()),
    }
}

// Greet command for testing
#[tauri::command]
fn greet(name: &str) -> GreetResponse {
    println!("Rust: greet command called with name: {}", name);
    GreetResponse {
        message: format!("Hello, {}! You've been greeted from Rust!", name),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Rust: Starting Tauri application");
    
    // Load environment variables from .env file
    match dotenv() {
        Ok(_) => println!("Rust: Successfully loaded .env file"),
        Err(e) => println!("Rust: Warning - Could not load .env file: {}", e),
    }
    
    // Create shared password state
    let shared_password: Arc<Mutex<Option<String>>> = Arc::new(Mutex::new(None));
    let password_for_callback = shared_password.clone();
    
    // Try to load password from keyring at startup
    match Entry::new(KEYRING_SERVICE, KEYRING_USER) {
        Ok(entry) => {
            match entry.get_password() {
                Ok(password) => {
                    println!("Rust: Loaded Stronghold password from keyring");
                    if let Ok(mut pw) = shared_password.lock() {
                        *pw = Some(password);
                    }
                }
                Err(_) => {
                    println!("Rust: No stored password found in keyring");
                }
            }
        }
        Err(e) => {
            println!("Rust: Failed to access keyring at startup: {}", e);
        }
    }
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_stronghold::Builder::new(move |_password| {
            // Handle password request callback
            println!("Rust: Stronghold password callback triggered");
            
            // Try to get the password from shared state
            if let Ok(password_guard) = password_for_callback.lock() {
                if let Some(password) = password_guard.as_ref() {
                    println!("Rust: Using stored password for Stronghold");
                    return password.as_bytes().to_vec();
                }
            }
            
            // Fallback to default password if none is set
            println!("Rust: No password found, using default");
            b"default_stronghold_password".to_vec()
        })
        .build())
        .manage(DatabaseConnection(Mutex::new(None)))
        .manage(AppState {
            stronghold_password: shared_password,
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            init_database,
            execute_sql,
            query_sql,
            close_database,
            init_stronghold,
            try_auto_unlock_stronghold,
            check_stronghold_status,
            get_password_storage_option
        ])
        .setup(|_app| {
            println!("Rust: Tauri setup complete");
            println!("Rust: Using SQLCipher for encrypted database operations");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
