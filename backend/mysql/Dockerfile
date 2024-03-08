# Use the official MySQL image as a base
FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=Expendi
# Expose port 3306 to access MySQL
EXPOSE 3306

# Define volume for data persistence
VOLUME /var/lib/mysql

# Start MySQL service when the container starts
CMD ["mysqld"]