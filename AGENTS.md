# [PROJECT_NAME] — Agent Rules

Monorepo: ASP.NET Core API + React/TypeScript frontend.
Replace `[PROJECT_NAME]` (slugs, DB names) and `[ProjectName]` (PascalCase, .NET filenames) everywhere.

## Precedence

1. This file (`AGENTS.md`)
2. `api/AGENTS.md` / `client/AGENTS.md` when working in that folder
3. Files in `api/agent_docs/` and `client/agent_docs/`
4. Global/user agent rules

Project rules always win over global user rules. If a tool-specific file (`.clinerules`, `CLAUDE.md`) conflicts with this file, this file wins.

## Stack (defaults)

- API: .NET 10, ASP.NET Core, PostgreSQL, EF Core, JWT, Swagger
- Client: React 18, TypeScript, Tailwind CSS, Vite
- Deploy: Railway (api) + Vercel (client) | Dev: Docker

If the project intentionally diverges, record it in `api/agent_docs/architecture.md` and follow that instead.

## Commands

```bash
docker-compose up --build                         # run everything
cd api && dotnet run --project src/[PROJECT_NAME].API
cd client && npm run dev
cd api && ./migrate.sh [MigrationName]            # ask before running
```

Swagger (dev only): http://localhost:8080/swagger

## Workflow — always in this order

1. **Plan** — describe files to create/change, assumptions, and risks. Do not write code yet.
2. **Wait** — stop and wait for explicit approval.
3. **Build** only what was approved. No scope creep, no unrequested refactors.
4. **Verify** — run the checks below and fix all errors before reporting done.
5. **Report** — list changed files, verification results, and anything left undone.

If a requirement is unclear, stop and ask. Never guess business rules.

## Hard rules — never break

### Data
- Soft delete only: `IsDeleted = true` + `UpdatedAt = DateTime.UtcNow`. Never `Remove()`, never SQL `DELETE`.
- Every entity extends `BaseEntity` (`Id`, `IsDeleted`, `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`).
- Every list query filters `.Where(x => !x.IsDeleted)`; every single-item query adds `&& !x.IsDeleted`.
- Restore looks up the record **without** the `IsDeleted` filter.
- Every list endpoint uses `PaginationFilter`; `PageSize` capped at 100 server-side.
- Paginated response shape: `{ data, totalCount, pageNumber, pageSize, totalPages }`.

### Security
- No hardcoded secrets, connection strings, API keys, JWT secrets, passwords, or SMTP config.
- Secrets live in `.env` (gitignored). New var = add to `.env`, `.env.example` (key only, empty value), and `docker-compose.yml`.
- DTOs at every API boundary. Never expose domain entities.
- Passwords hashed; JWT validated; never log tokens or password values.

### API
- Controllers are thin dispatchers — no business logic.
- Application never references Infrastructure; API never references Infrastructure directly.
- Explicit DTO mapping — no AutoMapper.
- One endpoint set per resource: list, get, dropdown, create, update, soft delete, restore.
- Embed related names in list DTOs server-side (cross-permission DTO pattern).

### Frontend
- Searchable dropdowns for every master table: async, debounced 300 ms, `{ id, label }`, backend filters `IsDeleted`.
- Never preload an entire master table.
- Every list: loading, empty, and error states.
- Every form: inline validation, disabled submit while saving, success/error toast.
- Own UI components only — no external UI library. Tailwind tokens only, no magic hex.
- TypeScript strict: no `any`, no `@ts-ignore`.

### Docker
- Every environment runs through Docker; `.env` drives compose; DB data uses a named volume.
- Multi-stage Dockerfiles. `migrate.sh` reads from `.env`.

## Testing policy

- Mandatory verification after every change (never skip):
  - API: `dotnet build`
  - Client: `npm run build` and `npx tsc --noEmit`
- Run existing tests if present; never leave them failing.
- Write **new** tests only when the user asks. Standards when asked:
  - API: xUnit in `api/tests/[PROJECT_NAME].Tests`
  - Client: Vitest + React Testing Library in `client/src`
- Details: `api/agent_docs/testing.md`, `client/agent_docs/testing.md`.

## Documentation upkeep (mandatory)

Update the matching doc in the **same change** when you touch:

| Change | Update |
|---|---|
| Entity / column / index | `api/agent_docs/database-schema.md` |
| Endpoint / response shape | `api/agent_docs/api-contracts.md` and `client/agent_docs/api-contracts.md` |
| Architecture decision | `api/agent_docs/architecture.md` |
| Env var / Docker service | `api/agent_docs/docker-setup.md` |
| UI component / pattern | `client/agent_docs/component-patterns.md` |
| Auth or state flow | `client/agent_docs/state-management.md` |

Docs must reflect the code after your change, not before it.

## Git

- Branch before working: `git checkout -b feat/description`
- Prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Never commit `.env` or commit directly to `main`.
- Never commit `node_modules/`, `bin/`, `obj/`, `.claude/worktrees/`.
- Never commit unless explicitly asked.

## Anti-patterns — never do these

- Hard delete / raw SQL `DELETE`
- List endpoint without pagination
- Hardcoded secrets or credentials
- Business logic in controllers or UI components
- Domain entities at the API boundary
- Non-searchable dropdown for master data / preloading whole master tables
- Skipping error handling or loading/empty states
- `.Result`, `.Wait()`, or sync-over-async
- `any`, `@ts-ignore`, inline styles, magic hex colors
- AutoMapper or external UI libraries
- Unrequested refactors, renames, or dependency additions

## Layout

```
AGENTS.md                    ← this file (all agents)
api/AGENTS.md                ← backend rules
client/AGENTS.md             ← frontend rules
api/agent_docs/              ← architecture, schema, contracts, style, docker, testing, checklists
client/agent_docs/           ← components, UX, state, contracts, testing, checklists
CLAUDE.md / .clinerules      ← optional shims for other agents (no rules of their own)
```
