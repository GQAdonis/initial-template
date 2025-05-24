import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { TauriSQLiteDatabase } from '@/lib/powersync-tauri-adapter'
import { AppSchema } from '@/hooks/powersync/app-schema.ts'
import BackendConnector from '@/hooks/powersync/backend-connector.ts'
import env from '@/config/env.ts'

// Create a flag to track if we're in a Tauri environment
// We check for the __TAURI__ object which is only present in Tauri apps
const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI__;
console.log('PowerSync Provider: Is Tauri environment:', isTauri);

// We primarily support Tauri environment, but provide a mock for browser preview
if (!isTauri) {
  console.warn('PowerSync Provider: Running in browser environment with limited functionality');
}

// Create our own database context since we're not using PowerSync's full implementation
const DatabaseContext = createContext<TauriSQLiteDatabase | null>(null);

// Export a hook to use the database
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a PowerSyncProvider');
  }
  return context;
};

// Create a wrapper for the PowerSync provider that handles both environments
const PowerSyncProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<TauriSQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        setIsLoading(true);

        if (isTauri) {
          // In Tauri environment, use the native SQLite adapter
          console.log('PowerSync Provider: Using native SQLite adapter for Tauri');
          
          try {
            // Create backend connector (for future use when we implement sync)
            const backend = new BackendConnector(env.POWERSYNC_URL, env.POWERSYNC_TOKEN);
            
            // Create our Tauri database with SQLCipher
            const tauriDb = new TauriSQLiteDatabase({
              dbFilename: 'powersync',  // The .db extension will be added by the adapter
              schema: AppSchema
            });
            
            // Initialize and connect
            await tauriDb.init();
            await tauriDb.connect(backend);
            
            // Set the database in state
            setDb(tauriDb);
            
            console.log('PowerSync Provider: Successfully initialized with native SQLite');
            
            // Set up cleanup function
            return () => {
              tauriDb.disconnect();
            };
          } catch (initError) {
            console.error('PowerSync Provider: Failed to initialize with native SQLite:', initError);
            throw initError;
          }
        } else {
          // In browser environment, provide a mock implementation
          console.log('PowerSync Provider: Using mock implementation for browser environment');
          
          // Create a simple mock object that implements the necessary interface
          // but doesn't actually connect to a database
          const mockDb = {
            schema: AppSchema,
            connected: true,
            connector: null,
            watch: () => ({ unsubscribe: () => {} }),
            getAll: async () => [],
            get: async () => null,
            execute: async () => ({ rows: { _array: [], length: 0, item: () => null }, rowsAffected: 0 }),
            query: async () => ({ rows: { _array: [], length: 0, item: () => null }, rowsAffected: 0 }),
            connect: async () => {},
            disconnect: async () => {},
            init: async () => {},
            transaction: async (callback: () => Promise<any>) => callback(),
          } as any;
          
          setDb(mockDb);
          console.log('PowerSync Provider: Successfully initialized with mock implementation');
        }
      } catch (err) {
        console.error('PowerSync Provider: Failed to initialize database:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    const cleanup = initializeDb();
    
    // Return cleanup function
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => {
          if (cleanupFn) cleanupFn();
        });
      }
    };
  }, []);

    if (isLoading) {
        return <div>Loading database...</div>
    }
    
    if (error) {
        return <div>Error initializing database: {error.message}</div>
    }
    
    if (!db) {
        return <div>Database not initialized</div>
    }
    
    return (
        <DatabaseContext.Provider value={db}>
            {children}
        </DatabaseContext.Provider>
    )
}

export { PowerSyncProvider }
