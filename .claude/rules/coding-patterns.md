# Coding Patterns & Workflow Rules

## Git Workflow
- Always work on a branch: `git checkout -b feat/description`
- Commit message prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Never commit directly to `main` or `master`
- Never commit `.env` — only `.env.example`
- Commit the `.claude/` folder — the whole team benefits from shared standards

## Response Style
- Show PLAN first — wait for "go" before writing any code
- Working code over long explanation
- Flag trade-offs when multiple valid approaches exist
- Ask when unclear — never assume and get it wrong

## Anti-Patterns (Never Do These)
| Anti-Pattern | Rule |
|---|---|
| Hard delete | ❌ Always soft delete |
| List without pagination | ❌ Always paginate |
| Hardcoded secrets | ❌ Always use .env |
| Business logic in controllers | ❌ Keep controllers thin |
| Domain entities at API boundary | ❌ Always use DTOs |
| Non-searchable dropdown for master data | ❌ Always async searchable |
| Loading entire master table into dropdown | ❌ Always paginated keyword search |
| Skipped error handling | ❌ Always handle and surface errors |
| No loading/empty/error states in UI | ❌ Always all three states |
| Magic hex color codes in components | ❌ Always Tailwind semantic tokens |
| `.Result` or `.Wait()` on async code | ❌ Always await properly |
| `@ts-ignore` or `any` in TypeScript | ❌ Always strict types |
