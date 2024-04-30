# Use the official Selenium Standalone Chrome image as the base image
FROM selenium/standalone-chrome:latest

# Set environment variables for Selenium Standalone Chrome
ENV SE_NODE_OVERRIDE_MAX_SESSIONS=true \
    SE_NODE_MAX_SESSIONS=5

# Set healthcheck for the Selenium service
HEALTHCHECK --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:4444/wd/hub/status || exit 1

# No further instructions are needed since configuration is done via environment variables
