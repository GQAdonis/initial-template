import { QueryResult, WatchHandler, SQLWatchOptions, Schema } from '@powersync/common';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import { join } from '@tauri-apps/api/path';

// Define a type for SQL response
interface SqlResponse {
  success: boolean;
  message: string;
  rows?: any[];
}

// Define a type for watch subscription
interface WatchSubscription {
  unsubscribe: () => void;
}

/**
 * Options for the TauriSQLiteDatabase
 */
export interface TauriSQLiteDatabaseOptions {
  /**
   * The filename for the database
   */
  dbFilename: string;

  /**
   * The schema to use for the database
   */
  schema: Schema;

  /**
   * Optional path to store the database file
   * If not provided, will use the app's data directory
   */
  dbPath?: string;
}

/**
 * TauriSQLiteDatabase - Simple database adapter for Tauri using SQLCipher through IPC
 * This implementation uses Tauri's IPC to communicate with a Rust backend that manages
 * the SQLCipher database operations.
 * 
 * Note: This is a simplified implementation that provides basic database functionality
 * without the full PowerSync synchronization features.
 */
export class TauriSQLiteDatabase {
  private dbPath: string;
  private _connected: boolean = false;
  private _connector: any = null;
  private watchSubscriptions: Map<string, WatchSubscription> = new Map<string, WatchSubscription>();
  private _schema: Schema;
  
  constructor(options: TauriSQLiteDatabaseOptions) {
    this._schema = options.schema;
    // Store the options for later use when we have access to async APIs
    this.dbPath = options.dbPath || `${options.dbFilename}.db`; // Will be resolved in init()
    console.log('TauriSQLiteDatabase: Created with SQLCipher adapter');
  }
  
  /**
   * Get the schema
   */
  get schema(): Schema {
    return this._schema;
  }
  
  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    if (this._connected) {
      console.log('TauriSQLiteDatabase: Already initialized');
      return;
    }
    
