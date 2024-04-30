# Build stage: Use Node.js image to install dependencies and build the project
FROM node:20.11-bullseye-slim AS build
WORKDIR /app
# Copy project definition files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
# Copy source code and build static files
COPY . .
RUN npm run build:docker

# Run the app
CMD ["npm", "start"]