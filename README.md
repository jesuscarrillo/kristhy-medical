# Sistema de Gestión Médica - Dra. Kristhy

Sistema de gestión médica para consultorio de ginecología y obstetricia. Combina una landing page pública multilingüe con un dashboard privado para gestión de pacientes, citas, historiales clínicos e imágenes médicas.

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend** | Server Actions de Next.js, Prisma 7 |
| **Base de datos** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (imágenes médicas) |
| **Autenticación** | Better Auth (email/password, roles) |
| **Encriptación** | AES-256-GCM para datos sensibles |
| **i18n** | next-intl (español/inglés) |

## Instalación y Ejecución

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar migraciones
pnpm db:migrate

# Crear usuario doctora (opcional)
pnpm db:seed

# Iniciar servidor de desarrollo
pnpm dev
```

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

# Seed opcional
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="password_seguro"
SEED_DOCTOR_NAME="Dra. Kristhy"

# Email (Resend) - para notificaciones
RESEND_API_KEY="re_xxxxxxxx"
EMAIL_FROM="Dra. Kristhy <noreply@tudominio.com>"
CRON_SECRET="tu_secreto_para_cron"
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (dashboard)/              # Rutas protegidas del dashboard
│   │   └── dashboard/
│   │       ├── pacientes/        # CRUD pacientes + historial + imágenes
│   │       ├── citas/            # CRUD citas + calendario
│   │       └── reportes/         # Reportes y estadísticas
│   ├── [locale]/                 # Landing pública (es/en)
│   ├── api/
│   │   ├── auth/                 # Better Auth endpoint
│   │   └── reports/              # API de exportación
│   └── login/                    # Página de login
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── patients/                 # PatientForm, MedicalRecordForm, ImageUploader
│   ├── appointments/             # AppointmentForm, CalendarView
│   ├── prescriptions/            # PrescriptionForm
│   ├── reports/                  # ReportFilters, SimpleBarChart
│   └── layout/                   # Header, Footer, etc.
├── lib/
│   ├── auth.ts                   # Configuración Better Auth
│   ├── prisma.ts                 # Cliente Prisma singleton
│   ├── supabase.ts               # Clientes Supabase
│   ├── utils/encryption.ts       # AES-256-GCM encrypt/decrypt
│   └── validators/               # Schemas Zod
└── server/
    ├── actions/                  # Server actions (CRUD)
    │   ├── patient.ts
    │   ├── appointment.ts
    │   ├── medicalRecord.ts
    │   ├── prescription.ts
    │   ├── images.ts
    │   └── reports.ts
    └── middleware/auth.ts        # Guards de autenticación
```

## Modelos de Base de Datos

| Modelo | Descripción |
|--------|-------------|
| **User/Session/Account** | Better Auth (autenticación) |
| **Patient** | Datos del paciente (campos sensibles encriptados) |
| **Appointment** | Citas médicas |
| **MedicalRecord** | Historiales clínicos |
| **Prescription** | Recetas médicas |
| **MedicalImage** | Referencias a imágenes en Supabase Storage |

## Módulos Implementados

### 1. Pacientes (CRUD Completo)
- **Actions:** `src/server/actions/patient.ts`
- **Validación:** `src/lib/validators/patient.ts`
- **Rutas:**
  - `/dashboard/pacientes` - Lista de pacientes
  - `/dashboard/pacientes/nuevo` - Crear paciente
  - `/dashboard/pacientes/[id]` - Ver detalle
  - `/dashboard/pacientes/[id]/editar` - Editar paciente
  - `/dashboard/pacientes/[id]/historial` - Historial clínico
  - `/dashboard/pacientes/[id]/imagenes` - Imágenes médicas

### 2. Historial Clínico (CRUD Completo)
- **Actions:** `src/server/actions/medicalRecord.ts`
  - `createMedicalRecord` - Crear registro
  - `getMedicalRecords` - Listar registros de un paciente
  - `getMedicalRecord` - Obtener registro individual
  - `updateMedicalRecord` - Actualizar registro
  - `deleteMedicalRecord` - Eliminar registro
- **Validación:** `src/lib/validators/medicalRecord.ts`
- **Componente:** `src/components/patients/MedicalRecordForm.tsx`
- **Rutas:**
  - `/dashboard/pacientes/[id]/historial` - Lista y crear
  - `/dashboard/pacientes/[id]/historial/[recordId]` - Ver detalle
  - `/dashboard/pacientes/[id]/historial/[recordId]/editar` - Editar

### 3. Citas (CRUD Completo + Calendario)
- **Actions:** `src/server/actions/appointment.ts`
  - `createAppointment`, `getAppointments`, `getAppointment`
  - `updateAppointment`, `deleteAppointment`
  - `getAppointmentsByDateRange` - Para vista de calendario
- **Validación:** `src/lib/validators/appointment.ts`
- **Componentes:**
  - `AppointmentForm` - Formulario de citas
  - `CalendarView` - Calendario mensual/semanal
