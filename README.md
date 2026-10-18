# Full-Stack Project Template

A starting point for **ASP.NET Core 10 + React/TypeScript** apps that AI coding agents can build correctly without being told the rules twice.

Rules are written for agents first: any tool that reads `AGENTS.md` gets the same standards, the same workflow, and the same architecture.

## What this template gives you

- **Clean Architecture API** — Domain / Application / Infrastructure / API with enforced layer boundaries
- **Data rules baked in** — soft delete only, pagination on every list, searchable dropdowns, audit fields
- **React frontend** — own component library (no external UI lib), consistent UX states, typed API layer
- **Docker from day one** — PostgreSQL + API + client with `.env`-driven compose
- **One rule source** — `AGENTS.md`; Claude Code and Cline get one-line shims, no duplicated rules
- **Module checklists** — deterministic file-by-file scaffolding for new backend and frontend modules
- **JWT auth foundation** — login/me endpoints, permission guards, bootstrap admin from env vars

## Requirements

- .NET 10 SDK
- Node.js 20+
- Docker Desktop
- Git
- An AI coding agent (opencode recommended; any `AGENTS.md`-aware tool works)

---

## Use this template

### Option A — GitHub (recommended)

1. Open this repository on GitHub
2. Click **Use this template** → **Create a new repository**
3. Clone your new repository

### Option B — manual

```bash
git clone https://github.com/paulsonniro07/dev-templates.git my-app
cd my-app
```

Delete the `.git` folder, then initialise a fresh repository.

---

## Set up your project

### 1. Replace the placeholder

This template uses a single placeholder: `[PROJECT_NAME]`.

In VS Code: `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac).

- Find `[PROJECT_NAME]` → your project name (e.g. `CRMSystem`)
- Click **Replace All**

Use one consistent value — it becomes the solution name, .NET namespaces, Docker image names, and the default database name.

### 2. Set up environment

```bash
cp .env.example .env
```

Fill in every value in `.env`. Secrets never belong in source code.

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

No global install is required. Open the project folder; the agent loads the rules automatically.

| Agent | Rule file it reads | Setup |
|---|---|---|
| opencode | `AGENTS.md` (root + nested) | none |
| Claude Code | `CLAUDE.md` / `.claude/CLAUDE.md` shims | none |
| Cline | `.clinerules` shims | none |
| Codex, Cursor, Gemini CLI, Jules, Copilot | `AGENTS.md` | none |
| Anything else | point it at `AGENTS.md` | one line |

### 6. Ask the agent for the foundation

The template enforces **plan first, approve, then build**. In opencode, switch to plan mode (`Tab`) and send:

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

Review the plan. If it is correct, approve it. The agent must not write code before approval.

### 7. Run everything

```bash
docker-compose up --build
```

Swagger (development only): http://localhost:8080/swagger

---

## How the rules work

`AGENTS.md` is the single source of truth. Tool-specific files contain no rules of their own:

```
AGENTS.md                 ← all hard rules and workflow
api/AGENTS.md             ← backend rules
client/AGENTS.md          ← frontend rules
CLAUDE.md                 ← shim → AGENTS.md (Claude Code)
.clinerules               ← shim → AGENTS.md (Cline)
api/CLAUDE.md, etc.       ← nested shims for scoped work
```

Deep knowledge lives in `agent_docs/` and is read on demand:

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

If a tool file and `AGENTS.md` ever disagree, `AGENTS.md` wins. Project rules also win over global user rules.

## Workflow the template enforces

1. **Plan** — restate the request, list files and risks. No code.
2. **Approve** — the human says "go". Nothing is written before this.
3. **Build** — only the approved scope. No unrequested refactors.
4. **Verify** — build and typecheck must pass.
5. **Report** — changed files, results, anything left undone.

No slash commands are required — plain prompts work with every model:

| Task | Prompt |
|---|---|
| Plan | "Plan [feature]. Don't code yet." |
| New module | "Scaffold the [Module] module following `api/agent_docs/module-checklist.md`." |
| Review | "Review this against AGENTS.md and the module checklists." |
| Bug fix | "Find the root cause first, then fix: [bug]." |

## Verification

- API: `dotnet build`
- Client: `npm run build` and `npx tsc --noEmit`
- Existing tests must still pass (`dotnet test`, `npm run test` if present)
- New tests only when explicitly requested — standards in the testing docs

## Daily commands

```bash
docker-compose up --build                          # everything
cd api && dotnet run --project src/[PROJECT_NAME].API
cd client && npm run dev
cd api && ./migrate.sh AddCustomerTable            # ask your agent first
```

## Template structure

```
/
├── AGENTS.md                 ← rules for every agent
├── CLAUDE.md                 ← shim → AGENTS.md
├── .clinerules               ← shim → AGENTS.md
├── .editorconfig
├── .env.example              ← every env var, empty values
├── docker-compose.yml
├── api/
│   ├── AGENTS.md             ← backend rules
│   ├── CLAUDE.md             ← shim
│   ├── .clinerules           ← shim
│   ├── agent_docs/           ← architecture, schema, contracts, style, docker, testing
│   ├── src/                  ← .NET projects (scaffolded)
│   ├── migrations/           ← EF Core migrations
│   ├── Dockerfile.api
│   └── migrate.sh
└── client/
    ├── AGENTS.md             ← frontend rules
    ├── CLAUDE.md             ← shim
    ├── .clinerules           ← shim
    ├── agent_docs/           ← components, UX, state, contracts, testing
    ├── src/                  ← React source (scaffolded)
    ├── Dockerfile
    └── nginx.conf
```

## Working in a generated project

The README is copied with the template. Replace this intro with your project's description, but keep the rules, workflow, and structure sections — they describe how the agent works.

## Maintaining this template

- Keep `AGENTS.md` as the only place rules live; shims must stay rule-free.
- When changing an entity, endpoint, env var, or UI pattern, update the matching `agent_docs/` file in the same change.
- Keep `module-checklist.md` files aligned with the actual project layout.
- Keep `[PROJECT_NAME]` as the only placeholder — never introduce `[ProjectName]` or similar variants.
- On GitHub: **Settings → Template repository** must stay enabled.
