/**
 * Utility functions for interacting with the Node.js AI service sidecar
 */

// In Tauri v2, we can use the global Tauri object since withGlobalTauri is enabled
// This approach avoids TypeScript module resolution issues

// Simple type-safe wrapper for the Tauri invoke function
function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  // @ts-ignore - Ignore TypeScript errors for the global Tauri object
  return window.__TAURI__.core.invoke(cmd, args);
}

/**
 * Interface for AI service request
 */
interface AiServiceRequest {
  message: string;
  stream?: boolean;
  context?: Record<string, any>;
}

/**
 * Interface for AI service response
 */
interface AiServiceResponse {
  success: boolean;
  message: string;
}

/**
 * Interface for AI message response
 */
interface AiMessageResponse {
  message: string;
  actions?: any[];
  error?: string;
}

/**
 * Interface for AI streaming chunk
 */
interface AiStreamChunk {
  chunk: string;
  done: boolean;
  error?: string;
}

/**
 * Start the AI service sidecar
 * @returns Promise with the result of the operation
 */
export async function startAiService(): Promise<AiServiceResponse> {
  try {
    return await invoke<AiServiceResponse>('start_ai_service');
  } catch (error) {
    console.error('Failed to start AI service:', error);
    return {
      success: false,
      message: `Failed to start AI service: ${error}`,
    };
  }
}

/**
 * Send a request to the AI service
 * @param request The request to send
 * @returns Promise with the AI response
 */
export async function sendAiRequest(request: AiServiceRequest): Promise<AiMessageResponse> {
  try {
    return await invoke<AiMessageResponse>('send_ai_request', { request });
  } catch (error) {
    console.error('Failed to send AI request:', error);
    return {
      message: `Error: ${error}`,
      error: String(error),
    };
  }
}

/**
 * Send a streaming request to the AI service
 * @param request The request to send
 * @param onChunk Callback for each chunk received
 * @returns Promise that resolves when the stream is complete
 */
export async function sendStreamingAiRequest(
  request: AiServiceRequest,
  onChunk: (chunk: string, done: boolean) => void
): Promise<void> {
  try {
    // Ensure stream flag is set
    const streamRequest = {
      ...request,
      stream: true,
    };
    
    // Send the request
    const response = await invoke<AiStreamChunk[]>('send_ai_request', { request: streamRequest });
    
    // Process each chunk
    for (const chunk of response) {
      onChunk(chunk.chunk, chunk.done);
      
      if (chunk.error) {
        console.error('Stream error:', chunk.error);
        onChunk(`Error: ${chunk.error}`, true);
        break;
      }
      
      if (chunk.done) {
        break;
      }
    }
  } catch (error) {
    console.error('Failed to send streaming AI request:', error);
    onChunk(`Error: ${error}`, true);
  }
}

/**
 * Initialize the AI service when the application starts
 */
export async function initializeAiService(): Promise<void> {
  console.log('Initializing AI service...');
  const result = await startAiService();
  console.log('AI service initialization result:', result);
}