# [PROJECT_NAME]

[2-3 lines: what this project does]

## Stack

- **API:** .NET 10, ASP.NET Core, PostgreSQL, EF Core, JWT, Swagger
- **Client:** React 18, TypeScript, Tailwind CSS, Vite
- **Deploy:** Railway (API) + Vercel (Client)
- **Dev:** Docker Compose

---

## Quick start

### 1. Replace placeholders

In VS Code: `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac).

- Find `[PROJECT_NAME]` → your project name (e.g. `CRMSystem`)
- Find `[ProjectName]` → PascalCase name used in .NET files (e.g. `Crmsystem`)

### 2. Set up environment

```bash
cp .env.example .env
```

Fill in every value in `.env`.

### 3. Scaffold the .NET solution

```bash
cd api
dotnet new sln -n [PROJECT_NAME]
dotnet new classlib -n [PROJECT_NAME].Domain -f net10.0 -o src/[PROJECT_NAME].Domain
dotnet new classlib -n [PROJECT_NAME].Application -f net10.0 -o src/[PROJECT_NAME].Application
dotnet new classlib -n [PROJECT_NAME].Infrastructure -f net10.0 -o src/[PROJECT_NAME].Infrastructure
dotnet new webapi -n [PROJECT_NAME].API -f net10.0 -o src/[PROJECT_NAME].API
dotnet sln add src/[PROJECT_NAME].Domain/[PROJECT_NAME].Domain.csproj
dotnet sln add src/[PROJECT_NAME].Application/[PROJECT_NAME].Application.csproj
dotnet sln add src/[PROJECT_NAME].Infrastructure/[PROJECT_NAME].Infrastructure.csproj
dotnet sln add src/[PROJECT_NAME].API/[PROJECT_NAME].API.csproj
dotnet build
```

### 4. Scaffold the React app

```bash
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite axios react-router-dom
npm install -D @types/node
```

### 5. Open your agent

No global install and no per-agent setup is required. Open the project folder in your editor; the agent picks up the rules automatically.

| Agent | Reads | Setup |
|---|---|---|
| opencode | `AGENTS.md` (root + nested) | none |
| Claude Code | `CLAUDE.md` / `.claude/CLAUDE.md` shims | none |
| Cline | `.clinerules` shims | none |
| Codex, Cursor, Gemini CLI, Jules, Copilot | `AGENTS.md` | none |
| Anything else | point it at `AGENTS.md` | one line |

### 6. Ask your agent to build the foundation

Always plan first. In opencode, switch to plan mode (`Tab`) and send:

```
Plan the Clean Architecture foundation: BaseEntity, PaginationFilter,
IGenericRepository, GlobalExceptionMiddleware, AuditEntityInterceptor,
JWT auth, PostgreSQL EF Core, and Program.cs wiring. Don't code yet.
```

Then in `client/`:

```
Plan the frontend foundation: AuthContext, Axios interceptor,
usePermissions, PermissionRoute, Layout, own UI components
(Button, Input, Badge, Spinner, EmptyState, Pagination, SearchInput, Modal),
and React Router setup. Don't code yet.
```

Review the plan, then approve. The agent must not write code before approval.

### 7. Run everything

```bash
docker-compose up --build
```

---

## How the rules work

`AGENTS.md` is the single source of truth. `.clinerules` and `CLAUDE.md` are one-line shims that import it — they contain no rules of their own, so nothing drifts.

```
AGENTS.md                 ← all hard rules and workflow
api/AGENTS.md             ← backend rules
client/AGENTS.md          ← frontend rules
api/agent_docs/           ← deep backend docs (patterns, schema, contracts)
client/agent_docs/        ← deep frontend docs (components, UX, state)
```

Deeper docs are read on demand when the related work happens:

| Topic | File |
|---|---|
| Architecture decisions | `api/agent_docs/architecture.md` |
| DB schema and query patterns | `api/agent_docs/database-schema.md` |
| Endpoints and response shapes | `api/agent_docs/api-contracts.md`, `client/agent_docs/api-contracts.md` |
| C# patterns | `api/agent_docs/coding-style.md` |
| New backend module | `api/agent_docs/module-checklist.md` |
| New frontend module | `client/agent_docs/module-checklist.md` |
| Components | `client/agent_docs/component-patterns.md` |
| UX / colors / spacing | `client/agent_docs/ux-ui-guide.md` |
| Auth and state | `client/agent_docs/state-management.md` |
| Docker and env vars | `api/agent_docs/docker-setup.md` |
| Testing | `api/agent_docs/testing.md`, `client/agent_docs/testing.md` |

## Workflow with any agent

1. **Plan** — describe the feature; agent proposes files and risks.
2. **Approve** — say "go". Nothing is written before this.
3. **Build** — only the approved scope.
4. **Verify** — `dotnet build`, `npm run build`, `npx tsc --noEmit`.
5. **Report** — changed files and results.

No slash commands are required — plain prompts work with every model:

| Task | Prompt |
|---|---|
| Plan | "Plan [feature]. Don't code yet." |
| New module | "Scaffold the [Module] module following `api/agent_docs/module-checklist.md`." |
| Review | "Review this against AGENTS.md and the module checklists." |
| Bug fix | "Find the root cause first, then fix: [bug]." |

## Daily commands

```bash
# Everything
docker-compose up --build

# API only
cd api && dotnet run --project src/[PROJECT_NAME].API

# Client only
cd client && npm run dev

# New migration (ask your agent first)
cd api && ./migrate.sh AddCustomerTable
```

## Verification before finishing

- API: `dotnet build`
- Client: `npm run build` and `npx tsc --noEmit`
- Existing tests must still pass (`dotnet test`, `npm run test` if present)
- New tests only when explicitly requested — standards in the testing docs

## Structure

```
[PROJECT_NAME]/
├── AGENTS.md                 ← rules for every agent
├── CLAUDE.md                 ← shim → AGENTS.md
├── .clinerules               ← shim → AGENTS.md
├── api/
│   ├── AGENTS.md             ← backend rules
│   ├── CLAUDE.md             ← shim
│   ├── .clinerules           ← shim
│   ├── agent_docs/           ← architecture, schema, contracts, style, docker, testing
│   ├── src/                  ← .NET projects
│   ├── migrations/           ← EF Core migrations
│   ├── Dockerfile.api
│   └── migrate.sh
├── client/
│   ├── AGENTS.md             ← frontend rules
│   ├── CLAUDE.md             ← shim
│   ├── .clinerules           ← shim
│   ├── agent_docs/           ← components, UX, state, contracts, testing
│   ├── src/                  ← React source
│   ├── Dockerfile
│   └── nginx.conf
├── .env.example
├── .editorconfig
├── .gitignore
└── docker-compose.yml
```
