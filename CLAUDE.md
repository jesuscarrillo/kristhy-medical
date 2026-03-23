# CLAUDE.md - Guía del Proyecto

## Resumen

Sistema de gestión médica para consultorio de ginecología y obstetricia. Landing pública multilingüe + dashboard privado con gestión completa de pacientes, citas, ecografías, certificados, historiales y prescripciones.

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Server Actions, Prisma 7
- **Base de datos:** Supabase (PostgreSQL + pgBouncer)
- **Storage:** Supabase Storage
- **Auth:** Better Auth
- **Seguridad:** AES-256-GCM + RLS
- **i18n:** next-intl (es/en)
- **Email:** Resend

## Estructura

```
src/
├── app/
│   ├── (dashboard)/dashboard/
│   │   ├── pacientes/[id]/
│   │   │   ├── historial/
│   │   │   ├── imagenes/
│   │   │   ├── prescripciones/
│   │   │   ├── ecografias/        # v2.0
│   │   │   └── certificados/      # v2.0
│   │   ├── citas/
│   │   ├── consultas/             # v2.1
│   │   ├── reportes/
│   │   └── auditoria/
│   ├── [locale]/                  # Landing (es/en)
│   └── api/
├── components/
│   ├── patients/
│   ├── appointments/
│   ├── ultrasound/                # v2.0
│   ├── certificates/              # v2.0
│   └── prescriptions/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── utils/encryption.ts
│   └── validators/
└── server/
    ├── actions/
    └── middleware/auth.ts
```

## Comandos

```bash
pnpm dev              # Desarrollo
pnpm build            # Build
pnpm db:push          # Sincronizar BD
pnpm db:seed          # Crear usuario doctora
pnpm db:studio        # GUI de BD
```

## Docker

El proyecto incluye configuración completa de Docker para desarrollo y producción.

### Desarrollo Local

```bash
docker-compose up                    # Iniciar con hot-reload
./scripts/docker-dev.sh             # Script interactivo
docker-compose exec app pnpm db:seed # Seed dentro del contenedor
```

### Producción

```bash
./scripts/docker-build.sh           # Build imagen optimizada
./scripts/docker-prod.sh            # Iniciar producción
```

### Archivos

- `Dockerfile` - Producción (multi-stage, Node 20, ~350MB)
- `Dockerfile.dev` - Desarrollo (hot-reload, ~1.2GB)
- `docker-compose.yml` - Desarrollo con volúmenes
- `docker-compose.prod.yml` - Producción optimizada
- `docs/docker/` - Documentación completa
- `k8s/` - Manifiestos de Kubernetes

### Características

- Health check en `/api/health`
- Hot-reload para desarrollo
- Build args para DATABASE_URL (requerido por Prisma)
- Non-root user (nextjs:1001)
- CI/CD con GitHub Actions
- Compatible con AWS, GCP, DigitalOcean, Railway, Render

**Documentación:** Ver `docs/docker/DOCKER-LOCAL.md` para guía completa.

## Modelos Principales

### Core
- **Patient** - medicalRecordNumber, weight, height, pregnancyStatus, datos sociodemográficos
- **GynecologicalProfile** - antecedentes obstétricos, ciclos, menarche, sexarche
- **Appointment** - citas médicas
- **MedicalRecord** - historiales clínicos
- **Prescription** - recetas médicas

### v2.0
- **UltrasoundReport** - 3 tipos: FIRST_TRIMESTER, SECOND_THIRD_TRIMESTER, GYNECOLOGICAL
- **UltrasoundImage** - imágenes de ecografías
- **MedicalCertificate** - 7 tipos: REST, MEDICAL_REPORT, FITNESS, etc.
- **MedicalImage** - documentos con metadata (tipo, laboratorio, resultados)
- **AuditLog** - logs de auditoría

## Enums

```typescript
enum PregnancyStatus {
  NOT_PREGNANT, FIRST_TRIMESTER, SECOND_TRIMESTER,
  THIRD_TRIMESTER, POSTPARTUM
}

enum UltrasoundType {
  FIRST_TRIMESTER,           // Solo si pregnancyStatus = FIRST_TRIMESTER
  SECOND_THIRD_TRIMESTER,    // Solo si SECOND o THIRD_TRIMESTER
  GYNECOLOGICAL              // Siempre disponible
}

enum CertificateType {
  REST, MEDICAL_REPORT, MEDICAL_CONSTANCY, FITNESS,
  DISABILITY, PREGNANCY, OTHER
}

enum DocumentType {
  LAB_RESULT, CYTOLOGY, BIOPSY, ULTRASOUND, XRAY,
  MRI_CT, EXTERNAL_REPORT, PRESCRIPTION, OTHER
}
```

