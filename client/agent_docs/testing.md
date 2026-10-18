# Testing — [PROJECT_NAME] Client

## Policy

- `npm run build` and `npx tsc --noEmit` are mandatory after every change — fix all errors.
- Run existing tests (`npm run test`) before and after the change; never leave them failing.
- Write **new** tests only when the user explicitly asks.

## Stack (when tests are requested)

- Vitest + React Testing Library + `@testing-library/jest-dom`
- `jsdom` environment
- Add the dependencies and a `test` script only when the user asks for tests.

## Layout

Co-locate tests next to the code:

```
src/features/customers/
├── service.ts
├── service.test.ts
├── CustomerForm.tsx
└── CustomerForm.test.tsx
```

## What to cover (when asked)

- Services: correct URL, params, and response typing
- `usePermissions`: returns `can()` correctly for allowed/denied permissions
- Forms: required-field validation, disabled submit while saving, API error mapping to fields
- Lists: loading skeleton, empty state, error toast
- Search input: debounce behavior (fake timers)

## Rules

- Test behavior, not implementation details.
- Query by role/label — avoid brittle CSS selectors.
- Mock the Axios instance (`lib/api.ts`), not real network calls.

## Run

```bash
cd client && npm run test
```
