# Entity Patterns — [PROJECT_NAME] API

## BaseEntity (every entity extends this)
```csharp
Id         Guid     PK, NewGuid()
IsDeleted  bool     default false — NEVER hard delete
CreatedAt  DateTime UTC
UpdatedAt  DateTime UTC
CreatedBy  string?  set by AuditEntityInterceptor from JWT
UpdatedBy  string?  set by AuditEntityInterceptor from JWT
```

## Soft Delete Queries (mandatory patterns)
```csharp
// List — always filter
.Where(x => !x.IsDeleted)

// Single item
.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)

// Soft delete
entity.IsDeleted = true;
entity.UpdatedAt = DateTime.UtcNow;

// Restore — NO IsDeleted filter (need to find deleted record)
var entity = await _context.Set<T>().FirstOrDefaultAsync(x => x.Id == id);
entity.IsDeleted = false;
entity.UpdatedAt = DateTime.UtcNow;
```

## Dropdown Query Pattern
```csharp
.Where(x => !x.IsDeleted &&
       (string.IsNullOrEmpty(keyword) ||
        x.Name.ToLower().Contains(keyword.ToLower())))
.OrderBy(x => x.Name)
.Take(Math.Min(pageSize, 50))
.Select(x => new DropdownItem { Id = x.Id, Label = x.Name })
```

## Pagination Pattern
```csharp
var totalCount = await query.CountAsync(ct);
var data = await query
    .Skip((filter.PageNumber - 1) * Math.Min(filter.PageSize, 100))
    .Take(Math.Min(filter.PageSize, 100))
    .ToListAsync(ct);
```

## IGenericRepository
```csharp
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<PaginatedList<T>> GetPagedAsync(
        PaginationFilter filter,
        Expression<Func<T, bool>>? searchPredicate = null,
        Expression<Func<T, object>>? orderBy = null,
        params Expression<Func<T, object>>[] includes);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task SoftDeleteAsync(Guid id);
    Task RestoreAsync(Guid id);
    Task<List<DropdownItem>> SearchDropdownAsync(
        Expression<Func<T, string>> labelSelector,
        string? keyword, int pageSize = 20);
}
```

## Cross-Permission DTO Pattern
- List DTOs embed related entity names server-side
- Frontend NEVER calls separate endpoints to resolve related names
- Prevents 403 errors for restricted roles seeing "Unknown" data

## Key Services
- AuditEntityInterceptor — sets CreatedBy/UpdatedBy from JWT on every save
- NumberSequenceService — PREFIX-YYMM-NNNN, thread-safe
- BootstrapAdmin — first admin from env vars on startup, never hardcoded
- IIdentityService — interface in Application, impl in Infrastructure (decoupled)
