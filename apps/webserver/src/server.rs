use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;

use actix_files::Files;
use actix_web::{
    web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result as ActixResult, Error as ActixError,
    http::StatusCode, middleware::{Logger, Compress},
};
use actix_web::dev::Server as ActixServer;
use actix_web::rt::signal;
use actix_web::web::Data;
use actix_web_lab::sse::{self, Sse, ChannelStream, SseSender};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use tracing::{info, error, debug};

use crate::error::{ServerError, Result};
use crate::config::ServerConfig;
use crate::deno::DenoRuntime;
use deno_runtime::worker::MainWorker;

/// Server state shared across all routes
#[derive(Clone)]
pub struct AppState {
    config: Arc<ServerConfig>,
    deno_runtime: Arc<DenoRuntime>,
    deno_worker: Arc<Mutex<Option<MainWorker>>>,
}

/// Request payload for the copilotkit endpoint
#[derive(Debug, Deserialize)]
pub struct CopilotRequest {
    message: String,
    #[serde(default)]
    context: serde_json::Value,
    #[serde(default)]
    stream: bool,
}

/// Response payload for the copilotkit endpoint
#[derive(Debug, Serialize)]
pub struct CopilotResponse {
    message: String,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    actions: Vec<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

/// Streaming chunk for the copilotkit endpoint
#[derive(Debug, Serialize)]
pub struct CopilotStreamChunk {
    chunk: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    done: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

/// The main server struct
pub struct Server {
    config: Arc<ServerConfig>,
}

impl Server {
    /// Create a new server instance
    pub fn new(config: ServerConfig) -> Self {
        let config = Arc::new(config);
        Self { config }
    }

