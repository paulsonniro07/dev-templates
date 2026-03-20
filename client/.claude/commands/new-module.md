# /new-module
# Usage: /new-module [ModuleName]
# Scaffolds complete frontend module with all UX standards

Scaffold frontend module: **$ARGUMENTS**

## Generate in this order:

### 1. Types (features/[module]/types.ts)
- [Module]Dto interface (matches backend response)
- Create[Module]Dto, Update[Module]Dto
- [Module]Filter extends PaginationFilter + module-specific fields
- isDeleted, createdAt, updatedAt always included

### 2. Service (features/[module]/service.ts)
- getAll(filter): PaginatedList<[Module]Dto>
- getById(id): [Module]Dto
- dropdown(keyword): DropdownItem[]
- create(data): void
- update(id, data): void
- delete(id): void
- restore(id): void
- All calls go through lib/api.ts instance

### 3. List Component (features/[module]/[Module]List.tsx)
- Search input (debounced 300ms)
- Table with loading skeleton + empty state
- Status badges using Badge component (semantic variants)
- Permission-guarded action buttons (edit, delete)
- Pagination component
- Opens [Module]Form modal

### 4. Form Component (features/[module]/[Module]Form.tsx)
- Create + Edit modes (isEdit = !!id)
- Controlled inputs with TypeScript types
- Inline validation errors below each field
- Async searchable dropdown for any master table fields
- Loading state on submit button
- Success toast + close on save
- Error toast + inline errors on failure

### 5. Page (pages/[Module]Page.tsx)
- Renders [Module]List
- Page title + optional breadcrumb

### 6. Route
- Add to App.tsx inside PermissionRoute

## After scaffolding
- Run npm run build — fix type errors
- Run npx tsc --noEmit
