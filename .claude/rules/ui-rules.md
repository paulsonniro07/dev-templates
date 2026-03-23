# UI & Frontend Rules

## Searchable Dropdowns (Always, No Exceptions)
- EVERY dropdown loading from a master table MUST be searchable
- No plain `<select>` for master data — ever
- Backend endpoint: `GET /api/[master]/dropdown?keyword=&pageSize=20`
- Response: `[{ id, label }]` — `IsDeleted=false` filtered server-side
- Frontend: async search on input, debounced 300ms minimum
- Never preload entire master table into memory
- Static lists with fewer than 50 items may preload but STILL must be searchable

## Frontend UX Standards (Every Frontend Project)

### List / Table Components
- MUST have: loading skeleton state
- MUST have: empty state (with message, not just blank space)
- MUST have: error state (toast or inline error)

### Form Components
- MUST have: inline field validation
- MUST have: submit button disabled while request is in-flight
- MUST have: success toast on save
- MUST have: error toast on failure

### Async Actions
- MUST show loading indicator while in-flight
- MUST show result (success/error toast) on completion
- Never leave user without feedback after an action

### Responsive Design
- Mobile-first approach — design for 375px first
- Test at: 375px (mobile), 768px (tablet), 1280px (desktop)

### Color System — Semantic Tokens Only
Use Tailwind semantic classes, never magic hex codes:
```
Success  → bg-green-100  text-green-800
Error    → bg-red-100    text-red-800
Warning  → bg-yellow-100 text-yellow-800
Info     → bg-blue-100   text-blue-800
Default  → bg-gray-100   text-gray-700
```

### Status Badge Mapping
```
Active / Approved / Completed → variant="success"
Pending / Draft               → variant="warning"
Cancelled / Voided / Rejected → variant="error"
Inactive / Transferred        → variant="default"
```

### Search Inputs
- Debounce ALL search inputs: 300ms minimum
- Never trigger search on every keystroke
