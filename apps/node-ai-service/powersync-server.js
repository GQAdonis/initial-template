// powersync-server.js - PowerSync Server for Supabase Integration
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

// Initialize Express app for the PowerSync server
const app = express();
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL connection pool for Supabase
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});

// Track active connections and their checkpoints
const activeConnections = new Map();

// PowerSync bucket operations
const bucketOps = {
  PUT: 'PUT',
  REMOVE: 'REMOVE',
};

/**
 * Initialize PowerSync schema in Postgres if it doesn't exist
 */
async function initializePowerSyncSchema() {
  const client = await pgPool.connect();
  try {
    // Create PowerSync schema if it doesn't exist
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS powersync;
    `);

    // Create operations table to track sync operations
    await client.query(`
      CREATE TABLE IF NOT EXISTS powersync.operations (
        op_id SERIAL PRIMARY KEY,
        op VARCHAR(10) NOT NULL,
        object_type VARCHAR(255) NOT NULL,
        object_id VARCHAR(255) NOT NULL,
        data JSONB,
        checksum INTEGER,
        subkey VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(object_type, object_id, subkey)
      );
    `);

    // Create checkpoints table to track client sync state
    await client.query(`
      CREATE TABLE IF NOT EXISTS powersync.checkpoints (
        client_id VARCHAR(255) PRIMARY KEY,
        last_op_id INTEGER REFERENCES powersync.operations(op_id),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create table for tracking client authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS powersync.clients (
        client_id VARCHAR(255) PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('PowerSync schema initialized successfully');
  } catch (error) {
    console.error('Error initializing PowerSync schema:', error);
  } finally {
    client.release();
  }
}

/**
 * Handle client authentication using Supabase JWT
 */
async function authenticateClient(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // In a production environment, you would verify the JWT using the Supabase JWT secret
    // For this implementation, we'll assume the token is valid if it exists
    // In a real implementation, use a JWT library to verify the token
    
    // Extract user ID from token (simplified for demo)
    // In a real implementation, decode and verify the JWT properly
    const userId = 'demo-user-id'; // This would come from the verified JWT
    
    // Generate or retrieve client ID
    let clientId = req.query.client_id;
    
    if (!clientId) {
      clientId = uuidv4();
    }
    
    // Store or update client information
    const client = await pgPool.query(
      `INSERT INTO powersync.clients (client_id, user_id, last_connected_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (client_id) 
       DO UPDATE SET last_connected_at = NOW()
       RETURNING client_id`,
      [clientId, userId]
    );
    
    req.clientId = client.rows[0].client_id;
    req.userId = userId;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
}

/**
 * Get the last checkpoint for a client
 */
async function getClientCheckpoint(clientId) {
  const result = await pgPool.query(
    'SELECT last_op_id FROM powersync.checkpoints WHERE client_id = $1',
    [clientId]
  );
  
  if (result.rows.length > 0) {
    return result.rows[0].last_op_id;
  }
  
  return 0; // No checkpoint found, start from the beginning
}

/**
 * Update client checkpoint
 */
async function updateClientCheckpoint(clientId, lastOpId) {
  await pgPool.query(
    `INSERT INTO powersync.checkpoints (client_id, last_op_id, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (client_id) 
     DO UPDATE SET last_op_id = $2, updated_at = NOW()`,
    [clientId, lastOpId]
  );
}

/**
 * Get operations since the last checkpoint
 */
async function getOperationsSinceCheckpoint(lastOpId) {
  const result = await pgPool.query(
    'SELECT * FROM powersync.operations WHERE op_id > $1 ORDER BY op_id ASC',
    [lastOpId]
  );
  
  return result.rows;
}

/**
 * Handle streaming sync connection
 */
async function handleStreamingSync(req, res) {
  const clientId = req.clientId;
  
  // Set headers for streaming response
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Get the last checkpoint for this client
  const lastOpId = await getClientCheckpoint(clientId);
  
  // Store the connection for later use
  activeConnections.set(clientId, { res, lastOpId });
  
  // Send initial checkpoint
  const checkpoint = {
    checkpoint: {
      last_op_id: lastOpId,
    }
  };
  
  res.write(JSON.stringify(checkpoint) + '\n');
  
  // Get operations since the last checkpoint
  const operations = await getOperationsSinceCheckpoint(lastOpId);
  
  // Send operations to the client
  for (const op of operations) {
    const syncOp = {
      op_id: op.op_id,
      op: op.op,
      object_type: op.object_type,
      object_id: op.object_id,
      data: op.data,
      checksum: op.checksum,
      subkey: op.subkey,
    };
    
    res.write(JSON.stringify(syncOp) + '\n');
  }
  
  // If there were operations, update the checkpoint
  if (operations.length > 0) {
    const newLastOpId = operations[operations.length - 1].op_id;
    await updateClientCheckpoint(clientId, newLastOpId);
    
    // Send checkpoint complete message
    const checkpointComplete = {
      checkpoint_complete: {
        last_op_id: newLastOpId,
      }
    };
    
    res.write(JSON.stringify(checkpointComplete) + '\n');
    
    // Update the stored last op ID
    activeConnections.get(clientId).lastOpId = newLastOpId;
  }
  
  // Keep the connection open for future updates
  req.on('close', () => {
    activeConnections.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
}

/**
 * Process a bucket operation (PUT or REMOVE)
 */
async function processBucketOperation(operation) {
  const { op, object_type, object_id, data, checksum, subkey } = operation;
  
  try {
    if (op === bucketOps.PUT) {
      await pgPool.query(
        `INSERT INTO powersync.operations (op, object_type, object_id, data, checksum, subkey)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (object_type, object_id, subkey) 
         DO UPDATE SET op = $1, data = $4, checksum = $5, created_at = NOW()
         RETURNING op_id`,
        [op, object_type, object_id, data, checksum, subkey || '']
      );
    } else if (op === bucketOps.REMOVE) {
      await pgPool.query(
        `INSERT INTO powersync.operations (op, object_type, object_id, subkey)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (object_type, object_id, subkey) 
         DO UPDATE SET op = $1, data = NULL, checksum = NULL, created_at = NOW()
         RETURNING op_id`,
        [op, object_type, object_id, subkey || '']
      );
    } else {
      throw new Error(`Unknown operation type: ${op}`);
    }
    
    // Notify connected clients about the new operation
    notifyClients(object_type);
    
    return true;
  } catch (error) {
    console.error('Error processing bucket operation:', error);
    return false;
  }
}

/**
 * Notify connected clients about new operations
 */
async function notifyClients(objectType) {
  // Get the latest operation ID
  const result = await pgPool.query(
    'SELECT MAX(op_id) as last_op_id FROM powersync.operations'
  );
  
  const lastOpId = result.rows[0].last_op_id;
  
  // Notify all connected clients
  for (const [clientId, connection] of activeConnections.entries()) {
    const { res, lastOpId: clientLastOpId } = connection;
    
    if (lastOpId > clientLastOpId) {
      // Get operations since the client's last checkpoint
      const operations = await getOperationsSinceCheckpoint(clientLastOpId);
      
      // Send new checkpoint
      const checkpoint = {
        checkpoint: {
          last_op_id: lastOpId,
        }
      };
      
      res.write(JSON.stringify(checkpoint) + '\n');
      
      // Send operations to the client
      for (const op of operations) {
        const syncOp = {
          op_id: op.op_id,
          op: op.op,
          object_type: op.object_type,
          object_id: op.object_id,
          data: op.data,
          checksum: op.checksum,
          subkey: op.subkey,
        };
        
        res.write(JSON.stringify(syncOp) + '\n');
      }
      
      // Send checkpoint complete message
      const checkpointComplete = {
        checkpoint_complete: {
          last_op_id: lastOpId,
        }
      };
      
      res.write(JSON.stringify(checkpointComplete) + '\n');
      
      // Update the stored last op ID
      activeConnections.get(clientId).lastOpId = lastOpId;
      
      // Update the client's checkpoint in the database
      await updateClientCheckpoint(clientId, lastOpId);
    }
  }
}

// Define PowerSync API routes
app.post('/powersync/bucket', authenticateClient, async (req, res) => {
  const operations = req.body;
  
  if (!Array.isArray(operations)) {
    return res.status(400).json({ error: 'Expected an array of operations' });
  }
  
  const results = [];
  
  for (const operation of operations) {
    const success = await processBucketOperation(operation);
    results.push({ success });
  }
  
  res.json({ results });
});

app.get('/powersync/sync', authenticateClient, async (req, res) => {
  await handleStreamingSync(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'powersync-server' });
});

// Initialize PowerSync schema and start the server
async function startServer() {
  try {
    await initializePowerSyncSchema();
    
    const PORT = process.env.POWERSYNC_PORT || 4113;
    app.listen(PORT, () => {
      console.log(`PowerSync Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start PowerSync server:', error);
    process.exit(1);
  }
}

startServer();

// Export for testing
module.exports = {
  app,
  initializePowerSyncSchema,
  processBucketOperation,
  notifyClients
};