## Módulos Principales

### 1. Pacientes
**Rutas:** `/dashboard/pacientes`, `/dashboard/pacientes/[id]`
**Actions:** `src/server/actions/patient.ts`
- createPatient, getPatients, getPatient, updatePatient, deactivatePatient

### 2. Ecografías (v2.0)
**Rutas:** `/dashboard/pacientes/[id]/ecografias/*`
**Actions:** `src/server/actions/ultrasound.ts`
**Validación:** Tipo de eco según pregnancyStatus del paciente
**Componentes:** UltrasoundForm, FirstTrimesterFields, SecondThirdTrimesterFields, GynecologicalFields, UltrasoundPrintView

### 3. Certificados (v2.0)
**Rutas:** `/dashboard/pacientes/[id]/certificados/*`
**Actions:** `src/server/actions/certificate.ts`
**Templates:** Auto-rellena contenido según tipo
**Especial:** REST auto-calcula validUntil = validFrom + restDays

### 4. Imágenes/Documentos
**Rutas:** `/dashboard/pacientes/[id]/imagenes`
**Actions:** `src/server/actions/images.ts`
**Filtros:** documentType, isNormal, fechas, tags
**Storage:** Supabase Storage

### 5. Historiales Clínicos
**Rutas:** `/dashboard/pacientes/[id]/historial/*`
**Actions:** `src/server/actions/medicalRecord.ts`

### 6. Prescripciones
**Rutas:** `/dashboard/pacientes/[id]/prescripciones/*`
**Actions:** `src/server/actions/prescription.ts`
**Print:** Vista optimizada con auto-print

### 7. Citas + Calendario
**Rutas:** `/dashboard/citas/*`, `/dashboard/citas/calendario`
**Actions:** `src/server/actions/appointment.ts`
**Cron:** Recordatorios automáticos diarios 8:00 AM

### 8. Consultas Recientes (v2.1)
**Ruta:** `/dashboard/consultas`
**Vista:** Historial global de consultas

### 9. Reportes
**Ruta:** `/dashboard/reportes`
**Actions:** `src/server/actions/reports.ts`
**API:** `/api/reports/export` (CSV)

### 10. Auditoría
**Ruta:** `/dashboard/auditoria`
**Actions:** `src/server/actions/audit.ts`
**Entidades:** patient, medical_record, prescription, ultrasound, certificate, export

## Seguridad

### Campos Encriptados (AES-256-GCM)
- **Patient:** cedula, phone, email, address, emergencyContact, allergies
- **MedicalRecord:** personalHistory, gynecologicHistory

### RLS (Supabase)
- Políticas en todas las tablas
- Solo acceso vía service role

### Rate Limiting
- `rateLimitAction()` en 7 server actions de mutación/upload
- `rateLimit()` en API routes (contact, export, cron)
- In-memory store (producción multi-instancia requiere Redis)

### reCAPTCHA (Login Protection)
- **v3 (Invisible):** Score-based verification en background
- **v2 (Fallback):** Checkbox "No soy un robot" cuando score < 0.5
- **Server Actions:** `verifyRecaptcha()`, `verifyLoginCaptcha()`
- **Rate Limiting:** 5 intentos por 15 minutos en login
- **Threshold:** 0.5 (configurable via `RECAPTCHA_SCORE_THRESHOLD`)
- **Bundle:** ~5KB (react-google-recaptcha-v3 + v2), carga async/defer
- **Documentación:** Ver `docs/SECURITY.md` para configuración detallada

### Supply Chain Protection (ignore-scripts)
- **`.npmrc`** en raíz del proyecto con `ignore-scripts=true`
- Bloquea ejecución de lifecycle hooks (`preinstall`, `postinstall`, etc.) al instalar dependencias
- Previene ataques de supply chain via paquetes maliciosos
- Solo ~2% de paquetes npm usan install scripts, impacto mínimo
- **Paquetes que requieren rebuild manual:** `prisma`, `sharp`, `bcrypt`, `node-sass`
- Después de `pnpm install`, ejecutar: `pnpm rebuild prisma` o `pnpm prisma generate`

