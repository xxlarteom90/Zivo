# Delivery Management App

A production-style delivery management web application focused on drivers. It uses:

- Frontend: React, TypeScript, Vite, Material UI, Redux Toolkit
- Backend: ASP.NET Core 8 Web API
- ORM: Entity Framework Core code-first migrations
- Database: PostgreSQL
- Authentication: JWT Bearer Auth
- API docs: Swagger
- Local environment: Docker Compose for PostgreSQL

## Project structure

```text
.
├── backend
│   ├── DeliveryApp.sln
│   ├── src
│   │   ├── DeliveryApp.Domain
│   │   ├── DeliveryApp.Application
│   │   ├── DeliveryApp.Infrastructure
│   │   └── DeliveryApp.Api
│   └── tests
│       └── DeliveryApp.Tests
├── frontend
│   └── delivery-driver-web
├── docker-compose.yml
└── README.md
```

## Prerequisites

Install these locally:

- Docker Desktop or Docker Engine
- .NET 8 SDK
- Node.js 20 or later
- Visual Studio Code

Optional but recommended:

```bash
dotnet tool install --global dotnet-ef
```

## Quick start

From the repository root:

```bash
cp .env.example .env
docker compose up -d
```

Run the backend:

```bash
dotnet restore backend/DeliveryApp.sln
dotnet run --project backend/src/DeliveryApp.Api/DeliveryApp.Api.csproj
```

In Development, the API is configured to automatically:

- apply EF Core migrations
- seed demo data if the database is empty

Swagger:

```text
http://localhost:5080/swagger
https://localhost:7044/swagger
```

Run the frontend in another terminal:

```bash
cd frontend/delivery-driver-web
cp .env.example .env
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Demo credentials

All demo users use:

```text
Password123!
```

Accounts:

```text
admin@example.com
dispatcher@example.com
driver1@example.com
driver2@example.com
```

For the driver UI, start with:

```text
driver1@example.com / Password123!
```

## Manual migration commands

The project already includes an initial migration. To apply it manually:

```bash
dotnet ef database update \
  --project backend/src/DeliveryApp.Infrastructure/DeliveryApp.Infrastructure.csproj \
  --startup-project backend/src/DeliveryApp.Api/DeliveryApp.Api.csproj
```

To create a new migration after model changes:

```bash
dotnet ef migrations add YourMigrationName \
  --project backend/src/DeliveryApp.Infrastructure/DeliveryApp.Infrastructure.csproj \
  --startup-project backend/src/DeliveryApp.Api/DeliveryApp.Api.csproj \
  --output-dir Persistence/Migrations
```

## Backend API overview

Authentication:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/me
```

Driver order flow:

```text
GET  /api/driver/orders/available
GET  /api/driver/orders/active
GET  /api/driver/orders/delivered
GET  /api/driver/orders/{id}
POST /api/driver/orders/{id}/accept
POST /api/driver/orders/{id}/mark-picked-up
POST /api/driver/orders/{id}/mark-delivered
```

Dispatcher/admin orders:

```text
GET  /api/orders
GET  /api/orders/{id}
POST /api/orders
POST /api/orders/{id}/cancel
GET  /api/orders/{id}/history
```

Supporting endpoints:

```text
GET  /api/customers
POST /api/customers
GET  /api/partner-businesses
POST /api/partner-businesses
GET  /api/drivers
PUT  /api/drivers/{id}/availability
GET  /health
```

## Configuration

### Backend

Configuration is environment-based. You can set values through:

- `appsettings.Development.json`
- environment variables
- user secrets
- cloud app settings later

Important environment variable names:

```text
ConnectionStrings__DefaultConnection
Jwt__Issuer
Jwt__Audience
Jwt__SigningKey
Jwt__AccessTokenMinutes
Database__ApplyMigrationsOnStartup
Database__SeedDemoData
```

### Frontend

The frontend reads the API URL from:

```text
VITE_API_BASE_URL=http://localhost:5080/api
```

## Driver workflow

The core order lifecycle is:

```text
Available -> Accepted -> PickedUp -> Delivered
```

Cancellation is available to dispatcher/admin users for non-final orders.

Every status transition writes a row to `order_status_history`.

## Maps integration

The frontend builds direct navigation links for:

- Google Maps
- Waze

If latitude/longitude exist, the links use coordinates. Otherwise, they use the formatted address.

## Testing

Run backend tests:

```bash
dotnet test backend/DeliveryApp.sln
```

Build frontend:

```bash
cd frontend/delivery-driver-web
npm run build
```

## Production and Azure readiness notes

This repository is prepared for future cloud deployment:

- Secrets are not hardcoded for production.
- PostgreSQL connection string is environment-based.
- JWT settings are environment-based.
- EF Core migrations are separate from domain/application logic.
- API uses structured JSON errors with trace IDs.
- Dates are stored and exposed as UTC.
- Swagger is enabled only in Development by default.
- Database startup migration/seed is configuration-controlled.

Typical Azure path:

- Azure App Service or Azure Container Apps for the API
- Azure Static Web Apps or Azure App Service for the frontend
- Azure Database for PostgreSQL Flexible Server
- Azure Key Vault for secrets
- Application Insights for telemetry

Before production, change:

- JWT signing key
- CORS allowed origins
- database credentials
- HTTPS and reverse proxy configuration
- migration strategy, preferably CI/CD-based rather than automatic startup migration
