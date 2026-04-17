#!/usr/bin/env node
// ============================================================
//  scaffold-module.js
//  Aligned with paulsonniro07/dev-templates standards
//  Usage: node scaffold-module.js <ModuleName> [ProjectName]
//
//  Examples:
//    node scaffold-module.js Customer
//    node scaffold-module.js Customer ZonaFaktur
// ============================================================

const fs   = require('fs');
const path = require('path');

// ── Args ─────────────────────────────────────────────────────
const [,, MODULE_RAW, PROJECT_ARG] = process.argv;

if (!MODULE_RAW) {
  console.error('\n  Usage: node scaffold-module.js <ModuleName> [ProjectName]\n');
  console.error('  Examples:');
  console.error('    node scaffold-module.js Customer');
  console.error('    node scaffold-module.js Customer ZonaFaktur\n');
  process.exit(1);
}

// ── Name helpers ─────────────────────────────────────────────
const M  = MODULE_RAW.charAt(0).toUpperCase() + MODULE_RAW.slice(1); // Customer
const m  = M.charAt(0).toLowerCase() + M.slice(1);                   // customer
const MP = m + 's';                                                   // customers (plural camelCase)
const MS = M + 's';                                                   // Customers (plural PascalCase)

// ── Detect project name ───────────────────────────────────────
function detectProjectName() {
  if (PROJECT_ARG) return PROJECT_ARG;
  // Look for .sln file in api/ or current dir
  const searchDirs = ['api', '.'];
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.sln'));
    if (files.length > 0) return files[0].replace('.sln', '');
  }
  // Fallback: use current directory name
  return path.basename(process.cwd());
}

const P = detectProjectName(); // e.g. ZonaFaktur

// ── Check we're in the right place ───────────────────────────
const inMonorepo = fs.existsSync('api') && fs.existsSync('client');
const inApiRoot  = fs.existsSync('src') && fs.readdirSync('.').some(f => f.endsWith('.sln'));

if (!inMonorepo && !inApiRoot) {
  console.error('\n  ERROR: Run this script from your project root.');
  console.error('  Expected either:');
  console.error('    monorepo root (has api/ and client/ folders)');
  console.error('    api root (has src/ and *.sln)\n');
  process.exit(1);
}

const BASE     = inMonorepo ? 'api'    : '.';
const BASE_FE  = inMonorepo ? 'client' : null;

console.log(`\n  Scaffold Module: ${M}`);
console.log(`  Project:         ${P}`);
console.log(`  Backend base:    ${BASE}`);
console.log(`  Frontend base:   ${BASE_FE ?? '(not found — skipping frontend)'}`);
console.log('');

// ── File writer ───────────────────────────────────────────────
function write(filePath, content) {
  const full = path.join(...filePath.split('/'));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log(`  [+] ${filePath}`);
}

// ============================================================
//  BACKEND FILES
// ============================================================

// ── 1. Domain Entity ─────────────────────────────────────────
write(`${BASE}/src/${P}.Domain/Entities/${M}.cs`, `namespace ${P}.Domain.Entities;

/// <summary>
/// ${M} entity — add your domain fields below.
/// Inherits: Id, IsDeleted, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy
/// </summary>
public class ${M} : BaseEntity
{
    // TODO: Add your fields here
    // Example:
    // public string Name { get; set; } = string.Empty;
    // public string? Description { get; set; }
}
`);

// ── 2. DTOs ───────────────────────────────────────────────────
write(`${BASE}/src/${P}.Application/${MS}/DTOs/${M}Dto.cs`, `namespace ${P}.Application.${MS}.DTOs;

/// <summary>Response DTO — maps from ${M} entity.</summary>
public class ${M}Dto
{
    public Guid   Id        { get; set; }
    public bool   IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // TODO: Mirror your entity fields here
    // public string Name { get; set; } = string.Empty;
}
`);

write(`${BASE}/src/${P}.Application/${MS}/DTOs/Create${M}Dto.cs`, `using FluentValidation;

namespace ${P}.Application.${MS}.DTOs;

/// <summary>Request DTO for creating a ${M}.</summary>
public class Create${M}Dto
{
    // TODO: Add create fields
    // public string Name { get; set; } = string.Empty;
}

public class Create${M}DtoValidator : AbstractValidator<Create${M}Dto>
{
    public Create${M}DtoValidator()
    {
        // TODO: Add validation rules
        // RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
    }
}
`);

