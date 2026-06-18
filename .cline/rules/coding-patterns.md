# Coding Patterns — [PROJECT_NAME]

## Workflow (always follow this order)
1. Plan first — describe what will be built, wait for approval
2. Build only what was approved — no scope creep
3. Run build after every change — fix errors before continuing
4. Never commit .env or push directly to main

## Anti-Patterns (never do these)
- No .Result or .Wait() — all async/await
- No raw entity exposure at API boundary — always DTOs
- No business logic in Controllers — handlers/services only
- No hardcoded secrets, IDs, or credentials
- No AutoMapper — map explicitly in handlers
- No magic hex color codes in frontend — Tailwind tokens only
- No external UI library — own components only
- No any or @ts-ignore in TypeScript

## Response Style
- Explain what you're about to do before doing it
- Point out risks or assumptions before writing code
- Ask before running migrations (./migrate.sh)
- Fix build errors immediately — don't leave broken state

## After Every Change
- API: run dotnet build — fix all errors
- Client: run npm run build + npx tsc --noEmit — fix all type errors
