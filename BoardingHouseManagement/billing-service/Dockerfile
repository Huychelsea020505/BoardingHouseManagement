FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml .
COPY .mvn .mvn
COPY room-service/pom.xml room-service/pom.xml
COPY billing-service/pom.xml billing-service/pom.xml
COPY billing-service/src billing-service/src

RUN mvn -pl billing-service -am package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /workspace/billing-service/target/billing-service-0.1.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
