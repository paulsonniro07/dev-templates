# TypeScript Rules — [PROJECT_NAME] Client

## Strict Rules
- No any — ever
- No @ts-ignore — ever
- Named exports only — no default exports for components
- All API responses typed — no implicit any from axios
- Props interfaces always explicit — no inline type objects on complex props

## Common Types (types/common.ts)
```typescript
export interface PaginatedList<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
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

## Feature Types Pattern
```typescript
// features/[feature]/types.ts
export interface CustomerDto {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  categoryId: string;
}

export interface UpdateCustomerDto extends CreateCustomerDto {}

export interface CustomerFilter extends PaginationFilter {
  // module-specific filter fields
  isActive?: boolean;
}
```

## Error Extraction from API
```typescript
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

## Hooks
```typescript
// usePermissions
const { can } = usePermissions();
{can('customers.edit') && <Button>Edit</Button>}

// useDebounce
const debouncedSearch = useDebounce((keyword: string) => {
  setFilter(f => ({ ...f, searchKeyword: keyword, pageNumber: 1 }));
}, 300);
```

## Naming Conventions
| What | Convention | Example |
|---|---|---|
| Feature folder | lowercase | features/customers/ |
| Component file | PascalCase | CustomerList.tsx |
| Service file | camelCase | service.ts |
| Types file | camelCase | types.ts |
| Hook | use + PascalCase | usePermissions.ts |
| UI component | PascalCase | Button.tsx |
