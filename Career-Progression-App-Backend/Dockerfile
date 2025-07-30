FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy the JAR file
COPY target/career_progression_app-0.0.1-SNAPSHOT.jar app.jar

# Copy .env file
COPY .env .env

ENTRYPOINT ["java", "-jar", "app.jar"]