/**
 * API Adapter for multi-platform environments
 *
 * This module provides adapters for platform-specific APIs, allowing the application
 * to use a consistent interface regardless of whether it's running in a Tauri desktop
 * environment, mobile (iOS/Android), or web browser.
 */

import { platformSpecific } from './platform';

/**
 * Interface for file system operations
 */
export interface FileSystemAdapter {
  /**
   * Read a file from the file system
   * 
   * @param {string} path - Path to the file
   * @returns {Promise<string>} File contents as string
   */
  readTextFile(path: string): Promise<string>;
  
  /**
   * Write text to a file
   * 
   * @param {string} path - Path to the file
   * @param {string} contents - Content to write
   * @returns {Promise<void>}
   */
  writeTextFile(path: string, contents: string): Promise<void>;
  
  /**
   * Check if a file exists
   * 
   * @param {string} path - Path to the file
   * @returns {Promise<boolean>} True if file exists
   */
  exists(path: string): Promise<boolean>;
}

/**
 * Interface for dialog operations
 */
export interface DialogAdapter {
  /**
   * Open a file selection dialog
   * 
   * @param {object} options - Dialog options
   * @returns {Promise<string | string[] | null>} Selected file path(s) or null if canceled
   */
  open(options?: { multiple?: boolean, filters?: Record<string, string[]> }): Promise<string | string[] | null>;
  
  /**
   * Open a file save dialog
   * 
   * @param {object} options - Dialog options
   * @returns {Promise<string | null>} Selected save path or null if canceled
   */
  save(options?: { defaultPath?: string, filters?: Record<string, string[]> }): Promise<string | null>;
}

/**
 * Get the appropriate file system adapter for the current platform
 * 
 * @returns {Promise<FileSystemAdapter>} Platform-specific file system adapter
 */
export const getFileSystemAdapter = async (): Promise<FileSystemAdapter> => {
  return await platformSpecific<Promise<FileSystemAdapter>>({
    // Tauri implementation
    desktop: async () => {
      try {
        // Dynamically import Tauri API only when in Tauri environment
        const { fs } = await import('@tauri-apps/api');
        
        return {
          readTextFile: async (path: string) => {
            return await fs.readTextFile(path);
          },
          writeTextFile: async (path: string, contents: string) => {
            await fs.writeTextFile(path, contents);
          },
          exists: async (path: string) => {
            try {
              await fs.metadata(path);
              return true;
            } catch {
              return false;
            }
          }
        };
      } catch (error) {
        console.error('Failed to load Tauri file system API:', error);
        throw new Error('Tauri file system API not available');
      }
    },
    
    // iOS implementation
    ios: async () => {
      try {
        // Dynamically import Capacitor File API
        const { Filesystem } = await import('@capacitor/filesystem');
        
        return {
          readTextFile: async (path: string) => {
            const result = await Filesystem.readFile({
              path,
              encoding: 'utf8'
            });
            return result.data;
          },
          writeTextFile: async (path: string, contents: string) => {
            await Filesystem.writeFile({
              path,
              data: contents,
              encoding: 'utf8'
            });
          },
          exists: async (path: string) => {
            try {
              await Filesystem.stat({ path });
              return true;
            } catch {
              return false;
            }
          }
        };
      } catch (error) {
        console.error('Failed to load Capacitor File API:', error);
        throw new Error('Capacitor File API not available');
      }
    },
    
    // Android implementation (same as iOS since both use Capacitor)
    android: async () => {
      try {
        // Dynamically import Capacitor File API
        const { Filesystem } = await import('@capacitor/filesystem');
        
        return {
          readTextFile: async (path: string) => {
            const result = await Filesystem.readFile({
              path,
              encoding: 'utf8'
            });
            return result.data;
          },
          writeTextFile: async (path: string, contents: string) => {
            await Filesystem.writeFile({
              path,
              data: contents,
              encoding: 'utf8'
            });
          },
          exists: async (path: string) => {
            try {
              await Filesystem.stat({ path });
              return true;
            } catch {
              return false;
            }
          }
        };
      } catch (error) {
        console.error('Failed to load Capacitor File API:', error);
        throw new Error('Capacitor File API not available');
      }
    },
    
    // Web implementation (with limited functionality)
    web: async () => {
      return {
        readTextFile: async (_path: string) => {
          throw new Error('File system access not available in web environment');
        },
        writeTextFile: async (_path: string, _contents: string) => {
          throw new Error('File system access not available in web environment');
        },
        exists: async (_path: string) => {
          throw new Error('File system access not available in web environment');
        }
      };
    }
  });
};

/**
 * Get the appropriate dialog adapter for the current platform
 * 
 * @returns {Promise<DialogAdapter>} Platform-specific dialog adapter
 */
