# Config & Infrastructure Rules

## Sensitive Data (Always in .env)
- NEVER hardcode: connection strings, API keys, JWT secrets, passwords, SMTP credentials
- ALL sensitive config goes in `.env` / environment variables
- `.env` is always in `.gitignore` — never commit it
- Always provide `.env.example` with all keys listed, values empty
- `docker-compose.yml` reads from `.env`
- `migrate.sh` reads from `.env`
- When adding a new env var: add it to `.env.example` immediately

## Docker (Every Project)
- Every project has: `Dockerfile` + `docker-compose.yml`
- `docker-compose.yml` services minimum: app + database
- Named volumes for database persistence (never anonymous volumes)
- Multi-stage Dockerfile: build stage → runtime stage (keeps image small)
- Dev: `docker-compose up --build`
- Prod: `docker-compose -f docker-compose.prod.yml up -d`
- `migrate.sh` handles EF Core migrations — reads credentials from `.env`
- Never embed secrets in Dockerfile — always pass via environment