    try {
      // Resolve the database path using Tauri's app data directory
      const appDataPath = await appDataDir();
      const fullDbPath = await join(appDataPath, this.dbPath);
      
      console.log(`TauriSQLiteDatabase: Initializing SQLCipher connection to ${fullDbPath}`);
      
      // Initialize the database using the Rust backend
      const response = await invoke<SqlResponse>('init_database', {
        dbPath: fullDbPath
      });
      
      if (!response.success) {
        throw new Error(`Failed to initialize database: ${response.message}`);
      }
      
      // Set connected flag before initializing schema
      this._connected = true;
      
      // Initialize schema
      await this.initSchema();
      
      console.log('TauriSQLiteDatabase: Successfully initialized encrypted SQLite database');
    } catch (error) {
      console.error('TauriSQLiteDatabase: Error initializing:', error);
      throw error;
    }
  }
  
  /**
   * Initialize the database schema
   */
  private async initSchema(): Promise<void> {
    try {
      console.log('TauriSQLiteDatabase: Initializing schema');
      
      // For now, let's just create a simple test table to ensure database works
      // PowerSync schemas require more complex setup
      await this.execute(`
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('TauriSQLiteDatabase: Basic schema initialized successfully');
    } catch (error) {
      console.error('TauriSQLiteDatabase: Error in initSchema:', error);
      throw error;
    }
  }
  
  /**
   * Get connection status
   */
  get connected(): boolean {
    return this._connected;
  }
  
  /**
   * Connect to the database
   */
  async connect(connector?: any): Promise<void> {
    if (!this._connected) {
      await this.init();
    }
    this._connector = connector;
  }
  
  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    if (this._connected) {
      try {
        // Close all watch subscriptions
        for (const key of this.watchSubscriptions.keys()) {
          const subscription = this.watchSubscriptions.get(key);
          if (subscription) {
            subscription.unsubscribe();
          }
        }
        this.watchSubscriptions.clear();
        
        // Close the database connection
        const response = await invoke<SqlResponse>('close_database');
        
        if (!response.success) {
          throw new Error(`Failed to close database: ${response.message}`);
        }
        
        this._connected = false;
        console.log('TauriSQLiteDatabase: Successfully disconnected from database');
      } catch (error) {
        console.error('TauriSQLiteDatabase: Error disconnecting:', error);
        throw error;
      }
    }
  }
  
  /**
   * Execute a SQL query that doesn't return data
   */
  async execute(sql: string, parameters: any[] = []): Promise<QueryResult> {
    try {
      if (!this._connected) {
        throw new Error('Database not connected');
      }
      
      console.log('TauriSQLiteDatabase: Executing SQL:', sql, 'with params:', parameters);
      
      // Execute the SQL statement using the Rust backend
      const response = await invoke<SqlResponse>('execute_sql', {
        sql,
        paramsJson: parameters.length > 0 ? { params: parameters } : null
      });
      
      if (!response.success) {
        throw new Error(`Failed to execute SQL: ${response.message}`);
      }
      
      return {
        rows: {
          _array: [],
          length: 0,
          item: (_idx: number) => null
        },
        rowsAffected: response.rows ? response.rows.length : 0
      };
    } catch (error) {
      console.error('TauriSQLiteDatabase: Error executing SQL:', error);
      throw error;
    }
  }
  
  /**
   * Execute a SQL query and return the results
   */
  async query(sql: string, parameters: any[] = []): Promise<QueryResult> {
    try {
      if (!this._connected) {
        throw new Error('Database not connected');
      }
      
      console.log('TauriSQLiteDatabase: Querying SQL:', sql, 'with params:', parameters);
      
      // Execute the SQL query using the Rust backend
      const response = await invoke<SqlResponse>('query_sql', {
        sql,
        paramsJson: parameters.length > 0 ? { params: parameters } : null
      });
      
      if (!response.success) {
        throw new Error(`Failed to query SQL: ${response.message}`);
      }
      
      const resultRows = response.rows || [];
      
      // Convert the rows to the expected format
      return {
        rows: {
          _array: resultRows,
          length: resultRows.length,
          item: (idx: number) => resultRows[idx] || null
        },
        rowsAffected: 0 // Not applicable for queries
      };
    } catch (error) {
      console.error('TauriSQLiteDatabase: Error querying SQL:', error);
      throw error;
    }
  }
  
  /**
   * Watch for changes to a SQL query
   */
  watch(sql: string, parameters?: any[], options?: SQLWatchOptions): AsyncIterable<QueryResult>;
  watch(sql: string, parameters?: any[], handler?: WatchHandler, options?: SQLWatchOptions): void;
  watch(sql: string, parameters: any[] = [], handlerOrOptions?: WatchHandler | SQLWatchOptions, options?: SQLWatchOptions): void | AsyncIterable<QueryResult> {
    // Generate a unique key for this watch
    const watchKey = `${sql}-${JSON.stringify(parameters)}`;
    
    // If we already have a subscription for this query, unsubscribe first
    if (this.watchSubscriptions.has(watchKey)) {
      const existingSubscription = this.watchSubscriptions.get(watchKey);
      if (existingSubscription) {
        existingSubscription.unsubscribe();
      }
      this.watchSubscriptions.delete(watchKey);
    }
    
    // Determine if we're using the handler or async iterable pattern
    const isHandlerPattern = typeof handlerOrOptions === 'function';
    const watchOptions = isHandlerPattern ? options : handlerOrOptions as SQLWatchOptions;
    const handler = isHandlerPattern ? handlerOrOptions as WatchHandler : undefined;
    
    // Create a subscription object
    const subscription: WatchSubscription = {
      unsubscribe: () => {
        // Clean up the subscription
        this.watchSubscriptions.delete(watchKey);
        console.log(`TauriSQLiteDatabase: Unsubscribed from watch ${watchKey}`);
      }
    };
    
    // Store the subscription
    this.watchSubscriptions.set(watchKey, subscription);
    
    if (isHandlerPattern && handler) {
      // Set up a polling mechanism to check for changes
      const pollInterval = (watchOptions?.throttleMs || 1000);
      let lastResult: any[] = [];
      
      const pollForChanges = async () => {
        try {
          // Query the database
          const result = await this.query(sql, parameters);
          
          // Check if the result has changed
          const resultStr = JSON.stringify(result.rows?._array || []);
          const lastResultStr = JSON.stringify(lastResult);
          
          if (resultStr !== lastResultStr) {
            // Call the handler with the new result
            handler.onResult(result);
            lastResult = [...(result.rows?._array || [])];
          }
        } catch (error) {
          console.error('TauriSQLiteDatabase: Error polling for changes:', error);
          if (handler.onError) {
            handler.onError(error as Error);
          }
        }
      };
      
      // Start polling
      const intervalId = setInterval(pollForChanges, pollInterval);
      
      // Initial query
      pollForChanges();
      
      // Update the unsubscribe method to clear the interval
      subscription.unsubscribe = () => {
        clearInterval(intervalId);
        this.watchSubscriptions.delete(watchKey);
        console.log(`TauriSQLiteDatabase: Unsubscribed from watch ${watchKey}`);
      };
      
      return;
    } else {
      // Implement the AsyncIterable pattern
      return {
        [Symbol.asyncIterator]: () => {
          let isDone = false;
          const pollInterval = (watchOptions?.throttleMs || 1000);
          let lastResult: any[] = [];
          
          return {
            next: async () => {
              if (isDone) {
                return { done: true, value: undefined };
              }
              
              try {
                // Wait for the poll interval
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                
                // Query the database
                const result = await this.query(sql, parameters);
                
                // Check if the result has changed
                const resultStr = JSON.stringify(result.rows?._array || []);
                const lastResultStr = JSON.stringify(lastResult);
                
                if (resultStr !== lastResultStr) {
                  lastResult = [...(result.rows?._array || [])];
                  return { done: false, value: result };
                }
                
                // No change, continue polling
                return { done: false, value: result };
              } catch (error) {
                console.error('TauriSQLiteDatabase: Error in AsyncIterable:', error);
                isDone = true;
                return { done: true, value: undefined };
              }
            },
            return: async () => {
              // Clean up when the iterator is closed
              isDone = true;
              subscription.unsubscribe();
              return { done: true, value: undefined };
            }
          };
        }
      } as AsyncIterable<QueryResult>;
    }
  }
  
  /**
   * Get the current connector
   */
  get connector(): any {
    return this._connector;
  }
  
  /**
   * Required method for PowerSync compatibility
   */
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      // Begin transaction
      await this.execute('BEGIN TRANSACTION;');
      
      try {
        // Execute the callback
        const result = await callback();
        
        // Commit the transaction
        await this.execute('COMMIT;');
        
        return result;
      } catch (error) {
        // Rollback the transaction on error
        await this.execute('ROLLBACK;');
        throw error;
      }
    } catch (error) {
      console.error('TauriSQLiteDatabase: Error in transaction:', error);
      throw error;
    }
  }
  
  /**
   * Simple implementations for basic database operations
   */
  async get(sql: string, parameters?: any[]): Promise<any> {
    const result = await this.query(sql, parameters);
    return result.rows?._array[0] || null;
  }
  
  async getAll(sql: string, parameters?: any[]): Promise<any[]> {
    const result = await this.query(sql, parameters);
    return result.rows?._array || [];
  }
}
