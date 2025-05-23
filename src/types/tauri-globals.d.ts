/**
 * Type declarations for Tauri global variables
 */

interface Window {
  /**
   * Tauri global object injected by Tauri
   */
  __TAURI__?: {
    /**
     * Invoke a Tauri command
     */
    invoke?: (cmd: string, args?: Record<string, unknown>) => Promise<any>;
    
    /**
     * Tauri namespace
     */
    tauri?: {
      /**
       * Invoke a Tauri command
       */
      invoke?: (cmd: string, args?: Record<string, unknown>) => Promise<any>;
    };
    
    /**
     * Core namespace
     */
    core?: {
      /**
       * Invoke a Tauri command
       */
      invoke?: (cmd: string, args?: Record<string, unknown>) => Promise<any>;
    };
  };
}
