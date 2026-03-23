# Stack & Architecture Rules

## .NET Version
- Always .NET 10 unless explicitly told otherwise

## Architecture Decision Guide
Choose the architecture based on project scope:

```
LAYERED API      → ≤5 modules, simple CRUD, quick delivery, solo dev
                   Controllers → Services → Repositories (one project)

CLEAN ARCH       → 5-15 modules, business rules, multi-role, medium complexity
                   Domain → Application → Infrastructure → API (separate projects)
                   DEFAULT choice for most projects

VERTICAL SLICE   → 15+ modules, complex domain, highly independent features
                   Feature folders, MediatR, self-contained slices
```

## Proven Patterns (Always Apply — from LMSApp)

### NumberSequenceService
Auto-generates reference numbers in format: `PREFIX-YYMM-NNNN`
Use for any entity that needs a human-readable reference number.

### AuditEntityInterceptor
EF Core interceptor that sets `CreatedBy` / `UpdatedBy` automatically from the JWT claim.
Never set audit fields manually in handlers.

### IGenericRepository<T>
```csharp
GetPagedAsync(filter, searchPredicate, orderBy, includes[])
```
Standard paged query interface. Every module repository extends this.

### GlobalExceptionMiddleware
Maps custom exceptions to HTTP status codes:
- `NotFoundException` → 404
- `ValidationException` → 400
- `ConflictException` → 409
- `UnauthorizedException` → 401

### IIdentityService
Defined in Application layer — decouples ASP.NET Identity from Application logic.
Never reference `UserManager` or `SignInManager` outside Infrastructure.

### BootstrapAdmin
First admin account is created from environment variables on startup.
Never hardcode seed credentials — read from `BootstrapAdmin__Email`, `BootstrapAdmin__Password`, etc.

### Cross-Permission DTO Pattern
Embed related entity names in DTO responses — never make separate endpoint calls per field.
```json
{ "id": "...", "customerId": "...", "customerName": "..." }
```
This avoids N+1 API calls on the frontend for restricted users.

### AuthContext initFromStorage()
```typescript
const [auth, setAuth] = useState<AuthState>(() => initFromStorage());
```
Lazy initializer — CRITICAL to prevent redirect race on page refresh.
