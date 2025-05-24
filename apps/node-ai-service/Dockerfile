# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Make ports available to the world outside this container
EXPOSE 3666 4111 4112 4113

# Define environment variable
ENV NODE_ENV production

# Run both services using PM2 when the container launches
CMD ["npm", "start"]