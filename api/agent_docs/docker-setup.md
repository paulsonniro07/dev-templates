# Docker Setup — [PROJECT_NAME]
# Update when env vars or services change

## Environment Variables
File: .env (gitignored) — copy from .env.example

```
DB_HOST=localhost
DB_NAME=[ProjectName]
DB_USER=postgres
DB_PASSWORD=yourpassword

JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ISSUER=https://localhost:8080
JWT_AUDIENCE=https://localhost:3000
JWT_EXPIRY_MINUTES=60

BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PASSWORD=Admin@123456
BOOTSTRAP_ADMIN_FIRSTNAME=Admin
BOOTSTRAP_ADMIN_LASTNAME=User

APP_PORT=8080
ASPNETCORE_ENVIRONMENT=Development
```

## Dockerfile.api
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app
COPY *.sln .
COPY src/ src/
RUN dotnet restore
RUN dotnet publish src/[ProjectName].API/[ProjectName].API.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "[ProjectName].API.dll"]
```

## docker-compose.yml
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      retries: 10

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    environment:
      ASPNETCORE_ENVIRONMENT: ${ASPNETCORE_ENVIRONMENT}
      ASPNETCORE_URLS: http://+:8080
      ConnectionStrings__DefaultConnection: "Host=db;Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD}"
      JwtSettings__Secret: ${JWT_SECRET}
      JwtSettings__Issuer: ${JWT_ISSUER}
      JwtSettings__Audience: ${JWT_AUDIENCE}
      JwtSettings__ExpiryMinutes: ${JWT_EXPIRY_MINUTES}
      BootstrapAdmin__Email: ${BOOTSTRAP_ADMIN_EMAIL}
      BootstrapAdmin__Password: ${BOOTSTRAP_ADMIN_PASSWORD}
      BootstrapAdmin__FirstName: ${BOOTSTRAP_ADMIN_FIRSTNAME}
      BootstrapAdmin__LastName: ${BOOTSTRAP_ADMIN_LASTNAME}
    ports:
      - "${APP_PORT}:8080"
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```

## Commands
```bash
# Dev
docker-compose up --build        # start everything
docker-compose up -d --build     # background
docker-compose logs -f api       # view logs
docker-compose down              # stop

# Migration
./migrate.sh AddCustomerTable    # generate + apply migration

# Prod
docker-compose -f docker-compose.prod.yml up -d --build
```

## Adding New Env Var
1. Add to .env (your local value)
2. Add to .env.example (key only, empty value)
3. Add to docker-compose.yml under api.environment
4. Update this file
