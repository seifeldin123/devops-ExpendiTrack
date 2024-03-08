# Build stage: Use Node.js image to install dependencies and build the project
FROM node:20.11-bullseye-slim AS build
WORKDIR /app
# Copy project definition files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
# Copy source code and build static files
COPY . .
RUN npm run build

# Production stage: Use Nginx to serve the static files
FROM nginx:alpine
# Copy static files from build stage to Nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
