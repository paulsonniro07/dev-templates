# Dev-Templates Setup & Module Scaffolding Guide
**paulsonniro07/dev-templates** — Full-Stack .NET 10 + React/TypeScript

---

## Overview

Two tools work together to eliminate boilerplate:

| Tool | What it does | When to run |
|---|---|---|
| `new-project.bat` | Creates full .NET foundation — solution, 4 projects, BaseEntity, GenericRepository, JWT, Docker | **Once** per new project |
| `scaffold-module.js` | Adds a complete module (backend + frontend) to an existing project | **Every time** you add a new feature |

```
new-project.bat          →  .NET foundation ready
scaffold-module.js       →  Add Customer, Invoice, Product... any time
4 manual steps per module →  Add fields, register DI, migrate, add route
```

---

## Part 1 — Setting Up a New Project

### Prerequisites
Make sure these are installed before starting:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org) (you already have this via npm/Vite)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)

Verify versions:
```bash
dotnet --version   # should show 10.x.x
node --version     # should show 18+ or 20+
docker --version
```

---

### Step 1 — Run the .NET Generator

Place `new-project.bat` somewhere accessible (e.g. `C:\dev-tools\`) or copy it to
wherever you want the new project folder to be created.

Double-click `new-project.bat` or run from terminal:
```cmd
new-project.bat
```

You'll be prompted for:

| Prompt | Recommended answer for ZonaFaktur |
|---|---|
| Project name | `ZonaFaktur` |
| Database | `1` (PostgreSQL) |
| JWT secret | Press Enter (change later in .env) |
| Include Docker | `Y` |
| API port | `8080` |
| PostgreSQL port | `5432` |

When it finishes you'll have:
```
ZonaFaktur/
├── src/
│   ├── ZonaFaktur.Domain/
│   ├── ZonaFaktur.Application/
│   ├── ZonaFaktur.Infrastructure/
│   └── ZonaFaktur.API/
├── agent_docs/
├── Dockerfile.api
├── docker-compose.yml
├── .env.example
├── migrate.sh
└── ZonaFaktur.sln
```

---

### Step 2 — Copy scaffold-module.js Into the Project

Copy `scaffold-module.js` into the project root alongside `docker-compose.yml`:

```
ZonaFaktur/               ← monorepo root
├── api/                  ← .NET solution (output from new-project.bat)
│   ├── src/
│   ├── agent_docs/
│   └── ZonaFaktur.sln
├── client/               ← React app (Step 4 below)
├── scaffold-module.js    ← ✅ place it here
└── docker-compose.yml
```

> **Note:** If you ran `new-project.bat` and got a flat structure (no `api/` folder),
> create the `api/` and `client/` folders manually and move things:
>
> ```cmd
> mkdir ZonaFaktur\api
> mkdir ZonaFaktur\client
> move ZonaFaktur\src ZonaFaktur\api\src
> move ZonaFaktur\*.sln ZonaFaktur\api\
> move ZonaFaktur\migrate.sh ZonaFaktur\api\
> move ZonaFaktur\agent_docs ZonaFaktur\api\agent_docs
> ```

---

### Step 3 — Set Up Environment

```bash
cd ZonaFaktur
cp api/.env.example api/.env       # or: copy api\.env.example api\.env
```

Open `api/.env` and fill in:
```env
API_PORT=8080
JWT_SECRET=your-super-secret-key-min-32-characters-long
DB_PORT=5432
DB_NAME=ZonaFaktur
DB_USER=postgres
DB_PASSWORD=yourpassword
CONNECTION_STRING=Host=db;Database=ZonaFaktur;Username=postgres;Password=yourpassword
```

---

### Step 4 — Scaffold the React Frontend

From the project root:
```bash
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install axios react-router-dom
npm install -D @types/node
```

Add path alias to `vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

Add to `tsconfig.json` under `compilerOptions`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

Create `client/src/lib/api.ts` (Axios instance with JWT):
```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

### Step 5 — Copy Claude Code Context Files

Copy the `.claude/` folder from your `dev-templates` repo into the project root.
This gives Claude Code the coding standards, slash commands, and agent_docs context.

```bash
# From dev-templates root
cp -r .claude /path/to/ZonaFaktur/.claude
cp -r api/.claude /path/to/ZonaFaktur/api/.claude
cp -r client/.claude /path/to/ZonaFaktur/client/.claude

# Copy agent_docs templates
cp api/agent_docs/*.md /path/to/ZonaFaktur/api/agent_docs/
cp client/agent_docs/*.md /path/to/ZonaFaktur/client/agent_docs/
```

Then do a find-and-replace in the copied files:
- Find: `[PROJECT_NAME]` → Replace: `ZonaFaktur`
- Find: `[ProjectName]` → Replace: `ZonaFaktur`

---

### Step 6 — Start with Docker

```bash
# From project root (where docker-compose.yml is)
docker-compose up --build
```

Wait for both containers to show healthy, then open:
- **Swagger:** http://localhost:8080/swagger
- **Health check:** http://localhost:8080/health
- **Frontend:** http://localhost:3000 (after `npm run dev` in client/)

---

### Step 7 — Run the Initial Migration

With the API container running:
```bash
cd api
./migrate.sh InitialCreate
```

On Windows (if bash isn't available):
```cmd
dotnet ef migrations add InitialCreate ^
  --project src\ZonaFaktur.Infrastructure ^
  --startup-project src\ZonaFaktur.API ^
  --output-dir Persistence\Migrations

dotnet ef database update ^
  --project src\ZonaFaktur.Infrastructure ^
  --startup-project src\ZonaFaktur.API
```

---

## Part 2 — Adding a New Module

Every time you want to add a feature (Customer, Invoice, Product, etc.),
run the scaffolder from the **project root** (where `api/` and `client/` folders are).

### Usage

```bash
# Basic — auto-detects project name from .sln file
node scaffold-module.js Customer

# Explicit project name
node scaffold-module.js Customer ZonaFaktur

# More examples
node scaffold-module.js Invoice ZonaFaktur
node scaffold-module.js Product ZonaFaktur
node scaffold-module.js Supplier ZonaFaktur
```

### What gets generated

Running `node scaffold-module.js Customer ZonaFaktur` creates:

**Backend** (`api/src/`)
```
ZonaFaktur.Domain/Entities/
  Customer.cs                              ← extends BaseEntity

ZonaFaktur.Application/Customers/
  DTOs/
    CustomerDto.cs                         ← response shape
    CreateCustomerDto.cs                   ← create request + FluentValidation
    UpdateCustomerDto.cs                   ← update request + FluentValidation
  CustomerFilter.cs                        ← extends PaginationFilter
  ICustomerRepository.cs                   ← repository contract
  Queries/
    GetCustomersQuery.cs + Handler         ← paged list
    GetCustomerByIdQuery.cs + Handler      ← single item
    GetCustomersDropdownQuery.cs + Handler ← { id, label } list
  Commands/
    CreateCustomerCommand.cs + Handler
    UpdateCustomerCommand.cs + Handler
    DeleteCustomerCommand.cs + Handler     ← soft delete (IsDeleted=true)
    RestoreCustomerCommand.cs + Handler    ← restore soft-deleted

ZonaFaktur.Infrastructure/Persistence/Repositories/
  CustomerRepository.cs                    ← implements ICustomerRepository

ZonaFaktur.API/Controllers/
  CustomersController.cs                   ← thin, MediatR dispatch only
```

**Frontend** (`client/src/`)
```
features/customers/
  types.ts          ← TypeScript interfaces (Dto, CreateDto, UpdateDto, Filter)
  service.ts        ← all API calls via axios
  CustomerList.tsx  ← table + search + pagination + delete
  CustomerForm.tsx  ← create/edit modal + validation errors

pages/
  CustomerPage.tsx  ← page wrapper
```

**Plus:** `NEXT_STEPS_CUSTOMER.md` — exact 4 manual steps for this module.

---

### After Running the Scaffolder — 4 Manual Steps

#### Step 1 — Add your entity fields

Open `api/src/ZonaFaktur.Domain/Entities/Customer.cs`:
```csharp
public class Customer : BaseEntity
{
    public string Name        { get; set; } = string.Empty;
    public string? Email      { get; set; }
    public string? Phone      { get; set; }
    public bool   IsActive    { get; set; } = true;
}
```

Then mirror the fields in these files (search `TODO` in each):

| File | What to do |
|---|---|
| `CustomerDto.cs` | Add same properties for response |
| `CreateCustomerDto.cs` | Add input properties + FluentValidation rules |
| `UpdateCustomerDto.cs` | Add input properties + FluentValidation rules |
| `CustomerRepository.cs` | Update search filter, sort field, dropdown Label, Select projection |
| `CreateCustomerHandler.cs` | Map `request.Dto.Name` → `entity.Name` |
| `UpdateCustomerHandler.cs` | Map `request.Dto.Name` → `entity.Name` |
| `GetCustomerByIdHandler.cs` | Map `entity.Name` → `dto.Name` |
| `client/features/customers/types.ts` | Add TypeScript fields |
| `client/features/customers/CustomerList.tsx` | Add table columns |
| `client/features/customers/CustomerForm.tsx` | Add form inputs |

> **Tip:** Search `TODO` across the whole project to find every spot:
> ```bash
> grep -r "TODO" api/src --include="*.cs"
> grep -r "TODO" client/src --include="*.ts" --include="*.tsx"
> ```

---

#### Step 2 — Register the repository in DI

Open `api/src/ZonaFaktur.Infrastructure/DependencyInjection.cs`

Add one line inside `AddInfrastructure()`:
```csharp
services.AddScoped<ICustomerRepository, CustomerRepository>();
```

---

#### Step 3 — Run the migration

```bash
cd api
./migrate.sh AddCustomerTable
```

Then verify:
```bash
dotnet build
```

---

#### Step 4 — Add the route in the frontend

Open `client/src/App.tsx`, add:
```tsx
import { CustomerPage } from '@/pages/CustomerPage';

// Inside your <Routes>:
<Route path="customers" element={<CustomerPage />} />
```

Add a nav link in your sidebar/layout pointing to `/customers`.

---

## Part 3 — Daily Workflow

```
┌─────────────────────────────────────────────────────┐
│  Starting a new feature?                            │
│                                                     │
│  1. node scaffold-module.js FeatureName             │
│  2. Read NEXT_STEPS_FEATURENAME.md                  │
│  3. Add fields (search TODO in generated files)     │
│  4. Register DI → migrate → add route               │
│  5. docker-compose up --build                       │
│  6. Test in Swagger + browser                       │
└─────────────────────────────────────────────────────┘
```

### Common commands

```bash
# Start everything
docker-compose up --build

# Start in background
docker-compose up -d --build

# View API logs
docker-compose logs -f api

# Stop everything
docker-compose down

# New migration
cd api && ./migrate.sh MigrationName

# Frontend dev server (separate terminal)
cd client && npm run dev

# Type check frontend
cd client && npx tsc --noEmit

# Find all TODO items in generated module
grep -r "TODO" api/src/ZonaFaktur.Application/Customers --include="*.cs"
```

---

## Part 4 — File Structure Reference

```
YourProject/                        ← monorepo root
│
├── scaffold-module.js              ← run here: node scaffold-module.js Customer
│
├── api/                            ← .NET solution (output from new-project.bat)
│   ├── src/
│   │   ├── YourProject.Domain/
│   │   │   └── Entities/
│   │   │       ├── BaseEntity.cs   ← Id, IsDeleted, audit fields
│   │   │       └── Customer.cs     ← your entities
│   │   │
│   │   ├── YourProject.Application/
│   │   │   ├── Common/
│   │   │   │   ├── Models/
│   │   │   │   │   ├── PaginationFilter.cs
│   │   │   │   │   ├── PagedResult.cs
│   │   │   │   │   └── DropdownItem.cs
│   │   │   │   ├── Interfaces/
│   │   │   │   │   ├── IGenericRepository.cs
│   │   │   │   │   └── ICurrentUserService.cs
│   │   │   │   ├── Behaviors/
│   │   │   │   │   └── ValidationBehavior.cs
│   │   │   │   └── Exceptions/
│   │   │   │       └── AppValidationException.cs
│   │   │   └── Customers/          ← one folder per module
│   │   │       ├── DTOs/
│   │   │       ├── Queries/
│   │   │       ├── Commands/
│   │   │       ├── CustomerFilter.cs
│   │   │       └── ICustomerRepository.cs
│   │   │
│   │   ├── YourProject.Infrastructure/
│   │   │   ├── Persistence/
│   │   │   │   ├── AppDbContext.cs
│   │   │   │   ├── Repositories/
│   │   │   │   │   ├── GenericRepository.cs
│   │   │   │   │   └── CustomerRepository.cs
│   │   │   │   ├── Configurations/   ← EF entity configs (add manually if needed)
│   │   │   │   ├── Interceptors/
│   │   │   │   │   └── AuditEntityInterceptor.cs
│   │   │   │   └── Migrations/
│   │   │   └── DependencyInjection.cs  ← register repos here
│   │   │
│   │   └── YourProject.API/
│   │       ├── Controllers/
│   │       │   └── CustomersController.cs
│   │       ├── Middleware/
│   │       │   └── GlobalExceptionMiddleware.cs
│   │       └── Program.cs
│   │
│   ├── agent_docs/                 ← Claude Code context docs
│   ├── .claude/                    ← Claude Code commands + rules
│   ├── Dockerfile.api
│   ├── docker-compose.yml
│   ├── migrate.sh
│   └── .env  (.env.example committed, .env gitignored)
│
└── client/                         ← React + TypeScript
    ├── src/
    │   ├── features/
    │   │   └── customers/          ← one folder per module
    │   │       ├── types.ts
    │   │       ├── service.ts
    │   │       ├── CustomerList.tsx
    │   │       └── CustomerForm.tsx
    │   ├── pages/
    │   │   └── CustomerPage.tsx
    │   ├── lib/
    │   │   └── api.ts              ← Axios + JWT interceptor
    │   └── types/
    │       └── common.ts           ← PaginatedList, DropdownItem, etc.
    └── .env
```

---

## Part 5 — Troubleshooting

### "Project name not detected"
Run with explicit project name:
```bash
node scaffold-module.js Customer ZonaFaktur
```

### "Run this script from your project root"
Make sure you're in the folder that contains both `api/` and `client/`:
```bash
# Wrong
cd api && node ../scaffold-module.js Customer

# Correct
cd /path/to/ZonaFaktur && node scaffold-module.js Customer
```

### dotnet build fails after scaffolding
Most common cause: `DropdownItem` namespace mismatch.
The scaffolder creates `DropdownItem.cs` if missing, but your existing project may
define it elsewhere. Delete the generated one and update the `using` in the repository.

### Frontend types don't match backend response
Check `PaginatedList<T>` — the backend returns `items` (lowercase), the frontend
`types/common.ts` interface uses `items`. If your bat-generated backend uses
a different property name (e.g. `data`), update `common.ts` to match.

### Migration fails
Common cause: `AppDbContext` not finding the entity.
Make sure `OnModelCreating` calls `modelBuilder.ApplyConfigurationsFromAssembly()`
or the entity is registered via a `DbSet<Customer>` property in `AppDbContext`.
Add: `public DbSet<Customer> Customers => Set<Customer>();`

---

## Part 6 — Keeping scaffold-module.js in dev-templates

Add it to your `dev-templates` repo so every project gets it:

```
dev-templates/
├── new-project.bat
├── scaffold-module.js    ← add here
├── .claude/
├── api/
└── client/
```

Update your README:
```markdown
## Scaffolding tools
- `new-project.bat`     — creates full .NET + Docker foundation
- `scaffold-module.js`  — adds a full module (backend + frontend) to existing project
  Usage: node scaffold-module.js <ModuleName> [ProjectName]
```
