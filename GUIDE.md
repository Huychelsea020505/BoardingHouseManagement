# Boarding House Management - Final Guide

## 1. Required tools

- JDK 17 and `JAVA_HOME` pointing to JDK 17
- Node.js 20+
- .NET SDK 9
- Docker Desktop is optional for the MySQL/docker-compose demo

## 2. Run Java services without Docker

The default `application.properties` files use H2 in-memory databases, so Docker is not required for local development.

```powershell
cd BoardingHouseManagement
.\mvnw.bat -pl room-service mn:run
```

Open another terminal:

```powershell
cd BoardingHouseManagement
.\mvnw.bat -pl billing-service mn:run
```

Expected ports:

- Room service: `http://localhost:8080`
- Room gRPC server: `localhost:9090`
- Billing service: `http://localhost:8082`

## 3. Run C# microservice

```powershell
cd BoardingHouseManagement\csharp-services\FinalMicroservices
dotnet run
```

Expected port:

- Final microservice: `http://localhost:5090`

Main APIs:

- `POST /api/sso/login`
- `GET /api/search/rooms?keyword=A&status=AVAILABLE`
- `GET /api/search/tenants?keyword=An`
- `GET /api/search/invoices?keyword=05/2026&status=UNPAID`
- `GET /api/reports/summary`

Demo accounts:

- `admin / 123456`
- `staff / 123456`

The C# service uses Java APIs when the Java services are running. If they are not running, it falls back to demo data so the microservice can still be tested.

## 3.1. Run backend services with Docker

Docker Compose starts the two Java services, their MySQL databases, and the C# final microservice.

```powershell
cd BoardingHouseManagement
docker compose up --build
```

Expected ports:

- Room service: `http://localhost:8080`
- Billing service: `http://localhost:8082`
- C# final microservice: `http://localhost:5090`

If login shows the wrong username/password message even with `admin / 123456`, check that `final-microservices` is running because the frontend login uses the C# SSO API.

## 4. Run frontend

```powershell
cd BoardingHouseManagement\frontend
npm install
npm run dev
```

Open:

- `http://localhost:5173`

Frontend proxy routes:

- `/api/room` -> room-service `8080`
- `/api/billing` -> billing-service `8082`
- `/api/micro` -> C# microservice `5090`

## 5. Final project feature checklist

- Login through C# SSO API
- Room CRUD through Java room-service
- Tenant CRUD through Java room-service
- Invoice/payment through Java billing-service
- Room/tenant/invoice search through C# Search API
- Statistical report page through C# Report API
- Design patterns in code:
  - Facade: `AuthFacade`, `SearchFacade`, `ReportFacade`
  - Builder: `InvoiceBuilder`
  - Factory Method: `InvoiceFactory`
  - State: `RoomState`, `AvailableRoomState`, `OccupiedRoomState`, `MaintenanceRoomState`
  - Iterator: `RoomCollection`, `RoomIterator`

## 6. Notes for final documentation

- The current implementation uses React + Java Micronaut + C# ASP.NET Core Web API.
- The original Google Doc mentions Spring Boot, Thymeleaf, and SQL Server. Update the written report to match the real implementation unless the instructor requires those exact technologies.
- If Docker is used, run `docker compose up --build` after installing Docker Desktop. Without Docker, use the H2 local setup above.
