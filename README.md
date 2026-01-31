# Sistema de Gestion Medica - Dra. Kristhy

Proyecto Next.js 16 (App Router) con landing multi-idioma y sistema privado de gestion medica. Stack: TypeScript, Tailwind v4, shadcn/ui, Prisma 7, Supabase (PostgreSQL + Storage), Better Auth.

## Ejecutar
```bash
pnpm install
pnpm dev
```

## Variables de entorno
Usa `.env` o `.env.local` con este contenido base:
```
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
ENCRYPTION_KEY="64_hex_chars"
BETTER_AUTH_SECRET="base64_secret"
BETTER_AUTH_URL="http://localhost:3000"
```

Seed opcional de la doctora:
```
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="password_seguro"
SEED_DOCTOR_NAME="Dra. Kristhy"
```

## Base de datos (Supabase + Prisma)
- Prisma 7 requiere `prisma.config.ts` para migraciones y usa `DIRECT_URL`.
- El cliente Prisma usa `@prisma/adapter-pg` y `pg`.

### Comandos Prisma
```bash
pnpm prisma generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

### Migraciones
- Crea una migracion:
  ```bash
  pnpm prisma migrate dev --name nombre_migracion
  ```
- En produccion:
  ```bash
  pnpm prisma migrate deploy
  ```

### RLS (Supabase)
- Se aplica por migracion `20260130152300_rls_lockdown` para bloquear acceso `anon`/`authenticated` en todas las tablas de negocio.
- Prisma no puede tocar `public._prisma_migrations` desde migraciones (fallaria en shadow DB).
- Para eliminar la alerta restante en Supabase, ejecutar manualmente en SQL Editor:
  ```sql
  alter table public._prisma_migrations enable row level security;
  drop policy if exists "deny anon prisma migrations" on public._prisma_migrations;
  drop policy if exists "deny auth prisma migrations" on public._prisma_migrations;
  create policy "deny anon prisma migrations" on public._prisma_migrations
    for all to anon using (false) with check (false);
  create policy "deny auth prisma migrations" on public._prisma_migrations
    for all to authenticated using (false) with check (false);
  ```

## Autenticacion (Better Auth)
- Configuracion: `src/lib/auth.ts`
- API route: `src/app/api/auth/[...better-auth]/route.ts`
- Login: `/login`
- Middleware: `src/server/middleware/auth.ts` (requireDoctor)
- Modelo de usuario incluye `role` (default `doctor`).

## Seguridad y datos sensibles
- Encriptacion AES-256-GCM en `src/lib/utils/encryption.ts`.
- Campos sensibles cifrados al guardar:
  - Patient: cedula, phone, email, address, emergencyContact, allergies
  - MedicalRecord: personalHistory, gynecologicHistory
- Desencriptado en `src/server/actions/patient.ts`.

## Modulos implementados

### Pacientes
- CRUD: `src/server/actions/patient.ts`
- Validacion: `src/lib/validators/patient.ts`
- UI:
  - `/dashboard/pacientes`
  - `/dashboard/pacientes/nuevo`
  - `/dashboard/pacientes/[id]`
  - `/dashboard/pacientes/[id]/editar`
  - `/dashboard/pacientes/[id]/historial`
  - `/dashboard/pacientes/[id]/imagenes`

### Historial clinico
- CRUD completo: `src/server/actions/medicalRecord.ts`
  - `createMedicalRecord` - Crear registro
  - `getMedicalRecords` - Listar registros de un paciente
  - `getMedicalRecord` - Obtener registro individual
  - `updateMedicalRecord` - Actualizar registro
  - `deleteMedicalRecord` - Eliminar registro
- Formulario: `src/components/patients/MedicalRecordForm.tsx`
- UI:
  - `/dashboard/pacientes/[id]/historial` - Lista y crear
  - `/dashboard/pacientes/[id]/historial/[recordId]` - Ver detalle
  - `/dashboard/pacientes/[id]/historial/[recordId]/editar` - Editar

### Citas
- CRUD: `src/server/actions/appointment.ts`
  - `getAppointmentsByDateRange` - Obtener citas por rango de fechas (para calendario)
- Validacion: `src/lib/validators/appointment.ts`
- UI:
  - `/dashboard/citas` - Lista de citas
  - `/dashboard/citas/calendario` - Vista de calendario (mensual/semanal)
  - `/dashboard/citas/nuevo` - Crear cita (acepta ?date=YYYY-MM-DD)
  - `/dashboard/citas/[id]` - Ver detalle
  - `/dashboard/citas/[id]/editar` - Editar cita
- Componentes:
  - `CalendarView` - Calendario con vista mensual y semanal

### Imagenes medicas (Supabase Storage)
- Cliente: `src/lib/supabase.ts`
- Upload action: `src/server/actions/images.ts`
- UI: `src/components/patients/ImageUploader.tsx`
- Vista: `/dashboard/pacientes/[id]/imagenes`

### Reportes avanzados
- Actions: `src/server/actions/reports.ts`
  - `getReportStats` - Estadísticas con filtros de fecha y tipo
  - `getExportData` - Datos para exportación CSV
- API: `/api/reports/export` - Exportar citas a CSV
- UI:
  - `/dashboard/reportes` - Dashboard con estadísticas y gráficos
- Componentes:
  - `ReportFilters` - Filtros de fecha, tipo y estado
  - `SimpleBarChart`, `MonthlyBarChart` - Gráficos de barras
- Funcionalidades:
  - Filtros por rango de fechas
  - Filtros por tipo de cita y estado
  - Gráficos de citas por mes, tipo, estado
  - Estadísticas de pacientes por género
  - Exportación a CSV con filtros

## Dashboard
- Layout protegido: `src/app/(dashboard)/layout.tsx`
- Navegacion en `/dashboard/*`
- Cerrar sesion: `src/components/dashboard/UserMenu.tsx`

## Scripts utiles
```bash
pnpm dev
pnpm build
pnpm lint
pnpm db:push
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

## Proximos pasos sugeridos
1. Mejorar performance en dev (cache de sesiones, reducir logs prisma).
2. Prescripciones (modelo + UI).
3. Notificaciones (recordatorios de citas).
4. RLS en Supabase y politicas de Storage.
5. Auditoria de accesos (logging).

## Notas
- Landing multi-idioma vive en `src/app/[locale]`.
- El sistema privado vive en `/dashboard`.
