# New API Module Checklist — [PROJECT_NAME]

Use when asked to add a new module (for example `Customer`).
Follow the order exactly. Do not invent file names or skip steps.

## 1. Entity — `Domain/Entities/[Module].cs`

- Extends `BaseEntity`.
- Public properties with nullability matching the schema.
- Navigation properties for relationships.
- No data annotations for persistence rules — configure in Infrastructure.

## 2. DTOs — `Application/DTOs/[Module]/`

- `[Module]Dto.cs` — response shape, embeds related names (cross-permission pattern).
- `Create[Module]Dto.cs`
- `Update[Module]Dto.cs`
- `[Module]Filter.cs` — extends `PaginationFilter`, adds module-specific filters.

Map explicitly in handlers. No AutoMapper.

## 3. Queries — `Application/Features/[Module]/Queries/`

- `Get[Module]sQuery.cs` + `Get[Module]sHandler.cs` — paged list.
- `Get[Module]ByIdQuery.cs` + handler — filters `!IsDeleted`.
- `Get[Module]DropdownQuery.cs` + handler — returns `{ id, label }`, `IsDeleted = false`, page size max 50.

## 4. Commands — `Application/Features/[Module]/Commands/`

- `Create[Module]Command.cs` + handler — validates, creates.
- `Update[Module]Command.cs` + handler — validates, updates.
- `Delete[Module]Command.cs` + handler — soft delete (`IsDeleted = true`, `UpdatedAt`).
- `Restore[Module]Command.cs` + handler — finds without `!IsDeleted`, restores.

## 5. Repository — `Infrastructure/Persistence/Repositories/`

- Add `I[Module]Repository` + implementation only when custom queries are needed.
- Otherwise reuse `IGenericRepository<[Module]>`.
- Override `GetPagedAsync` only for deep includes.

## 6. Configuration — `Infrastructure/Persistence/Configurations/[Module]Configuration.cs`

- Table name, keys, indexes (always include `IsDeleted` for list queries).
- Relationship configuration.
- Apply via the existing `DbContext`.

## 7. Controller — `API/Controllers/[Module]sController.cs`

Thin dispatcher only — one action per endpoint:

```
GET    /api/[module]               → Get[Module]sQuery
GET    /api/[module]/{id}          → Get[Module]ByIdQuery
GET    /api/[module]/dropdown      → Get[Module]DropdownQuery
POST   /api/[module]               → Create[Module]Command
PUT    /api/[module]/{id}          → Update[Module]Command
DELETE /api/[module]/{id}          → Delete[Module]Command
PUT    /api/[module]/{id}/restore  → Restore[Module]Command
```

Add XML comments and `[Authorize]` / permission attributes.

## 8. Wiring

- Register the repository in `Infrastructure/DependencyInjection.cs` (if custom).
- MediatR handlers are discovered automatically — no manual registration.

## 9. Docs

- Update `agent_docs/api-contracts.md` endpoint table.
- Update `agent_docs/database-schema.md` entity section.

## 10. Verify

1. `dotnet build` — zero errors.
2. Ask before running `./migrate.sh Add[Module]`.
3. Test each endpoint in Swagger before reporting done.
