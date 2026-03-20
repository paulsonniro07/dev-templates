# [PROJECT_NAME]

[2-3 lines: what this project does]

## Stack
- **API:** .NET 10, ASP.NET Core, PostgreSQL, JWT
- **Client:** React 18, TypeScript, Tailwind CSS, Vite
- **Deploy:** Railway (API) + Vercel (Client)

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

### Step 3 — Install Claude Code global rules (first time only)
```bash
# Mac/Linux
mkdir -p ~/.claude
# Copy contents of global/CLAUDE.md to ~/.claude/CLAUDE.md
# OR ask Claude: "What are my global coding standards?" to verify it's loaded
```

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

### Step 6 — Let Claude build the foundation
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

# Claude Code slash commands (in Claude panel)
/plan [describe feature]    ← always start here
/new-module [ModuleName]    ← scaffold full module
/review                     ← check standards before commit
/fix [describe bug]         ← root cause fix
```

---

## 📁 Structure
```
[PROJECT_NAME]/
├── api/                 ← ASP.NET Core API
│   ├── .claude/         ← API-specific Claude rules
│   ├── agent_docs/      ← Architecture, schema, contracts docs
│   ├── src/             ← .NET source projects
│   ├── migrations/      ← EF Core migrations
│   ├── Dockerfile.api
│   └── migrate.sh
├── client/              ← React Frontend
│   ├── .claude/         ← Frontend-specific Claude rules
│   ├── agent_docs/      ← Component patterns, UX guide, state docs
│   ├── src/             ← React source
│   ├── Dockerfile
│   └── nginx.conf
├── .claude/             ← Root monorepo Claude context
├── .env.example         ← All env vars documented
├── .gitignore
└── docker-compose.yml
```
