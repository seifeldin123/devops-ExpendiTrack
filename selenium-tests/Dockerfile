# Use the official Node.js 16 image as the base image
FROM node:20.11-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your test suite into the container
COPY . .

# Command to run your tests
CMD ["npm", "run", "test:docker"]
