# Sistema de Gestión Médica - Dra. Kristhy v2.2

Sistema de gestión médica para consultorio de ginecología y obstetricia. Combina una landing page pública multilingüe con un dashboard privado para gestión de pacientes, citas, historiales clínicos, ecografías, certificados médicos e imágenes médicas.

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend** | Server Actions de Next.js, Prisma 7 |
| **Base de datos** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (imágenes médicas, ecografías) |
| **Autenticación** | Better Auth (email/password, roles) |
| **Encriptación** | AES-256-GCM para datos sensibles |
| **i18n** | next-intl (español/inglés) |
| **Email** | Resend + React Email |

## Instalación y Ejecución

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Sincronizar schema de base de datos
pnpm db:push

# Crear usuario doctora (opcional)
pnpm db:seed

# Iniciar servidor de desarrollo
pnpm dev

# Ejecutar tests
pnpm test

# Tests con UI interactiva
pnpm test:ui

# Tests con cobertura
pnpm test:coverage
```

## API REST

El proyecto incluye una API REST completa con versionado `/v1/`:

- **Especificación OpenAPI:** `docs/openapi.yaml`
- **Documentación:** `docs/API.md`
- **Tests:** `src/lib/api/__tests__/`

### Endpoints Principales

```bash
# Públicos
POST /api/v1/contact              # Formulario de contacto

# Autenticados (requiere sesión)
GET  /api/v1/session              # Verificar sesión
GET  /api/v1/patients/export      # Exportar pacientes (CSV)
GET  /api/v1/appointments/export  # Exportar citas (CSV)

# Cron (requiere Bearer token)
POST /api/v1/cron/reminders       # Enviar recordatorios

# Monitoreo
GET  /api/v1/health               # Health check
```

Ver `docs/API.md` para documentación completa.

## Variables de Entorno

```bash
# Base de datos
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Seguridad
ENCRYPTION_KEY="64_hex_chars"
BETTER_AUTH_SECRET="base64_secret"
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend) - para notificaciones
RESEND_API_KEY="re_xxxxxxxx"
EMAIL_FROM="Dra. Kristhy <noreply@tudominio.com>"
CRON_SECRET="tu_secreto_para_cron"

# Seed opcional
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="password_seguro"
SEED_DOCTOR_NAME="Dra. Kristhy"
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (dashboard)/              # Rutas protegidas del dashboard
│   │   └── dashboard/
│   │       ├── pacientes/        # CRUD pacientes
│   │       │   └── [id]/
│   │       │       ├── historial/       # Historiales clínicos
│   │       │       ├── imagenes/        # Imágenes médicas
│   │       │       ├── prescripciones/  # Recetas médicas
│   │       │       ├── ecografias/      # Reportes ecográficos (v2.0)
│   │       │       └── certificados/    # Certificados médicos (v2.0)
│   │       ├── citas/            # CRUD citas + calendario
│   │       ├── reportes/         # Reportes y estadísticas
│   │       └── auditoria/        # Logs de auditoría
│   ├── [locale]/                 # Landing pública (es/en)
│   ├── api/
│   │   ├── auth/                 # Better Auth endpoint
│   │   ├── reports/              # API de exportación CSV
│   │   └── cron/                 # Recordatorios automáticos
│   └── login/                    # Página de login
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── patients/                 # PatientForm, MedicalRecordForm, ImageUploader
│   ├── appointments/             # AppointmentForm, CalendarView
│   ├── prescriptions/            # PrescriptionForm
│   ├── ultrasound/               # Formularios ecografías (v2.0)
│   ├── certificates/             # Formularios certificados (v2.0)
│   ├── reports/                  # ReportFilters, SimpleBarChart
│   └── layout/                   # Header, Footer, etc.
├── lib/
│   ├── auth.ts                   # Configuración Better Auth
│   ├── prisma.ts                 # Cliente Prisma singleton
│   ├── supabase.ts               # Clientes Supabase
│   ├── email.ts                  # Cliente Resend
│   ├── utils/encryption.ts       # AES-256-GCM encrypt/decrypt
│   └── validators/               # Schemas Zod
│       ├── patient.ts
│       ├── gynecologicalProfile.ts
│       ├── ultrasound.ts         # (v2.0)
│       ├── certificate.ts        # (v2.0)
│       └── medicalImage.ts       # (v2.0)
└── server/
    ├── actions/                  # Server actions (CRUD)
    │   ├── patient.ts
    │   ├── appointment.ts
    │   ├── medicalRecord.ts
    │   ├── prescription.ts
    │   ├── images.ts
    │   ├── ultrasound.ts         # (v2.0)
    │   ├── certificate.ts        # (v2.0)
    │   ├── reports.ts
    │   ├── notifications.ts
    │   └── audit.ts
    └── middleware/auth.ts        # Guards de autenticación