write(`${BASE}/src/${P}.Application/${MS}/DTOs/Update${M}Dto.cs`, `using FluentValidation;

namespace ${P}.Application.${MS}.DTOs;

/// <summary>Request DTO for updating a ${M}.</summary>
public class Update${M}Dto
{
    // TODO: Add update fields (usually same as Create)
    // public string Name { get; set; } = string.Empty;
}

public class Update${M}DtoValidator : AbstractValidator<Update${M}Dto>
{
    public Update${M}DtoValidator()
    {
        // TODO: Add validation rules
        // RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
    }
}
`);

// ── 3. Filter ─────────────────────────────────────────────────
write(`${BASE}/src/${P}.Application/${MS}/${M}Filter.cs`, `using ${P}.Application.Common.Models;

namespace ${P}.Application.${MS};

/// <summary>Pagination + search filter for ${M} list queries.</summary>
public class ${M}Filter : PaginationFilter
{
    // TODO: Add module-specific filter fields
    // public bool? IsActive { get; set; }
}
`);

// ── 4. Repository Interface ───────────────────────────────────
write(`${BASE}/src/${P}.Application/${MS}/I${M}Repository.cs`, `using ${P}.Application.Common.Interfaces;
using ${P}.Application.Common.Models;
using ${P}.Application.${MS}.DTOs;
using ${P}.Domain.Entities;

namespace ${P}.Application.${MS};

/// <summary>
/// ${M}-specific repository contract.
/// Extend IGenericRepository with module-specific queries here.
/// </summary>
public interface I${M}Repository : IGenericRepository<${M}>
{
    Task<PagedResult<${M}Dto>> GetPagedDtoAsync(${M}Filter filter, CancellationToken ct = default);
    Task<List<DropdownItem>> GetDropdownAsync(string? keyword, int pageSize = 20, CancellationToken ct = default);
}
`);

// ── 5. Repository Implementation ─────────────────────────────
write(`${BASE}/src/${P}.Infrastructure/Persistence/Repositories/${M}Repository.cs`, `using Microsoft.EntityFrameworkCore;
using ${P}.Application.Common.Models;
using ${P}.Application.${MS};
using ${P}.Application.${MS}.DTOs;
using ${P}.Domain.Entities;
using ${P}.Infrastructure.Persistence;

namespace ${P}.Infrastructure.Persistence.Repositories;

public class ${M}Repository : GenericRepository<${M}>, I${M}Repository
{
    public ${M}Repository(AppDbContext db) : base(db) { }

    public async Task<PagedResult<${M}Dto>> GetPagedDtoAsync(
        ${M}Filter filter, CancellationToken ct = default)
    {
        var query = _set
            .Where(x => !x.IsDeleted);

        // Search
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            // TODO: Replace 'Name' with your actual searchable field(s)
            // query = query.Where(x => x.Name.ToLower().Contains(filter.Search.ToLower()));
        }

        // Sort
        // TODO: Replace 'CreatedAt' with your default sort field
        query = filter.SortDesc
            ? query.OrderByDescending(x => x.CreatedAt)
            : query.OrderBy(x => x.CreatedAt);

        var total = await query.CountAsync(ct);

        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(x => new ${M}Dto
            {
                Id        = x.Id,
                IsDeleted = x.IsDeleted,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                // TODO: Map your fields
                // Name = x.Name,
            })
            .ToListAsync(ct);

        return new PagedResult<${M}Dto>
        {
            Items      = items,
            TotalCount = total,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<List<DropdownItem>> GetDropdownAsync(
        string? keyword, int pageSize = 20, CancellationToken ct = default)
    {
        pageSize = Math.Min(pageSize, 50); // cap at 50

        var query = _set.Where(x => !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            // TODO: Replace 'Name' with your label field
            // query = query.Where(x => x.Name.ToLower().Contains(keyword.ToLower()));
        }

        return await query
            // TODO: Replace 'Name' with your label field
            // .OrderBy(x => x.Name)
            .Take(pageSize)
            .Select(x => new DropdownItem
            {
                Id    = x.Id,
                Label = x.Id.ToString() // TODO: Replace with x.Name or similar
            })
            .ToListAsync(ct);
    }
}
`);

