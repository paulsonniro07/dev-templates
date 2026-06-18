# [PROJECT_NAME]

[2-3 lines: what this project does]

## Stack
- **API:** .NET 10, ASP.NET Core, PostgreSQL, JWT
- **Client:** React 18, TypeScript, Tailwind CSS, Vite
- **Deploy:** Railway (API) + Vercel (Client)
- **AI Coding Agent:** Claude Code OR Cline (DeepSeek) — pick one below

---

## 🚀 Quick Start After Cloning

### Step 1 — Replace placeholders
In VS Code: `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)
- Find: `[PROJECT_NAME]`
- Replace: your actual project name (e.g. `CRMSystem`)
- Click **Replace All**

Do the same for `[ProjectName]` (PascalCase used in .NET filenames).

### Step 2 — Setup environment
```bash
cp .env.example .env
```
Open `.env` and fill in all values.

### Step 3 — Set up your AI coding agent

This template supports **two agents** — pick whichever you're using. Both read from the same `agent_docs/` and follow the same architecture rules; only the rule file format differs.

<table>
<tr>
<th>🟣 Claude Code</th>
<th>🔵 Cline (DeepSeek)</th>
</tr>
<tr>
<td>

Copy the contents of [`.claude/CLAUDE.md`](.claude/CLAUDE.md) into `~/.claude/CLAUDE.md`
so Claude applies these standards to every project.

```bash
# Mac/Linux
mkdir -p ~/.claude && cp .claude/CLAUDE.md ~/.claude/CLAUDE.md

# Windows (PowerShell)
New-Item -ItemType Directory -Force ~/.claude
Copy-Item .claude/CLAUDE.md ~/.claude/CLAUDE.md
```

Verify: ask Claude *"What are my global coding standards?"*

</td>
<td>

Nothing to install globally. Cline reads `.clinerules` automatically the moment you open this folder in VS Code — at root, and again inside `api/` or `client/` depending on where you're working.

Just make sure the Cline extension is installed and pointed at your DeepSeek API key (`https://api.deepseek.com`, model `deepseek-chat`) in the Cline sidebar settings.

Verify: ask Cline *"What are the project rules?"*

</td>
</tr>
</table>

### Step 4 — Scaffold the .NET solution
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

### Step 5 — Scaffold the React app
```bash
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite axios react-router-dom
npm install -D @types/node
```

### Step 6 — Let your agent build the foundation

<table>
<tr>
<th>🟣 Claude Code</th>
<th>🔵 Cline (DeepSeek)</th>
</tr>
<tr>
<td>

Open VS Code → click ⚡ Claude panel → open terminal in `api/`:
```
/plan setup Clean Architecture foundation with BaseEntity, PaginationFilter,
IGenericRepository, GlobalExceptionMiddleware, AuditEntityInterceptor,
JWT auth, PostgreSQL EF Core, and Program.cs wiring
```

Then in `client/`:
```
/plan setup frontend foundation with AuthContext, Axios interceptor,
usePermissions hook, PermissionRoute, Layout sidebar, own UI component
library (Button, Input, Badge, Spinner, EmptyState, Pagination, SearchInput, Modal),
and React Router setup
```

</td>
<td>

Open the Cline panel in `api/` and describe the same request in plain language — Cline has no slash commands, but `.clinerules` already tells it to plan first and wait for approval:
```
Plan a Clean Architecture foundation with BaseEntity, PaginationFilter,
IGenericRepository, GlobalExceptionMiddleware, AuditEntityInterceptor,
JWT auth, PostgreSQL EF Core, and Program.cs wiring. Don't code yet.
```

Then in `client/`:
```
Plan a frontend foundation with AuthContext, Axios interceptor,
usePermissions hook, PermissionRoute, Layout sidebar, own UI component
library (Button, Input, Badge, Spinner, EmptyState, Pagination, SearchInput, Modal),
and React Router setup. Don't code yet.
```

</td>
</tr>
</table>

### Step 7 — Run everything
```bash
# From project root
docker-compose up --build
```

---

## 📋 Daily Commands

```bash
# New migration
cd api && ./migrate.sh AddCustomerTable
```

| Task | 🟣 Claude Code | 🔵 Cline (DeepSeek) |
|---|---|---|
| Plan before coding | `/plan [describe feature]` | "Plan [describe feature]. Don't code yet." |
| Scaffold full module | `/new-module [ModuleName]` | "Scaffold a new module called [ModuleName] following the module checklist in the rules." |
| Review against standards | `/review` | "Review this against the architecture, soft delete, and pagination rules." |
| Root-cause bug fix | `/fix [describe bug]` | "Fix this bug — find the root cause first: [describe bug]" |

Cline has no built-in slash commands, so these are typed as plain instructions — `.clinerules` already primes it to follow the same plan → approve → build → verify workflow as Claude Code's commands.

---

## 📁 Structure
```
[PROJECT_NAME]/
├── api/                 ← ASP.NET Core API
│   ├── .claude/         ← API-specific Claude Code rules
│   ├── .cline/           ← API-specific Cline rules
│   ├── .clinerules      ← Cline entry point (api scope)
│   ├── agent_docs/      ← Architecture, schema, contracts docs (shared by both agents)
│   ├── src/             ← .NET source projects
│   ├── migrations/      ← EF Core migrations
│   ├── Dockerfile.api
│   └── migrate.sh
├── client/              ← React Frontend
│   ├── .claude/         ← Frontend-specific Claude Code rules
│   ├── .cline/           ← Frontend-specific Cline rules
│   ├── .clinerules      ← Cline entry point (client scope)
│   ├── agent_docs/      ← Component patterns, UX guide, state docs (shared by both agents)
│   ├── src/             ← React source
│   ├── Dockerfile
│   └── nginx.conf
├── .claude/             ← Root monorepo Claude Code context
├── .cline/               ← Root monorepo Cline rules
├── .clinerules          ← Cline entry point (root scope)
├── .env.example         ← All env vars documented
├── .gitignore
└── docker-compose.yml
```

> Both `.claude/` and `.cline/` exist so the template works whether you're running Claude Code or Cline + DeepSeek — they read the same architectural standards, just in the format each tool expects. `agent_docs/` is the shared source of truth referenced by both.