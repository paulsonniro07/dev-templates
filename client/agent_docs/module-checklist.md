# New Client Module Checklist — [PROJECT_NAME]

Use when asked to add a new module (for example `Customer`).
Follow the order exactly. Do not invent file names or skip steps.

## 1. Types — `src/features/[module]/types.ts`

- `[Module]Dto` — mirrors the API response, including embedded related names.
- `Create[Module]Dto`, `Update[Module]Dto`.
- `[Module]Filter` — extends `PaginationFilter`, adds module-specific filters.

## 2. Service — `src/features/[module]/service.ts`

Exactly these methods:

- `getAll(filter)` → `PaginatedList<[Module]Dto>`
- `getById(id)`
- `dropdown(keyword)` → `DropdownItem[]`
- `create(data)`
- `update(id, data)`
- `delete(id)`
- `restore(id)`

## 3. List — `src/features/[module]/[Module]List.tsx`

- Debounced search (300 ms), resets to page 1.
- `TableSkeleton` while loading.
- `EmptyState` when there are no results.
- Error toast on failure.
- `Badge` for status fields.
- Permission-guarded action buttons using `can('[module].edit' / '[module].delete')`.
- `Pagination` below the table.
- Opens the form modal for create/edit.

## 4. Form — `src/features/[module]/[Module]Form.tsx`

- One component for create + edit (`isEdit = !!id`).
- Controlled inputs with typed state.
- Inline errors below each field (`errors.fieldName`).
- `AsyncSelect` for every master-table foreign key — never preload.
- Submit disabled + spinner while saving.
- Success toast + close + refresh on save.
- API validation errors mapped to fields.

## 5. Page — `src/pages/[Module]Page.tsx`

Renders `[Module]List`. No business logic.

## 6. Route — `src/App.tsx`

Add inside `Layout`, wrapped in `PermissionRoute`:

```tsx
<Route
  path="[module]"
  element={
    <PermissionRoute permission="[module].view">
      <[Module]Page />
    </PermissionRoute>
  }
/>
```

## 7. Docs

Update `agent_docs/api-contracts.md` if endpoints or response shapes changed.

## 8. Verify

1. `npm run build` — zero errors.
2. `npx tsc --noEmit` — zero type errors.
3. Manually check loading, empty, error, and permission-denied states.
