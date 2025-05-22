// agent-server.js - Mastra Agent Server
const express = require('express');
const cors = require('cors');
const { MastraClient } = require('@mastra/client-js');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app for the agent server
const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Define agent configuration
const agentConfig = {
  id: "copilot-agent",
  name: "Copilot Agent",
  description: "An AI agent that handles copilot requests using OpenAI",
  version: "1.0.0",
  provider: "openai",
  model: "gpt-4o",
  systemPrompt: "You are a helpful AI assistant that provides coding assistance and answers questions.",
  tools: []
};

// Log agent initialization
console.log(`Initializing agent: ${agentConfig.name} (${agentConfig.id})`);


// Agent handler function
async function handleAgentRequest(req, res) {
  try {
    const { messages, context = {}, stream = false } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request format. 'messages' array is required." });
    }
    
    // Process with OpenAI directly
    if (stream) {
      // Set up streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const stream = await openai.chat.completions.create({
        model: agentConfig.model,
        messages: [
          { role: "system", content: agentConfig.systemPrompt },
          ...messages
        ],
        stream: true,
      });
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
      
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      // Non-streaming response
      const completion = await openai.chat.completions.create({
        model: agentConfig.model,
        messages: [
          { role: "system", content: agentConfig.systemPrompt },
          ...messages
        ]
      });
      
      const response = completion.choices[0].message;
      res.json({ 
        content: response.content,
        role: response.role,
        context: context
      });
    }
  } catch (error) {
    console.error('Error handling agent request:', error);
    res.status(500).json({ 
      error: "An error occurred while processing your request.",
      details: error.message
    });
  }
}

// Define agent API routes
app.post('/api/agents/copilot/chat', handleAgentRequest);
app.post('/api/agents/copilot/stream', (req, res) => {
  req.body.stream = true;
  handleAgentRequest(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mastra-agent' });
});

// Start the agent server
const PORT = process.env.AGENT_PORT || 4111;
app.listen(PORT, () => {
  console.log(`Mastra Agent Server running on port ${PORT}`);
});

// Export for testing
module.exports = {
  app,
  handleAgentRequest
};
