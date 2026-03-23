# Component Rules

## Component Structure
Every feature module lives in `src/features/[feature]/` and contains:
```
features/[feature]/
├── types.ts           ← TypeScript interfaces for this feature
├── service.ts         ← All API calls via lib/api.ts (no fetch in components)
├── [Feature]List.tsx  ← Table + search + pagination
└── [Feature]Form.tsx  ← Create/Edit modal
```

Route-level pages live in `src/pages/[Module]Page.tsx` and compose features.

## Own Component Library (src/components/ui/)
- Build and maintain your own UI component library — no external UI frameworks (no MUI, no Ant Design, no shadcn)
- Every project must have at minimum:
  - `Button.tsx` — variants: primary, secondary, danger, ghost
  - `Input.tsx` — with error state support
  - `Modal.tsx` — with backdrop + close on Escape
  - `Table.tsx` — with sortable headers
  - `Badge.tsx` — semantic variants: success, warning, error, default
  - `Spinner.tsx` — used in loading states
  - `EmptyState.tsx` — with icon + message
  - `Pagination.tsx` — prev/next + page info
  - `SearchInput.tsx` — debounced 300ms built-in
  - `Toast.tsx` — success/error/warning notifications

## TypeScript Rules
- Strict mode ON — `strict: true` in tsconfig
- No `any` — ever
- No `@ts-ignore` — ever
- Named exports only — no default exports for components
- Props interface defined above each component:
  ```typescript
  interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }
  export function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps) { ... }
  ```
- All API response shapes typed in `src/types/` or `feature/types.ts`
- Use `PaginatedList<T>`, `ApiResponse<T>`, `DropdownItem` from `src/types/common.ts`

## Tailwind Rules
- Tailwind only — no inline `style={{}}` ever
- No magic hex codes — semantic color tokens only (see `client/.claude/rules/ux-rules.md`)
- Use `clsx` or `cn()` for conditional class composition

## Axios Instance Rules (src/lib/api.ts)
- Single Axios instance shared everywhere — never create ad-hoc instances
- Attach JWT to all requests via request interceptor
- 401 response → clear auth state + redirect to `/login`
- 403 on non-GET mutations → fire `'unauthorized'` custom event → global toast
- Never fire 403 toast on GET requests (restricted users see no data, not an error popup)

## File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` prefixed with `use` (e.g. `useDebounce.ts`)
- Services / utils: `camelCase.ts`
- Types: `camelCase.ts` (e.g. `common.ts`, `auth.ts`)
