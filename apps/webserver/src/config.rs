use std::net::SocketAddr;
use std::path::PathBuf;
use clap::Parser;
use dotenv::dotenv;
use std::env;

/// Server configuration
#[derive(Debug, Clone)]
pub struct ServerConfig {
    /// Address to bind the server to
    pub addr: SocketAddr,
    
    /// Path to the static files directory (React/Vite build output)
    pub static_dir: PathBuf,
    
    /// Number of worker threads to use
    pub worker_threads: usize,
    
    /// Log level
    pub log_level: String,
    
    /// OpenAI API key for Deno application
    pub openai_api_key: String,
    
    /// Path to the Deno application
    pub deno_app_path: PathBuf,
}

/// Command line arguments
#[derive(Parser, Debug)]
#[clap(author, version, about)]
pub struct Args {
    /// Address to bind the server to
    #[clap(short, long, default_value = "127.0.0.1:3000")]
    pub addr: String,
    
    /// Path to the static files directory (React/Vite build output)
    #[clap(short, long, default_value = "dist")]
    pub static_dir: PathBuf,
    
    /// Number of worker threads to use (0 means use number of CPU cores)
    #[clap(short, long, default_value = "0")]
    pub worker_threads: usize,
    
    /// Log level (trace, debug, info, warn, error)
    #[clap(short, long, default_value = "info")]
    pub log_level: String,
}

impl ServerConfig {
    /// Create a new server configuration from command line arguments
    pub fn from_args(args: Args) -> Result<Self, String> {
        // Load environment variables from .env file
        dotenv().ok();
        
        // Parse the address
        let addr = args.addr.parse()
            .map_err(|e| format!("Invalid address: {}", e))?;
        
        // Determine the number of worker threads
        let worker_threads = if args.worker_threads == 0 {
            std::thread::available_parallelism()
                .map(|n| n.get())
                .unwrap_or(1)
        } else {
            args.worker_threads
        };
        
        // Ensure the static directory exists
        if !args.static_dir.exists() {
            return Err(format!("Static directory does not exist: {:?}", args.static_dir));
        }
        
        // Get OpenAI API key from environment
        let openai_api_key = env::var("OPENAI_API_KEY")
            .map_err(|_| "OPENAI_API_KEY environment variable not set".to_string())?;
        
        // Get Deno application path
        let deno_app_path = PathBuf::from(
            env::var("DENO_APP_PATH").unwrap_or_else(|_| "../apps/ai-service/main.ts".to_string())
        );
        
        // Ensure the Deno application exists
        if !deno_app_path.exists() {
            return Err(format!("Deno application does not exist: {:?}", deno_app_path));
        }
        
        Ok(Self {
            addr,
            static_dir: args.static_dir,
            worker_threads,
            log_level: args.log_level,
            openai_api_key,
            deno_app_path,
        })
    }
}