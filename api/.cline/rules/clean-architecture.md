# Clean Architecture Rules — [PROJECT_NAME] API

## 4 Projects
- [PROJECT_NAME].Domain         → Entities, Enums (zero dependencies)
- [PROJECT_NAME].Application    → DTOs, Interfaces, CQRS Handlers
- [PROJECT_NAME].Infrastructure → EF Core, Repositories, Identity
- [PROJECT_NAME].API            → Controllers, Middleware, Program.cs

## Dependency Rules (never break)
- Domain: NO references to any other layer
- Application: references Domain only
- Infrastructure: references Application + Domain
- API: references Application only
- NEVER: API → Infrastructure directly
- NEVER: business logic in Controllers

## Controller Pattern (thin dispatcher only)
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

## Handler Pattern (CQRS)
```csharp
public record GetCustomersQuery(CustomerFilter Filter) : IRequest<PaginatedList<CustomerDto>>;

public class GetCustomersHandler : IRequestHandler<GetCustomersQuery, PaginatedList<CustomerDto>>
{
    private readonly ICustomerRepository _repository;
    public GetCustomersHandler(ICustomerRepository repository) => _repository = repository;

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

## Exception Mapping (GlobalExceptionMiddleware)
- NotFoundException → 404
- ValidationException → 400
- ConflictException → 409
- UnauthorizedException → 401

## What Goes Where
| What | Where |
|---|---|
| Entity definition | Domain/Entities/ |
| Business rule | Application/Features/.../Handler |
| Data access | Infrastructure/Persistence/Repositories/ |
| HTTP mapping | API/Controllers/ |
| DTO | Application/DTOs/[Feature]/ |
| DI registration | Infrastructure/DependencyInjection.cs |