```

## Modelos de Base de Datos

| Modelo | Descripción |
|--------|-------------|
| **User/Session/Account** | Better Auth (autenticación) |
| **Patient** | Datos del paciente (medicalRecordNumber, weight, height, pregnancyStatus, datos sociodemográficos) |
| **GynecologicalProfile** | Antecedentes gineco-obstétricos (1:1 con Patient) |
| **Appointment** | Citas médicas |
| **MedicalRecord** | Historiales clínicos |
| **Prescription** | Recetas médicas |
| **UltrasoundReport** | Reportes ecográficos (v2.0) |
| **UltrasoundImage** | Imágenes de ecografías (v2.0) |
| **MedicalCertificate** | Certificados médicos (v2.0) |
| **MedicalImage** | Referencias a imágenes en Supabase Storage |
| **AuditLog** | Registro de auditoría de accesos |

### Enums

```typescript
// Estado de embarazo del paciente
enum PregnancyStatus {
  NOT_PREGNANT      // No embarazada
  FIRST_TRIMESTER   // Primer trimestre
  SECOND_TRIMESTER  // Segundo trimestre
  THIRD_TRIMESTER   // Tercer trimestre
  POSTPARTUM        // Postparto
}

// Tipo de ecografía (validado según pregnancyStatus)
enum UltrasoundType {
  FIRST_TRIMESTER        // Solo si pregnancyStatus = FIRST_TRIMESTER
  SECOND_THIRD_TRIMESTER // Solo si pregnancyStatus = SECOND o THIRD_TRIMESTER
  GYNECOLOGICAL          // Siempre disponible
}

// Tipo de certificado médico
enum CertificateType {
  REST              // Reposo médico (requiere días)
  MEDICAL_REPORT    // Informe médico
  MEDICAL_CONSTANCY // Constancia médica
  FITNESS           // Apto médico
  DISABILITY        // Incapacidad
  PREGNANCY         // Certificado de embarazo
  OTHER             // Otro
}

