use std::io;
use thiserror::Error;

/// Custom error types for the web server
#[derive(Error, Debug)]
pub enum ServerError {
    /// IO errors
    #[error("IO error: {0}")]
    Io(#[from] io::Error),

    /// Hyper errors
    #[error("Hyper error: {0}")]
    Hyper(#[from] hyper::Error),

    /// JSON serialization/deserialization errors
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    /// Static file serving errors
    #[error("Static file error: {0}")]
    StaticFile(String),

    /// Configuration errors
    #[error("Configuration error: {0}")]
    Config(String),

    /// General server errors
    #[error("Server error: {0}")]
    Server(String),
    
    /// Deno runtime errors
    #[error("Deno runtime error: {0}")]
    DenoRuntime(String),
    
    /// Deno execution errors
    #[error("Deno execution error: {0}")]
    DenoExecution(String),
    
    /// Deno V8 errors
    #[error("Deno V8 error: {0}")]
    DenoV8(String),
    
    /// Environment variable errors
    #[error("Environment variable error: {0}")]
    EnvVar(String),
}

impl From<deno_core::error::AnyError> for ServerError {
    fn from(err: deno_core::error::AnyError) -> Self {
        ServerError::DenoRuntime(err.to_string())
    }
}

/// Result type alias for ServerError
pub type Result<T> = std::result::Result<T, ServerError>;