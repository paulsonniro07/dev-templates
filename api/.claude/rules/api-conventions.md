# API Conventions

## REST Endpoint Pattern
Every resource follows this exact URL structure:
```
GET    /api/[resource]               → paged list (PaginationFilter)
GET    /api/[resource]/{id}          → single item
GET    /api/[resource]/dropdown      → [{ id, label }] for searchable dropdowns
POST   /api/[resource]               → create
PUT    /api/[resource]/{id}          → full update
DELETE /api/[resource]/{id}          → soft delete (IsDeleted=true)
PUT    /api/[resource]/{id}/restore  → restore (IsDeleted=false)
POST   /api/auth/login               → { token, user }
GET    /api/auth/me                  → current user profile
```

## HTTP Status Codes
| Scenario | Code |
|---|---|
| Success (with body) | 200 OK |
| Created | 201 Created |
| Success (no body) | 204 No Content |
| Validation failure | 400 Bad Request |
| Unauthenticated | 401 Unauthorized |
| Forbidden | 403 Forbidden |
| Not found | 404 Not Found |
| Conflict (duplicate) | 409 Conflict |
| Server error | 500 Internal Server Error |

## Response Shapes

### Single item
```json
{ "data": { ... }, "message": "Success" }
```

### Paged list
```json
{
  "data": [...],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### Dropdown
```json
[{ "id": "guid", "label": "Display Name" }]
```

### Error
```json
{ "message": "Descriptive error message", "errors": { "field": ["error"] } }
```

## Dropdown Endpoint Rules
- Route: `GET /api/[resource]/dropdown?keyword=&pageSize=20`
- Always filter `IsDeleted=false` server-side
- Cap `pageSize` at 50
- Return only `{ id, label }` — never full entity
- Register route BEFORE `/{id}` route to avoid routing conflicts

## RBAC Permission Naming
- Format: `module.action` (lowercase, dot-separated)
- Examples: `customers.view`, `customers.edit`, `invoices.approve`, `reports.export`
- `PermissionSeeder` seeds on startup — skips permissions that already exist
- Assign to roles, not users directly
- Controllers use `[Authorize(Policy = "Permission")]` + check specific permission
