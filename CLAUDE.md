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
- Implementado en rutas críticas

## Convenciones

1. **Server Actions:** `"use server"` + validación Zod + encriptación
2. **Validadores:** Schemas en `src/lib/validators/`
3. **Formularios:** React Hook Form + shadcn/ui
4. **Auth:** `requireDoctor()` en rutas protegidas
5. **Auditoría:** `logAudit()` en acciones críticas

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

# Seed
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="password"
SEED_DOCTOR_NAME="Dra. Kristhy"
```

## Changelog

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
# Configurar .env.local
pnpm db:push
pnpm db:seed
pnpm dev
```

Abrir http://localhost:3000
