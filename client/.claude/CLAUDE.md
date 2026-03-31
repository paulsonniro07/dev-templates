# [PROJECT_NAME] Client
# React 18 + TypeScript + Tailwind CSS + Vite

## What this does
[2-3 lines: what this frontend does, who uses it]

## Structure
src/
├── components/ui/     ← own component library (no external UI lib)
├── contexts/          ← AuthContext with initFromStorage() lazy init
├── features/          ← one folder per module
│   └── [feature]/
│       ├── types.ts
│       ├── service.ts
│       ├── [F]List.tsx
│       └── [F]Form.tsx
├── hooks/             ← useDebounce, usePermissions
├── lib/api.ts         ← Axios + JWT interceptor + 403 event
├── pages/             ← route-level components
└── types/             ← common.ts, auth.ts

## Auth Pattern
- JWT in localStorage, initFromStorage() lazy init prevents refresh race
- 401 → clear auth + redirect /login
- 403 on mutations only → global toast (never on GET)

## UI Rules
- Tailwind only — no inline styles, no magic hex codes
- Own components only — no external UI library
- Every list: loading skeleton + empty state + error toast
- Every form: inline validation + disabled submit while loading + toast
- Search debounced 300ms
- Semantic colors: success=green, error=red, warning=yellow, info=blue

## Commands
- Dev:        npm run dev
- Build:      npm run build
- Type check: npx tsc --noEmit

## Reference Docs
@agent_docs/component-patterns.md — read when building any component
@agent_docs/api-contracts.md      — read when calling backend endpoints

## Rules
- Run npm run build before finishing any feature
- No any, no @ts-ignore — TypeScript strict always
- Named exports only — no default exports for components
