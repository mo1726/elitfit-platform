# ---- Build Stage ----
# Use an official Maven image to build the application
FROM maven:3.8-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to download dependencies first
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of your source code
COPY src ./src

# Build the application and create the JAR file. This runs your 'mvn clean package' command.
RUN mvn package -DskipTests


# ---- Run Stage ----
# Use a lightweight official OpenJDK image to run the application
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the 'build' stage
COPY --from=build /app/target/ellfil-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your application runs on (e.g., 8080)
EXPOSE 8080

# This is the command to start your app. This replaces the 'Start Command' in Render's UI.
ENTRYPOINT ["java", "-jar", "app.jar"]