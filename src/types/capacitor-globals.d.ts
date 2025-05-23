/**
 * Type declarations for Capacitor global variables
 */

interface Window {
  /**
   * Capacitor global object injected by Capacitor
   */
  Capacitor?: {
    /**
     * Get the current platform
     * @returns The current platform ('ios', 'android', 'web')
     */
    getPlatform: () => 'ios' | 'android' | 'web';
    
    /**
     * Check if the app is running natively
     * @returns True if running natively
     */
    isNative: () => boolean;
    
    /**
     * Check if the app is running on a specific platform
     * @param platform The platform to check
     * @returns True if running on the specified platform
     */
    platform: (platform: string) => boolean;
  };
}
