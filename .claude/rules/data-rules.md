# Data Rules

## Soft Delete (Always, No Exceptions)
- NEVER hard delete records from the database
- Every entity MUST have:
  - `IsDeleted: bool` — default false
  - `CreatedAt: DateTime` UTC — set on insert
  - `UpdatedAt: DateTime` UTC — updated on every change
- ALL list queries filter: `WHERE IsDeleted = false`
- ALL single-item queries also check: `AND IsDeleted = false`
- Delete = set `IsDeleted = true`, update `UpdatedAt` — NEVER `.Remove()`
- Restore = set `IsDeleted = false` (always support restore)
  - Restore must find the record WITHOUT the IsDeleted filter first
- Hard delete FORBIDDEN unless explicitly requested with the words "hard delete this"

## Pagination (Always, No Exceptions)
- Every list endpoint uses `PaginationFilter` — no raw lists ever
- Base `PaginationFilter` fields:
  - `PageNumber` (default 1)
  - `PageSize` (default 10, max 100 enforced server-side)
  - `SearchKeyword` (nullable)
  - `SortBy` (nullable)
  - `SortDirection` (asc/desc, default asc)
- Each module EXTENDS `PaginationFilter` with its own extra filter fields
- Every paginated response shape:
  ```json
  { "data": [], "totalCount": 0, "pageNumber": 1, "pageSize": 10, "totalPages": 0 }
  ```
- PageSize cap: enforce max 100 server-side, never trust client value