    /// Start the server and run until shutdown signal
    pub async fn run(&self) -> Result<()> {
        let addr = self.config.addr;
        let static_dir = self.config.static_dir.clone();

        // Initialize Deno runtime
        let deno_runtime = DenoRuntime::new(self.config.clone());
        let deno_runtime = Arc::new(deno_runtime);

        // Initialize Deno worker
        info!("Initializing Deno runtime...");
        let deno_worker = deno_runtime.init().await?;
        let deno_worker = Arc::new(Mutex::new(Some(deno_worker)));

        info!("Deno runtime initialized successfully");

        // Create shared state
        let state = AppState {
            config: self.config.clone(),
            deno_runtime: deno_runtime.clone(),
            deno_worker: deno_worker.clone(),
        };

        // Start Actix-web server
        info!("Starting server on {}", addr);
        info!("Serving static files from {:?}", static_dir);

        let state_data = Data::new(state);

        HttpServer::new(move || {
            App::new()
                .app_data(state_data.clone())
                .wrap(Logger::default())
                .wrap(Compress::default())
                // API routes
                .service(
                    web::resource("/api/copilotkit")
                        .route(web::post().to(handle_copilot_request))
                )
                .service(
                    web::resource("/api/copilotkit/stream")
                        .route(web::post().to(handle_copilot_stream))
                )
                // Serve static files
                .service(
                    Files::new("/", &static_dir)
                        .index_file("index.html")
                        .prefer_utf8(true)
                        .use_last_modified(true)
                        .default_handler(web::to(spa_fallback))
                )
        })
        .bind(addr)?
        .run()
        .await
        .map_err(ServerError::from)?;

        info!("Server shutdown complete");
        Ok(())
    }
}

/// Handler for SPA fallback - serves index.html for all non-file routes
async fn spa_fallback(req: HttpRequest, data: Data<AppState>) -> ActixResult<impl Responder> {
    let path = data.config.static_dir.join("index.html");

    debug!("SPA fallback for {}, serving index.html", req.uri());

    if !path.exists() {
        error!("index.html not found at {:?}", path);
        return Ok(HttpResponse::NotFound().body("Not Found"));
    }

    match tokio::fs::read_to_string(&path).await {
        Ok(html) => Ok(HttpResponse::Ok().content_type("text/html; charset=utf-8").body(html)),
        Err(err) => {
            error!("Failed to read index.html: {}", err);
            Ok(HttpResponse::InternalServerError().body("Internal Server Error"))
        }
    }
}

/// Handler for copilotkit API requests
async fn handle_copilot_request(
    data: Data<AppState>,
    req: web::Json<CopilotRequest>,
) -> ActixResult<impl Responder> {
    let request = req.into_inner();
    debug!("Received copilotkit request: {:?}", request);

    // If streaming is requested, redirect to the streaming endpoint
    if request.stream {
        return handle_copilot_stream(data, web::Json(request)).await;
    }

    // Get a lock on the Deno worker
    let mut worker_lock = data.deno_worker.lock().await;

    // Check if worker is available
    let worker = match worker_lock.as_mut() {
        Some(worker) => worker,
        None => {
            error!("Deno worker not initialized");
            return Ok(HttpResponse::InternalServerError().json(CopilotResponse {
                message: "Internal server error".to_string(),
                actions: vec![],
                error: Some("Deno runtime not initialized".to_string()),
            }));
        }
    };

    // Prepare the request JSON for the Deno function
    let request_json = match serde_json::to_string(&request) {
        Ok(json) => json,
        Err(err) => {
            error!("Failed to serialize request: {}", err);
            return Ok(HttpResponse::InternalServerError().json(CopilotResponse {
                message: "Internal server error".to_string(),
                actions: vec![],
                error: Some(format!("Failed to serialize request: {}", err)),
            }));
        }
    };

    // Call the Deno function
    let result = match data.deno_runtime.execute_function(worker, "handleCopilotRequest", &format!("'{}'", request_json)).await {
        Ok(result) => result,
        Err(err) => {
            error!("Failed to execute Deno function: {}", err);
            return Ok(HttpResponse::InternalServerError().json(CopilotResponse {
                message: "Internal server error".to_string(),
                actions: vec![],
                error: Some(format!("Failed to execute Deno function: {}", err)),
            }));
        }
    };

    // Parse the response
    match serde_json::from_str::<CopilotResponse>(&result) {
        Ok(response) => {
            debug!("Copilotkit response: {:?}", response);
            Ok(HttpResponse::Ok().json(response))
        },
        Err(err) => {
            error!("Failed to parse Deno response: {}", err);
            Ok(HttpResponse::InternalServerError().json(CopilotResponse {
                message: "Internal server error".to_string(),
                actions: vec![],
                error: Some(format!("Failed to parse Deno response: {}", err)),
            }))
        }
    }
}

/// Handler for streaming copilotkit API requests
async fn handle_copilot_stream(
    data: Data<AppState>,
    req: web::Json<CopilotRequest>,
) -> ActixResult<impl Responder> {
    let request = req.into_inner();
    debug!("Received streaming copilotkit request: {:?}", request);

    let (tx, rx) = sse::channel(100);

    // Clone state for the async task
    let state_clone = data.get_ref().clone();
    actix_web::rt::spawn(async move {
        stream_copilot_response(state_clone, request, tx).await;
    });

    Ok(Sse::new(ChannelStream::new(rx)).keep_alive(sse::KeepAlive::new().interval(std::time::Duration::from_secs(15))))
}

/// Stream the copilot response
async fn stream_copilot_response(
    state: AppState,
    request: CopilotRequest,
    tx: SseSender,
) {
    // Get a lock on the Deno worker
    let mut worker_lock = state.deno_worker.lock().await;

    // Check if worker is available
    let worker = match worker_lock.as_mut() {
        Some(worker) => worker,
        None => {
            error!("Deno worker not initialized for streaming");
            let error_chunk = CopilotStreamChunk {
                chunk: "Internal server error".to_string(),
                done: Some(true),
                error: Some("Deno runtime not initialized".to_string()),
            };
            if let Ok(json) = serde_json::to_string(&error_chunk) {
                let _ = tx.send(sse::Data::new(json)).await;
            }
            return;
        }
    };

    // Prepare the request JSON for the Deno function
    let request_json = match serde_json::to_string(&request) {
        Ok(json) => json,
        Err(err) => {
            error!("Failed to serialize streaming request: {}", err);
            let error_chunk = CopilotStreamChunk {
                chunk: "Internal server error".to_string(),
                done: Some(true),
                error: Some(format!("Failed to serialize request: {}", err)),
            };
            if let Ok(json) = serde_json::to_string(&error_chunk) {
                let _ = tx.send(sse::Data::new(json)).await;
            }
            return;
        }
    };

    // Call the Deno function for streaming
    match state.deno_runtime.execute_function(worker, "handleCopilotStreamRequest", &format!("'{}'", request_json)).await {
        Ok(result) => {
            // The result should be a JSON array of chunks
            match serde_json::from_str::<Vec<CopilotStreamChunk>>(&result) {
                Ok(chunks) => {
                    for chunk in chunks {
                        if let Ok(json) = serde_json::to_string(&chunk) {
                            if tx.send(sse::Data::new(json)).await.is_err() {
                                break;
                            }
                            if chunk.done.unwrap_or(false) {
                                break;
                            }
                        }
                    }
                },
                Err(err) => {
                    error!("Failed to parse streaming Deno response: {}", err);
                    let error_chunk = CopilotStreamChunk {
                        chunk: "Internal server error".to_string(),
                        done: Some(true),
                        error: Some(format!("Failed to parse Deno response: {}", err)),
                    };
                    if let Ok(json) = serde_json::to_string(&error_chunk) {
                        let _ = tx.send(sse::Data::new(json)).await;
                    }
                }
            }
        },
        Err(err) => {
            error!("Failed to execute streaming Deno function: {}", err);
            let error_chunk = CopilotStreamChunk {
                chunk: "Internal server error".to_string(),
                done: Some(true),
                error: Some(format!("Failed to execute Deno function: {}", err)),
            };
            if let Ok(json) = serde_json::to_string(&error_chunk) {
                let _ = tx.send(sse::Data::new(json)).await;
            }
        }
    }
}