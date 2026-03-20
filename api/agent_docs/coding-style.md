# Coding Style — [PROJECT_NAME]
# Exact patterns Claude follows when writing backend code

## C# Rules
- All public methods async, return Task<T>
- Use var only when type obvious from right side
- Null checks: use ?. and ?? operators
- String interpolation over concatenation
- Expression bodies for simple one-liners
- Throw meaningful exceptions with context

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

## IGenericRepository Pattern
```csharp
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<PaginatedList<T>> GetPagedAsync(
        PaginationFilter filter,
        Expression<Func<T, bool>>? searchPredicate = null,
        Expression<Func<T, object>>? orderBy = null,
        params Expression<Func<T, object>>[] includes);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task SoftDeleteAsync(Guid id);
    Task RestoreAsync(Guid id);
    Task<List<DropdownItem>> SearchDropdownAsync(
        Expression<Func<T, string>> labelSelector,
        string? keyword, int pageSize = 20);
}
```

## Repository Implementation Pattern
```csharp
public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context) { }

    // Override GetPagedAsync only when deep includes needed
    public override async Task<PaginatedList<Customer>> GetPagedAsync(
        PaginationFilter filter, ...)
    {
        var query = _context.Customers
            .Where(x => !x.IsDeleted)
            .Include(x => x.Address)          // first-level OK in base
            .Include(x => x.Orders)
                .ThenInclude(o => o.Items);    // deep include — override needed

        // search, sort, paginate...
        return await PaginatedList<Customer>.CreateAsync(query, filter);
    }
}
```

## Handler Pattern (CQRS)
```csharp
public record GetCustomersQuery(CustomerFilter Filter) : IRequest<PaginatedList<CustomerDto>>;

public class GetCustomersHandler : IRequestHandler<GetCustomersQuery, PaginatedList<CustomerDto>>
{
    private readonly ICustomerRepository _repository;

    public GetCustomersHandler(ICustomerRepository repository)
        => _repository = repository;

    public async Task<PaginatedList<CustomerDto>> Handle(
        GetCustomersQuery request, CancellationToken ct)
    {
        request.Filter.PageSize = Math.Min(request.Filter.PageSize, 100);
        var result = await _repository.GetPagedAsync(request.Filter, ...);
        return result.Map(MapToDto);
    }

    private static CustomerDto MapToDto(Customer c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        // map all fields explicitly — no AutoMapper
    };
}
```

## Controller Pattern (thin dispatcher)
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;
    public CustomersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CustomerFilter filter)
        => Ok(await _mediator.Send(new GetCustomersQuery(filter)));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => Ok(await _mediator.Send(new GetCustomerByIdQuery(id)));

    [HttpGet("dropdown")]
    public async Task<IActionResult> Dropdown([FromQuery] string? keyword, [FromQuery] int pageSize = 20)
        => Ok(await _mediator.Send(new GetCustomersDropdownQuery(keyword, pageSize)));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerCommand command)
        => CreatedAtAction(nameof(GetById),
            new { id = (await _mediator.Send(command)).Id }, null);

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteCustomerCommand(id));
        return NoContent();
    }

    [HttpPut("{id:guid}/restore")]
    public async Task<IActionResult> Restore(Guid id)
    {
        await _mediator.Send(new RestoreCustomerCommand(id));
        return NoContent();
    }
}
```

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
    // add more repos here

    return services;
}
```
