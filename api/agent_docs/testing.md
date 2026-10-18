# Testing — [PROJECT_NAME] API

## Policy

- `dotnet build` is mandatory after every change — fix all errors before reporting done.
- Run existing tests (`dotnet test`) before and after the change; never leave them failing.
- Write **new** tests only when the user explicitly asks.
- Tests must not depend on a running database unless they are integration tests.

## Stack (when tests are requested)

- xUnit in `tests/[PROJECT_NAME].Tests/`
- Optional helpers, add only when needed:
  - `FluentAssertions` — readable assertions
  - `NSubstitute` or `Moq` — mocking repositories/services
  - `Microsoft.AspNetCore.Mvc.Testing` — API integration tests
  - `Testcontainers.PostgreSql` — real PostgreSQL integration tests

## Layout

```
tests/[PROJECT_NAME].Tests/
├── Domain/          ← entity and value-object rules
├── Application/     ← handler tests with mocked repositories
└── API/             ← endpoint tests via WebApplicationFactory
```

## Naming

`[Method]_[Scenario]_[ExpectedResult]`

```csharp
[Fact]
public async Task DeleteCustomer_WhenNotFound_ThrowsNotFoundException() { }
```

## What to cover (when asked)

- Business rules in handlers (validation, conflicts, state transitions)
- Soft delete: record kept, `IsDeleted = true`, `UpdatedAt` set
- Restore: works without the `IsDeleted` filter
- Pagination: `PageSize` capped at 100, response shape correct
- Dropdown: filters deleted rows, caps page size
- Auth: 401 unauthenticated, 403 missing permission
- Endpoint status codes per `api-contracts.md`

## Run

```bash
cd api && dotnet test
```