- **Rutas:**
  - `/dashboard/citas` - Lista de citas
  - `/dashboard/citas/calendario` - Vista calendario
  - `/dashboard/citas/nuevo` - Crear cita (acepta `?date=YYYY-MM-DD`)
  - `/dashboard/citas/[id]` - Ver detalle
  - `/dashboard/citas/[id]/editar` - Editar cita

### 4. Imágenes Médicas (Supabase Storage)
- **Actions:** `src/server/actions/images.ts`
- **Cliente:** `src/lib/supabase.ts`
- **Componente:** `src/components/patients/ImageUploader.tsx`
- **Ruta:** `/dashboard/pacientes/[id]/imagenes`

### 5. Reportes y Estadísticas
- **Actions:** `src/server/actions/reports.ts`
  - `getReportStats` - Estadísticas con filtros
  - `getExportData` - Datos para exportación
- **API:** `/api/reports/export` - Exportar a CSV
- **Componentes:**
  - `ReportFilters` - Filtros de fecha, tipo y estado
  - `SimpleBarChart`, `MonthlyBarChart` - Gráficos
- **Ruta:** `/dashboard/reportes`
- **Funcionalidades:**
  - Filtros por rango de fechas, tipo y estado
  - Gráficos: citas por mes, tipo, estado, género
  - Cards de estadísticas (pacientes, citas, historiales)
  - Exportación a CSV

### 6. Prescripciones (CRUD Completo)
- **Actions:** `src/server/actions/prescription.ts`
  - `createPrescription` - Crear prescripción
  - `getPrescriptions` - Listar prescripciones de un paciente
  - `getPrescription` - Obtener prescripción individual
  - `updatePrescription` - Actualizar prescripción
  - `deletePrescription` - Eliminar prescripción (soft delete)
- **Validación:** `src/lib/validators/prescription.ts`
- **Componente:** `src/components/prescriptions/PrescriptionForm.tsx`
- **Rutas:**
  - `/dashboard/pacientes/[id]/prescripciones` - Lista
  - `/dashboard/pacientes/[id]/prescripciones/nuevo` - Crear
  - `/dashboard/pacientes/[id]/prescripciones/[prescriptionId]` - Ver detalle
  - `/dashboard/pacientes/[id]/prescripciones/[prescriptionId]/editar` - Editar
  - `/dashboard/pacientes/[id]/prescripciones/[prescriptionId]/imprimir` - Vista impresión

### 7. Notificaciones (Recordatorios de Citas)
- **Servicio:** Resend (email)
- **Cliente:** `src/lib/email.ts`
- **Plantillas:** `src/lib/email-templates/appointment-reminder.tsx`
- **Actions:** `src/server/actions/notifications.ts`
  - `sendAppointmentReminders` - Enviar recordatorios automáticos (24h antes)
  - `sendManualReminder` - Enviar recordatorio manual de una cita
  - `getAppointmentsForReminder` - Listar citas próximas
- **API Cron:** `/api/cron/reminders` - Endpoint para Vercel Cron
- **Configuración Vercel:** `vercel.json` - Cron diario a las 8:00 AM

## Seguridad

### Encriptación de Datos Sensibles
- **Algoritmo:** AES-256-GCM
- **Ubicación:** `src/lib/utils/encryption.ts`
- **Campos encriptados:**
  - **Patient:** cedula, phone, email, address, emergencyContact, allergies
  - **MedicalRecord:** personalHistory, gynecologicHistory

### Autenticación (Better Auth)
- **Configuración:** `src/lib/auth.ts`
- **API Route:** `src/app/api/auth/[...better-auth]/route.ts`
- **Middleware:** `src/server/middleware/auth.ts`
- **Login:** `/login`
- **Roles:** `doctor` (default)

### Row Level Security (Supabase)
- Políticas RLS aplicadas en migración `20260130152300_rls_lockdown`
- Bloquea acceso `anon`/`authenticated` en tablas de negocio

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

## Estado del Proyecto

### Completado
- [x] Landing page multilingüe (español/inglés)
- [x] Sistema de autenticación con Better Auth
- [x] Dashboard protegido con roles
- [x] CRUD completo de pacientes
- [x] CRUD completo de historiales médicos
- [x] CRUD completo de citas
- [x] Vista de calendario (mensual/semanal)
- [x] Upload de imágenes médicas
- [x] Reportes con filtros y gráficos
- [x] Exportación a CSV
- [x] CRUD completo de prescripciones
- [x] Vista de impresión para prescripciones
- [x] Notificaciones por email (Resend)
- [x] Recordatorios automáticos de citas (Vercel Cron)
- [x] Encriptación de datos sensibles
- [x] RLS básico en Supabase

### Próximos Pasos
1. RLS completo en Supabase y políticas de Storage
2. Auditoría de accesos (logging)
3. Optimizaciones de performance

## Notas

- La landing multi-idioma está en `src/app/[locale]/`
- El sistema privado está en `/dashboard/*`
- Prisma 7 requiere `prisma.config.ts` para migraciones