// ── 6. Queries ────────────────────────────────────────────────
write(`${BASE}/src/${P}.Application/${MS}/Queries/Get${MS}Query.cs`, `using MediatR;
using ${P}.Application.Common.Models;
using ${P}.Application.${MS}.DTOs;

namespace ${P}.Application.${MS}.Queries;

public record Get${MS}Query(${M}Filter Filter)
    : IRequest<PagedResult<${M}Dto>>;

public class Get${MS}Handler : IRequestHandler<Get${MS}Query, PagedResult<${M}Dto>>
{
    private readonly I${M}Repository _repo;

    public Get${MS}Handler(I${M}Repository repo) => _repo = repo;

    public Task<PagedResult<${M}Dto>> Handle(Get${MS}Query request, CancellationToken ct)
        => _repo.GetPagedDtoAsync(request.Filter, ct);
}
`);

write(`${BASE}/src/${P}.Application/${MS}/Queries/Get${M}ByIdQuery.cs`, `using MediatR;
using ${P}.Application.${MS}.DTOs;

namespace ${P}.Application.${MS}.Queries;

public record Get${M}ByIdQuery(Guid Id) : IRequest<${M}Dto>;

public class Get${M}ByIdHandler : IRequestHandler<Get${M}ByIdQuery, ${M}Dto>
{
    private readonly I${M}Repository _repo;

    public Get${M}ByIdHandler(I${M}Repository repo) => _repo = repo;

    public async Task<${M}Dto> Handle(Get${M}ByIdQuery request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct)
            ?? throw new KeyNotFoundException($"${M} {request.Id} not found.");

        return new ${M}Dto
        {
            Id        = entity.Id,
            IsDeleted = entity.IsDeleted,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            // TODO: Map your fields
        };
    }
}
`);

write(`${BASE}/src/${P}.Application/${MS}/Queries/Get${MS}DropdownQuery.cs`, `using MediatR;
using ${P}.Application.Common.Models;

namespace ${P}.Application.${MS}.Queries;

public record Get${MS}DropdownQuery(string? Keyword, int PageSize = 20)
    : IRequest<List<DropdownItem>>;

public class Get${MS}DropdownHandler : IRequestHandler<Get${MS}DropdownQuery, List<DropdownItem>>
{
    private readonly I${M}Repository _repo;

    public Get${MS}DropdownHandler(I${M}Repository repo) => _repo = repo;

    public Task<List<DropdownItem>> Handle(Get${MS}DropdownQuery request, CancellationToken ct)
        => _repo.GetDropdownAsync(request.Keyword, request.PageSize, ct);
}
`);

// ── 7. Commands ───────────────────────────────────────────────
write(`${BASE}/src/${P}.Application/${MS}/Commands/Create${M}Command.cs`, `using MediatR;
using ${P}.Application.${MS}.DTOs;
using ${P}.Domain.Entities;

namespace ${P}.Application.${MS}.Commands;

public record Create${M}Command(Create${M}Dto Dto) : IRequest<${M}Dto>;

public class Create${M}Handler : IRequestHandler<Create${M}Command, ${M}Dto>
{
    private readonly I${M}Repository _repo;

    public Create${M}Handler(I${M}Repository repo) => _repo = repo;

    public async Task<${M}Dto> Handle(Create${M}Command request, CancellationToken ct)
    {
        var entity = new ${M}
        {
            // TODO: Map fields from request.Dto
            // Name = request.Dto.Name,
        };

        await _repo.AddAsync(entity, ct);
        await _repo.SaveChangesAsync(ct);

        return new ${M}Dto
        {
            Id        = entity.Id,
            IsDeleted = entity.IsDeleted,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            // TODO: Map fields
        };
    }
}
`);

write(`${BASE}/src/${P}.Application/${MS}/Commands/Update${M}Command.cs`, `using MediatR;
using ${P}.Application.${MS}.DTOs;

namespace ${P}.Application.${MS}.Commands;

public record Update${M}Command(Guid Id, Update${M}Dto Dto) : IRequest<${M}Dto>;

public class Update${M}Handler : IRequestHandler<Update${M}Command, ${M}Dto>
{
    private readonly I${M}Repository _repo;

    public Update${M}Handler(I${M}Repository repo) => _repo = repo;

    public async Task<${M}Dto> Handle(Update${M}Command request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct)
            ?? throw new KeyNotFoundException($"${M} {request.Id} not found.");

        // TODO: Map fields from request.Dto
        // entity.Name = request.Dto.Name;

        _repo.Update(entity);
        await _repo.SaveChangesAsync(ct);

        return new ${M}Dto
        {
            Id        = entity.Id,
            IsDeleted = entity.IsDeleted,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            // TODO: Map fields
        };
    }
}
`);

