// PowerSync configuration helper
// This ensures we use the correct implementation based on the environment

export const getPowerSyncConfig = () => {
  // Check if we're in a Tauri environment
  const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI__;
  
  if (isTauri) {
    console.log('PowerSync Config: Using native SQLite implementation for Tauri');
    return {
      implementation: 'native',
      useWebWorker: false,
      disableWasm: true,
      sqliteAdapter: 'tauri-native'
    };
  }
  
  // In non-Tauri environments, throw an error
  // This application is designed to run only in Tauri
  console.error('PowerSync Config: This application is designed to run only in Tauri');
  throw new Error('PowerSync should only run in Tauri environment');
};
