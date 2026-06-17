# ─────────────────────────────────────────────
# Stage 1 — Build the Spring Boot JAR with Maven
# ─────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy only pom.xml first — Docker will cache the dependency layer
# and skip the slow download step on subsequent builds if pom.xml didn't change
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build the fat JAR (skip tests for faster image builds)
COPY src ./src
RUN mvn package -DskipTests -q

# ─────────────────────────────────────────────
# Stage 2 — Minimal runtime image (no Maven, no JDK)
# ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S labocore && adduser -S labocore -G labocore

# Copy the fat JAR from the build stage
COPY --from=builder /build/target/labocore-0.0.1-SNAPSHOT.jar app.jar

# Set ownership
RUN chown labocore:labocore app.jar
USER labocore

EXPOSE 8080

# Spring profiles: "docker" profile is activated so we can override DB host
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "app.jar"]
