// openai-api-server.js - OpenAI API Compatible Server
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { MastraClient } = require('@mastra/client-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app for the OpenAI API compatible server
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Mastra client for agent interactions
const mastra = new MastraClient({
  apiKey: process.env.MASTRA_API_KEY || 'default-key',
  baseUrl: process.env.MASTRA_BASE_URL || 'http://localhost:4111'
});

// Define the agent API endpoint
const agentBaseUrl = process.env.MASTRA_BASE_URL || 'http://localhost:4111';
console.log(`Connecting to agent service at: ${agentBaseUrl}`);

// Track sessions for reporting events
const sessions = new Map();

/**
 * Handle OpenAI API completions requests
 * Maps OpenAI completions format to Mastra agent for routing and processing
 */
async function handleCompletionsRequest(req, res) {
  try {
    const {
      model = 'gpt-3.5-turbo',
      prompt,
      max_tokens,
      temperature = 0.7,
      top_p = 1,
      n = 1,
      stream = false,
      stop,
      presence_penalty,
      frequency_penalty,
      logit_bias,
      user,
      // Additional parameters for our implementation
      session_id,
      client_info
    } = req.body;

    // Validate required parameters
    if (!prompt) {
      return res.status(400).json({
        error: {
          message: "Missing required parameter: prompt",
          type: "invalid_request_error",
          param: "prompt",
          code: null
        }
      });
    }

    // Generate a session ID if not provided
    const sessionId = session_id || uuidv4();
    
    // Store session information for event reporting
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        id: sessionId,
        client: client_info || 'unknown',
        created_at: new Date().toISOString(),
        requests: 0
      });
    }
    
    // Update session request count
    const session = sessions.get(sessionId);
    session.requests += 1;
    session.last_request_at = new Date().toISOString();
    
    // Convert OpenAI API format to our agent format
    const messages = [
      { role: "user", content: prompt }
    ];
    
    const context = {
      session_id: sessionId,
      client_info: client_info || 'openai-api',
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      top_p: top_p,
      stop: stop,
      presence_penalty: presence_penalty,
      frequency_penalty: frequency_penalty,
      logit_bias: logit_bias,
      user: user
    };

    // Define agent options for Mastra
    const agentOptions = {
      agentId: 'copilot-agent', // Use the copilot agent as defined in agent-server.js
      messages: messages,
      context: context,
      stream: stream
    };

    if (stream) {
      // Set up streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Generate a unique ID for this completion
      const completionId = `cmpl-${uuidv4().replace(/-/g, '')}`;
      let responseIndex = 0;
      
      // Send the initial response
      const initialChunk = {
        id: completionId,
        object: "text_completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: []
      };
      
      res.write(`data: ${JSON.stringify(initialChunk)}\n\n`);
      
      try {
        // Use Mastra client to stream the agent response
        const stream = await mastra.agent.streamChat(agentOptions);
        
        // Process the stream
        for await (const chunk of stream) {
          if (chunk.content) {
            const responseChunk = {
              id: completionId,
              object: "text_completion",
              created: Math.floor(Date.now() / 1000),
              model: model,
              choices: [{
                text: chunk.content,
                index: responseIndex,
                logprobs: null,
                finish_reason: null
              }]
            };
            
            res.write(`data: ${JSON.stringify(responseChunk)}\n\n`);
            responseIndex++;
          }
        }
        
        // End of stream
        const finalChunk = {
          id: completionId,
          object: "text_completion",
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            text: "",
            index: responseIndex,
            logprobs: null,
            finish_reason: "stop"
          }]
        };
        
        res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
      } catch (error) {
        console.error('Error streaming from Mastra agent:', error);
        res.write(`data: ${JSON.stringify({
          error: {
            message: "An error occurred during streaming: " + error.message,
            type: "server_error",
            param: null,
            code: null
          }
        })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    } else {
      // Non-streaming response using Mastra agent
      try {
        // Use Mastra client to get the agent response
        const response = await mastra.agent.chat(agentOptions);
        
        // Format response according to OpenAI API specification
        const completionResponse = {
          id: `cmpl-${uuidv4().replace(/-/g, '')}`,
          object: "text_completion",
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            text: response.content,
            index: 0,
            logprobs: null,
            finish_reason: "stop"
          }],
          usage: {
            prompt_tokens: prompt.length / 4, // Rough estimate
            completion_tokens: response.content.length / 4, // Rough estimate
            total_tokens: (prompt.length + response.content.length) / 4 // Rough estimate
          }
        };
        
        res.json(completionResponse);
      } catch (error) {
        console.error('Error getting response from Mastra agent:', error);
        res.status(500).json({
          error: {
            message: "An error occurred while processing your request: " + error.message,
            type: "server_error",
            param: null,
            code: null
          }
        });
      }
    }
    
    // Report event for ag-ui (asynchronously)
    reportEvent(sessionId, {
      type: 'completion',
      model: model,
      client: client_info || 'openai-api',
      timestamp: new Date().toISOString()
    }).catch(err => {
      console.error('Error reporting event:', err);
    });
    
  } catch (error) {
    console.error('Error handling completions request:', error);
    res.status(500).json({
      error: {
        message: "An error occurred while processing your request: " + error.message,
        type: "server_error",
        param: null,
        code: null
      }
    });
  }
}

/**
 * Report events for analytics and tracking
 * This can be extended to support more detailed event reporting
 */
async function reportEvent(sessionId, eventData) {
  try {
    // Get session data
    const session = sessions.get(sessionId);
    if (!session) return;
    
    // Combine session data with event data
    const event = {
      ...eventData,
      session_id: sessionId,
      client_info: session.client
    };
    
    // Log the event for now
    console.log('Event reported:', event);
    
    // In the future, this could send events to an analytics service
    // or store them in a database
  } catch (error) {
    console.error('Error reporting event:', error);
  }
}

/**
 * Handle OpenAI API chat completions requests
 * Maps OpenAI chat completions format to Mastra agent for routing and processing
 */
async function handleChatCompletionsRequest(req, res) {
  try {
    const {
      model = 'gpt-3.5-turbo',
      messages,
      max_tokens,
      temperature = 0.7,
      top_p = 1,
      n = 1,
      stream = false,
      stop,
      presence_penalty,
      frequency_penalty,
      logit_bias,
      user,
      // Additional parameters for our implementation
      session_id,
      client_info
    } = req.body;

    // Validate required parameters
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: "Missing required parameter: messages",
          type: "invalid_request_error",
          param: "messages",
          code: null
        }
      });
    }

    // Generate a session ID if not provided
    const sessionId = session_id || uuidv4();
    
    // Store session information for event reporting
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        id: sessionId,
        client: client_info || 'unknown',
        created_at: new Date().toISOString(),
        requests: 0
      });
    }
    
    // Update session request count
    const session = sessions.get(sessionId);
    session.requests += 1;
    session.last_request_at = new Date().toISOString();
    
    const context = {
      session_id: sessionId,
      client_info: client_info || 'openai-api',
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      top_p: top_p,
      stop: stop,
      presence_penalty: presence_penalty,
      frequency_penalty: frequency_penalty,
      logit_bias: logit_bias,
      user: user
    };

    // Define agent options for Mastra
    const agentOptions = {
      agentId: 'copilot-agent', // Use the copilot agent as defined in agent-server.js
      messages: messages,
      context: context,
      stream: stream
    };

    if (stream) {
      // Set up streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Generate a unique ID for this completion
      const completionId = `chatcmpl-${uuidv4().replace(/-/g, '')}`;
      let responseIndex = 0;
      
      // Send the initial response
      const initialChunk = {
        id: completionId,
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: null
        }]
      };
      
      res.write(`data: ${JSON.stringify(initialChunk)}\n\n`);
      
      try {
        // Use Mastra client to stream the agent response
        const stream = await mastra.agent.streamChat(agentOptions);
        
        // Process the stream
        for await (const chunk of stream) {
          if (chunk.content) {
            const responseChunk = {
              id: completionId,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model: model,
              choices: [{
                index: 0,
                delta: {
                  content: chunk.content
                },
                finish_reason: null
              }]
            };
            
            res.write(`data: ${JSON.stringify(responseChunk)}\n\n`);
            responseIndex++;
          }
        }
        
        // End of stream
        const finalChunk = {
          id: completionId,
          object: "chat.completion.chunk",
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            index: 0,
            delta: {},
            finish_reason: "stop"
          }]
        };
        
        res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
      } catch (error) {
        console.error('Error streaming from Mastra agent:', error);
        res.write(`data: ${JSON.stringify({
          error: {
            message: "An error occurred during streaming: " + error.message,
            type: "server_error",
            param: null,
            code: null
          }
        })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    } else {
      // Non-streaming response using Mastra agent
      try {
        // Use Mastra client to get the agent response
        const response = await mastra.agent.chat(agentOptions);
        
        // Format response according to OpenAI API specification
        const completionResponse = {
          id: `chatcmpl-${uuidv4().replace(/-/g, '')}`,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [{
            index: 0,
            message: {
              role: "assistant",
              content: response.content
            },
            finish_reason: "stop"
          }],
          usage: {
            prompt_tokens: JSON.stringify(messages).length / 4, // Rough estimate
            completion_tokens: response.content.length / 4, // Rough estimate
            total_tokens: (JSON.stringify(messages).length + response.content.length) / 4 // Rough estimate
          }
        };
        
        res.json(completionResponse);
      } catch (error) {
        console.error('Error getting response from Mastra agent:', error);
        res.status(500).json({
          error: {
            message: "An error occurred while processing your request: " + error.message,
            type: "server_error",
            param: null,
            code: null
          }
        });
      }
    }
    
    // Report event for ag-ui (asynchronously)
    reportEvent(sessionId, {
      type: 'chat_completion',
      model: model,
      client: client_info || 'openai-api',
      timestamp: new Date().toISOString()
    }).catch(err => {
      console.error('Error reporting event:', err);
    });
    
  } catch (error) {
    console.error('Error handling chat completions request:', error);
    res.status(500).json({
      error: {
        message: "An error occurred while processing your request: " + error.message,
        type: "server_error",
        param: null,
        code: null
      }
    });
  }
}

// Define OpenAI API compatible routes
app.post('/v1/completions', handleCompletionsRequest);
app.post('/v1/chat/completions', handleChatCompletionsRequest);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'openai-api-compatible' });
});

// Start the OpenAI API compatible server
const PORT = process.env.OPENAI_API_PORT || 4112;
app.listen(PORT, () => {
  console.log(`OpenAI API Compatible Server running on port ${PORT}`);
});

// Export for testing
module.exports = {
  app,
  handleCompletionsRequest,
  reportEvent
};
