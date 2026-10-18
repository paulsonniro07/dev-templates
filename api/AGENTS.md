# [PROJECT_NAME] API — Agent Rules

.NET 10 | PostgreSQL | Clean Architecture | JWT | Swagger.
Read `../AGENTS.md` first. This file only adds backend-specific rules.

## What this does

[2-3 lines: what this API does, who uses it]

## Commands

```bash
dotnet build                                   # build (run after every change)
dotnet run --project src/[PROJECT_NAME].API    # run
./migrate.sh [MigrationName]                   # ask before running
```

Swagger: http://localhost:8080/swagger (Development only). All controllers need XML comments.

## Structure — Clean Architecture (4 projects)

```
[PROJECT_NAME].Domain         → Entities, Enums (zero dependencies)
[PROJECT_NAME].Application    → DTOs, interfaces, CQRS handlers
[PROJECT_NAME].Infrastructure → EF Core, repositories, Identity, interceptors
[PROJECT_NAME].API            → Controllers, middleware, Program.cs
```

Dependency rules (never break):
- Domain references nothing.
- Application references Domain only.
- Infrastructure references Application + Domain.
- API references Application only — never Infrastructure directly.
- Controllers dispatch through MediatR only; no business logic.

## Endpoint convention

```
GET    /api/[resource]               → paged list
GET    /api/[resource]/{id}          → single item
GET    /api/[resource]/dropdown      → [{ id, label }]
POST   /api/[resource]               → create
PUT    /api/[resource]/{id}          → update
DELETE /api/[resource]/{id}          → soft delete (IsDeleted = true)
PUT    /api/[resource]/{id}/restore  → restore
POST   /api/auth/login               → { token, user: { permissions[] } }
GET    /api/auth/me                  → current user
```

## Key patterns

- Soft delete: `IsDeleted = true` + `UpdatedAt = DateTime.UtcNow` — never `.Remove()`.
- List queries: `.Where(x => !x.IsDeleted)`. Single item: `&& !x.IsDeleted`.
- Pagination: `PaginationFilter` on every list, `PageSize` max 100.
- Auto-number: `NumberSequenceService` → `PREFIX-YYMM-NNNN`.
- Audit: `AuditEntityInterceptor` sets `CreatedBy` / `UpdatedBy` from JWT.
- Errors: `GlobalExceptionMiddleware` maps exceptions to HTTP status codes.
- Admin seed: `BootstrapAdmin` reads env vars — never hardcoded.
- Identity: `IIdentityService` in Application, implementation in Infrastructure.
- Cross-permission: embed related names in DTOs — frontend never calls extra endpoints.
- Explicit DTO mapping — no AutoMapper.

## Testing

- Run `dotnet build` after every change.
- Run `dotnet test` if tests exist; never leave them failing.
- New tests only on request — xUnit in `tests/[PROJECT_NAME].Tests`.
- Details: `agent_docs/testing.md`.

## Scaffolding a new module

Follow `agent_docs/module-checklist.md` file-by-file. Do not improvise names or skip steps.

## Reference docs

| Read when | File |
|---|---|
| Making architecture decisions | `agent_docs/architecture.md` |
| Touching entities or migrations | `agent_docs/database-schema.md` |
| Adding or changing endpoints | `agent_docs/api-contracts.md` |
| Touching Docker or env vars | `agent_docs/docker-setup.md` |
| Writing C# | `agent_docs/coding-style.md` |
| Scaffolding a module | `agent_docs/module-checklist.md` |
| Writing or running tests | `agent_docs/testing.md` |

## Rules

- Ask before running `./migrate.sh` — confirm the migration name first.
- Never commit `.env` — only `.env.example`.
- Update `agent_docs/` in the same change when schema, contracts, or config change.
