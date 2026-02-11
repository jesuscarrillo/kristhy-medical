# API Documentation - Kristhy Medical

## Versión Actual: v1.0

Todas las APIs nuevas deben usar el prefijo `/api/v1/` para versionado. Los endpoints antiguos sin versión se mantienen para compatibilidad hacia atrás pero están marcados como **DEPRECATED**.

---

## 📋 Estructura de Respuestas

### Respuesta Exitosa (2xx)

```typescript
{
  data: T,                    // Datos de la respuesta
  meta: {
    timestamp: string,        // ISO 8601
    version?: string,         // Versión de API
    [key: string]: unknown    // Metadata adicional
  }
}
```

### Respuesta de Error (4xx, 5xx)

```typescript
{
  error: string,              // Código de error (PascalCase)
  message: string,            // Mensaje legible para el usuario
  details?: unknown,          // Detalles adicionales del error
  timestamp: string,          // ISO 8601
  path: string               // Ruta del endpoint
}
```

### Respuesta Paginada

```typescript
{
  data: T[],
  meta: {
    timestamp: string,
    page: number,
    pageSize: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  }
}
```

---

## 🔐 Autenticación

Todos los endpoints del dashboard requieren sesión activa vía cookie de Better Auth.

**Header de Autenticación:**
```
Cookie: session_token=...
```

**Endpoints Públicos:**
- `POST /api/v1/contact` - Formulario de contacto

**Endpoints con Bearer Token:**
- `POST /api/v1/cron/reminders` - Requiere `Authorization: Bearer {CRON_SECRET}`

---

## 📍 Endpoints

### Contacto

#### `POST /api/v1/contact` ⚠️ **DEPRECATED**

> **⚠️ DEPRECATED:** Este endpoint está en desuso. El formulario de contacto ahora usa integración directa con WhatsApp.
> Mantenido solo para compatibilidad hacia atrás.
>
> **Nueva implementación:** El botón "Enviar por WhatsApp" del formulario genera un link `wa.me` con los datos del formulario pre-formateados y abre WhatsApp directamente en el navegador del usuario.

Enviar formulario de contacto desde el landing page.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "reason": "prenatal" | "gynecology" | "ultrasound" | "other",
  "message": "string",
  "privacy": true
}
```

**Response 201 Created:**
```json
{
  "data": {
    "id": "uuid",
    "status": "pending",
    "submittedAt": "2026-02-10T..."
  },
  "meta": {
    "timestamp": "2026-02-10T...",
    "message": "Mensaje enviado exitosamente. Te contactaremos pronto.",
    "version": "1.0"
  }
}
```

**Errores:**
- `422 Unprocessable Entity` - Validación fallida
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor

**Rate Limit:** 5 requests / 15 minutos por IP

---

### Sesión

#### `GET /api/v1/session`

Obtener sesión actual del usuario autenticado.

**Response 200 OK:**
```json
{
  "data": {
    "session": {
      "id": "string",
      "userId": "string",
      "expiresAt": "2026-02-10T...",
      "createdAt": "2026-02-10T...",
      "updatedAt": "2026-02-10T..."
    },
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "emailVerified": true,
      "createdAt": "2026-02-10T...",
      "updatedAt": "2026-02-10T..."
    }
  },
  "meta": {
    "timestamp": "2026-02-10T...",
    "version": "1.0"
  }
}
```

**Errores:**
- `401 Unauthorized` - No hay sesión activa
- `500 Internal Server Error` - Error del servidor

---

### Exportación de Datos

#### `GET /api/v1/patients/export`

Exportar lista de pacientes en formato CSV.

**Query Parameters:**
- `startDate` (opcional): ISO 8601 date - Filtrar desde esta fecha de registro
- `endDate` (opcional): ISO 8601 date - Filtrar hasta esta fecha de registro

**Response 200 OK:**
Descarga CSV con BOM UTF-8 para compatibilidad con Excel.

**Headers:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="pacientes_2026-02-10.csv"
Cache-Control: no-store, must-revalidate
```

**Errores:**
- `401 Unauthorized` - Sesión no válida
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor

**Rate Limit:** 10 requests / 15 minutos por IP

**Auditoría:** Se registra cada exportación en la tabla `AuditLog`

---

#### `GET /api/v1/appointments/export`

Exportar lista de citas en formato CSV.

**Query Parameters:**
- `startDate` (opcional): ISO 8601 date - Filtrar desde esta fecha de cita
- `endDate` (opcional): ISO 8601 date - Filtrar hasta esta fecha de cita
- `type` (opcional): `prenatal` | `gynecology` | `ultrasound` | `followup`
- `status` (opcional): `scheduled` | `completed` | `cancelled` | `noshow`

**Response 200 OK:**
Descarga CSV con BOM UTF-8 para compatibilidad con Excel.

