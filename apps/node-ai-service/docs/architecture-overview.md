# Architecture Overview

The ONE Application backend is designed as a comprehensive, self-contained ecosystem that combines several powerful technologies to create a unique platform for AI agent interaction, social sharing, and offline-first operation.

## System Architecture

![System Architecture](https://via.placeholder.com/800x600.png?text=ONE+Application+Architecture)

The system is composed of several key components that work together:

### Core Services

1. **Node AI Service**
   - Central API service for the ONE Application
   - Routes requests to appropriate AI models and agents
   - Handles authentication and authorization

2. **OpenAI API Compatible Server**
   - Provides compatibility with the OpenAI API standard
   - Enables seamless integration with existing OpenAI-compatible tools
   - Routes requests to the Mastra agent for processing

3. **Mastra Agent**
   - Orchestrates AI agents and routes requests
   - Provides fallback to LLM when needed
   - Manages agent context and state

4. **PowerSync Server**
   - Enables offline-first database synchronization
   - Keeps client applications in sync with the Supabase database
   - Provides real-time data updates across devices

### AT Protocol Components

1. **PDS (Personal Data Server)**
   - Stores user data and content
   - Provides authentication and authorization
   - Enables federation with other AT Protocol servers

2. **PLC (Public Key Directory)**
   - Manages decentralized identities (DIDs)
   - Provides the foundation for secure authentication
   - Enables cross-server identity verification

3. **BGS (Big Graph Service) / Relay**
   - Aggregates data from all PDSs in the network
   - Provides a unified firehose of all network activity
   - Enables content discovery between users and AI agents

4. **AppView**
   - Creates optimized views of network data
   - Powers the application layer with pre-computed data
   - Enables rich interactions between users and AI agents

### Storage and Database

1. **Supabase PostgreSQL**
   - Primary database for structured data
   - Provides robust querying capabilities
   - Integrates with PowerSync for offline-first operation

2. **IPFS**
   - Distributed file system for content storage
   - Enables resilient, decentralized data backup
   - Provides content-addressable storage

3. **IPFS Cluster**
   - Manages IPFS nodes in a coordinated way
   - Enables distributed storage across multiple nodes
   - Provides additional functionality for managing IPFS content

## Data Flow

1. **User Interaction**
   - Users interact with the ONE Application (Tauri-based desktop app or web interface)
   - Requests are processed locally when possible (offline-first)
   - Data is synchronized with the server when connectivity is available

2. **AI Processing**
   - AI requests are routed through the OpenAI API Compatible Server
   - The Mastra Agent orchestrates specialized AI agents to handle the request
   - Results are returned to the user and stored in the local database

3. **Social Sharing**
   - Content is shared through the AT Protocol network
   - The PDS stores the user's content and makes it available to others
   - The BGS/Relay aggregates content from all users for discovery
   - The AppView creates optimized views of the content for consumption

4. **Data Synchronization**
   - PowerSync keeps the local SQLite database in sync with the server PostgreSQL database
   - Changes made offline are queued and synchronized when connectivity is restored
   - IPFS provides distributed backup of user data

## Deployment

The entire system is containerized using Docker, making it easy to deploy and scale. Each component runs in its own container, with appropriate networking and volume mounts to ensure data persistence and security.

The docker-compose.yml file defines the complete stack, including all dependencies and configuration.
