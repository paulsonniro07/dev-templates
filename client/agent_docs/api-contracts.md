# API Contracts — [PROJECT_NAME] Frontend
# Keep in sync with backend agent_docs/api-contracts.md

## Base URL
- Dev:  VITE_API_BASE_URL or NEXT_PUBLIC_API_BASE_URL in .env
- Prod: set in deployment environment

## Auth
```
POST /api/auth/login  → { token, user: { id, email, fullName, role, permissions[] } }
GET  /api/auth/me     → current user
```
All protected endpoints require: Authorization: Bearer {token}

## Standard TypeScript Types
```typescript
// types/common.ts
export interface PaginatedList<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = void> {
  data?: T;
  message?: string;
}

export interface DropdownItem {
  id: string;
  label: string;
}

export interface PaginationFilter {
  pageNumber?: number;
  pageSize?: number;
  searchKeyword?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
```

## Endpoints Per Module
<!-- Mirror from backend api-contracts.md -->
<!-- Update when backend changes -->

### [Module]
```
GET    /api/[module]              → PaginatedList<[Module]Dto>
GET    /api/[module]/{id}         → [Module]Dto
GET    /api/[module]/dropdown     → DropdownItem[]
POST   /api/[module]              → [Module]Dto
PUT    /api/[module]/{id}         → [Module]Dto
DELETE /api/[module]/{id}         → 204
PUT    /api/[module]/{id}/restore → 204
```

## Error Handling
```typescript
// Axios interceptor handles:
401 → clear auth + redirect to /login
403 (non-GET) → fire 'unauthorized' event → global toast
404 → show not found state in component
400 → extract field errors → show inline validation
500 → show generic error toast

// Field error extraction
function extractErrors(err: unknown): Record<string, string> {
  const data = (err as AxiosError)?.response?.data as any;
  if (data?.errors) {
    return Object.fromEntries(
      Object.entries(data.errors).map(([k, v]) => [k, (v as string[])[0]])
    );
  }
  return {};
}
```
