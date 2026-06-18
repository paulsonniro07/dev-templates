# Architecture Rules — [PROJECT_NAME]

## Project Structure
```
[PROJECT_NAME]/
├── api/        ← ASP.NET Core API (Clean Architecture)
├── client/     ← React 18 + TypeScript frontend
├── .clinerules ← Cline reads this automatically
└── .cline/     ← Detailed rules (referenced from .clinerules)
```

## Clean Architecture Layers (API)
```
Domain         → Zero dependencies. Entities, Enums, BaseEntity.
Application    → Depends on Domain only. CQRS handlers, DTOs, IRepository.
Infrastructure → Depends on Application + Domain. EF Core, Repositories.
API            → Depends on Application only. Controllers, Middleware.
```

## Layer Boundaries (never break)
- Controllers call Application only — never Infrastructure directly
- Business logic in handlers/services — never in Controllers
- DTOs at all API boundaries — never expose raw Domain entities
- Domain has NO references to any other layer

## Entity Standard (BaseEntity)
Every entity must extend BaseEntity:
- Id (Guid, NewGuid())
- IsDeleted (bool, default false)
- CreatedAt (DateTime UTC)
- UpdatedAt (DateTime UTC)
- CreatedBy (string?)
- UpdatedBy (string?)

## Frontend Structure
```
src/
├── components/ui/   ← own component library (no external UI lib)
├── contexts/        ← AuthContext with initFromStorage() lazy init
├── features/        ← one folder per module
│   └── [feature]/
│       ├── types.ts
│       ├── service.ts
│       ├── [F]List.tsx
│       └── [F]Form.tsx
├── hooks/           ← useDebounce, usePermissions
├── lib/api.ts       ← Axios + JWT interceptor
├── pages/           ← route-level components
└── types/           ← common.ts, auth.ts
```
