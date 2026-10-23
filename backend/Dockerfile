# ========== Stage 1: Build ==========
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom and download dependencies first (better layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ========== Stage 2: Runtime ==========
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render (and most platforms) inject the PORT environment variable
EXPOSE 8080

# Use the PORT env var if present, otherwise default to 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]