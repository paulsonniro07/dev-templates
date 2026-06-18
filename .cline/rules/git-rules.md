# Git Rules — [PROJECT_NAME]

## Branch Always
- git checkout -b feat/description before any work
- Prefixes: feat:, fix:, refactor:, chore:, docs:
- Never commit directly to main

## Never Commit
- .env (secrets)
- .claude/settings.local.json
- node_modules/, bin/, obj/

## Commit Messages
- feat: add customer soft delete
- fix: pagination missing totalPages
- refactor: extract customer mapper
- chore: update .env.example
