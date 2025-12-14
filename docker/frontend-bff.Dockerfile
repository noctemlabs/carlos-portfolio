FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY frontend-bff/pom.xml ./pom.xml
RUN mvn -q -B -e dependency:go-offline

COPY frontend-bff/src ./src
RUN mvn -q -B -e -DskipTests package

# ---- runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the bootable jar only (exclude the plain jar)
COPY --from=build /app/target/*-SNAPSHOT.jar /app/app.jar
RUN test ! -f /app/target/*-plain.jar || true

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