write(`${BASE}/src/${P}.Application/${MS}/Commands/Delete${M}Command.cs`, `using MediatR;

namespace ${P}.Application.${MS}.Commands;

/// <summary>Soft delete — sets IsDeleted = true. Never hard deletes.</summary>
public record Delete${M}Command(Guid Id) : IRequest;

public class Delete${M}Handler : IRequestHandler<Delete${M}Command>
{
    private readonly I${M}Repository _repo;

    public Delete${M}Handler(I${M}Repository repo) => _repo = repo;

    public async Task Handle(Delete${M}Command request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync(request.Id, ct)
            ?? throw new KeyNotFoundException($"${M} {request.Id} not found.");

        _repo.SoftDelete(entity); // IsDeleted = true — never .Remove()
        await _repo.SaveChangesAsync(ct);
    }
}
`);

write(`${BASE}/src/${P}.Application/${MS}/Commands/Restore${M}Command.cs`, `using MediatR;
using Microsoft.EntityFrameworkCore;
using ${P}.Infrastructure.Persistence;

namespace ${P}.Application.${MS}.Commands;

/// <summary>Restore a soft-deleted ${M}.</summary>
public record Restore${M}Command(Guid Id) : IRequest;

public class Restore${M}Handler : IRequestHandler<Restore${M}Command>
{
    private readonly AppDbContext _db;

    public Restore${M}Handler(AppDbContext db) => _db = db;

    public async Task Handle(Restore${M}Command request, CancellationToken ct)
    {
        // Must query WITHOUT IsDeleted filter to find deleted records
        var entity = await _db.Set<${P}.Domain.Entities.${M}>()
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new KeyNotFoundException($"${M} {request.Id} not found.");

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }
}
`);

// ── 8. Controller ─────────────────────────────────────────────
write(`${BASE}/src/${P}.API/Controllers/${MS}Controller.cs`, `using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ${P}.Application.${MS};
using ${P}.Application.${MS}.Commands;
using ${P}.Application.${MS}.DTOs;
using ${P}.Application.${MS}.Queries;

namespace ${P}.API.Controllers;

/// <summary>${MS} CRUD endpoints.</summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ${MS}Controller : ControllerBase
{
    private readonly IMediator _mediator;

    public ${MS}Controller(IMediator mediator) => _mediator = mediator;

    /// <summary>Get paged list of ${MP}.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ${M}Filter filter)
        => Ok(await _mediator.Send(new Get${MS}Query(filter)));

    /// <summary>Get single ${m} by ID.</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => Ok(await _mediator.Send(new Get${M}ByIdQuery(id)));

    /// <summary>Search dropdown — returns [{ id, label }].</summary>
    [HttpGet("dropdown")]
    public async Task<IActionResult> Dropdown(
        [FromQuery] string? keyword,
        [FromQuery] int pageSize = 20)
        => Ok(await _mediator.Send(new Get${MS}DropdownQuery(keyword, pageSize)));

    /// <summary>Create a new ${m}.</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Create${M}Dto dto)
    {
        var result = await _mediator.Send(new Create${M}Command(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Update an existing ${m}.</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Update${M}Dto dto)
        => Ok(await _mediator.Send(new Update${M}Command(id, dto)));

    /// <summary>Soft delete — sets IsDeleted = true.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new Delete${M}Command(id));
        return NoContent();
    }

    /// <summary>Restore a soft-deleted ${m}.</summary>
    [HttpPut("{id:guid}/restore")]
    public async Task<IActionResult> Restore(Guid id)
    {
        await _mediator.Send(new Restore${M}Command(id));
        return NoContent();
    }
}
`);

