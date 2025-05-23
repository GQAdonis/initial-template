# Node.js AI Service

This is a Node.js implementation of the AI service that's used as a sidecar in the Tauri application. It provides the same functionality as the Deno version but implemented in Node.js with Express.

## Features

- Mastra framework for AI agents
- OpenAI for completions
- Support for both regular and streaming requests
- Express HTTP server with CORS support
- Compatible API interface with the Deno version

## Installation

1. Install dependencies:

```bash
cd apps/node-ai-service
npm install
```

2. Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

3. Add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

### Starting the server

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

### API Endpoints

The service exposes the following endpoints:

- `POST /api/copilot`: For non-streaming requests
- `POST /api/copilot/stream`: For streaming requests
- `POST /api/openai/stream`: For direct OpenAI streaming

### Request Format

#### Non-streaming request:

```json
{
  "message": "Your message here",
  "context": {
    "key": "value"
  }
}
```

#### Streaming request:

```json
{
  "message": "Your message here",
  "context": {
    "key": "value"
  },
  "stream": true
}
```

### Response Format

#### Non-streaming response:

```json
{
  "message": "AI response here",
  "actions": []
}
```

#### Streaming response:

```json
[
  {
    "chunk": "Partial",
    "done": false
  },
  {
    "chunk": " response",
    "done": false
  },
  {
    "chunk": "",
    "done": true
  }
]
```

## Using as a Module

You can also use this service as a module in your Node.js application:

```javascript
const { handleCopilotRequest, handleCopilotStreamRequest, handleOpenAIStreamRequest } = require('./main');

// Example usage
const response = await handleCopilotRequest(JSON.stringify({
  message: "Hello, AI!",
  context: {}
}));
```

## Error Handling

All endpoints and functions include proper error handling and will return appropriate error messages if something goes wrong.
