// PM2 Ecosystem Configuration
module.exports = {
  apps: [
    {
      name: 'api-service',
      script: 'main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'mastra-agent',
      script: 'agent-server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4111
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'openai-api-service',
      script: 'openai-api-server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4112
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'powersync-service',
      script: 'powersync-server.js',
      env: {
        NODE_ENV: 'production',
        POWERSYNC_PORT: 4113
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
