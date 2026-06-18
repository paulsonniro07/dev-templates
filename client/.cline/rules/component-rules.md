# Component Rules — [PROJECT_NAME] Client

## Own Component Library (src/components/ui/)
Use ONLY these — no external library:
- Button (variants: primary, secondary, danger, ghost)
- Badge (variants: success, error, warning, info, default)
- Input (with error prop for inline validation)
- Spinner (sizes: sm, md, lg)
- EmptyState (message, description, optional action)
- Pagination (currentPage, totalPages, onPageChange)
- SearchInput (debounced, with clear button)
- Modal (focus trap, escape to close, click outside to close)
- AsyncSelect (searchable dropdown via API)
- TableSkeleton (rows, cols props)

## Feature Folder Structure
```
features/[feature]/
├── types.ts         ← [Feature]Dto, Create/Update Dto, [Feature]Filter
├── service.ts       ← getAll, getById, dropdown, create, update, delete, restore
├── [Feature]List.tsx ← table with search, pagination, skeleton, empty state
└── [Feature]Form.tsx ← modal form, create + edit modes
```

## List Component Requirements
- Search input debounced 300ms
- Loading skeleton while fetching (TableSkeleton)
- Empty state when 0 results (EmptyState)
- Error toast on API failure
- Permission-guarded action buttons using can()
- Pagination component below table
- Opens form modal on add/edit

## Form Component Requirements
- Single component handles create + edit (isEdit = !!id)
- Controlled inputs with TypeScript types
- Inline error below each field (errors.fieldName)
- Async searchable dropdown for any master table FK fields
- Submit button disabled + shows spinner while saving
- Success toast + modal close on save
- Error toast + inline errors from API on failure

## Service Pattern
```typescript
// features/[feature]/service.ts
export const customerService = {
  getAll: (filter: CustomerFilter) =>
    api.get<PaginatedList<CustomerDto>>('/customers', { params: filter }).then(r => r.data),
  getById: (id: string) =>
    api.get<CustomerDto>(`/customers/${id}`).then(r => r.data),
  dropdown: (keyword: string): Promise<DropdownItem[]> =>
    api.get('/customers/dropdown', { params: { keyword, pageSize: 20 } }).then(r => r.data),
  create: (data: CreateCustomerDto) =>
    api.post('/customers', data).then(r => r.data),
  update: (id: string, data: UpdateCustomerDto) =>
    api.put(`/customers/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete(`/customers/${id}`),
  restore: (id: string) =>
    api.put(`/customers/${id}/restore`),
};
```

## New Module Checklist
1. features/[module]/types.ts — Dto, Filter, Create/Update types
2. features/[module]/service.ts — all 7 methods
3. features/[module]/[Module]List.tsx — full list with UX requirements
4. features/[module]/[Module]Form.tsx — modal form create+edit
5. pages/[Module]Page.tsx — renders list
6. Add route in App.tsx inside PermissionRoute
7. Run npm run build + npx tsc --noEmit — fix all errors