// Tipo de documento/imagen médica
enum DocumentType {
  LAB_RESULT      // Resultado de laboratorio
  CYTOLOGY        // Citología
  BIOPSY          // Biopsia
  ULTRASOUND      // Ecografía externa
  XRAY            // Rayos X
  MRI_CT          // Resonancia/Tomografía
  EXTERNAL_REPORT // Informe externo
  PRESCRIPTION    // Receta/Récipe
  OTHER           // Otro
}
```

---

## Módulos Implementados

### 1. Pacientes (CRUD Completo)

**Server Actions:** `src/server/actions/patient.ts`
```typescript
createPatient(formData: FormData)
getPatients(page?: number, limit?: number, search?: string)
getPatient(id: string)
updatePatient(id: string, formData: FormData)
deactivatePatient(id: string)
```

**Rutas:**
| Ruta | Descripción |
|------|-------------|
| `/dashboard/pacientes` | Lista con paginación y búsqueda |
| `/dashboard/pacientes/nuevo` | Crear paciente |
| `/dashboard/pacientes/[id]` | Ver detalle |
| `/dashboard/pacientes/[id]/editar` | Editar paciente |

**Campos del Paciente:**
- **Básicos:** firstName, lastName, cedula, dateOfBirth, gender, phone, email, address
- **Médicos:** medicalRecordNumber (HM-000001), weight (kg), height (cm), bloodType, allergies
- **Embarazo:** pregnancyStatus (solo femeninos)
- **Sociodemográficos:** maritalStatus, occupation, nationality, educationLevel, religion

---

### 2. Ecografías (v2.0 - CRUD Completo)

**Server Actions:** `src/server/actions/ultrasound.ts`
```typescript
createUltrasound(formData: FormData)      // Valida tipo vs pregnancyStatus
getUltrasounds(patientId: string)         // Lista por paciente
getUltrasound(id: string)                 // Detalle con imágenes
updateUltrasound(id: string, formData: FormData)
deleteUltrasound(id: string)              // Soft delete
uploadUltrasoundImage(formData: FormData) // Subir imagen a Supabase
deleteUltrasoundImage(id: string)
```

**Rutas:**
| Ruta | Descripción |
|------|-------------|
| `/dashboard/pacientes/[id]/ecografias` | Lista de ecografías |
| `/dashboard/pacientes/[id]/ecografias/nuevo` | Crear (selección de tipo) |
| `/dashboard/pacientes/[id]/ecografias/[ecoId]` | Ver detalle |
| `/dashboard/pacientes/[id]/ecografias/[ecoId]/editar` | Editar |
| `/dashboard/pacientes/[id]/ecografias/[ecoId]/imprimir` | Vista impresión |

**Tipos y Validación:**
```typescript
// Solo se permiten ciertos tipos según el estado de embarazo
const validUltrasoundTypes = {
  NOT_PREGNANT: ["GYNECOLOGICAL"],
  FIRST_TRIMESTER: ["FIRST_TRIMESTER", "GYNECOLOGICAL"],
  SECOND_TRIMESTER: ["SECOND_THIRD_TRIMESTER", "GYNECOLOGICAL"],
  THIRD_TRIMESTER: ["SECOND_THIRD_TRIMESTER", "GYNECOLOGICAL"],
  POSTPARTUM: ["GYNECOLOGICAL"],
};
```

**Campos por Tipo:**

| Primer Trimestre | 2do/3er Trimestre | Ginecológica |
|------------------|-------------------|--------------|
| CRL (mm) | DBP, CC, CA, LF (mm) | Útero: posición, medidas |
| Saco gestacional | Peso estimado (g) | Endometrio: grosor, aspecto |
| FCF (lpm) | Líquido amniótico (ILA) | Ovarios: medidas, volumen |
| Translucencia nucal | Placenta: ubicación, grado | Douglas: libre/ocupado |
| Hueso nasal | Cordón umbilical | |
| Número de embriones | Presentación, dorso | |

---

### 3. Certificados Médicos (v2.0 - CRUD Completo)

**Server Actions:** `src/server/actions/certificate.ts`
```typescript
createCertificate(formData: FormData)
getCertificates(patientId: string)
getCertificate(id: string)
updateCertificate(id: string, formData: FormData)
deleteCertificate(id: string)  // Soft delete
```

**Rutas:**
| Ruta | Descripción |
|------|-------------|
| `/dashboard/pacientes/[id]/certificados` | Lista de certificados |
| `/dashboard/pacientes/[id]/certificados/nuevo` | Crear certificado |
| `/dashboard/pacientes/[id]/certificados/[certId]` | Ver detalle |
| `/dashboard/pacientes/[id]/certificados/[certId]/editar` | Editar |
| `/dashboard/pacientes/[id]/certificados/[certId]/imprimir` | Vista impresión |

**Tipos de Certificado:**
| Tipo | Etiqueta | Notas |
|------|----------|-------|
| `REST` | Reposo médico | Requiere `restDays`, auto-calcula `validUntil` |
| `MEDICAL_REPORT` | Informe médico | Template con secciones clínicas |
| `MEDICAL_CONSTANCY` | Constancia médica | Constancia de asistencia |
| `FITNESS` | Apto médico | Certificado de aptitud |
| `DISABILITY` | Incapacidad | Incapacidad temporal |
| `PREGNANCY` | Certificado de embarazo | Estado del embarazo |
| `OTHER` | Otro | Genérico |

---

### 4. Imágenes Médicas (v2.0 Mejorado)

**Server Actions:** `src/server/actions/images.ts`
```typescript
uploadMedicalImage(formData: FormData)
getMedicalImages(patientId: string, filters?: GetImagesFilters, page?: number, limit?: number)
getMedicalImage(id: string)
updateMedicalImage(id: string, formData: FormData)
deleteMedicalImage(id: string)
```

**Filtros disponibles:**
```typescript
interface GetImagesFilters {
  documentType?: DocumentType;  // Filtrar por tipo
  isNormal?: boolean;           // Normal/Anormal
  startDate?: Date;             // Desde fecha
  endDate?: Date;               // Hasta fecha
  tags?: string[];              // Por etiquetas
}
```

**Ruta:** `/dashboard/pacientes/[id]/imagenes`

---

### 5. Historial Clínico (CRUD Completo)

**Server Actions:** `src/server/actions/medicalRecord.ts`
```typescript
createMedicalRecord(formData: FormData)
getMedicalRecords(patientId: string)
getMedicalRecord(id: string)
updateMedicalRecord(id: string, formData: FormData)
deleteMedicalRecord(id: string)
```

**Rutas:**
| Ruta | Descripción |
|------|-------------|
| `/dashboard/pacientes/[id]/historial` | Lista y crear |
| `/dashboard/pacientes/[id]/historial/[recordId]` | Ver detalle |
| `/dashboard/pacientes/[id]/historial/[recordId]/editar` | Editar |

---

### 6. Citas (CRUD Completo + Calendario)

**Server Actions:** `src/server/actions/appointment.ts`
```typescript
createAppointment(formData: FormData)
getAppointments(page?: number, limit?: number, status?: string)
getAppointment(id: string)
updateAppointment(id: string, formData: FormData)
deleteAppointment(id: string)
getAppointmentsByDateRange(startDate: Date, endDate: Date)
```

**Rutas:**
| Ruta | Descripción |
|------|-------------|
| `/dashboard/citas` | Lista de citas |
| `/dashboard/citas/calendario` | Vista calendario (mensual/semanal) |
| `/dashboard/citas/nuevo` | Crear cita (acepta `?date=YYYY-MM-DD`) |
| `/dashboard/citas/[id]` | Ver detalle |
| `/dashboard/citas/[id]/editar` | Editar cita |

---

### 7. Prescripciones (CRUD Completo)

**Server Actions:** `src/server/actions/prescription.ts`
```typescript
createPrescription(formData: FormData)
getPrescriptions(patientId: string)
getPrescription(id: string)
updatePrescription(id: string, formData: FormData)
deletePrescription(id: string)
```

**Rutas:**
| Ruta | Descripción |
|------|-------------|
| `/dashboard/pacientes/[id]/prescripciones` | Lista |
| `/dashboard/pacientes/[id]/prescripciones/nuevo` | Crear |
| `/dashboard/pacientes/[id]/prescripciones/[prescriptionId]` | Ver detalle |
| `/dashboard/pacientes/[id]/prescripciones/[prescriptionId]/editar` | Editar |
| `/dashboard/pacientes/[id]/prescripciones/[prescriptionId]/imprimir` | Imprimir |

---

### 8. Reportes y Estadísticas

**Server Actions:** `src/server/actions/reports.ts`
```typescript
getReportStats(filters?: ReportFilters)
getExportData(filters?: ReportFilters)
```

**API de Exportación:** `GET /api/reports/export?startDate=...&endDate=...&type=...&status=...`

**Ruta:** `/dashboard/reportes`

**Funcionalidades:**
- Filtros por rango de fechas, tipo de consulta, estado
- Gráficos: citas por mes, tipo, estado, género
- Cards de estadísticas
- Exportación a CSV

---

### 9. Notificaciones (Recordatorios)

**Server Actions:** `src/server/actions/notifications.ts`
```typescript
sendAppointmentReminders()      // Automático (cron)
sendManualReminder(appointmentId: string)  // Manual
getAppointmentsForReminder()
```

**API Cron:** `GET /api/cron/reminders` (protegido con `CRON_SECRET`)

**Configuración Vercel Cron:** `vercel.json`
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 8 * * *"
  }]
}
```

