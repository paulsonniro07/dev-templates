# Database Schema — [PROJECT_NAME]
# Engine: PostgreSQL | ORM: EF Core | Update when entities change

## Connection
- Configured via DB_CONNECTION_STRING in .env
- Migrations folder: /migrations/
- Apply via: ./migrate.sh [MigrationName]

## BaseEntity
```csharp
Id         Guid     PK, NewGuid()
IsDeleted  bool     default false — NEVER hard delete
CreatedAt  DateTime UTC
UpdatedAt  DateTime UTC
CreatedBy  string?  set by AuditEntityInterceptor
UpdatedBy  string?  set by AuditEntityInterceptor
```

## Entities
<!-- Copy this block for each entity -->

### [EntityName]
**Table:** [table_name]
**Purpose:** [what this stores]

| Column | Type | Notes |
|---|---|---|
| Id | Guid | PK |
| [Field] | [Type] | [Notes] |
| IsDeleted | bool | soft delete |
| CreatedAt | DateTime | UTC |
| UpdatedAt | DateTime | UTC |

**Relationships:**
- [e.g. Has many Orders]
- [e.g. Belongs to Category]

**Indexes:**
- IsDeleted (all list queries)
- [other indexed columns]

**Auto-number:** [e.g. CUST-YYMM-NNNN or N/A]

---

## Migration History
| Migration | Date | What Changed |
|---|---|---|
| InitialCreate | [date] | Initial schema |

## Standard Query Patterns

### Soft Delete Query
```csharp
// List
.Where(x => !x.IsDeleted)

// Single item
.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)

// Soft delete
entity.IsDeleted = true;
entity.UpdatedAt = DateTime.UtcNow;

// Restore (no IsDeleted filter — need to find the deleted record)
var entity = await _context.Set<T>().FirstOrDefaultAsync(x => x.Id == id);
entity.IsDeleted = false;
entity.UpdatedAt = DateTime.UtcNow;
```

### Dropdown Query
```csharp
.Where(x => !x.IsDeleted &&
       (string.IsNullOrEmpty(keyword) ||
        x.Name.ToLower().Contains(keyword.ToLower())))
.OrderBy(x => x.Name)
.Take(Math.Min(pageSize, 50))
.Select(x => new DropdownItem { Id = x.Id, Label = x.Name })
```

### Pagination
```csharp
var totalCount = await query.CountAsync(ct);
var data = await query
    .Skip((filter.PageNumber - 1) * Math.Min(filter.PageSize, 100))
    .Take(Math.Min(filter.PageSize, 100))
    .ToListAsync(ct);
```
