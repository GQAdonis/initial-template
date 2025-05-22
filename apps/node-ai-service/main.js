// apps/node-ai-service/main.js
const express = require('express');
const cors = require('cors');
const { MastraClient } = require('@mastra/client-js');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Define types for our streaming chunks (for documentation)
/**
 * @typedef {Object} StreamChunk
 * @property {string} chunk - The content chunk
 * @property {boolean} [done] - Whether this is the final chunk
 * @property {string} [error] - Error message if an error occurred
 */

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Define the agent API endpoint
const agentBaseUrl = process.env.MASTRA_BASE_URL || "http://localhost:4111";
console.log(`Connecting to agent service at: ${agentBaseUrl}`);


/**
 * Handle CopilotKit requests (non-streaming)
 * @param {string} requestJson - JSON string containing the request
 * @returns {Promise<string>} - JSON string containing the response
 */
async function handleCopilotRequest(requestJson) {
  try {
    const request = JSON.parse(requestJson);
    
    // If streaming is requested but we're in the non-streaming handler,
    // redirect to the streaming handler
    if (request.stream) {
      return await handleCopilotStreamRequest(requestJson);
    }
    
    // Make a direct HTTP request to our agent service
    const response = await fetch(`${agentBaseUrl}/api/agents/copilot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: request.message }
        ],
        context: request.context || {}
      })
    });
    
    if (!response.ok) {
      throw new Error(`Agent service responded with status: ${response.status}`);
    }
    
    const agentResponse = await response.json();
    
    return JSON.stringify({
      message: agentResponse.content,
      actions: agentResponse.actions || [],
    });
  } catch (error) {
    console.error("Error handling copilot request:", error);
    return JSON.stringify({
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
}

/**
 * Handle streaming CopilotKit requests
 * @param {string} requestJson - JSON string containing the request
 * @returns {Promise<string>} - JSON string containing the response chunks
 */
async function handleCopilotStreamRequest(requestJson) {
  try {
    const request = JSON.parse(requestJson);
    const chunks = [];
    
    // Make a direct HTTP request to our agent service for streaming
    const response = await fetch(`${agentBaseUrl}/api/agents/copilot/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: request.message }
        ],
        context: request.context || {}
      })
    });
    
    if (!response.ok) {
      throw new Error(`Agent service responded with status: ${response.status}`);
    }
    
    // Read the response as a stream of events
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.content) {
              chunks.push({
                chunk: data.content,
                done: false,
              });
            } else if (data.done) {
              // End of stream
              chunks.push({
                chunk: "",
                done: true,
              });
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
    
    // If we didn't get a done event, add one
    if (!chunks.some(chunk => chunk.done)) {
      chunks.push({
        chunk: "",
        done: true,
      });
    }
    
    return JSON.stringify(chunks);
  } catch (error) {
    console.error("Error handling streaming copilot request:", error);
    return JSON.stringify([
      {
        chunk: "An error occurred while processing your request.",
        error: error.message,
        done: true,
      }
    ]);
  }
}

/**
 * Handle direct OpenAI streaming for more control
 * @param {string} requestJson - JSON string containing the request
 * @returns {Promise<string>} - JSON string containing the response chunks
 */
async function handleOpenAIStreamRequest(requestJson) {
  try {
    const request = JSON.parse(requestJson);
    const chunks = [];
    
    // Create a streaming completion
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: request.message }
      ],
      stream: true,
    });
    
    // Process the stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        chunks.push({
          chunk: content,
          done: false,
        });
      }
    }
    
    // Add final chunk to indicate completion
    chunks.push({
      chunk: "",
      done: true,
    });
    
    return JSON.stringify(chunks);
  } catch (error) {
    console.error("Error handling OpenAI streaming request:", error);
    return JSON.stringify([
      {
        chunk: "An error occurred while processing your request.",
        error: error.message,
        done: true,
      }
    ]);
  }
}

// Define API routes
app.post('/api/copilot', async (req, res) => {
  try {
    const response = await handleCopilotRequest(JSON.stringify(req.body));
    res.json(JSON.parse(response));
  } catch (error) {
    console.error('Error in /api/copilot route:', error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
});

app.post('/api/copilot/stream', async (req, res) => {
  try {
    const response = await handleCopilotStreamRequest(JSON.stringify(req.body));
    res.json(JSON.parse(response));
  } catch (error) {
    console.error('Error in /api/copilot/stream route:', error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
});

app.post('/api/openai/stream', async (req, res) => {
  try {
    const response = await handleOpenAIStreamRequest(JSON.stringify(req.body));
    res.json(JSON.parse(response));
  } catch (error) {
    console.error('Error in /api/openai/stream route:', error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
});

// Start the server
const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Service initialized successfully with streaming support on port ${PORT}`);
});

// Export functions for direct use in Node.js environments (e.g., when used as a module)
module.exports = {
  handleCopilotRequest,
  handleCopilotStreamRequest,
  handleOpenAIStreamRequest
};