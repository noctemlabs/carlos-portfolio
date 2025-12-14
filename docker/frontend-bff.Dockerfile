# syntax=docker/dockerfile:1.6

FROM --platform=$BUILDPLATFORM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy only pom.xml first (dependency layer)
COPY frontend-bff/pom.xml .
RUN mvn -B -q dependency:go-offline

# 2. Copy source AFTER deps are cached
COPY frontend-bff/src ./src

# 3. Build
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