---

### 10. Auditoría de Accesos

**Server Actions:** `src/server/actions/audit.ts`
```typescript
logAudit(data: AuditLogData)
getAuditLogs(filters?: AuditFilters, page?: number, limit?: number)
getAuditStats()
```

**Ruta:** `/dashboard/auditoria`

**Entidades auditadas:**
- `patient`, `medical_record`, `prescription`, `medical_image`
- `appointment`, `ultrasound`, `ultrasound_image`, `certificate`, `export`

**Acciones registradas:** `view`, `create`, `update`, `delete`, `export`

---

## Seguridad

### Encriptación de Datos Sensibles
- **Algoritmo:** AES-256-GCM
- **Campos encriptados:**
  - **Patient:** cedula, phone, email, address, emergencyContact, allergies
  - **MedicalRecord:** personalHistory, gynecologicHistory

### Row Level Security (Supabase)
- Políticas RLS en todas las tablas
- Bloquea acceso `anon`/`authenticated`
- Solo acceso vía service role (Server Actions)

### Autenticación (Better Auth)
- Login con email/password
- Rol por defecto: `doctor`
- Middleware: `requireDoctor()` en server actions
- `src/middleware.ts` protege rutas `/dashboard/*`

### Rate Limiting
- Server actions: `rateLimitAction()` en mutaciones y uploads (20 req/min, 10 req/min uploads)
- API routes: `rateLimit()` en contact, export, cron
- In-memory store (producción requiere Redis/Upstash)