### Middleware (src/middleware.ts)
- Protección de rutas `/dashboard/*` via cookie de sesión
- Redirect a `/login` si no hay sesión
- i18n middleware para rutas públicas

## Convenciones

1. **Server Actions:** `"use server"` + rateLimitAction + validación Zod + try-catch + error sanitizado
2. **Validadores:** Schemas en `src/lib/validators/`
3. **Formularios:** React Hook Form + shadcn/ui
4. **Auth:** `requireDoctor()` en rutas protegidas
5. **Auditoría:** `logAudit()` en acciones críticas
6. **Decrypt:** Siempre usar `safeDecrypt()` nunca `decrypt()` directo
7. **revalidateTag:** Requiere 2do parámetro en Next.js 16: `revalidateTag(tag, "default")`
8. **Suspense:** Páginas del dashboard usan `<Suspense>` con skeletons para streaming

## Variables de Entorno

```bash
# Base de datos
DATABASE_URL="postgresql://...?pgbouncer=true"
DIRECT_URL="postgresql://...postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Seguridad
ENCRYPTION_KEY="64_hex_chars"
BETTER_AUTH_SECRET="base64_secret"
BETTER_AUTH_URL="http://localhost:3000"

# Email
RESEND_API_KEY="re_xxx"
EMAIL_FROM="Dra. Kristhy <noreply@domain.com>"
CRON_SECRET="secret"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_PHONE="+58 412-073-5223"

# reCAPTCHA (Login Protection)
# Obtener en: https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY="6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
RECAPTCHA_V3_SECRET_KEY="6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY="6LeYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
RECAPTCHA_V2_SECRET_KEY="6LeYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
RECAPTCHA_SCORE_THRESHOLD="0.5"  # Opcional, default 0.5

# Seed
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="password"
SEED_DOCTOR_NAME="Dra. Kristhy"
```

## API REST

El proyecto implementa una API REST completa siguiendo mejores prácticas de diseño.

### Estructura

- **Versionado:** Todos los endpoints usan prefijo `/api/v1/` para versionado
- **Respuestas:** Envelope pattern consistente con `data` y `meta`
- **Errores:** Estructura estandarizada con códigos semánticos
- **Rate Limiting:** Protección en todos los endpoints públicos

### Endpoints v1

```typescript
// Públicos
POST /api/v1/contact              // Formulario de contacto

// Autenticados (requiere sesión)
GET  /api/v1/session              // Verificar sesión actual
GET  /api/v1/patients/export      // Exportar pacientes (CSV)
GET  /api/v1/appointments/export  // Exportar citas (CSV)

// Cron (requiere Bearer token)
POST /api/v1/cron/reminders       // Enviar recordatorios

// Monitoreo
GET  /api/v1/health               // Health check + DB status
```

### Estructura de Respuestas

**Éxito (2xx):**
```typescript
{
  data: T,
  meta: {
    timestamp: string,
    version?: string,
    message?: string
  }
}
```

**Error (4xx/5xx):**
```typescript
{
  error: string,        // Código (PascalCase)
  message: string,      // Mensaje legible
  details?: unknown,    // Información adicional
  timestamp: string,
  path: string
}
```

### Códigos de Error

- `BadRequest` (400) - Sintaxis inválida
- `Unauthorized` (401) - Sin autenticación
- `Forbidden` (403) - Sin permisos
- `NotFound` (404) - Recurso no existe
- `ValidationError` (422) - Error de validación Zod
- `RateLimitExceeded` (429) - Rate limit alcanzado
- `InternalServerError` (500) - Error del servidor
- `ServiceUnavailable` (503) - Servicio no disponible

