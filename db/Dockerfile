# Use the official MySQL image as the base image
FROM mysql:8.0

# Set environment variables for MySQL
ENV MYSQL_DATABASE=Expendi \
    MYSQL_USER=sa \
    MYSQL_PASSWORD=password \
    MYSQL_ROOT_PASSWORD=password

# Set healthcheck for the MySQL service
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD mysqladmin ping -h localhost
