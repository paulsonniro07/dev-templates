# UX Rules

## Required States — Every List / Table
Every component that fetches a list MUST handle all three states:
1. **Loading** — skeleton rows or spinner (not blank screen)
2. **Empty** — `<EmptyState>` with a helpful message (not just blank space)
3. **Error** — toast notification with a retry option if possible

## Required States — Every Form
Every form that submits data MUST:
1. **Inline validation** — show field errors beneath each field, not just on submit
2. **Disabled submit** — button disabled while request is in-flight (prevent double-submit)
3. **Success toast** — confirm save succeeded
4. **Error toast** — surface failure with a meaningful message (not just "Something went wrong")

## Async Action Feedback
Every async action (button click, file upload, status change) MUST:
- Show a loading indicator immediately on trigger
- Show a result (success or error toast) on completion
- Never leave the user in silence after an action

## Search Inputs
- Debounce: 300ms minimum on all search inputs
- Never trigger API call on every keystroke
- Show loading state while search results are fetching
- Use `useDebounce` hook from `src/hooks/useDebounce.ts`

## Responsive Breakpoints
- Design mobile-first — start at 375px
- Test and fix at:
  - 375px — mobile
  - 768px — tablet
  - 1280px — desktop

## Color Token System (Tailwind only — no hex codes)
```
Success  → bg-green-100  text-green-800   border-green-200
Error    → bg-red-100    text-red-800     border-red-200
Warning  → bg-yellow-100 text-yellow-800  border-yellow-200
Info     → bg-blue-100   text-blue-800    border-blue-200
Default  → bg-gray-100   text-gray-700    border-gray-200
```

## Status Badge Mapping
Map entity status values to Badge variants consistently:
```
Active / Approved / Completed / Paid → variant="success"
Pending / Draft / Processing         → variant="warning"
Cancelled / Voided / Rejected / Failed → variant="error"
Inactive / Transferred / Archived    → variant="default"
```

## Permission-Gated UI
- Use `usePermissions()` hook + `can('module.action')` for conditional rendering
- Never show disabled buttons for actions the user cannot perform — hide them
- Show empty state instead of access error for read-restricted views
- `403` toast fires ONLY on non-GET mutations (not on page load or data fetch)

## Auth Context Pattern
```typescript
// CRITICAL: lazy initializer prevents redirect race on page refresh
const [auth, setAuth] = useState<AuthState>(() => initFromStorage());
```
Do not change this pattern — it was proven to fix a redirect race condition.
