use std::process;
use clap::Parser;
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use webserver::config::{Args, ServerConfig};
use webserver::server::Server;

#[actix_web::main]
async fn main() {
    // Parse command line arguments
    let args = Args::parse();
    
    // Initialize logging
    setup_logging(&args.log_level);
    
    // Create server configuration
    let config = match ServerConfig::from_args(args) {
        Ok(config) => config,
        Err(err) => {
            error!("Failed to create server configuration: {}", err);
            process::exit(1);
        }
    };
    
    // Log configuration
    info!("Server configuration:");
    info!("  Address: {}", config.addr);
    info!("  Static directory: {:?}", config.static_dir);
    info!("  Worker threads: {}", config.worker_threads);
    info!("  Log level: {}", config.log_level);
    
    // Create and run server
    let server = Server::new(config);
    
    info!("Starting server...");
    if let Err(err) = server.run().await {
        error!("Server error: {}", err);
        process::exit(1);
    }
}

/// Setup logging with the specified log level
fn setup_logging(log_level: &str) {
    // Parse log level
    let filter = match log_level {
        "trace" => tracing::Level::TRACE,
        "debug" => tracing::Level::DEBUG,
        "info" => tracing::Level::INFO,
        "warn" => tracing::Level::WARN,
        "error" => tracing::Level::ERROR,
        _ => tracing::Level::INFO,
    };
    
    // Initialize tracing subscriber
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::builder()
                .with_default_directive(filter.into())
                .from_env_lossy()
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    info!("Logging initialized at {} level", log_level);
}