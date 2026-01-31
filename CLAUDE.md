# CLAUDE.md - Contexto del Proyecto

## Resumen del Proyecto

Sistema de gestión médica para consultorio de ginecología y obstetricia de la Dra. Kristhy. Combina una landing page pública multilingüe con un dashboard privado para gestión de pacientes, citas, historiales clínicos e imágenes médicas.

## Stack Tecnológico

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Server Actions de Next.js, Prisma 7
- **Base de datos:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (imágenes médicas)
- **Autenticación:** Better Auth (email/password, roles)
- **Encriptación:** AES-256-GCM para datos sensibles
- **i18n:** next-intl (español/inglés)

## Estructura de Carpetas Clave

```
src/
├── app/
│   ├── (dashboard)/          # Rutas protegidas del dashboard
│   │   └── dashboard/
│   │       ├── pacientes/    # CRUD pacientes
│   │       ├── citas/        # CRUD citas
│   │       └── reportes/     # Reportes básicos
│   ├── [locale]/             # Landing pública (es/en)
│   ├── api/auth/             # Better Auth endpoint
│   └── login/                # Página de login
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── patients/             # PatientForm, MedicalRecordForm, ImageUploader
│   ├── appointments/         # AppointmentForm
│   └── layout/               # Header, Footer, etc.
├── lib/
│   ├── auth.ts               # Configuración Better Auth
│   ├── prisma.ts             # Cliente Prisma singleton
│   ├── supabase.ts           # Clientes Supabase
│   └── validators/           # Schemas Zod
└── server/
    ├── actions/              # Server actions (CRUD)
    └── middleware/auth.ts    # Guards de autenticación
```

