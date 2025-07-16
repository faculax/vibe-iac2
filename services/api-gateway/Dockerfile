# Stage 1: The Build Stage
# Use a Gradle image with JDK 21 to build the application
FROM gradle:8.8.0-jdk21-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Gradle wrapper and build files
COPY gradlew .
COPY gradle/ ./gradle/
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Copy the source code for this specific service
COPY services/api-gateway ./services/api-gateway

# Build the application, creating the executable JAR
RUN ./gradlew :services:api-gateway:bootJar --no-daemon


# Stage 2: The Runtime Stage
# Use a minimal JRE image for a smaller, more secure final image
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the executable JAR from the builder stage
COPY --from=builder /app/services/api-gateway/build/libs/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Order Management System Route
ENV SPRING_CLOUD_GATEWAY_ROUTES_0_ID=oms-route
ENV SPRING_CLOUD_GATEWAY_ROUTES_0_URI=https://vibe-trading-app-oms.onrender.com
ENV SPRING_CLOUD_GATEWAY_ROUTES_0_PREDICATES_0=Path=/api/orders/**
ENV SPRING_CLOUD_GATEWAY_ROUTES_0_FILTERS_0="RewritePath=/api/(?<segment>.*), /\${segment}"


# Route 1: Users
ENV SPRING_CLOUD_GATEWAY_ROUTES_1_ID=self-route-users
ENV SPRING_CLOUD_GATEWAY_ROUTES_1_URI=https://vibe-trading-app-api-gateway.onrender.com
ENV SPRING_CLOUD_GATEWAY_ROUTES_1_PREDICATES_0=Path=/api/users/**

# Route 2: Config
ENV SPRING_CLOUD_GATEWAY_ROUTES_2_ID=self-route-config
ENV SPRING_CLOUD_GATEWAY_ROUTES_2_URI=https://vibe-trading-app-api-gateway.onrender.com
ENV SPRING_CLOUD_GATEWAY_ROUTES_2_PREDICATES_0=Path=/api/config/**

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]