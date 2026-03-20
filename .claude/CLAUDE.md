# [PROJECT_NAME] — Monorepo
# ASP.NET Core API + React/TypeScript Frontend
# ⚠️  Replace [PROJECT_NAME] everywhere before first use
# Tip: VS Code Ctrl+Shift+H → find [PROJECT_NAME] → replace all

## Project Overview
[2-3 lines: what this project does, who uses it]

## Monorepo Structure
```
[PROJECT_NAME]/
├── api/          ← ASP.NET Core 10 API (deploy to Railway)
├── client/       ← React + TypeScript frontend (deploy to Vercel)
├── .claude/      ← Root-level Claude context (this file)
├── .env.example  ← All env vars documented
├── .env          ← Your local secrets (gitignored)
└── docker-compose.yml
```

## Stack
- Backend:  .NET 10, ASP.NET Core API, PostgreSQL, EF Core, JWT
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Deploy:   Railway (API) + Vercel (client)
- Docker:   dev + prod

## Global Rules (always apply)
See ~/.claude/CLAUDE.md for universal standards.
Project-specific rules are in api/.claude/CLAUDE.md and client/.claude/CLAUDE.md.

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
- Never commit to main directly
- Never commit .env
