# [PROJECT_NAME] — ASP.NET Core API
# .NET 10 | PostgreSQL | Docker | JWT
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

## Architecture Decision Guide
```
LAYERED API    → ≤5 modules, simple CRUD, quick delivery
               → Controllers → Services → Repositories (one project)

CLEAN ARCH     → 5-15 modules, business rules, multi-role  ← DEFAULT
               → Domain → Application → Infrastructure → API

VERTICAL SLICE → 15+ modules, complex domain, highly independent features
               → Feature folders, MediatR, self-contained slices
```

## Project Structure (Clean Architecture — adjust for other options)
```
api/
├── src/
│   ├── [PROJECT_NAME].Domain/
│   │   ├── Entities/
│   │   │   └── BaseEntity.cs
│   │   ├── Enums/
│   │   └── Interfaces/
│   ├── [PROJECT_NAME].Application/
│   │   ├── Common/
│   │   │   ├── Exceptions/        ← NotFoundException, ValidationException, etc.
│   │   │   ├── Interfaces/        ← IGenericRepository<T>, IIdentityService
│   │   │   └── Models/            ← PaginatedList<T>, ApiResponse<T>, DropdownItem
│   │   ├── DTOs/[Feature]/
│   │   └── Features/[Feature]/
│   │       ├── Commands/
│   │       └── Queries/
│   ├── [PROJECT_NAME].Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Repositories/
│   │   │   ├── Interceptors/      ← AuditEntityInterceptor
│   │   │   └── Seeders/           ← PermissionSeeder, BootstrapAdminSeeder
│   │   ├── Identity/
│   │   │   └── IdentityService.cs
│   │   └── DependencyInjection.cs
│   └── [PROJECT_NAME].API/
│       ├── Controllers/
│       ├── Middleware/
│       │   └── GlobalExceptionMiddleware.cs
│       └── Program.cs
├── migrations/
├── agent_docs/
├── .claude/
├── Dockerfile.api
├── migrate.sh
├── .env.example
└── .gitignore
```

## Commands
- Build:        dotnet build
- Run (local):  dotnet run --project src/[PROJECT_NAME].API
- Run (docker): docker-compose up --build (from root)
- Test:         dotnet test
- Migration:    ./migrate.sh [MigrationName]

## BaseEntity (every entity inherits this — no exceptions)
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}
```

## Soft Delete Rules
- Delete = IsDeleted=true, UpdatedAt=UtcNow — NEVER .Remove()
- ALL queries: .Where(x => !x.IsDeleted)
- GetById: FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
- Restore: find WITHOUT IsDeleted filter, then set IsDeleted=false

## PaginationFilter
```csharp
public class PaginationFilter
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;   // max 100 server-side
    public string? SearchKeyword { get; set; }
    public string? SortBy { get; set; }
    public string SortDirection { get; set; } = "asc";
}
// Extend per module: public class [Module]Filter : PaginationFilter { ... }
```

## Proven Patterns (always use)
- NumberSequenceService: PREFIX-YYMM-NNNN auto-numbers
- AuditEntityInterceptor: CreatedBy/UpdatedBy from JWT claim
- GlobalExceptionMiddleware: maps custom exceptions to HTTP codes
- IIdentityService: decouples Identity from Application layer
- BootstrapAdmin: first admin from env vars, never hardcoded
- Cross-permission DTO: embed related names in response, never call separate endpoints

## API Conventions
```
GET    /api/[resource]               → paged list
GET    /api/[resource]/{id}          → single item
GET    /api/[resource]/dropdown      → [{ id, label }]
POST   /api/[resource]               → create
PUT    /api/[resource]/{id}          → update
DELETE /api/[resource]/{id}          → soft delete
PUT    /api/[resource]/{id}/restore  → restore
POST   /api/auth/login               → { token, user }
GET    /api/auth/me                  → current user
```

## RBAC Permission Naming
- Format: module.action (e.g. customers.view, invoices.approve)
- PermissionSeeder seeds on startup — skips roles that already have permissions

## Reference Docs
@agent_docs/architecture.md     — Read when modifying structure or design decisions
@agent_docs/coding-style.md     — Read when writing handlers, services, or repositories
@agent_docs/database-schema.md  — Read when touching entities or migrations
@agent_docs/api-contracts.md    — Read when adding or modifying endpoints
@agent_docs/docker-setup.md     — Read when modifying Docker or env config

## IMPORTANT
- Run dotnet build after every change — fix before continuing
- Use ./migrate.sh [Name] for migrations — never run ef commands manually
- Never commit .env — only .env.example