### Error Handling
- Try-catch en todos los server actions con errores sanitizados
- `error.tsx` y `not-found.tsx` a nivel global y dashboard
- ZodError → mensaje de validación, otros → mensaje genérico

### Security Headers
- HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
- CSP configurado (sin unsafe-eval)
- Referrer-Policy, Permissions-Policy

---

## Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Iniciar en producción
pnpm lint         # Verificar código
pnpm db:migrate   # Ejecutar migraciones
pnpm db:push      # Push schema sin migración
pnpm db:seed      # Crear usuario doctora
pnpm db:studio    # Abrir Prisma Studio
```

---

## Estado del Proyecto

### Completado (v2.2.1)
- [x] Landing page multilingüe (español/inglés)
- [x] Sistema de autenticación con Better Auth
- [x] Dashboard protegido con roles
- [x] CRUD completo de pacientes (con datos sociodemográficos)
- [x] Antecedentes gineco-obstétricos (GynecologicalProfile)
- [x] CRUD completo de historiales médicos
- [x] CRUD completo de citas + calendario
- [x] CRUD completo de prescripciones + impresión
- [x] **Módulo de Ecografías (3 tipos con validación)**
- [x] **Módulo de Certificados Médicos (7 tipos con templates)**
- [x] **Imágenes médicas con metadata extendida**
- [x] Upload de imágenes a Supabase Storage
- [x] Reportes con filtros y gráficos
- [x] Exportación a CSV
- [x] Notificaciones por email (Resend)
- [x] Recordatorios automáticos de citas (Vercel Cron)
- [x] Encriptación de datos sensibles (AES-256-GCM)
- [x] RLS completo en Supabase
- [x] Auditoría de accesos
- [x] Paginación en listas
- [x] Estados de carga (skeletons)
- [x] Confirmaciones en acciones destructivas
- [x] Vistas de impresión (prescripciones, ecografías, certificados)

---

## Changelog

### v2.0.0 (Febrero 2026)

#### Nuevos Módulos
- **Ecografías:** 3 tipos (primer trimestre, 2do/3er trimestre, ginecológica) con validación según estado de embarazo
- **Certificados Médicos:** 7 tipos con templates automáticos y cálculo de fechas para reposos

#### Mejoras a Modelos Existentes
- **Patient:** Nuevos campos sociodemográficos (maritalStatus, occupation, nationality, educationLevel, religion)
- **Patient:** Campo pregnancyStatus para control de tipos de ecografía
- **GynecologicalProfile:** Campos de historial sexual (menarche, sexarche, numberOfPartners)
- **MedicalImage:** Metadata extendida (documentType, laboratory, physician, results, isNormal, tags)

#### Componentes Nuevos
- `src/components/ultrasound/` - 8 componentes para ecografías
- `src/components/certificates/` - Formulario y vistas de certificados

#### Rutas Nuevas
- `/dashboard/pacientes/[id]/ecografias/*` - CRUD ecografías
- `/dashboard/pacientes/[id]/certificados/*` - CRUD certificados

### v2.1.0 (Marzo 2026)
- **Rediseño Premium UI/UX:** Interfaz modernizada con efectos glassmorphism, paleta de colores refinada y tipografía mejorada.
- **Responsive Design:** Sidebar navegación móvil mejorada y grillas adaptativas en todos los módulos.
- **Navegación:** Nueva barra de navegación interna en perfiles de paciente.
- **Consultas Globales:** Nueva vista `/dashboard/consultas` para visualizar el historial reciente de atenciones.
- **Calendario Mejorado:** Rediseño visual del componente de calendario.

### v2.2.1 (Febrero 2026 - Auditoría Integral)
- **Seguridad:** `safeDecrypt()` en todos los server actions (incluido reports.ts)
- **Seguridad:** Error handling (try-catch) con errores sanitizados en 20+ funciones
- **Seguridad:** Rate limiting en 7 server actions críticos (mutaciones + uploads)
- **Seguridad:** CSP sin unsafe-eval, signed URLs de 30 días, upload validation (MIME + tamaño)
- **Infra:** `middleware.ts` para protección de rutas + i18n
- **Infra:** `error.tsx` y `not-found.tsx` (global + dashboard)
- **Infra:** `.env` → `.env.local` para secrets
- **DB:** `$transaction` en createPatient y updatePatient
- **DB:** Pool timeouts configurados (max:10, idle:30s, connect:10s)
- **SEO:** sitemap.ts, robots.ts, JSON-LD, hreflang, canonical URLs, metadata por página
- **Performance:** Suspense boundaries con skeletons en 6 páginas del dashboard
- **Cache:** `revalidateTag` corregido con profile "default" (Next.js 16)
- **Audit:** Logging en todos los CRUD incluyendo appointments

### v2.2.0 (Abril 2026)
- **Landing Page Polish:** Rediseño de la sección Hero (2 columnas), About y Testimonios con estética premium y authority médica.
- **Correcciones de Navegación:** Implementación de smooth scroll manual en Header y Hero para resolver problemas de navegación por hash en Next.js.
- **Localización Completa:** Traducción total de la landing page (ES/EN), eliminando textos hardcodeados y unificando la identidad visual (ULA).
- **Seguridad & Datos:** Implementación de migración RLS para tablas de ecografías e imágenes, y resolución de errores de CSP para mapas de Google.
- **Performance:** Optimización de interacciones en botones y carga de imágenes de alta calidad (Q90).

### v2.0.0 (Febrero 2026)
- Número de historia médica (medicalRecordNumber)
- Datos antropométricos (weight, height)
- Antecedentes gineco-obstétricos (GynecologicalProfile)

### v1.0.0 (Enero 2026)
- Sistema base completo
- CRUD pacientes, citas, historiales, prescripciones
- Calendario de citas
- Reportes y exportación CSV
- Notificaciones por email
- Auditoría de accesos
- RLS en Supabase

---

## 🐳 Docker

El proyecto incluye soporte completo para Docker tanto para desarrollo como producción.

### Quick Start con Docker

```bash
# Desarrollo local con hot-reload
docker-compose up

# La aplicación estará disponible en http://localhost:3000
```

### Documentación

- 📘 **[Desarrollo Local](./docs/docker/DOCKER-LOCAL.md)** - Guía rápida para desarrollo con Docker
- 📖 **[Guía Completa](./docs/docker/README-DOCKER.md)** - Documentación exhaustiva (producción, cloud, Kubernetes)
- ☸️ **[Kubernetes](./k8s/README.md)** - Manifiestos y guía de deployment

### Scripts Disponibles

```bash
./scripts/docker-dev.sh      # Iniciar desarrollo
./scripts/docker-build.sh    # Build de producción
./scripts/docker-prod.sh     # Iniciar producción
./scripts/docker-stop.sh     # Detener contenedores
./scripts/docker-migrate.sh  # Ejecutar migraciones
./scripts/docker-seed.sh     # Seed de base de datos
```

### Características

- ✅ Hot-reload en desarrollo
- ✅ Dockerfile multi-stage optimizado para producción
- ✅ Health check endpoint (`/api/health`)
- ✅ CI/CD con GitHub Actions
- ✅ Kubernetes manifests listos
- ✅ Compatible con AWS, GCP, DigitalOcean, Railway, Render

Ver [docs/docker/](./docs/docker/) para más información.

---

## Notas

- La landing multi-idioma está en `src/app/[locale]/`
- El sistema privado está en `/dashboard/*`
- Prisma 7 requiere `prisma.config.ts` para migraciones
- Las vistas de impresión usan `window.print()` automático
