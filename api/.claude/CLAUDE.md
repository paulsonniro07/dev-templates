# [PROJECT_NAME] API
# .NET 10 | PostgreSQL | Clean Architecture | JWT | Swagger

## What this does
[2-3 lines: what this API does, who uses it]

## Architecture
Clean Architecture — 4 projects:
- [PROJECT_NAME].Domain         → Entities, Enums (no dependencies)
- [PROJECT_NAME].Application    → DTOs, Interfaces, Services/Handlers
- [PROJECT_NAME].Infrastructure → EF Core, Repositories, Identity
- [PROJECT_NAME].API            → Controllers, Middleware, Program.cs

Rules:
- Controllers call Application only — never Infrastructure directly
- Business logic in Application — never in Controllers
- DTOs at all API boundaries — never expose domain entities

## Entity Standard
Every entity extends BaseEntity:
Id (Guid), IsDeleted (bool, false), CreatedAt, UpdatedAt,
CreatedBy (string?), UpdatedBy (string?)

## Key Patterns
- Soft delete: IsDeleted=true + UpdatedAt=UtcNow — never .Remove()
- All queries: .Where(x => !x.IsDeleted)
- GetById: FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
- Pagination: PaginationFilter on every list, PageSize max 100
- Auto-number: NumberSequenceService → PREFIX-YYMM-NNNN
- Audit: AuditEntityInterceptor sets CreatedBy/UpdatedBy from JWT
- Errors: GlobalExceptionMiddleware maps exceptions to HTTP codes
- Admin seed: BootstrapAdmin reads from env vars — never hardcoded
- Cross-permission: embed related names in DTO — never call separate endpoints

## API Endpoints Convention
GET    /api/[resource]               → paged list
GET    /api/[resource]/{id}          → single item
GET    /api/[resource]/dropdown      → [{ id, label }]
POST   /api/[resource]               → create
PUT    /api/[resource]/{id}          → update
DELETE /api/[resource]/{id}          → soft delete (IsDeleted=true)
PUT    /api/[resource]/{id}/restore  → restore
POST   /api/auth/login               → { token, user: { permissions[] } }
GET    /api/auth/me                  → current user

## Swagger
- Available at: http://localhost:8080/swagger (Development only)
- All controllers must have XML comments
- Test all endpoints in Swagger before marking complete

## Commands
- Build:       dotnet build
- Run:         dotnet run --project src/[PROJECT_NAME].API
- Migration:   ./migrate.sh [MigrationName]

## Reference Docs
@agent_docs/database-schema.md  — read when touching entities or migrations
@agent_docs/api-contracts.md    — read when adding or changing endpoints
@agent_docs/docker-setup.md     — read when touching Docker or env vars

## Rules
- Run dotnet build after every change — fix before continuing
- Never commit .env — only .env.example
- Ask before running ./migrate.sh — confirm name first
