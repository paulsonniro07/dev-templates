# State Management — [PROJECT_NAME] Frontend

## Auth State (AuthContext)

```typescript
// contexts/AuthContext.tsx
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Lazy initializer — CRITICAL: prevents redirect race on page refresh
function initFromStorage(): AuthState {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    return { token, user: JSON.parse(user), isAuthenticated: true };
  }
  return { token: null, user: null, isAuthenticated: false };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initFromStorage); // lazy init

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Permission Hook
```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const { user } = useAuth();

  const can = useCallback((permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  }, [user]);

  return { can };
}

// Usage
const { can } = usePermissions();
{can('customers.edit') && <Button>Edit</Button>}
```

## Axios Instance (lib/api.ts)
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 403 && error.config.method !== 'get') {
      // 403 on mutations only — fire event for global toast
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default api;
```

## Route Protection
```typescript
// PermissionRoute component
function PermissionRoute({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { can } = usePermissions();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!can(permission)) return <AccessDenied />;
  return <>{children}</>;
}

// App.tsx routing
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<Layout />}>
    <Route index element={<Navigate to="/dashboard" />} />
    <Route path="customers" element={
      <PermissionRoute permission="customers.view">
        <CustomersPage />
      </PermissionRoute>
    } />
  </Route>
</Routes>
```

## Local State Rules
- Use useState for component-level UI state (loading, modal open, form values)
- Use useCallback for functions passed as props or used in useEffect deps
- Use useMemo only when computation is expensive — don't over-memoize
- Lift state up only when 2+ components need it — prefer keeping state local
- Global state: AuthContext only — don't add more global state unless clearly needed
