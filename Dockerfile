# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY apps/node-ai-service/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY apps/node-ai-service/main.js ./

# Expose the port the service will run on (assuming it's 3000 for this example)
EXPOSE 3000

# Define the command to run the service
CMD ["npm", "start"]