### Rate Limiting

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/api/v1/contact` | 5 req | 15 min |
| `/api/v1/*/export` | 10 req | 15 min |
| `/api/v1/cron/reminders` | 60 req | 15 min |

### Endpoints Deprecated

Los siguientes endpoints **funcionan** pero están marcados como deprecated:

- `/api/contact` → usar `/api/v1/contact`
- `/api/auth-check` → usar `/api/v1/session`
- `/api/reports/export` → usar `/api/v1/patients/export` o `/api/v1/appointments/export`
- `/api/cron/reminders` → usar `/api/v1/cron/reminders`
- `/api/health` → usar `/api/v1/health` (mantener para Docker)

**Nota:** Los endpoints deprecated incluyen headers `X-Deprecated: true` y `X-Use-Instead`.

### Utilidades

```typescript
// lib/api/responses.ts
successResponse<T>(data, meta?)     // Respuesta exitosa
errorResponse(...)                   // Respuesta de error
validationErrorResponse(zodError)   // Error de validación
handleApiError(error, path)         // Handler genérico
rateLimitErrorResponse(reset, path) // Rate limit

// lib/api/csv.ts
escapeCSV(value)                    // Escapar valores
generateCSV(headers, rows)          // Generar CSV
addBOM(csv)                         // Agregar BOM UTF-8
generateFilename(prefix)            // Nombre con timestamp
```

**Documentación completa:** Ver `docs/API.md`

## Changelog

### v2.2.5 (Febrero 2026 - reCAPTCHA Fix + Legal Pages Update)
- **reCAPTCHA Optimization:** Badge ahora aparece SOLO en login + contacto (no en todas las páginas)
- **reCAPTCHA Fix:** Removido RecaptchaProvider de [locale]/layout.tsx
- **reCAPTCHA Architecture:** Creado `/[locale]/contacto/layout.tsx` con provider scoped
- **Legal Pages:** Términos y Privacidad completamente rediseñadas
- **Content Update:** Clarificado que formulario redirige a WhatsApp (NO almacena en DB)
- **Privacy Policy:** Actualizada para reflejar comunicación WhatsApp-only
- **Design Premium:** Cards con bordes, backgrounds, secciones estructuradas
- **Dark Mode:** Legal pages ahora tienen dark mode completo (text-slate-X dark:text-slate-X)
- **Typography:** Jerarquía mejorada con headings h2, listas, y divisores
- **UX:** Fecha actualizada a "Febrero 2026", enlaces teal con hover states
- **Files:** 4 archivos modificados/creados (layout, terminos, privacidad, contacto/layout)

### v2.2.4 (Febrero 2026 - Dark Mode Completo)
- **Dark Mode:** Implementación completa en landing page y dashboard
- **Sistema:** next-themes instalado con ThemeProvider en root layout
- **ThemeToggle:** Componente Sun/Moon con animación de rotación (300ms)
- **Landing Page:** 11 componentes actualizados (Hero, About, Contact, Testimonials, Services, ServiceCard, Header, ContactForm, Footer, LanguageSwitcher, Label)
- **Dashboard:** AppSidebar con ThemeToggle integrado, dark mode completo
- **Paleta Dark:** slate-950 bg principal, slate-800 cards, teal-400 primary, teal-900/30 accents, slate-700 borders, slate-100 text
- **Performance:** Sin FOUC, persistencia localStorage, detección system, transiciones suaves
- **Fixes:** Hydration error en DashboardLayoutClient resuelto con Suspense boundary
- **Fixes:** Select dropdown texto seleccionado con `text-foreground` explícito
- **Fixes:** WhatsApp floating button eliminado (redundante con formulario)
- **reCAPTCHA:** Optimizado - movido de root layout a login + [locale] layout únicamente
- **Bundle:** Reducción ~25KB en páginas que no usan reCAPTCHA
- **Components:** Label, Select, Input, Textarea todos con dark mode correcto
- **Contraste:** AAA compliant en ambos modos (WCAG 2.1)
- **Dependencies:** next-themes@0.4.6

### v2.2.3 (Febrero 2026 - reCAPTCHA Protection)
- **Seguridad:** Implementación de Google reCAPTCHA v3 + v2 en login
- **Seguridad:** Protección contra ataques de fuerza bruta y bots automatizados
- **reCAPTCHA v3:** Verificación invisible en background (score-based)
- **reCAPTCHA v2:** Fallback automático con checkbox cuando score < 0.5
- **Server Actions:** `verifyRecaptcha()` y `verifyLoginCaptcha()`
- **Performance:** Bundle size +5KB, carga async/defer (no bloquea render)
- **Rate Limiting:** 5 intentos de login por 15 minutos
- **Threshold:** Configurable via `RECAPTCHA_SCORE_THRESHOLD` (default 0.5)
- **Monitoring:** Logs de consola para scores bajos y uso de fallback
- **Dependencies:** `react-google-recaptcha-v3`, `react-google-recaptcha`
- **TypeScript:** Tipos declarados en `src/env.d.ts` para env vars
- **Docs:** Documentación completa en `docs/SECURITY.md`
- **UX:** Disclaimer de privacidad de Google en login form
- **Variables:** 5 nuevas env vars (2 site keys, 2 secret keys, 1 threshold)

### v2.2.2 (Febrero 2026 - Integración WhatsApp)
- **WhatsApp:** Formulario de contacto integrado con WhatsApp (cliente directo)
- **WhatsApp:** Utilidad `whatsapp.ts` con funciones de formateo y normalización
- **WhatsApp:** Variable de entorno `NEXT_PUBLIC_WHATSAPP_PHONE` para configuración
- **WhatsApp:** Botón "Enviar por WhatsApp" con color verde oficial (#25D366)
- **WhatsApp:** Mensaje pre-formateado con datos del formulario
- **WhatsApp:** WhatsAppButton refactorizado para usar env vars
- **API:** Endpoint `/api/v1/contact` marcado como deprecated (mantiene funcionalidad)
- **Docs:** Documentación completa de diseño en `docs/plans/2026-02-10-whatsapp-contact-form-design.md`
- **i18n:** Traducciones ES/EN actualizadas con textos de WhatsApp

### v2.2.1 (Febrero 2026 - Auditoría Integral + REST API)
- **API REST:** Refactorización completa según principios REST
- **API REST:** Versionado `/api/v1/` en todos los endpoints
- **API REST:** Estructura de respuesta consistente con envelope pattern
- **API REST:** Manejo de errores estandarizado con códigos semánticos
- **API REST:** Endpoints orientados a recursos (patients/export, appointments/export)
- **API REST:** Rate limiting en todos los endpoints públicos (5-60 req/15min)
- **API REST:** Documentación completa en `docs/API.md`
- **API REST:** Utilidades compartidas (`lib/api/responses.ts`, `lib/api/csv.ts`)
- **API REST:** Backward compatibility en endpoints antiguos (deprecated pero funcionales)
- **Seguridad:** safeDecrypt en todos los server actions (incluido reports.ts)
- **Seguridad:** Error handling (try-catch) en 20+ funciones de server actions
- **Seguridad:** Rate limiting en 7 server actions críticos (mutaciones + uploads)
- **Seguridad:** CSP sin unsafe-eval, signed URLs de 30 días
- **Seguridad:** Upload validation (MIME + tamaño) en ultrasound.ts e images.ts
- **Infra:** middleware.ts para protección de rutas + i18n
- **Infra:** error.tsx y not-found.tsx (global + dashboard)
- **Infra:** .env → .env.local para secrets
- **DB:** $transaction en createPatient y updatePatient
- **DB:** Pool timeouts configurados (max:10, idle:30s, connect:10s)
- **SEO:** sitemap.ts, robots.ts, JSON-LD, hreflang, canonical URLs
- **SEO:** Metadata individual por página (contacto, servicios, sobre-mi)
- **Performance:** Suspense boundaries en 6 páginas del dashboard con skeletons
- **Cache:** revalidateTag corregido con profile "default" (Next.js 16)
- **Audit:** Logging en todos los CRUD incluyendo appointments

### v2.2.0 (Abril 2026)
- Landing page rediseñada (Hero, About, Testimonios)
- Smooth scroll manual en Header
- Traducción completa ES/EN
- RLS para tablas públicas
- CSP para Google Maps
- Performance optimizations

### v2.1.0 (Marzo 2026)
- UI/UX premium con glassmorphism
- Responsive design mejorado
- Módulo de Consultas Globales
- Calendario mejorado

### v2.0.0 (Febrero 2026)
- Módulo de Ecografías (3 tipos)
- Módulo de Certificados (7 tipos)
- Campos sociodemográficos en Patient
- Metadata extendida en imágenes
- Vistas de impresión

### v1.0.0 (Enero 2026)
- Sistema base completo
- CRUD pacientes, citas, historiales, prescripciones
- Calendario + reportes + auditoría
- RLS + encriptación

## Quick Start

```bash
git clone <repo>
cd kristhy-medical
pnpm install
cp .env.example .env.local
# Configurar .env.local con tus credenciales
pnpm db:push
pnpm db:seed
pnpm dev
```

Abrir http://localhost:3000
