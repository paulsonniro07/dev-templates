# [PROJECT_NAME]
# Monorepo: ASP.NET Core 10 API + React/TypeScript Frontend
# Replace [PROJECT_NAME] everywhere → VS Code Ctrl+Shift+H

## Stack
- API: .NET 10, ASP.NET Core, PostgreSQL, EF Core, JWT, Swagger
- Client: React 18, TypeScript, Tailwind CSS, Vite
- Deploy: Railway (api) + Vercel (client) | Dev: Docker

## Commands
- Run all:      docker-compose up --build
- API only:     cd api && dotnet run --project src/[PROJECT_NAME].API
- Client only:  cd client && npm run dev
- Migration:    cd api && ./migrate.sh [MigrationName]
- Swagger:      http://localhost:8080/swagger (dev only)

## Rules (apply to everything)
- Soft delete only — IsDeleted=true, never SQL DELETE
- All lists use PaginationFilter — no raw lists ever
- All secrets in .env — never hardcoded
- Docker for every environment
- Searchable dropdowns — async, { id, label }, IsDeleted filtered
- Plan before coding — describe, wait for approval, then build

## Git
- Always branch: git checkout -b feat/description
- Never commit .env or directly to main
