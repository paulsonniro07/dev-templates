# UX Rules — [PROJECT_NAME] Client

## Color System (Tailwind tokens only — no hex codes)

### Semantic Colors
```
Success  → bg-green-100  text-green-800
Error    → bg-red-100    text-red-800
Warning  → bg-yellow-100 text-yellow-800
Info     → bg-blue-100   text-blue-800
```

### Status Badge Mapping (consistent across all modules)
```
Active / Approved / Completed → Badge variant="success"
Pending / Draft               → Badge variant="warning"
Cancelled / Voided / Rejected → Badge variant="error"
Inactive / Transferred        → Badge variant="default"
```

### Brand Colors
```
Primary action → blue-600  (buttons, links, focus rings)
Danger action  → red-600   (delete, destructive)
Text primary   → gray-900
Text secondary → gray-500
Border         → gray-200
Background     → gray-50 / white
```

## Typography Scale
```
Page title    → text-xl font-semibold text-gray-900
Section title → text-lg font-medium text-gray-800
Table header  → text-sm font-medium text-gray-500
Body text     → text-sm text-gray-700
Muted/label   → text-xs text-gray-500
```

## Loading States (required on every async operation)
- Table/List → TableSkeleton rows while fetching
- Button → loading prop shows Spinner + disabled
- Page → centered Spinner size="lg"

## Empty States (required when list returns 0 items)
- EmptyState with message, optional description and action button

## Toast Notifications
```
Success → toast.success('Customer created successfully')
Error   → toast.error('Failed to load customers')
403     → handled globally in api.ts interceptor — not per-request
```

## Form Rules
- Labels always visible (no placeholder-only labels)
- Required fields marked with * in label
- Inline error below field: <p className="text-sm text-red-600 mt-1">{errors.name}</p>
- Submit disabled while saving
- Confirm dialog before delete actions

## Search Rules
- Debounce 300ms — never search on every keystroke
- Search resets to page 1
- Clear button (×) visible when search has value

## Auth / Permission Guards
```typescript
// Route level
<PermissionRoute permission="customers.view">
  <CustomersPage />
</PermissionRoute>

// Button level
{can('customers.create') && <Button onClick={onCreate}>Add</Button>}
{can('customers.edit') && <Button variant="ghost">Edit</Button>}
{can('customers.delete') && <Button variant="danger">Delete</Button>}
```

## Axios Interceptor Behavior (lib/api.ts)
- 401 → clear localStorage + redirect /login (token expired)
- 403 on non-GET → fire global 'unauthorized' event → toast
- 403 on GET → silently ignore (user just won't see the data)
- 400 → extract field errors → show inline per field
- 500 → generic error toast
