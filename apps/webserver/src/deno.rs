use std::path::Path;
use std::rc::Rc;
use std::sync::Arc;
use std::cell::RefCell;

use deno_core::error::AnyError;
use deno_core::{v8, JsRuntime, RuntimeOptions};
use deno_runtime::deno_broadcast_channel::InMemoryBroadcastChannel;
use deno_runtime::deno_web::BlobStore;
use deno_runtime::permissions::Permissions;
use deno_runtime::worker::{MainWorker, WorkerOptions};
use deno_runtime::BootstrapOptions;

use crate::error::{Result, ServerError};
use crate::config::ServerConfig;

/// Deno runtime service for executing TypeScript/JavaScript code
pub struct DenoRuntime {
    /// Configuration for the server
    config: Arc<ServerConfig>,
}

impl DenoRuntime {
    /// Create a new Deno runtime service
    pub fn new(config: Arc<ServerConfig>) -> Self {
        Self { config }
    }

    /// Initialize the Deno runtime with the specified main module
    pub async fn init(&self) -> Result<MainWorker> {
        let module_path = self.config.deno_app_path.clone();
        let module_url = deno_core::resolve_url_or_path(&module_path.to_string_lossy())?;
        
        let create_web_worker_cb = Arc::new(|_| {
            todo!("Web workers are not supported in this implementation");
        });

        let blob_store = BlobStore::default();
        let broadcast_channel = InMemoryBroadcastChannel::default();

        // Set up permissions (no permissions for now, which is secure by default)
        let permissions = Permissions::allow_all();

        // Bootstrap options
        let bootstrap_options = BootstrapOptions {
            args: vec![],
            cpu_count: num_cpus::get() as u32,
            debug_flag: false,
            enable_testing_features: false,
            location: None,
            no_color: false,
            is_tty: false,
            runtime_version: "v1.0.0".to_string(),
            ts_version: "4.9.4".to_string(),
            unstable: false,
            user_agent: "deno/1.0.0".to_string(),
            inspect: false,
        };

        // Worker options
        let options = WorkerOptions {
            bootstrap: bootstrap_options,
            extensions: vec![],
            unsafely_ignore_certificate_errors: None,
            root_cert_store: None,
            seed: None,
            source_map_getter: None,
            format_js_error_fn: None,
            web_worker_preload_module_cb: create_web_worker_cb.clone(),
            web_worker_pre_execute_module_cb: create_web_worker_cb,
            create_web_worker_cb: Arc::new(|_| {
                todo!("Web workers are not supported in this implementation");
            }),
            maybe_inspector_server: None,
            should_break_on_first_statement: false,
            should_wait_for_inspector_session: false,
            module_loader: Rc::new(deno_runtime::deno_fs::FsModuleLoader),
            npm_resolver: None,
            get_error_class_fn: None,
            cache_storage_dir: None,
            origin_storage_dir: None,
            blob_store: blob_store.clone(),
            broadcast_channel: broadcast_channel.clone(),
            shared_array_buffer_store: None,
            compiled_wasm_module_store: None,
            stdio: Default::default(),
        };

        // Create main worker
        let mut worker = MainWorker::bootstrap_from_options(module_url.clone(), permissions, options);
        
        // Set environment variables for the Deno runtime
        self.set_environment_variables(&mut worker)?;
        
        // Execute the main module
        worker.execute_main_module(&module_url).await?;
        
        Ok(worker)
    }
    
    /// Set environment variables for the Deno runtime
    fn set_environment_variables(&self, worker: &mut MainWorker) -> Result<()> {
        // Set OpenAI API key
        let script = format!(
            r#"
            Deno.env.set("OPENAI_API_KEY", "{}");
            "#,
            self.config.openai_api_key
        );
        
        worker.execute_script("[env_setup]", &script)
            .map_err(|e| ServerError::DenoExecution(format!("Failed to set environment variables: {}", e)))?;
        
        Ok(())
    }
    
    /// Execute a function in the Deno runtime
    pub async fn execute_function(&self, worker: &mut MainWorker, function_name: &str, args: &str) -> Result<String> {
        // Create a script to call the function with the provided arguments
        let script = format!(
            r#"
            (async function() {{
                if (typeof globalThis.{} !== "function") {{
                    throw new Error("Function {} is not defined");
                }}
                
                try {{
                    const result = await globalThis.{}({});
                    return result;
                }} catch (error) {{
                    throw new Error(`Error executing {}: ${{error.message}}`);
                }}
            }})();
            "#,
            function_name, function_name, function_name, args, function_name
        );
        
        // Execute the script
        let result = worker.execute_script("[execute_function]", &script)
            .map_err(|e| ServerError::DenoExecution(format!("Failed to execute function: {}", e)))?;
        
        // Get the result from the promise
        let global = worker.js_runtime.global_context();
        let scope = &mut worker.js_runtime.handle_scope();
        let local = v8::Local::new(scope, result);
        
        // Resolve the promise
        let promise = v8::Local::<v8::Promise>::try_from(local)
            .map_err(|_| ServerError::DenoV8("Result is not a promise".to_string()))?;
        
        // Process microtasks to resolve the promise
        worker.js_runtime.run_event_loop(false).await?;
        
        // Check promise state
        match promise.state() {
            v8::PromiseState::Fulfilled => {
                let result = promise.result(scope);
                let result_str = result.to_string(scope)
                    .ok_or_else(|| ServerError::DenoV8("Failed to convert result to string".to_string()))?;
                
                let rust_string = result_str.to_rust_string_lossy(scope);
                Ok(rust_string)
            },
            v8::PromiseState::Rejected => {
                let result = promise.result(scope);
                let result_str = result.to_string(scope)
                    .ok_or_else(|| ServerError::DenoV8("Failed to convert error to string".to_string()))?;
                
                let error_message = result_str.to_rust_string_lossy(scope);
                Err(ServerError::DenoExecution(error_message))
            },
            v8::PromiseState::Pending => {
                Err(ServerError::DenoExecution("Promise is still pending".to_string()))
            },
        }
    }
}