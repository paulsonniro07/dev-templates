# [PROJECT_NAME] — Monorepo
# ASP.NET Core 10 API + React/TypeScript Frontend
# ⚠️  Replace [PROJECT_NAME] everywhere before first use
# Tip: VS Code Ctrl+Shift+H → find [PROJECT_NAME] → replace all

## Project Overview
[2-3 lines: what this project does, who uses it]

## Stack
- Backend:  .NET 10, ASP.NET Core API, PostgreSQL, EF Core, JWT
- Frontend: React 18 + TypeScript + Tailwind CSS + Vite
- Deploy:   Railway (API) + Vercel (client)
- Docker:   dev + prod

## Detailed Rules
All coding standards are split into focused files in `.claude/rules/`:
- `rules/data-rules.md`      — Soft delete, pagination
- `rules/config-rules.md`    — Secrets, Docker
- `rules/stack-rules.md`     — .NET version, architecture guide, proven patterns
- `rules/ui-rules.md`        — Searchable dropdowns, UX standards, color tokens
- `rules/coding-patterns.md` — Git workflow, anti-patterns, response style

API-specific rules: `api/.claude/CLAUDE.md` + `api/.claude/rules/`
Frontend-specific rules: `client/.claude/CLAUDE.md` + `client/.claude/rules/`

## Development Commands
```bash
# Run everything
docker-compose up --build

# Backend only
cd api && dotnet run --project src/[PROJECT_NAME].API

# Frontend only
cd client && npm run dev

# New migration
cd api && ./migrate.sh [MigrationName]
```

## Git Workflow
- Branch: git checkout -b feat/description
- Prefixes: feat:, fix:, refactor:, chore:, docs:
- Never commit to main directly
- Never commit .env
