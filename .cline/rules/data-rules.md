# Data Rules — [PROJECT_NAME]

## Soft Delete (mandatory)
- NEVER use SQL DELETE or EF Core .Remove()
- Always: entity.IsDeleted = true + entity.UpdatedAt = DateTime.UtcNow
- All list queries MUST filter: .Where(x => !x.IsDeleted)
- GetById MUST check: .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
- Restore: find WITHOUT IsDeleted filter, then set IsDeleted = false

## Pagination (mandatory on all lists)
- Every list endpoint uses PaginationFilter — no raw IEnumerable returns
- PageSize capped at 100 server-side always
- Response shape always includes: TotalCount, PageNumber, PageSize, TotalPages
- Frontend: PaginationFilter extends with module-specific filter fields

## Searchable Dropdowns
- Every master table MUST have a /dropdown endpoint
- Returns ONLY: List<DropdownItem> → { id: Guid, label: string }
- IsDeleted=false filtered on backend
- PageSize capped at 50
- Frontend: async search, debounced 300ms

## Auto-Numbering
- Pattern: PREFIX-YYMM-NNNN via NumberSequenceService
- Thread-safe, sequential within month
- Never generate number manually in handlers

## Secrets
- All secrets in .env — never hardcoded anywhere
- New env vars: add to .env AND .env.example (key only, empty value)
- Docker: add to docker-compose.yml under api.environment
