use std::env;

// Learn more about Tauri commands at https://tauri.app/develop/
use serde::{Serialize};
use dotenv::dotenv;

// Add response struct for better type safety and debugging
#[derive(Debug, Serialize)]
pub struct GreetResponse {
    message: String,
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
    
    // Use a default value for STRONGHOLD_PASSWORD if not set in environment
    let stronghold_password = env::var("STRONGHOLD_PASSWORD")
        .unwrap_or_else(|_| {
            println!("Rust: STRONGHOLD_PASSWORD not found, using default value");
            "development_password".to_string()
        })
        .into_bytes();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_stronghold::Builder::new(move |_| stronghold_password.clone()).build())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|_app| {
            println!("Rust: Tauri setup complete");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