## Comandos Frecuentes

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm db:migrate       # Ejecutar migraciones
pnpm db:seed          # Seed de doctora inicial
pnpm db:studio        # Prisma Studio (GUI de BD)
```

## Convenciones del Código

1. **Server Actions:** Usar `"use server"` al inicio, validar con Zod, encriptar campos sensibles
2. **Validaciones:** Schemas en `src/lib/validators/`, usar zod
3. **Formularios:** React Hook Form + shadcn/ui Form components
4. **Rutas protegidas:** Usar `requireDoctor()` de `src/server/middleware/auth.ts`
5. **Encriptación:** Usar `encrypt()`/`decrypt()` de `src/lib/utils/encryption.ts` para datos PII

## Campos Encriptados

**Patient:** cedula, phone, email, address, emergencyContact, allergies
**MedicalRecord:** personalHistory, gynecologicHistory

## Modelos de Base de Datos

- **User/Session/Account:** Better Auth (autenticación)
- **Patient:** Datos del paciente
- **Appointment:** Citas médicas
- **MedicalRecord:** Historiales clínicos
- **Prescription:** Recetas (modelo existe, sin UI)
- **MedicalImage:** Referencias a imágenes en Supabase Storage

---

# Plan de Trabajo

## Estado Actual (Completado)

- [x] Landing page multilingüe (español/inglés)
- [x] Sistema de autenticación con Better Auth
- [x] Dashboard protegido con roles
- [x] CRUD completo de pacientes
- [x] Crear historiales médicos
- [x] CRUD completo de citas
- [x] Upload de imágenes médicas
- [x] Reportes básicos (totales)
- [x] Encriptación de datos sensibles
- [x] RLS básico en Supabase

---

## Fase 1: Completar Funcionalidades Core (Prioridad Alta)

### 1.1 CRUD Completo de Historial Médico - COMPLETADO
**Archivos modificados/creados:**
- `src/server/actions/medicalRecord.ts` - CRUD completo con encriptación
- `src/app/(dashboard)/dashboard/pacientes/[id]/historial/[recordId]/page.tsx` - Vista detalle
- `src/app/(dashboard)/dashboard/pacientes/[id]/historial/[recordId]/editar/page.tsx` - Edición
- `src/app/(dashboard)/dashboard/pacientes/[id]/historial/[recordId]/DeleteRecordButton.tsx` - Botón eliminar
- `src/components/patients/MedicalRecordForm.tsx` - Adaptado para crear/editar

**Tareas completadas:**
- [x] Agregar action `getMedicalRecord(id)` con decrypt
- [x] Agregar action `getMedicalRecords(patientId)` para listar
- [x] Agregar action `updateMedicalRecord(id, formData)` con encrypt
- [x] Agregar action `deleteMedicalRecord(id)` (hard delete)
- [x] Crear página de detalle del historial
- [x] Crear página de edición del historial
- [x] Agregar botones de ver/editar en la lista

### 1.2 Vista de Calendario para Citas - COMPLETADO
**Archivos creados:**
- `src/components/appointments/CalendarView.tsx` - Componente calendario custom
- `src/app/(dashboard)/dashboard/citas/calendario/page.tsx` - Página de calendario
- `src/server/actions/appointment.ts` - Agregado `getAppointmentsByDateRange`

**Implementación:** Componente custom con Tailwind CSS (sin dependencias externas)

**Tareas completadas:**
- [x] Crear componente CalendarView custom con Tailwind
- [x] Crear vista mensual de citas
- [x] Crear vista semanal de citas
- [x] Permitir click en día para crear cita (enlace a /nuevo?date=)
- [x] Mostrar estado de citas con colores por tipo
- [x] Navegación entre meses/semanas
- [x] Botón "Hoy" para volver a fecha actual
- [x] Actualizar página de citas con botón de calendario

---

## Fase 2: Reportes y Exportación (Prioridad Media) - COMPLETADO

### 2.1 Reportes Avanzados - COMPLETADO
**Archivos creados/modificados:**
- `src/server/actions/reports.ts` - Actions para estadísticas y exportación
- `src/app/(dashboard)/dashboard/reportes/page.tsx` - Dashboard mejorado
- `src/components/reports/ReportFilters.tsx` - Filtros de fecha, tipo y estado
- `src/components/reports/SimpleBarChart.tsx` - Gráficos de barras
- `src/app/api/reports/export/route.ts` - API para exportar CSV

**Tareas completadas:**
- [x] Agregar filtros por fecha (desde/hasta)
- [x] Agregar filtros por tipo de consulta
- [x] Agregar filtros por estado de cita
- [x] Mostrar gráficos básicos (citas por mes, tipo, estado, género)
- [x] Implementar export a CSV
- [x] Cards de estadísticas (pacientes, citas, historiales)
- [x] Tabla de citas recientes/filtradas

---

## Fase 3: Prescripciones (Prioridad Media)

### 3.1 Módulo de Prescripciones
**Archivos a crear:**
- `src/lib/validators/prescription.ts` - Schema de validación
- `src/server/actions/prescription.ts` - CRUD actions
- `src/components/prescriptions/PrescriptionForm.tsx` - Formulario
- `src/app/(dashboard)/dashboard/pacientes/[id]/prescripciones/page.tsx` - Lista
- `src/app/(dashboard)/dashboard/pacientes/[id]/prescripciones/nuevo/page.tsx` - Crear
- `src/app/(dashboard)/dashboard/pacientes/[id]/prescripciones/[prescriptionId]/page.tsx` - Ver/Imprimir

**Tareas:**
- [ ] Crear schema de validación Zod
- [ ] Crear server actions CRUD
- [ ] Crear formulario de prescripción
- [ ] Crear vista de lista de prescripciones por paciente
- [ ] Crear vista de detalle con opción de imprimir
- [ ] Agregar generación de PDF para prescripción

---

## Fase 4: Notificaciones (Prioridad Media-Baja)

### 4.1 Recordatorios de Citas
**Requiere:** Configurar servicio de email (Resend) o SMS

**Archivos a crear:**
- `src/lib/email.ts` - Cliente de Resend
- `src/server/actions/notifications.ts` - Envío de notificaciones
- `src/app/api/cron/reminders/route.ts` - Cron job para recordatorios

**Tareas:**
- [ ] Configurar Resend API
- [ ] Crear plantillas de email
- [ ] Implementar envío de recordatorio 24h antes
- [ ] Marcar citas como `reminderSent`
- [ ] Configurar cron job (Vercel Cron o similar)

---

## Fase 5: Seguridad y Auditoría (Prioridad Alta para Producción)

### 5.1 RLS Completo en Supabase
**Tareas:**
- [ ] Revisar y completar políticas RLS para todas las tablas
- [ ] Configurar políticas de Storage para `medical-images`
- [ ] Documentar políticas aplicadas

### 5.2 Auditoría de Accesos
**Archivos a crear:**
- `prisma/schema.prisma` - Agregar modelo `AuditLog`
- `src/server/actions/audit.ts` - Registrar accesos
- `src/app/(dashboard)/dashboard/auditoria/page.tsx` - Vista de logs

**Tareas:**
- [ ] Crear modelo AuditLog (userId, action, entity, entityId, timestamp, ip)
- [ ] Crear migración
- [ ] Agregar logging en actions críticos (ver paciente, ver historial)
- [ ] Crear UI para ver logs de auditoría

---

## Fase 6: Optimizaciones y UX (Prioridad Baja)

### 6.1 Performance
- [ ] Implementar cache de sesiones en desarrollo
- [ ] Reducir logs de Prisma en dev
- [ ] Optimizar queries con `select` específicos
- [ ] Agregar paginación a listas largas

### 6.2 UX Improvements
- [ ] Agregar estados de carga (skeletons)
- [ ] Mejorar mensajes de error
- [ ] Agregar confirmaciones en acciones destructivas
- [ ] Implementar búsqueda avanzada de pacientes

---

## Notas para Desarrollo

### Variables de Entorno Requeridas
```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ENCRYPTION_KEY
BETTER_AUTH_SECRET
BETTER_AUTH_URL
```

### Para Testing Local
1. Clonar el repo
2. `pnpm install`
3. Configurar `.env.local` con las variables
4. `pnpm db:migrate` para aplicar migraciones
5. `pnpm db:seed` para crear usuario doctora
6. `pnpm dev`

### Antes de Desplegar
- [ ] Verificar todas las variables de entorno en producción
- [ ] Ejecutar `pnpm build` localmente para verificar errores
- [ ] Revisar políticas RLS en Supabase
- [ ] Configurar dominio en Better Auth URL
