# API Contracts — [PROJECT_NAME]
# Update when endpoints are added or changed

## Base URL
- Dev: http://localhost:8080/api
- Prod: https://[domain]/api

## Auth
- POST /api/auth/login     → { token, user: { id, email, fullName, role, permissions[] } }
- GET  /api/auth/me        → current user info
- All other endpoints require: Authorization: Bearer {token}

## Standard Response Shapes

### Single item
```json
{ "id": "guid", "name": "...", ...fields }
```

### Paginated list
```json
{
  "data": [...],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### Dropdown
```json
[{ "id": "guid", "label": "Display Name" }]
```

### Error
```json
{ "message": "Not found", "errors": { "field": ["error"] } }
```

## Endpoints
<!-- Add one section per module as you build -->

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | None | Login → JWT token |
| GET | /api/auth/me | Bearer | Current user |

### [Module]
| Method | Route | Auth | Permission | Description |
|---|---|---|---|---|
| GET | /api/[module] | Bearer | [module].view | Paged list |
| GET | /api/[module]/{id} | Bearer | [module].view | Single item |
| GET | /api/[module]/dropdown | Bearer | [module].view | Search dropdown |
| POST | /api/[module] | Bearer | [module].create | Create |
| PUT | /api/[module]/{id} | Bearer | [module].edit | Update |
| DELETE | /api/[module]/{id} | Bearer | [module].delete | Soft delete |
| PUT | /api/[module]/{id}/restore | Bearer | [module].delete | Restore |

## HTTP Status Codes
- 200 OK — success (GET, PUT)
- 201 Created — resource created (POST)
- 204 No Content — success with no body (DELETE, restore)
- 400 Bad Request — validation failure
- 401 Unauthorized — not authenticated
- 403 Forbidden — not authorized
- 404 Not Found — resource missing or IsDeleted=true
- 409 Conflict — duplicate / business rule violation
- 500 Internal Server Error — unexpected failure
