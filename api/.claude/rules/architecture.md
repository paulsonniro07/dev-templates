# API Architecture Rules (Clean Architecture — Default)

## Layer Dependency Rules
```
Domain          → depends on nothing
Application     → depends on Domain only
Infrastructure  → depends on Application + Domain
API             → depends on Application only (never Infrastructure directly)
```

Breaking these rules is never acceptable. If you need something from Infrastructure in API,
define an interface in Application and implement it in Infrastructure.

## What Goes Where

| Thing | Layer |
|---|---|
| Entities, enums, domain interfaces | Domain |
| DTOs, commands, queries, handlers | Application |
| Custom exceptions (NotFoundException, etc.) | Application/Common/Exceptions |
| IGenericRepository<T>, IIdentityService | Application/Common/Interfaces |
| PaginatedList<T>, ApiResponse<T>, DropdownItem | Application/Common/Models |
| PaginationFilter and module filters | Application/Common/Models |
| AppDbContext, EF configs, migrations | Infrastructure |
| Repositories implementations | Infrastructure |
| AuditEntityInterceptor | Infrastructure |
| IdentityService, JWT logic | Infrastructure |
| DependencyInjection.cs (service registration) | Infrastructure |
| Controllers | API |
| GlobalExceptionMiddleware | API |
| Program.cs, appsettings.json | API |

## Clean Architecture Folder Structure
```
api/src/
├── [ProjectName].Domain/
│   ├── Entities/
│   │   └── BaseEntity.cs         ← Id, IsDeleted, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy
│   ├── Enums/
│   └── Interfaces/
├── [ProjectName].Application/
│   ├── Common/
│   │   ├── Exceptions/           ← NotFoundException, ValidationException, ConflictException
│   │   ├── Interfaces/           ← IGenericRepository<T>, IIdentityService
│   │   └── Models/               ← PaginatedList<T>, ApiResponse<T>, DropdownItem, PaginationFilter
│   ├── DTOs/[Feature]/
│   └── Features/[Feature]/
│       ├── Commands/             ← Create/Update/Delete/Restore handlers
│       └── Queries/              ← GetPaged/GetById/GetDropdown handlers
├── [ProjectName].Infrastructure/
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   ├── Repositories/
│   │   ├── Interceptors/         ← AuditEntityInterceptor
│   │   └── Seeders/              ← PermissionSeeder, BootstrapAdminSeeder
│   ├── Identity/
│   │   └── IdentityService.cs
│   └── DependencyInjection.cs
└── [ProjectName].API/
    ├── Controllers/
    ├── Middleware/
    │   └── GlobalExceptionMiddleware.cs
    └── Program.cs
```

## BaseEntity (Every entity inherits — no exceptions)
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

## Controller Rules
- Controllers are thin — dispatch to handlers/services only
- No business logic in controllers
- No direct repository calls in controllers
- Validate with `[ApiController]` + FluentValidation in handlers
- Return `IActionResult` — use `Ok()`, `Created()`, `NoContent()`, `NotFound()` etc.
