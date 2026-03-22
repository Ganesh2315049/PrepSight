# Multi-stage Dockerfile for PrepSight Backend
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies first for better caching
COPY backend/pom.xml .
COPY backend/src ./src

# Build the application with Maven
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/backend/target/*.jar app.jar

# Change ownership to non-root user
RUN chown appuser:appgroup /app/app.jar

# Switch to non-root user
USER appuser

# Expose port (Render uses $PORT env var)
EXPOSE $PORT

# Healthcheck using Spring Boot Actuator (enabled by default)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar"]
