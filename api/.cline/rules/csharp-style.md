# C# Style Rules — [PROJECT_NAME] API

## General
- All public methods async, return Task<T>
- Use var only when type is obvious from right side
- Null checks: use ?. and ?? operators
- String interpolation over concatenation
- Expression bodies for simple one-liners
- Throw meaningful exceptions with context
- No .Result or .Wait() — always await

## Naming
| What | Convention | Example |
|---|---|---|
| Class | PascalCase | CustomerService |
| Interface | I + PascalCase | ICustomerRepository |
| Async method | PascalCase + Async | GetAllAsync |
| Private field | _camelCase | _repository |
| Local variable | camelCase | customerId |
| DTO | PascalCase + suffix | CreateCustomerDto |
| Handler | Feature + Handler | CreateCustomerHandler |

## DI Registration Pattern
```csharp
// Infrastructure/DependencyInjection.cs
public static IServiceCollection AddInfrastructure(
    this IServiceCollection services, IConfiguration config)
{
    services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(config.GetConnectionString("DefaultConnection"))
               .AddInterceptors(new AuditEntityInterceptor()));

    services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
    services.AddScoped<ICustomerRepository, CustomerRepository>();
    return services;
}
```

## Repository Override Pattern (deep includes only)
```csharp
public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context) { }

    // Override only when deep includes needed
    public override async Task<PaginatedList<Customer>> GetPagedAsync(
        PaginationFilter filter, ...)
    {
        var query = _context.Customers
            .Where(x => !x.IsDeleted)
            .Include(x => x.Orders)
                .ThenInclude(o => o.Items); // deep include needs override
        return await PaginatedList<Customer>.CreateAsync(query, filter);
    }
}
```

## New Module Checklist
1. Domain/Entities/[Module].cs — extends BaseEntity
2. Application/DTOs/[Module]/[Module]Dto.cs
3. Application/Features/[Module]/Queries + Commands + Handlers
4. Infrastructure/Persistence/Repositories/[Module]Repository.cs
5. API/Controllers/[Module]sController.cs
6. Register repo in DependencyInjection.cs
7. Run dotnet build — fix all errors
8. Ask before ./migrate.sh
