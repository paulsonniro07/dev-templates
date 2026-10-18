# [PROJECT_NAME] Client — Agent Rules

React 18 + TypeScript + Tailwind CSS + Vite.
Read `../AGENTS.md` first. This file only adds frontend-specific rules.

## What this does

[2-3 lines: what this frontend does, who uses it]

## Commands

```bash
npm run dev          # dev server
npm run build        # build (run before finishing any feature)
npx tsc --noEmit     # type check (run with build)
```

## Structure

```
src/
├── components/ui/   ← own component library (no external UI lib)
├── contexts/        ← AuthContext with initFromStorage() lazy init
├── features/        ← one folder per module
│   └── [feature]/
│       ├── types.ts
│       ├── service.ts
│       ├── [Feature]List.tsx
│       └── [Feature]Form.tsx
├── hooks/           ← useDebounce, usePermissions
├── lib/api.ts       ← Axios + JWT interceptor + 403 event
├── pages/           ← route-level components
└── types/           ← common.ts, auth.ts
```

## Component library (src/components/ui/)

Own components only — no external UI library (no shadcn, no MUI):
`Button`, `Badge`, `Input`, `Spinner`, `EmptyState`, `Pagination`, `SearchInput`, `Modal`, `AsyncSelect`, `TableSkeleton`.

## TypeScript

- Strict mode. No `any`, no `@ts-ignore`.
- Named exports only — no default exports for components.
- All API responses typed — no implicit `any` from Axios.
- Props interfaces explicit.

## UI / UX rules

- Tailwind tokens only — no inline styles, no magic hex codes.
- Semantic colors: success=green, error=red, warning=yellow, info=blue.
- Every list: loading skeleton + empty state + error toast.
- Every form: inline validation + disabled submit while loading + success/error toast.
- Search debounced 300 ms, resets to page 1, clear button when filled.
- Searchable async dropdowns for master data — never preload whole tables.
- Confirm dialog before destructive actions.
- Responsive: mobile-first (375 / 768 / 1280).

## Auth pattern

- JWT in localStorage; `initFromStorage()` lazy init prevents refresh race.
- 401 → clear auth + redirect `/login`.
- 403 on mutations only → global toast (never on GET).
- Route guard: `PermissionRoute`. Button guard: `can('resource.action')`.

## Testing

- Run `npm run build` and `npx tsc --noEmit` after every change.
- Run `npm run test` if tests exist; never leave them failing.
- New tests only on request — Vitest + React Testing Library in `src`.
- Details: `agent_docs/testing.md`.

## Scaffolding a new module

Follow `agent_docs/module-checklist.md` file-by-file. Do not improvise names or skip steps.

## Reference docs

| Read when | File |
|---|---|
| Building any component | `agent_docs/component-patterns.md` |
| Calling backend endpoints | `agent_docs/api-contracts.md` |
| Touching auth or state | `agent_docs/state-management.md` |
| Choosing colors, spacing, UX behavior | `agent_docs/ux-ui-guide.md` |
| Scaffolding a module | `agent_docs/module-checklist.md` |
| Writing or running tests | `agent_docs/testing.md` |

## Rules

- Update `agent_docs/` in the same change when contracts or patterns change.
- No unrequested dependencies.
