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
COPY services/order-management-system ./services/order-management-system

# Build the application, creating the executable JAR
RUN ./gradlew :services:order-management-system:bootJar --no-daemon


# Stage 2: The Runtime Stage
# Use a minimal JRE image for a smaller, more secure final image
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the executable JAR from the builder stage
COPY --from=builder /app/services/order-management-system/build/libs/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8081

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-d1ohnradbo4c73b35r2g-a/trading_db_fkmw
ENV SPRING_KAFKA_BOOTSTRAP_SERVERS=vibe-trading-app-kafka-private:9092
ENV SPRING_DATASOURCE_USERNAME=admin
ENV SPRING_DATASOURCE_PASSWORD=YHkDrumeiHnAwBc3xiXfH2xOXPF8NoeN

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]