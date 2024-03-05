
# Use the official OpenJDK 17 Alpine image as the base image
FROM openjdk:17-jdk-alpine

# Argument for the JAR file (passed during build)
ARG JAR_FILE=target/*.jar

# Copy the JAR file into the container as 'app.jar'
COPY ${JAR_FILE} docker-tracker.jar

# Define the entry point for running the application
ENTRYPOINT ["java", "-jar", "/docker-tracker.jar"]

# Labels providing metadata for the image
LABEL maintainer="Seifeldin <seifeldin@example.com>, harmeet <harmeet@example.com>, sasha <sasha@example.com>"
LABEL version="1.0"
LABEL description="Docker image for the budget Tracker Spring Boot application"