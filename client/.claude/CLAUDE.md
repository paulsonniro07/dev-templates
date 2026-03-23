# [PROJECT_NAME] — Frontend (React + Vite)
# React 18 + TypeScript strict + Tailwind CSS
# Location: client/.claude/CLAUDE.md

## Project Overview
[2-3 lines: what this frontend does, who uses it]
Type: [Internal admin / Public-facing / Mixed] ← pick one, delete others

## Tech Stack
- Framework: React 18 + TypeScript strict
- Build: Vite
- Styling: Tailwind CSS (semantic tokens only — no hex codes)
- UI: Own component library (`src/components/ui/`)
- HTTP: Axios with JWT interceptor (`src/lib/api.ts`)
- Routing: React Router v6
- State: React Context (auth) + local state

## Detailed Rules
All frontend-specific standards are in `client/.claude/rules/`:
- `rules/component-rules.md` — Component structure, TypeScript, own UI lib, Axios, Tailwind
- `rules/ux-rules.md`        — Loading/empty/error states, forms, search, responsive, colors

Global standards (searchable dropdowns, UX basics, anti-patterns):
→ see `~/.claude/CLAUDE.md` or root `.claude/rules/`

## Commands
```bash
npm run dev          # local dev server
npm run build        # production build
npx tsc --noEmit     # type check only
npm run lint         # lint
```

## Project Structure
```
client/src/
├── components/ui/    ← Own component library (Button, Input, Modal, Table, etc.)
├── contexts/         ← AuthContext (lazy initFromStorage)
├── features/         ← One folder per module (types, service, List, Form)
├── hooks/            ← useDebounce, usePagination, usePermissions
├── lib/              ← api.ts (Axios), utils.ts
├── pages/            ← Route-level components
├── types/            ← common.ts, auth.ts
└── App.tsx           ← Routes + PermissionRoute
```

## Reference Docs (agent_docs/)
@agent_docs/component-patterns.md  — Building UI components
@agent_docs/ux-ui-guide.md         — States, colors, layouts
@agent_docs/state-management.md    — Auth and global state
@agent_docs/api-contracts.md       — Backend endpoint shapes

## Key Reminders
- Run `npm run build` to catch type errors before finishing any feature
- No inline styles — Tailwind only
- No `any`, no `@ts-ignore` — TypeScript strict
- Never commit `.env` — only `.env.example`
