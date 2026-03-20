# /new-module
# Usage: /new-module [ModuleName]
# Scaffolds complete module with ALL standards baked in

Scaffold module: **$ARGUMENTS**

## Generate in this exact order:

### 1. Domain — Entity
- Extends BaseEntity (Id, IsDeleted, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
- Module-specific fields
- Enums if needed
- Auto-number constant if applicable

### 2. Application — Query/Command + DTOs
- Get[Module]sQuery + Handler (paged, uses [Module]Filter)
- Get[Module]ByIdQuery + Handler
- Get[Module]sDropdownQuery + Handler (returns List<DropdownItem>)
- Create[Module]Command + Handler
- Update[Module]Command + Handler
- Delete[Module]Command + Handler (soft delete)
- Restore[Module]Command + Handler
- [Module]Filter extends PaginationFilter (add module-specific fields)
- [Module]Dto (response shape — embeds related names, no raw entity)

### 3. Infrastructure — Repository
- I[Module]Repository extends IGenericRepository<[Module]>
- [Module]Repository implementation
- Override GetPagedAsync if deep includes needed
- Register in DependencyInjection.cs

### 4. API — Controller
- GET    /api/[module]              → GetAll (paged)
- GET    /api/[module]/{id}         → GetById
- GET    /api/[module]/dropdown     → Dropdown [{ id, label }]
- POST   /api/[module]              → Create
- PUT    /api/[module]/{id}         → Update
- DELETE /api/[module]/{id}         → SoftDelete
- PUT    /api/[module]/{id}/restore → Restore
- Thin controller — only MediatR dispatch

## After scaffolding
- Run dotnet build — fix all errors
- Prompt me before running ./migrate.sh
