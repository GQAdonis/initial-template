# Running One-App on Replit

This guide will help you set up and run the One-App project on Replit without requiring Corepack.

## Setup Instructions

1. **Import the project to Replit**
   - Create a new Replit project and import this repository

2. **Configure the Replit environment**
   - Make sure to use Node.js 18+ as the runtime
   - In the Replit shell, run:
     ```
     npm install
     ```

3. **Environment Variables**
   - Create a `.env` file in the root directory with your OpenAI API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

4. **Running the application**
   - To run the frontend:
     ```
     npm run dev
     ```
   - To run the Node.js AI service:
     ```
     cd apps/node-ai-service
     npm install
     npm run start:api
     ```
   - In a separate shell, run the agent server:
     ```
     cd apps/node-ai-service
     npm run start:agent
     ```

## Development Notes

- The project has been configured to work without Corepack, making it compatible with Replit
- The `.npmrc` file contains settings to ensure compatibility
- Both npm and yarn should work for package management

## Troubleshooting

- If you encounter dependency issues, try running `npm install --legacy-peer-deps`
- For permission errors, make sure your Replit has the necessary permissions to access files
