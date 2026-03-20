# [PROJECT_NAME] — Frontend (React + Vite)
# React 18 + TypeScript + Tailwind CSS
# Location: client/.claude/CLAUDE.md

## Project Overview
[2-3 lines: what this frontend does, who uses it]
Type: [Internal admin / Public-facing / Mixed] ← pick one

## Tech Stack
- Framework: React 18 + TypeScript strict
- Build: Vite
- Styling: Tailwind CSS
- UI: Own component library (src/components/ui/)
- HTTP: Axios with JWT interceptor
- Routing: React Router v6
- State: React Context (auth) + local state

## Project Structure (LMSApp proven pattern)
```
client/src/
├── components/
│   ├── ui/                   ← Own component library (no external deps)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchInput.tsx
│   │   └── Toast.tsx
│   ├── Layout.tsx             ← Sidebar + header
│   └── PermissionGuard.tsx
├── contexts/
│   └── AuthContext.tsx        ← JWT auth, initFromStorage() lazy init
├── features/                  ← One folder per module
│   └── [feature]/
│       ├── types.ts           ← TypeScript interfaces
│       ├── service.ts         ← API calls via lib/api.ts
│       ├── [Feature]List.tsx  ← Table + search + pagination
│       └── [Feature]Form.tsx  ← Create/Edit modal
├── hooks/
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── usePermissions.ts      ← can('module.action') helper
├── lib/
│   ├── api.ts                 ← Axios instance + interceptors
│   └── utils.ts
├── pages/                     ← Route-level components
│   └── [Module]Page.tsx
├── types/
│   ├── common.ts              ← PaginatedList<T>, ApiResponse<T>, DropdownItem
│   └── auth.ts
└── App.tsx                    ← Routes + PermissionRoute
```

## Commands
- Dev:        npm run dev
- Build:      npm run build
- Type check: npx tsc --noEmit
- Lint:       npm run lint

## Auth Pattern (LMSApp proven — prevents refresh race)
```typescript
// Lazy initializer — CRITICAL: prevents redirect race on page refresh
const [auth, setAuth] = useState<AuthState>(() => initFromStorage());
```

## Permission Pattern
```typescript
const { can } = usePermissions();
{can('customers.edit') && <Button onClick={edit}>Edit</Button>}
```

## Axios Instance Rules
- Attach JWT to all requests via interceptor
- 401 → clear auth + redirect to /login
- 403 on non-GET mutations → fire 'unauthorized' event → global toast
- Never call 403 toast on GET requests (restricted users see no data, not error)

## UX Rules (every component)
- Lists: loading skeleton + empty state + error toast
- Forms: inline validation + disabled submit while loading + success/error toast
- Search: debounced 300ms — never search on every keystroke
- Responsive: works at 375px, 768px, 1280px

## Color Tokens (Tailwind — no magic hex codes)
```
Success  → bg-green-100  text-green-800
Error    → bg-red-100    text-red-800
Warning  → bg-yellow-100 text-yellow-800
Info     → bg-blue-100   text-blue-800
Default  → bg-gray-100   text-gray-700
```

## Status Badge Mapping
```
Active/Approved/Completed → variant="success"
Pending/Draft             → variant="warning"
Cancelled/Voided/Rejected → variant="error"
Inactive/Transferred      → variant="default"
```

## TypeScript Rules
- Strict mode ON — no any, no @ts-ignore
- Named exports (no default exports for components)
- Props interface above each component
- All API response shapes typed in types/ or feature/types.ts

## .env.example
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Reference Docs
@agent_docs/component-patterns.md  — Read when building any UI component
@agent_docs/ux-ui-guide.md         — Read when adding states, colors, or layouts
@agent_docs/state-management.md    — Read when handling auth or global state
@agent_docs/api-contracts.md       — Read when calling backend endpoints

## IMPORTANT
- Run npm run build to catch type errors before finishing any feature
- No inline styles — Tailwind only
- No magic hex codes — semantic color tokens only
- Never commit .env — only .env.example
