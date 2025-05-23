/**
 * Platform detection utilities
 *
 * This module provides utilities to detect whether the application is running
 * in a desktop (Tauri), mobile (iOS/Android), or web environment, allowing for
 * conditional code execution and feature detection.
 */

/**
 * Platform types supported by the application
 */
export type Platform = 'desktop' | 'ios' | 'android' | 'web';

/**
 * Check if the application is running in a Tauri desktop environment
 *
 * @returns {boolean} True if running in Tauri
 */
export const isTauri = (): boolean => {
  // Check for Tauri-specific global object with detailed logging
  if (typeof window === 'undefined') {
    console.log('isTauri: window is undefined');
    return false;
  }
  
  const hasTauri = typeof window.__TAURI__ !== 'undefined';
  
  if (hasTauri) {
    console.log('isTauri: __TAURI__ object found');
    console.log('isTauri: __TAURI__ keys:', Object.keys(window.__TAURI__ || {}));
    
    // Check for invoke method in different possible locations
    const hasDirectInvoke = typeof window.__TAURI__?.invoke === 'function';
    const hasTauriInvoke = typeof window.__TAURI__?.tauri?.invoke === 'function';
    const hasCoreInvoke = typeof window.__TAURI__?.core?.invoke === 'function';
    
    console.log('isTauri: has direct invoke:', hasDirectInvoke);
    console.log('isTauri: has tauri.invoke:', hasTauriInvoke);
    console.log('isTauri: has core.invoke:', hasCoreInvoke);
    
    return true;
  }
  
  console.log('isTauri: __TAURI__ object not found');
  return false;
};

/**
 * Check if the application is running on iOS
 *
 * @returns {boolean} True if running on iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Capacitor on iOS
  const isCapacitorIOS = typeof window.Capacitor !== 'undefined' &&
                        window.Capacitor.getPlatform() === 'ios';
  
  // Alternative detection using user agent
  const isIOSUserAgent = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                        !(window as any).MSStream;
  
  return isCapacitorIOS || isIOSUserAgent;
};

/**
 * Check if the application is running on Android
 *
 * @returns {boolean} True if running on Android
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Capacitor on Android
  const isCapacitorAndroid = typeof window.Capacitor !== 'undefined' &&
                            window.Capacitor.getPlatform() === 'android';
  
  // Alternative detection using user agent
  const isAndroidUserAgent = /Android/.test(navigator.userAgent);
  
  return isCapacitorAndroid || isAndroidUserAgent;
};

/**
 * Check if the application is running on a mobile device (iOS or Android)
 *
 * @returns {boolean} True if running on a mobile device
 */
export const isMobile = (): boolean => {
  return isIOS() || isAndroid();
};

/**
 * Check if the application is running in a web browser environment
 *
 * @returns {boolean} True if running in a web browser
 */
export const isWeb = (): boolean => {
  return !isTauri() && !isMobile();
};

/**
 * Get the current platform name
 *
 * @returns {Platform} 'desktop', 'ios', 'android', or 'web'
 */
export const getPlatform = (): Platform => {
  if (isTauri()) return 'desktop';
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'web';
};

/**
 * Execute different functions based on the current platform
 *
 * @param {Object} options - Object containing platform-specific functions
 * @param {Function} options.desktop - Function to execute in Tauri environment
 * @param {Function} options.ios - Function to execute in iOS environment
 * @param {Function} options.android - Function to execute in Android environment
 * @param {Function} options.web - Function to execute in web environment
 * @param {Function} options.mobile - Function to execute in any mobile environment (fallback if ios/android not specified)
 * @param {Function} options.default - Default function to execute if no platform-specific function is provided
 * @returns {any} Result of the executed function
 */
export const platformSpecific = <T>(options: {
  desktop?: () => T;
  ios?: () => T;
  android?: () => T;
  web?: () => T;
  mobile?: () => T;
  default?: () => T;
}): T => {
  const platform = getPlatform();
  
  // Check for exact platform match
  if (platform === 'desktop' && options.desktop) {
    return options.desktop();
  }
  
  if (platform === 'ios' && options.ios) {
    return options.ios();
  }
  
  if (platform === 'android' && options.android) {
    return options.android();
  }
  
  if (platform === 'web' && options.web) {
    return options.web();
  }
  
  // Check for mobile fallback
  if ((platform === 'ios' || platform === 'android') && options.mobile) {
    return options.mobile();
  }
  
  // Use default if provided
  if (options.default) {
    return options.default();
  }
  
  throw new Error(`No implementation provided for platform: ${platform}`);
};