// ── 9. DropdownItem model (only if missing) ───────────────────
const dropdownModelPath = `${BASE}/src/${P}.Application/Common/Models/DropdownItem.cs`;
if (!fs.existsSync(dropdownModelPath)) {
  write(dropdownModelPath, `namespace ${P}.Application.Common.Models;

public class DropdownItem
{
    public Guid   Id    { get; set; }
    public string Label { get; set; } = string.Empty;
}
`);
}

// ============================================================
//  FRONTEND FILES
// ============================================================

if (BASE_FE && fs.existsSync(BASE_FE)) {
  const FE = BASE_FE;

  // ── types.ts ───────────────────────────────────────────────
  write(`${FE}/src/features/${MP}/types.ts`, `import type { PaginationFilter } from '@/types/common';

// ── Response DTO (mirrors backend ${M}Dto) ──────────────────
export interface ${M}Dto {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // TODO: Add your fields
  // name: string;
}

// ── Create / Update request bodies ─────────────────────────
export interface Create${M}Dto {
  // TODO: Add create fields
  // name: string;
}

export interface Update${M}Dto {
  // TODO: Add update fields
  // name: string;
}

// ── Filter ──────────────────────────────────────────────────
export interface ${M}Filter extends PaginationFilter {
  // TODO: Add module-specific filter fields
  // isActive?: boolean;
}
`);

  // ── service.ts ─────────────────────────────────────────────
  write(`${FE}/src/features/${MP}/service.ts`, `import api from '@/lib/api';
import type { PaginatedList, DropdownItem } from '@/types/common';
import type { ${M}Dto, Create${M}Dto, Update${M}Dto, ${M}Filter } from './types';

export const ${m}Service = {
  getAll: (filter: ${M}Filter) =>
    api.get<PaginatedList<${M}Dto>>('/api/${MP}', { params: filter }).then(r => r.data),

  getById: (id: string) =>
    api.get<${M}Dto>(\`/api/${MP}/\${id}\`).then(r => r.data),

  dropdown: (keyword: string): Promise<DropdownItem[]> =>
    api.get('/api/${MP}/dropdown', { params: { keyword, pageSize: 20 } }).then(r => r.data),

  create: (data: Create${M}Dto) =>
    api.post<${M}Dto>('/api/${MP}', data).then(r => r.data),

  update: (id: string, data: Update${M}Dto) =>
    api.put<${M}Dto>(\`/api/${MP}/\${id}\`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(\`/api/${MP}/\${id}\`),

  restore: (id: string) =>
    api.put(\`/api/${MP}/\${id}/restore\`),
};
`);

  // ── List component ─────────────────────────────────────────
  write(`${FE}/src/features/${MP}/${M}List.tsx`, `import { useState, useEffect, useCallback } from 'react';
import { ${m}Service } from './service';
import { ${M}Form } from './${M}Form';
import type { ${M}Dto, ${M}Filter } from './types';
import type { PaginatedList } from '@/types/common';

// TODO: Import your own UI components, e.g.:
// import { Button }     from '@/components/ui/Button';
// import { Badge }      from '@/components/ui/Badge';
// import { Spinner }    from '@/components/ui/Spinner';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { Pagination } from '@/components/ui/Pagination';
// import { usePermissions } from '@/hooks/usePermissions';

export function ${M}List() {
  const [filter, setFilter]   = useState<${M}Filter>({ page: 1, pageSize: 10 });
  const [data, setData]       = useState<PaginatedList<${M}Dto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen]     = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  // const { can } = usePermissions();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ${m}Service.getAll(filter);
      setData(result);
    } catch {
      // TODO: show error toast
      console.error('Failed to load ${MP}');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleEdit = (item: ${M}Dto) => {
    setSelectedId(item.id);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ${m}?')) return;
    try {
      await ${m}Service.delete(id);
      loadData();
    } catch {
      // TODO: show error toast
      console.error('Delete failed');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(f => ({ ...f, search: e.target.value, page: 1 }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">${MS}</h1>
        {/* {can('${MP}.create') && ( */}
          <button
            onClick={() => { setSelectedId(undefined); setFormOpen(true); }}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Add ${M}
          </button>
        {/* )} */}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search ${MP}..."
        onChange={handleSearch}
        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : !data?.items.length ? (
        <div className="text-center py-12 text-gray-400">No ${MP} found.</div>
      ) : (
        <>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {/* TODO: Add your column headers */}
                <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* TODO: Replace with your fields */}
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {/* {can('${MP}.edit') && ( */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-100"
                      >Edit</button>
                    {/* )} */}
                    {/* {can('${MP}.delete') && ( */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100"
                      >Delete</button>
                    {/* )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {((filter.page! - 1) * filter.pageSize!) + 1}–
              {Math.min(filter.page! * filter.pageSize!, data.totalCount)} of {data.totalCount}
            </span>
            <div className="flex gap-2">
              <button
                disabled={filter.page === 1}
                onClick={() => setFilter(f => ({ ...f, page: f.page! - 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >Prev</button>
              <button
                disabled={filter.page === data.totalPages}
                onClick={() => setFilter(f => ({ ...f, page: f.page! + 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >Next</button>
            </div>
          </div>
        </>
      )}

      <${M}Form
        open={formOpen}
        ${m}Id={selectedId}
        onClose={() => { setFormOpen(false); setSelectedId(undefined); }}
        onSaved={loadData}
      />
    </div>
  );
}
`);

  // ── Form component ─────────────────────────────────────────
  write(`${FE}/src/features/${MP}/${M}Form.tsx`, `import { useState, useEffect } from 'react';
import { ${m}Service } from './service';
import type { Create${M}Dto, Update${M}Dto } from './types';

interface ${M}FormProps {
  open:      boolean;
  ${m}Id?:   string;
  onClose:   () => void;
  onSaved:   () => void;
}

// TODO: Replace with your actual fields
type FormState = Create${M}Dto & Partial<Update${M}Dto>;

const defaultForm: FormState = {
  // TODO: initialize your fields
  // name: '',
};

export function ${M}Form({ open, ${m}Id, onClose, onSaved }: ${M}FormProps) {
  const isEdit = !!${m}Id;
  const [form, setForm]     = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (isEdit && ${m}Id) {
      ${m}Service.getById(${m}Id).then(data => {
        setForm({
          // TODO: Map loaded data to form state
          // name: data.name,
        });
      });
    } else {
      setForm(defaultForm);
      setErrors({});
    }
  }, [open, isEdit, ${m}Id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && ${m}Id) {
        await ${m}Service.update(${m}Id, form as Update${M}Dto);
      } else {
        await ${m}Service.create(form as Create${M}Dto);
      }
      // TODO: show success toast
      onSaved();
      onClose();
    } catch (err: unknown) {
      // Extract field validation errors from API response
      const apiErrors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
        ?.response?.data?.errors ?? {};
      const mapped: Record<string, string> = {};
      for (const [k, v] of Object.entries(apiErrors)) {
        mapped[k] = Array.isArray(v) ? v[0] : String(v);
      }
      setErrors(mapped);
      // TODO: show error toast
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? 'Edit' : 'Add'} ${M}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TODO: Add your form fields */}
          {/* Example:
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name ?? ''}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>
          */}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`);

  // ── Page component ─────────────────────────────────────────
  write(`${FE}/src/pages/${M}Page.tsx`, `import { ${M}List } from '@/features/${MP}/${M}List';

export function ${M}Page() {
  return (
    <div className="p-6">
      <${M}List />
    </div>
  );
}
`);

  // ── common types (only if missing) ────────────────────────
  const commonTypesPath = `${FE}/src/types/common.ts`;
  if (!fs.existsSync(commonTypesPath)) {
    write(commonTypesPath, `// Shared TypeScript types — keep in sync with backend models

export interface PaginatedList<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DropdownItem {
  id: string;
  label: string;
}

export interface PaginationFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
`);
  }

} else {
  console.log('\n  (Frontend skipped — client/ folder not found)');
}

