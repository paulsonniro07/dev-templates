# /review
# Usage: /review  OR  /review [file/feature]

Review: **$ARGUMENTS**

### 🏗️ Architecture
- [ ] Layer boundaries respected?
- [ ] Controller is thin (MediatR dispatch only)?
- [ ] Business logic in handler/service, not controller?
- [ ] DTOs at all boundaries — no raw entities?

### 🗑️ Soft Delete
- [ ] No hard deletes — only IsDeleted=true?
- [ ] ALL list queries filter !IsDeleted?
- [ ] GetById checks !IsDeleted?
- [ ] UpdatedAt set on delete/restore?
- [ ] Restore finds record WITHOUT IsDeleted filter?

### 📄 Pagination
- [ ] All lists use PaginationFilter?
- [ ] PageSize capped at 100 server-side?
- [ ] Response has TotalCount, PageNumber, PageSize, TotalPages?

### 🔽 Searchable Dropdowns
- [ ] Dropdown endpoint exists for this master table?
- [ ] Returns only { id, label } — not full entity?
- [ ] IsDeleted=false on backend?
- [ ] pageSize capped at 50?

### 🔐 Security
- [ ] No hardcoded secrets?
- [ ] New env vars added to .env.example?
- [ ] Authorization attributes on protected endpoints?
- [ ] Inputs validated?

### ⚙️ Code Quality
- [ ] All async awaited? No .Result/.Wait()?
- [ ] Exceptions handled — not swallowed?
- [ ] No null reference risks?
- [ ] Related names embedded in DTO (cross-permission pattern)?

### 🐳 Docker / Config
- [ ] .env.example updated for new env vars?
- [ ] docker-compose.yml updated for new services?

---
Output per category: ✅ Pass / ⚠️ Minor / ❌ Fix
List issues with file reference.
Overall: ✅ Ready / ⚠️ Fix minor / ❌ Needs rework
