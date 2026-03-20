# Architecture — [PROJECT_NAME]
# Update this when architecture decisions change

## Project Type
[What this API does, who uses it]

## Architecture Pattern
[LAYERED / CLEAN ARCH / VERTICAL SLICE]
Chosen because: [reason]

## Layer Rules
```
Domain         → Zero dependencies. Entities, Enums, BaseEntity, domain interfaces.
Application    → Depends on Domain only. CQRS handlers, DTOs, IRepository, IService.
Infrastructure → Depends on Application + Domain. EF Core, repos, Identity, interceptors.
API            → Depends on Application only. Controllers, middleware, Program.cs.
```

## Dependency Rules (never break)
- Domain: NO references to any other layer
- Application: references Domain only
- Infrastructure: references Application + Domain
- API: references Application only
- NEVER: API → Infrastructure directly
- NEVER: business logic in controllers

## Key Architecture Decisions

### ADR-001: Soft Delete
- IsDeleted=true — never SQL DELETE
- Global query filter in DbContext or manual .Where(!x.IsDeleted) in all queries

### ADR-002: Auto-numbering
- Pattern: PREFIX-YYMM-NNNN via NumberSequenceService
- Thread-safe, sequential within month

### ADR-003: Audit Trail
- AuditEntityInterceptor sets CreatedBy/UpdatedBy from JWT claim
- All entities extending BaseEntity get this automatically

### ADR-004: Exception Handling
- Custom exceptions in Application/Common/Exceptions/
- GlobalExceptionMiddleware maps to HTTP status codes:
  NotFoundException → 404
  ValidationException → 400
  ConflictException → 409
  UnauthorizedException → 401

### ADR-005: Identity Decoupling
- IIdentityService interface in Application layer
- IdentityService implementation in Infrastructure
- Application never references UserManager/RoleManager directly

### ADR-006: BootstrapAdmin
- First admin created from env vars (BOOTSTRAP_ADMIN_*) on startup
- No hardcoded credentials anywhere

### ADR-007: Cross-Permission DTO Pattern
- List DTOs embed related entity names server-side
- Frontend NEVER calls separate endpoints to resolve related names
- Prevents 403 errors for restricted roles seeing "Unknown" data

## What Goes Where
| What | Where |
|---|---|
| Entity definition | Domain/Entities/ |
| Business rule | Application/Features/.../Handler |
| Data access | Infrastructure/Persistence/Repositories/ |
| HTTP mapping | API/Controllers/ |
| DTO | Application/DTOs/[Feature]/ |
| DI registration | Infrastructure/DependencyInjection.cs |

## Modules in This Project
| Module | Status | Notes |
|---|---|---|
| Auth | [ ] | JWT login, me endpoint |
| [Module] | [ ] | |