// ============================================================
//  NEXT_STEPS.md
// ============================================================

const diPath = `${BASE}/src/${P}.Infrastructure/DependencyInjection.cs`;
const appTsxPath = BASE_FE ? `${BASE_FE}/src/App.tsx` : 'client/src/App.tsx';

write(`NEXT_STEPS_${M.toUpperCase()}.md`, `# Next Steps — ${M} Module

Generated by scaffold-module.js at ${new Date().toISOString()}

## ✅ What was generated

### Backend (${BASE}/)
- Domain/Entities/${M}.cs
- Application/${MS}/DTOs/${M}Dto.cs, Create${M}Dto.cs, Update${M}Dto.cs
- Application/${MS}/${M}Filter.cs
- Application/${MS}/I${M}Repository.cs
- Application/${MS}/Queries/ (GetAll, GetById, GetDropdown)
- Application/${MS}/Commands/ (Create, Update, Delete, Restore)
- Infrastructure/Persistence/Repositories/${M}Repository.cs
- API/Controllers/${MS}Controller.cs

### Frontend (${BASE_FE ?? 'client'}/)
- features/${MP}/types.ts
- features/${MP}/service.ts
- features/${MP}/${M}List.tsx
- features/${MP}/${M}Form.tsx
- pages/${M}Page.tsx

---

## 🔧 4 Manual Steps Required

### Step 1 — Add your entity fields
Open \`${BASE}/src/${P}.Domain/Entities/${M}.cs\`
Add your domain-specific properties. Example:
\`\`\`csharp
public string Name { get; set; } = string.Empty;
public string? Description { get; set; }
\`\`\`
Then mirror them in:
- ${M}Dto.cs   (response shape)
- Create${M}Dto.cs / Update${M}Dto.cs  (request shape + validation)
- ${M}Repository.cs  (search filter + Select projection + dropdown Label)
- Both handlers (Create, Update — map fields)
- Frontend types.ts, ${M}List.tsx columns, ${M}Form.tsx fields

### Step 2 — Register repository in DI
Open \`${diPath}\`
Add inside \`AddInfrastructure()\`:
\`\`\`csharp
services.AddScoped<I${M}Repository, ${M}Repository>();
\`\`\`

### Step 3 — Run the migration
From your api/ folder:
\`\`\`bash
./migrate.sh Add${M}Table
\`\`\`
Or manually:
\`\`\`bash
dotnet ef migrations add Add${M}Table \\
  --project src/${P}.Infrastructure \\
  --startup-project src/${P}.API \\
  --output-dir Persistence/Migrations
\`\`\`
Then verify \`dotnet build\` passes.

### Step 4 — Add the route (frontend)
Open \`${appTsxPath}\`
Add import:
\`\`\`tsx
import { ${M}Page } from '@/pages/${M}Page';
\`\`\`
Add route inside your router:
\`\`\`tsx
<Route path="${MP}" element={
  <PermissionRoute permission="${MP}.view">
    <${M}Page />
  </PermissionRoute>
} />
\`\`\`
Add nav link in your sidebar/layout.

---

## 🔎 TODOs Summary (search for "TODO" in generated files)

Backend:
- [ ] ${M}.cs — add entity fields
- [ ] ${M}Dto.cs — mirror entity fields
- [ ] Create/Update Dto — add fields + FluentValidation rules
- [ ] ${M}Repository.cs — update search predicate, sort field, dropdown Label, Select projection
- [ ] Create/Update Handlers — map fields from Dto to entity and back

Frontend:
- [ ] types.ts — add TypeScript field types
- [ ] ${M}List.tsx — add table columns matching your fields
- [ ] ${M}Form.tsx — add form inputs matching your fields

---

## 📋 API Endpoints Created

| Method | Route                        | Description        |
|--------|------------------------------|--------------------|
| GET    | /api/${MP}                   | Paged list         |
| GET    | /api/${MP}/{id}              | Single item        |
| GET    | /api/${MP}/dropdown          | Search dropdown    |
| POST   | /api/${MP}                   | Create             |
| PUT    | /api/${MP}/{id}              | Update             |
| DELETE | /api/${MP}/{id}              | Soft delete        |
| PUT    | /api/${MP}/{id}/restore      | Restore            |

Test all endpoints at: http://localhost:8080/swagger
`);

// ── Summary ───────────────────────────────────────────────────
console.log(`
  ════════════════════════════════════════════════════════
   ✅  ${M} module scaffolded successfully!
  ════════════════════════════════════════════════════════

   📄 Read NEXT_STEPS_${M.toUpperCase()}.md for exact next steps.

   Quick summary:
   1. Add fields to ${M}.cs + mirror in DTOs + Repository
   2. Register I${M}Repository in DependencyInjection.cs
   3. Run: ./migrate.sh Add${M}Table
   4. Add route in App.tsx

   Search all TODO comments: grep -r "TODO" --include="*.cs" --include="*.ts" --include="*.tsx"
  ════════════════════════════════════════════════════════
`);