**Headers:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="citas_2026-02-10.csv"
Cache-Control: no-store, must-revalidate
```

**Errores:** Igual que `/api/v1/patients/export`

---

### Cron Jobs

#### `POST /api/v1/cron/reminders`

Enviar recordatorios de citas (ejecutado por Vercel Cron).

**Headers:**
```
Authorization: Bearer {CRON_SECRET}
```

**Response 200 OK:**
```json
{
  "data": {
    "status": "completed" | "partial",
    "sent": 10,
    "failed": 0,
    "total": 10,
    "executedAt": "2026-02-10T08:00:00Z"
  },
  "meta": {
    "timestamp": "2026-02-10T...",
    "message": "Sent 10 reminders, 0 failed",
    "version": "1.0"
  }
}
```

**Errores:**
- `401 Unauthorized` - Token inválido o faltante
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor

**Rate Limit:** 60 requests / 15 minutos por IP

**Método Alternativo:** `GET` también soportado para compatibilidad con Vercel Cron

---

### Health Check

#### `GET /api/v1/health`

Health check para monitoreo y load balancers. Verifica conectividad a la base de datos.

**Response 200 OK:**
```json
{
  "data": {
    "status": "healthy",
    "service": "kristhy-medical",
    "database": "connected",
    "uptime": 12345.67,
    "memory": {
      "rss": 123456789,
      "heapTotal": 123456789,
      "heapUsed": 123456789,
      "external": 123456789,
      "arrayBuffers": 123456789
    }
  },
  "meta": {
    "timestamp": "2026-02-10T...",
    "version": "1.0"
  }
}
```

**Response 503 Service Unavailable:**
```json
{
  "error": "ServiceUnavailable",
  "message": "Service is unhealthy",
  "details": {
    "status": "unhealthy",
    "service": "kristhy-medical",
    "database": "disconnected",
    "reason": "Connection timeout"
  },
  "timestamp": "2026-02-10T...",
  "path": "/api/v1/health"
}
```

---

## ⚠️ Endpoints DEPRECATED

Los siguientes endpoints están marcados como **DEPRECATED** pero se mantienen para compatibilidad hacia atrás. Migrar a las versiones `v1` cuando sea posible.

| Endpoint Antiguo | Nuevo Endpoint | Estado |
|------------------|----------------|--------|
| `POST /api/contact` | `POST /api/v1/contact` | ✅ Funcional |
| `GET /api/auth-check` | `GET /api/v1/session` | ✅ Funcional |
| `GET /api/reports/export` | `GET /api/v1/{patients\|appointments}/export` | ✅ Funcional |
| `POST /api/cron/reminders` | `POST /api/v1/cron/reminders` | ✅ Funcional |
| `GET /api/health` | `GET /api/v1/health` | ✅ Funcional (Docker) |

**Nota:** Los endpoints deprecated incluyen headers adicionales:
- `X-Deprecated: true`
- `X-Use-Instead: /api/v1/...`

---

## 🚦 Rate Limiting

Todos los endpoints tienen rate limiting implementado con límites por IP:

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `POST /api/v1/contact` | 5 requests | 15 min |
| `GET /api/v1/*/export` | 10 requests | 15 min |
| `POST /api/v1/cron/reminders` | 60 requests | 15 min |

**Response 429:**
```json
{
  "error": "RateLimitExceeded",
  "message": "Too many requests",
  "details": {
    "retryAfter": 300,
    "resetAt": "2026-02-10T..."
  },
  "timestamp": "2026-02-10T...",
  "path": "/api/..."
}
```

**Headers:**
```
Retry-After: 300
X-RateLimit-Reset: 1234567890
```

---

## 📊 Códigos de Estado HTTP

### 2xx Success
- `200 OK` - Request exitoso
- `201 Created` - Recurso creado exitosamente

### 4xx Client Errors
- `400 Bad Request` - Sintaxis inválida
- `401 Unauthorized` - Autenticación requerida
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `422 Unprocessable Entity` - Error de validación
- `429 Too Many Requests` - Rate limit excedido

### 5xx Server Errors
- `500 Internal Server Error` - Error del servidor
- `503 Service Unavailable` - Servicio no disponible (health check)

---

## 🔒 Seguridad

### Headers de Respuesta

Todos los endpoints incluyen headers de seguridad via middleware:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- CSP configurado en Next.js config

### Validación

Todos los endpoints validan input con Zod schemas:
- Validación de tipos
- Validación de formato (email, teléfono, etc.)
- Sanitización de datos

### Encriptación

Datos sensibles encriptados con AES-256-GCM:
- Cédula, teléfono, email, dirección de pacientes
- Historial médico personal
- Ver `lib/utils/encryption.ts`

---

## 🧪 Testing

### Ejemplo con cURL

```bash
# Contact form
curl -X POST https://app.kristhy.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "email": "maria@example.com",
    "phone": "+58 412-073-5223",
    "reason": "prenatal",
    "message": "Necesito una cita prenatal",
    "privacy": true
  }'

# Session check (requiere cookie)
curl https://app.kristhy.com/api/v1/session \
  -H "Cookie: session_token=..."

# Health check
curl https://app.kristhy.com/api/v1/health
```

---

## 📝 Changelog

### v1.0 (2026-02-10)

**Nueva Estructura REST:**
- ✅ Respuestas consistentes con envelope pattern
- ✅ Códigos HTTP semánticamente correctos
- ✅ Manejo de errores estandarizado
- ✅ Versionado de API `/v1/`
- ✅ Rate limiting en todos los endpoints
- ✅ Endpoints RESTful orientados a recursos

**Endpoints Nuevos:**
- `POST /api/v1/contact`
- `GET /api/v1/session`
- `GET /api/v1/patients/export`
- `GET /api/v1/appointments/export`
- `POST /api/v1/cron/reminders`
- `GET /api/v1/health`

**Mejoras:**
- Separación de exports por recurso (patients vs appointments)
- Headers de deprecación en endpoints antiguos
- Documentación completa de API
- TypeScript interfaces para responses

---

## 🛠️ Desarrollo

### Agregar Nuevo Endpoint

1. **Crear ruta en `/api/v1/`**
```typescript
// src/app/api/v1/resource/route.ts
import { successResponse, handleApiError } from "@/lib/api/responses";

export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return successResponse(data);
  } catch (error) {
    return handleApiError(error, "/api/v1/resource");
  }
}
```

2. **Agregar validación con Zod**
```typescript
import { z } from "zod";

const schema = z.object({
  field: z.string().min(1)
});

const validated = schema.parse(body);
```

3. **Documentar en este archivo**

4. **Agregar tests** (TODO: configurar testing)

---

## 📚 Referencias

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
