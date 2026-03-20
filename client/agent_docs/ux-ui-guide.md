# UX/UI Guide — [PROJECT_NAME]
# Standards Claude follows for all UI decisions

## Color System (Tailwind tokens — no magic hex codes)

### Semantic Colors
```
Success  → bg-green-100  text-green-800   border-green-200
Error    → bg-red-100    text-red-800     border-red-200
Warning  → bg-yellow-100 text-yellow-800  border-yellow-200
Info     → bg-blue-100   text-blue-800    border-blue-200
```

### Status Badge Colors (consistent across all modules)
```
Active / Approved / Completed → Badge variant="success"
Pending / Draft               → Badge variant="warning"
Cancelled / Voided / Rejected → Badge variant="error"
Inactive / Transferred        → Badge variant="default"
```

### Role Badge Colors (if RBAC)
```
Admin       → bg-violet-100  text-violet-800
Coordinator → bg-blue-100    text-blue-800
Instructor  → bg-teal-100    text-teal-800
Student     → bg-green-100   text-green-800
```

### Brand / UI Colors
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
Page title     → text-xl font-semibold text-gray-900
Section title  → text-lg font-medium text-gray-800
Table header   → text-sm font-medium text-gray-500 uppercase tracking-wider
Body text      → text-sm text-gray-700
Muted / label  → text-xs text-gray-500
```

## Spacing & Layout
```
Page padding      → p-6 (desktop) p-4 (mobile)
Card padding      → p-4 or p-6
Section gap       → space-y-6
Form field gap    → space-y-4
Button group gap  → gap-2
Table cell pad    → px-4 py-3
```

## Loading States (required on every async operation)

### Table/List Loading — Skeleton rows
```tsx
function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-10 bg-gray-100 rounded animate-pulse flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Button Loading — Spinner + disabled
```tsx
<Button loading={saving}>Save</Button>
// → shows spinner, disabled while saving
```

### Page Loading — Centered spinner
```tsx
{loading && (
  <div className="flex justify-center py-12">
    <Spinner size="lg" />
  </div>
)}
```

## Empty States (required when list returns zero items)
```tsx
<EmptyState
  message="No customers found"
  description="Try adjusting your search or filters"
  action={can('customers.create') ? (
    <Button onClick={onCreate}>Add First Customer</Button>
  ) : undefined}
/>
```

## Error States & Toast Notifications
```tsx
// Success
toast.success('Customer created successfully');

// Error (API failure)
toast.error('Failed to create customer. Please try again.');

// Validation error (show inline, not toast)
<p className="text-sm text-red-600 mt-1">{errors.name}</p>

// 403 Unauthorized mutation (fires once via event — not per-request)
// Handled globally in api.ts — "You don't have permission to perform this action"
```

## Responsive Breakpoints
```
Mobile first: 375px  → default styles
Tablet:       768px  → sm: prefix
Desktop:      1280px → lg: prefix

Sidebar: hidden on mobile (hamburger), visible on lg+
Table: horizontal scroll on mobile (overflow-x-auto)
Modal: full screen on mobile, max-w-md centered on desktop
Grid: 1 col mobile → 2 col tablet → 3-4 col desktop
```

## Form UX Rules
- Labels always visible (no placeholder-only labels)
- Required fields marked with * in label
- Inline error below field (not summary at top)
- Submit button disabled while loading
- Success toast + modal close on save
- Cancel button always present
- Confirm dialog before destructive actions (delete)

## Table UX Rules
- Sticky header on scroll for long tables
- Hover row highlight (hover:bg-gray-50)
- Action buttons right-aligned in last column
- Sortable columns show sort indicator
- Pagination below table, shows "Showing X-Y of Z"
- Row count selector (10 / 25 / 50 per page)

## Search UX Rules
- Debounce 300ms — never search on every keystroke
- Clear button (×) when search has value
- Search resets to page 1
- "Searching..." indicator while debounce pending

## Modal UX Rules
- Click outside to close (unless form has unsaved changes)
- Escape key to close
- Focus trap inside modal
- Scroll inside modal if content is long
- Max height 90vh with internal scroll