export const getDialogAdapter = async (): Promise<DialogAdapter> => {
  return await platformSpecific<Promise<DialogAdapter>>({
    // Tauri implementation
    desktop: async () => {
      try {
        // Dynamically import Tauri API only when in Tauri environment
        const { dialog } = await import('@tauri-apps/api');
        
        return {
          open: async (options?: { multiple?: boolean, filters?: Record<string, string[]> }) => {
            try {
              if (options?.multiple) {
                return await dialog.open({
                  multiple: true,
                  filters: options.filters
                });
              } else {
                return await dialog.open({
                  multiple: false,
                  filters: options?.filters
                });
              }
            } catch {
              return null;
            }
          },
          save: async (options?: { defaultPath?: string, filters?: Record<string, string[]> }) => {
            try {
              return await dialog.save({
                defaultPath: options?.defaultPath,
                filters: options?.filters
              });
            } catch {
              return null;
            }
          }
        };
      } catch (error) {
        console.error('Failed to load Tauri dialog API:', error);
        throw new Error('Tauri dialog API not available');
      }
    },
    
    // iOS implementation
    ios: async () => {
      try {
        // Dynamically import Capacitor FilePicker plugin
        const { FilePicker } = await import('@capawesome/capacitor-file-picker');
        
        return {
          open: async (options?: { multiple?: boolean, filters?: Record<string, string[]> }) => {
            try {
              const result = await FilePicker.pickFiles({
                multiple: options?.multiple || false,
                // Convert filters to readable formats
                readableTypes: options?.filters ?
                  Object.entries(options.filters).flatMap(([_, exts]) =>
                    exts.map(ext => ext.replace('.', ''))) :
                  undefined
              });
              
              if (result.files.length === 0) {
                return null;
              }
              
              if (options?.multiple) {
                return result.files.map((file) => file.path);
              } else {
                return result.files[0].path;
              }
            } catch {
              return null;
            }
          },
          save: async (_options?: { defaultPath?: string, filters?: Record<string, string[]> }) => {
            // FilePicker doesn't have a direct save method, so we'd need to implement
            // a custom solution or use a different plugin
            console.warn('Save dialog not fully implemented for iOS');
            return null;
          }
        };
      } catch (error) {
        console.error('Failed to load Capacitor FilePicker API:', error);
        throw new Error('Capacitor FilePicker API not available');
      }
    },
    
    // Android implementation (similar to iOS)
    android: async () => {
      try {
        // Dynamically import Capacitor FilePicker plugin
        const { FilePicker } = await import('@capawesome/capacitor-file-picker');
        
        return {
          open: async (options?: { multiple?: boolean, filters?: Record<string, string[]> }) => {
            try {
              const result = await FilePicker.pickFiles({
                multiple: options?.multiple || false,
                // Convert filters to readable formats
                readableTypes: options?.filters ?
                  Object.entries(options.filters).flatMap(([_, exts]) =>
                    exts.map(ext => ext.replace('.', ''))) :
                  undefined
              });
              
              if (result.files.length === 0) {
                return null;
              }
              
              if (options?.multiple) {
                return result.files.map((file) => file.path);
              } else {
                return result.files[0].path;
              }
            } catch {
              return null;
            }
          },
          save: async (_options?: { defaultPath?: string, filters?: Record<string, string[]> }) => {
            // FilePicker doesn't have a direct save method, so we'd need to implement
            // a custom solution or use a different plugin
            console.warn('Save dialog not fully implemented for Android');
            return null;
          }
        };
      } catch (error) {
        console.error('Failed to load Capacitor FilePicker API:', error);
        throw new Error('Capacitor FilePicker API not available');
      }
    },
    
    // Web implementation (with browser-based file dialogs where possible)
    web: async () => {
      return {
        open: async (options?: { multiple?: boolean, filters?: Record<string, string[]> }) => {
          // Use the File System Access API if available
          if ('showOpenFilePicker' in window) {
            try {
              const fileHandles = await (window as any).showOpenFilePicker({
                multiple: options?.multiple || false,
                types: options?.filters ? Object.entries(options.filters).map(([description, extensions]) => ({
                  description,
                  accept: extensions.reduce((acc: Record<string, string[]>, ext: string) => {
                    // Convert extensions to MIME types (simplified)
                    const mimeType = ext === '.json' ? 'application/json' :
                                    ext === '.txt' ? 'text/plain' :
                                    ext === '.png' ? 'image/png' :
                                    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                                    'application/octet-stream';
                    acc[mimeType] = [ext];
                    return acc;
                  }, {} as Record<string, string[]>)
                })) : undefined
              });
              
              if (options?.multiple) {
                // Return array of file paths (in web, we use object URLs)
                const files = await Promise.all(fileHandles.map((handle: any) => handle.getFile()));
                return files.map((file: File) => URL.createObjectURL(file));
              } else {
                // Return single file path
                const file = await fileHandles[0].getFile();
                return URL.createObjectURL(file);
              }
            } catch {
              return null;
            }
          } else {
            throw new Error('File system access not available in this browser');
          }
        },
        save: async (options?: { defaultPath?: string, filters?: Record<string, string[]> }) => {
          // Use the File System Access API if available
          if ('showSaveFilePicker' in window) {
            try {
              const fileHandle = await (window as any).showSaveFilePicker({
                suggestedName: options?.defaultPath?.split('/').pop(),
                types: options?.filters ? Object.entries(options.filters).map(([description, extensions]) => ({
                  description,
                  accept: extensions.reduce((acc: Record<string, string[]>, ext: string) => {
                    // Convert extensions to MIME types (simplified)
                    const mimeType = ext === '.json' ? 'application/json' :
                                    ext === '.txt' ? 'text/plain' :
                                    ext === '.png' ? 'image/png' :
                                    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                                    'application/octet-stream';
                    acc[mimeType] = [ext];
                    return acc;
                  }, {} as Record<string, string[]>)
                })) : undefined
              });
              
              // In web, we return a FileSystemFileHandle object
              return JSON.stringify(fileHandle);
            } catch {
              return null;
            }
          } else {
            throw new Error('File system access not available in this browser');
          }
        }
      };
    }
  });
};

/**
 * Safely access platform-specific APIs with fallbacks
 * 
 * @param {Function} fn - Function that uses platform-specific APIs
 * @param {any} fallback - Fallback value if the API is not available
 * @returns {Promise<any>} Result of the function or fallback value
 */
export const withPlatformApi = async <T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.warn('Platform API not available:', error);
    return fallback;
  }
};
