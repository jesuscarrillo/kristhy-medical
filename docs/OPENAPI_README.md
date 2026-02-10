# OpenAPI Documentation

This directory contains the OpenAPI 3.1 specification for the Kristhy Medical API v1.

## Files

- `openapi.yaml` - Complete API specification
- `API.md` - Human-readable API documentation

## Viewing the Specification

### Online Viewers

1. **Swagger Editor** (recommended)
   - Visit: https://editor.swagger.io/
   - File → Import File → Select `openapi.yaml`
   - Or paste the YAML content directly

2. **Redoc**
   - Visit: https://redocly.github.io/redoc/
   - Paste the YAML URL or content

3. **SwaggerHub**
   - Visit: https://app.swaggerhub.com/
   - Create account and import specification

### Local Development

Install and run a local documentation server:

```bash
# Using Redoc
npx @redocly/cli preview-docs docs/openapi.yaml

# Using Swagger UI
npx swagger-ui-watcher docs/openapi.yaml
```

## Using the Specification

### Code Generation

Generate client SDKs for various languages:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g typescript-fetch \
  -o ./generated/typescript-client

# Generate Python client
openapi-generator-cli generate \
  -i docs/openapi.yaml \
  -g python \
  -o ./generated/python-client

# Other generators: javascript, java, go, php, ruby, etc.
```

### API Testing

Use the specification for automated testing:

```bash
# With Postman
# Import → Upload Files → Select openapi.yaml

# With Insomnia
# Import → From File → Select openapi.yaml

# With Bruno
# Import Collection → OpenAPI → Select openapi.yaml
```

### Mock Server

Create a mock API server for development:

```bash
# Using Prism
npm install -g @stoplight/prism-cli

# Start mock server
prism mock docs/openapi.yaml

# Server runs at http://localhost:4010
curl http://localhost:4010/api/v1/health
```

## Specification Structure

```yaml
openapi: 3.1.0
info:                    # API metadata
  title: Kristhy Medical API
  version: 1.0.0

servers:                 # API base URLs
  - url: https://kristhy.com/api/v1

tags:                    # Endpoint grouping
  - name: Contact
  - name: Session
  - name: Export
  - name: Cron
  - name: Health

paths:                   # API endpoints
  /contact:
    post: {...}
  /session:
    get: {...}
  # etc.

components:              # Reusable schemas
  securitySchemes: {...}
  schemas: {...}
  responses: {...}
  examples: {...}
```

## Security Schemes

### Session Cookie

```typescript
// Automatic with fetch
fetch('/api/v1/session', {
  credentials: 'include'
});
```

### Bearer Token (Cron)

```bash
curl -X POST https://kristhy.com/api/v1/cron/reminders \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

## Response Envelopes

All successful responses follow the envelope pattern:

```json
{
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2026-02-10T10:30:00Z",
    "version": "1.0",
    "message": "Optional message"
  }
}
```

All error responses follow this structure:

```json
{
  "error": "ErrorCode",
  "message": "Human-readable error message",
  "details": { /* optional error details */ },
  "timestamp": "2026-02-10T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

## Rate Limiting

All public endpoints have rate limits indicated in the specification:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/contact` | 5 req | 15 min |
| `/*/export` | 10 req | 15 min |
| `/cron/reminders` | 60 req | 15 min |

Rate limit errors include headers:
- `Retry-After`: Seconds until retry
- `X-RateLimit-Reset`: UNIX timestamp of reset

## Validation

The specification includes Zod-compatible schemas with:
- Type validation
- Format validation (email, date-time, etc.)
- String constraints (minLength, maxLength, pattern)
- Required fields
- Enum values

## Extending the Specification

When adding new endpoints:

1. **Add path** in `paths` section
2. **Define schemas** in `components/schemas`
3. **Reuse responses** from `components/responses`
4. **Add examples** in `components/examples`
5. **Tag appropriately** for documentation grouping
6. **Document security** requirements

Example:

```yaml
paths:
  /new-endpoint:
    post:
      tags:
        - YourTag
      summary: Short description
      description: |
        Detailed description with markdown support
      operationId: uniqueOperationId
      security:
        - sessionCookie: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/YourSchema'
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/YourResponse'
        '422':
          $ref: '#/components/responses/ValidationError'
```

## CI/CD Integration

### Validate Specification

```bash
# Using Redocly CLI
npx @redocly/cli lint docs/openapi.yaml

# Using Swagger CLI
npx swagger-cli validate docs/openapi.yaml
```

### Generate Documentation

```bash
# Generate static HTML documentation
npx @redocly/cli build-docs docs/openapi.yaml \
  --output docs/api-docs.html

# Serve documentation
npx http-server docs/
```

### GitHub Actions Example

```yaml
name: Validate OpenAPI
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate OpenAPI Spec
        run: npx @redocly/cli lint docs/openapi.yaml
```

## Resources

- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger Editor](https://editor.swagger.io/)
- [Redoc Documentation](https://redocly.com/docs/redoc/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Prism Mock Server](https://stoplight.io/open-source/prism)

## Changelog

### v1.0.0 (2026-02-10)
- Initial OpenAPI specification
- All v1 endpoints documented
- Security schemes defined
- Response envelopes standardized
- Rate limiting documented
- Examples and error responses included
