# [PROJECT_NAME] — ASP.NET Core API
# .NET 10 | PostgreSQL | EF Core | JWT | Docker
# Location: api/.claude/CLAUDE.md

## Project Overview
[2-3 lines: what this API does, who consumes it]

## Tech Stack
- Runtime: .NET 10 / ASP.NET Core Web API
- Database: PostgreSQL
- ORM: Entity Framework Core (Npgsql)
- Auth: JWT Bearer + ASP.NET Identity
- Architecture: [LAYERED / CLEAN ARCH / VERTICAL SLICE] ← pick one, delete others
- Containerization: Docker + docker-compose

## Detailed Rules
All API-specific standards are in `api/.claude/rules/`:
- `rules/architecture.md`    — Layer rules, dependency rules, folder structure, BaseEntity
- `rules/api-conventions.md` — REST patterns, HTTP codes, response shapes, RBAC naming

Global standards (soft delete, pagination, Docker, secrets, patterns):
→ see `~/.claude/CLAUDE.md` or root `.claude/rules/`

## Commands
```bash
dotnet build
dotnet run --project src/[PROJECT_NAME].API
dotnet test
./migrate.sh [MigrationName]
docker-compose up --build   # from root
```

## Reference Docs (agent_docs/)
@agent_docs/architecture.md     — Structural and design decisions
@agent_docs/coding-style.md     — Handlers, services, repositories
@agent_docs/database-schema.md  — Entities and migrations
@agent_docs/api-contracts.md    — Endpoints and payloads
@agent_docs/docker-setup.md     — Docker and env config

## Key Reminders
- Run `dotnet build` after every change — fix before continuing
- Use `./migrate.sh [Name]` for migrations — never run `ef` commands manually
- Never commit `.env` — only `.env.example`
