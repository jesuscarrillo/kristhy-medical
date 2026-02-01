# CLAUDE.md - Contexto del Proyecto

## Resumen del Proyecto

Sistema de gestión médica para consultorio de ginecología y obstetricia de la Dra. Kristhy. Combina una landing page pública multilingüe con un dashboard privado para gestión de pacientes, citas, historiales clínicos, ecografías, certificados médicos e imágenes médicas.

## Stack Tecnológico

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Server Actions de Next.js, Prisma 7
- **Base de datos:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (imágenes médicas, ecografías)
- **Autenticación:** Better Auth (email/password, roles)
- **Encriptación:** AES-256-GCM para datos sensibles
- **i18n:** next-intl (español/inglés)
- **Email:** Resend + React Email (notificaciones)

## Estructura de Carpetas Clave

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
│   │       │       ├── ecografias/      # Reportes ecográficos
│   │       │       └── certificados/    # Certificados médicos
│   │       ├── citas/            # CRUD citas + calendario
│   │       ├── reportes/         # Reportes y estadísticas
│   │       └── auditoria/        # Logs de auditoría
│   ├── [locale]/                 # Landing pública (es/en)
│   ├── api/
│   │   ├── auth/                 # Better Auth endpoint
│   │   ├── reports/              # Exportación CSV
│   │   └── cron/                 # Recordatorios automáticos
│   └── login/                    # Página de login
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── patients/                 # PatientForm, MedicalRecordForm, ImageUploader
│   ├── appointments/             # AppointmentForm, CalendarView
│   ├── prescriptions/            # PrescriptionForm
│   ├── ultrasound/               # Formularios y vistas de ecografías
│   ├── certificates/             # Formularios y vistas de certificados
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
│       ├── appointment.ts
│       ├── medicalRecord.ts
│       ├── prescription.ts
│       ├── ultrasound.ts         # Ecografías
│       ├── certificate.ts        # Certificados
│       └── medicalImage.ts       # Imágenes con metadata
└── server/
    ├── actions/                  # Server actions (CRUD)
    │   ├── patient.ts
    │   ├── appointment.ts
    │   ├── medicalRecord.ts
    │   ├── prescription.ts
    │   ├── images.ts
    │   ├── ultrasound.ts         # CRUD ecografías
    │   ├── certificate.ts        # CRUD certificados
    │   ├── reports.ts
    │   ├── notifications.ts
    │   └── audit.ts
    └── middleware/auth.ts        # Guards de autenticación
```

## Comandos Frecuentes

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm db:migrate       # Ejecutar migraciones
pnpm db:push          # Push schema sin migración
pnpm db:seed          # Seed de doctora inicial
pnpm db:studio        # Prisma Studio (GUI de BD)
```

## Convenciones del Código

1. **Server Actions:** Usar `"use server"` al inicio, validar con Zod, encriptar campos sensibles
2. **Validaciones:** Schemas en `src/lib/validators/`, usar zod
3. **Formularios:** React Hook Form + shadcn/ui Form components
4. **Rutas protegidas:** Usar `requireDoctor()` de `src/server/middleware/auth.ts`
5. **Encriptación:** Usar `encrypt()`/`decrypt()` de `src/lib/utils/encryption.ts` para datos PII
6. **Auditoría:** Llamar `logAudit()` en acciones críticas (create, view, update, delete, export)

## Campos Encriptados

**Patient:** cedula, phone, email, address, emergencyContact, allergies
**MedicalRecord:** personalHistory, gynecologicHistory

## Modelos de Base de Datos

### Modelos Core
- **User/Session/Account:** Better Auth (autenticación)
- **Patient:** Datos del paciente (medicalRecordNumber, weight, height, pregnancyStatus, datos sociodemográficos)
- **GynecologicalProfile:** Antecedentes gineco-obstétricos (1:1 con Patient)
- **Appointment:** Citas médicas
- **MedicalRecord:** Historiales clínicos
- **Prescription:** Recetas médicas

### Modelos v2.0 (Nuevo)
- **UltrasoundReport:** Reportes ecográficos (3 tipos)
- **UltrasoundImage:** Imágenes de ecografías
- **MedicalCertificate:** Certificados médicos (7 tipos)
- **MedicalImage:** Referencias a imágenes en Supabase Storage (con metadata extendida)
- **AuditLog:** Registro de auditoría de accesos

### Enums
```prisma
enum PregnancyStatus {
  NOT_PREGNANT, FIRST_TRIMESTER, SECOND_TRIMESTER,
  THIRD_TRIMESTER, POSTPARTUM
}

enum UltrasoundType {
  FIRST_TRIMESTER, SECOND_THIRD_TRIMESTER, GYNECOLOGICAL
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

---

# Módulos del Sistema

## Módulo de Pacientes

### Campos del Paciente
**Datos básicos:** firstName, lastName, cedula (encriptado), dateOfBirth, gender, phone, email, address
**Datos médicos:** medicalRecordNumber (HM-000001), weight (kg), height (cm), bloodType, allergies
**Estado de embarazo:** pregnancyStatus (solo femeninos)
**Datos sociodemográficos:** maritalStatus, occupation, nationality, educationLevel, religion

### Rutas
- `/dashboard/pacientes` - Lista con paginación y búsqueda
- `/dashboard/pacientes/nuevo` - Crear paciente
- `/dashboard/pacientes/[id]` - Ver detalle
- `/dashboard/pacientes/[id]/editar` - Editar paciente

### Server Actions (`src/server/actions/patient.ts`)
```typescript
createPatient(formData: FormData)
getPatients(page?: number, limit?: number, search?: string)
getPatient(id: string)
updatePatient(id: string, formData: FormData)
deactivatePatient(id: string)
```

---

## Módulo de Ecografías (v2.0)

### Tipos de Ecografía
| Tipo | Descripción | Disponible cuando |
|------|-------------|-------------------|
| `FIRST_TRIMESTER` | Eco primer trimestre | pregnancyStatus = FIRST_TRIMESTER |
| `SECOND_THIRD_TRIMESTER` | Eco 2do/3er trimestre | pregnancyStatus = SECOND o THIRD_TRIMESTER |
| `GYNECOLOGICAL` | Eco ginecológica | Siempre disponible |

### Validación de Tipo vs Estado de Embarazo
```typescript
// src/lib/validators/ultrasound.ts
const validUltrasoundTypes = {
  NOT_PREGNANT: ["GYNECOLOGICAL"],
  FIRST_TRIMESTER: ["FIRST_TRIMESTER", "GYNECOLOGICAL"],
  SECOND_TRIMESTER: ["SECOND_THIRD_TRIMESTER", "GYNECOLOGICAL"],
  THIRD_TRIMESTER: ["SECOND_THIRD_TRIMESTER", "GYNECOLOGICAL"],
  POSTPARTUM: ["GYNECOLOGICAL"],
};
```

### Campos por Tipo

**Primer Trimestre:**
- CRL (mm), saco gestacional (mm), FCF (lpm)
- Translucencia nucal (mm), hueso nasal (presente/ausente)
- Número de embriones, corionicidad

**Segundo/Tercer Trimestre:**
- Biometría: DBP, CC, CA, LF (mm)
- Peso estimado (g), percentil
- Líquido amniótico (ILA cm, bolsillo mayor cm)
- Placenta: ubicación, grado, grosor
- Cordón umbilical: inserción, vasos
- Presentación, dorso, actividad cardíaca

**Ginecológica:**
- Útero: posición, medidas (long, ant-post, transv mm)
- Endometrio: grosor (mm), aspecto
- Ovarios: medidas, volumen, folículos
- Douglas: libre/ocupado

### Rutas
- `/dashboard/pacientes/[id]/ecografias` - Lista de ecografías
- `/dashboard/pacientes/[id]/ecografias/nuevo` - Crear ecografía (wizard: seleccionar tipo)
- `/dashboard/pacientes/[id]/ecografias/[ecoId]` - Ver detalle
- `/dashboard/pacientes/[id]/ecografias/[ecoId]/editar` - Editar
- `/dashboard/pacientes/[id]/ecografias/[ecoId]/imprimir` - Vista impresión (3 templates)

### Server Actions (`src/server/actions/ultrasound.ts`)
```typescript
createUltrasound(formData: FormData)      // Valida tipo vs pregnancyStatus
getUltrasounds(patientId: string)         // Lista por paciente
getUltrasound(id: string)                 // Detalle con imágenes
updateUltrasound(id: string, formData: FormData)
deleteUltrasound(id: string)              // Soft delete (isActive = false)
uploadUltrasoundImage(formData: FormData) // Subir imagen a Supabase
deleteUltrasoundImage(id: string)         // Eliminar imagen
```

### Componentes (`src/components/ultrasound/`)
- `UltrasoundForm.tsx` - Formulario principal (renderiza campos según tipo)
- `FirstTrimesterFields.tsx` - Campos específicos primer trimestre
- `SecondThirdTrimesterFields.tsx` - Campos específicos 2do/3er trimestre
- `GynecologicalFields.tsx` - Campos específicos ginecológica
- `UltrasoundPrintView.tsx` - 3 templates de impresión
- `UltrasoundImageUploader.tsx` - Upload de imágenes del eco

---

## Módulo de Certificados Médicos (v2.0)

### Tipos de Certificado
| Tipo | Etiqueta | Descripción |
|------|----------|-------------|
| `REST` | Reposo médico | Requiere días de reposo, calcula fechas automáticamente |
| `MEDICAL_REPORT` | Informe médico | Informe detallado del estado del paciente |
| `MEDICAL_CONSTANCY` | Constancia médica | Constancia de asistencia a consulta |
| `FITNESS` | Apto médico | Certificado de aptitud física/laboral |
| `DISABILITY` | Incapacidad | Certificado de incapacidad temporal |
| `PREGNANCY` | Certificado de embarazo | Estado actual del embarazo |
| `OTHER` | Otro | Certificado genérico |

### Validación Especial para Reposo
- Si `type === "REST"`, el campo `restDays` es requerido
- `validUntil` se calcula automáticamente: `validFrom + restDays`

### Campos del Certificado
```typescript
{
  patientId: string;
  date: DateTime;
  type: CertificateType;
  title: string;
  content: string;          // Texto del certificado
  restDays?: number;        // Solo para REST
  validFrom?: DateTime;     // Inicio de validez
  validUntil?: DateTime;    // Fin de validez (auto-calculado para REST)
  diagnosis?: string;
  issuedBy: string;         // Nombre del médico
  licenseNumber: string;    // MPPS
}
```

### Rutas
- `/dashboard/pacientes/[id]/certificados` - Lista de certificados
- `/dashboard/pacientes/[id]/certificados/nuevo` - Crear certificado
- `/dashboard/pacientes/[id]/certificados/[certId]` - Ver detalle
- `/dashboard/pacientes/[id]/certificados/[certId]/editar` - Editar
- `/dashboard/pacientes/[id]/certificados/[certId]/imprimir` - Vista impresión

### Server Actions (`src/server/actions/certificate.ts`)
```typescript
createCertificate(formData: FormData)
getCertificates(patientId: string)
getCertificate(id: string)
updateCertificate(id: string, formData: FormData)
deleteCertificate(id: string)  // Soft delete
```

### Componentes (`src/components/certificates/`)
- `CertificateForm.tsx` - Formulario con templates por tipo
- Auto-rellena contenido según tipo seleccionado
- Calcula automáticamente validUntil para reposos

---

## Módulo de Imágenes/Documentos Médicos (v2.0 Mejorado)

### Tipos de Documento
```typescript
const documentTypes = {
  LAB_RESULT: "Resultado de laboratorio",
  CYTOLOGY: "Citología",
  BIOPSY: "Biopsia",
  ULTRASOUND: "Ecografía externa",
  XRAY: "Rayos X",
  MRI_CT: "Resonancia/Tomografía",
  EXTERNAL_REPORT: "Informe externo",
  PRESCRIPTION: "Receta/Récipe",
  OTHER: "Otro",
};
```

### Campos Extendidos
```typescript
{
  // Campos existentes
  patientId, fileName, fileUrl, fileType, fileSize, mimeType, description,
  // Campos v2.0
  documentType?: DocumentType;
  documentDate?: DateTime;
  laboratory?: string;
  physician?: string;
  results?: string;
  isNormal?: boolean;
  tags?: string[];
}
```

### Server Actions (`src/server/actions/images.ts`)
```typescript
uploadMedicalImage(formData: FormData)
getMedicalImages(patientId: string, filters?: GetImagesFilters, page?: number, limit?: number)
getMedicalImage(id: string)
updateMedicalImage(id: string, formData: FormData)
deleteMedicalImage(id: string)
```

### Filtros Disponibles
```typescript
interface GetImagesFilters {
  documentType?: DocumentType;
  isNormal?: boolean;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
}
```

---

## Módulo de Antecedentes Gineco-Obstétricos

### Campos del Perfil Ginecológico (`GynecologicalProfile`)
**Antecedentes obstétricos:** gestas, partos, cesareas, abortos, ectopicos, mpilas, parity
**Ciclos menstruales:** cycleDays, bleedingDays, painLevel, lastMenstrualPeriod, isMenopausal, menopauseAge
**Historial sexual (v2.0):** menarche (edad), sexarche (edad), numberOfPartners
**Info adicional:** contraceptiveMethod, isSexuallyActive, notes

### Validador (`src/lib/validators/gynecologicalProfile.ts`)
```typescript
export const gynecologicalProfileSchema = z.object({
  // Obstétricos
  gestas: z.coerce.number().int().min(0).max(20).optional(),
  // ... etc
  // Nuevos campos v2.0
  menarche: z.coerce.number().int().min(8).max(20).optional(),
  sexarche: z.coerce.number().int().min(10).max(50).optional(),
  numberOfPartners: z.coerce.number().int().min(0).max(100).optional(),
});
```

---

## Otros Módulos

### Historiales Clínicos
- **Actions:** `src/server/actions/medicalRecord.ts`
- **Rutas:** `/dashboard/pacientes/[id]/historial/*`

### Prescripciones
- **Actions:** `src/server/actions/prescription.ts`
- **Rutas:** `/dashboard/pacientes/[id]/prescripciones/*`
- **Impresión:** Vista optimizada con auto-print

### Citas + Calendario
- **Actions:** `src/server/actions/appointment.ts`
- **Rutas:** `/dashboard/citas/*`, `/dashboard/citas/calendario`
- **Vista:** Mensual y semanal

### Reportes
- **Actions:** `src/server/actions/reports.ts`
- **API:** `/api/reports/export` (CSV)
- **Rutas:** `/dashboard/reportes`

### Auditoría
- **Actions:** `src/server/actions/audit.ts`
- **Entidades:** patient, medical_record, prescription, medical_image, appointment, ultrasound, ultrasound_image, certificate, export
- **Rutas:** `/dashboard/auditoria`

### Notificaciones
- **Actions:** `src/server/actions/notifications.ts`
- **Cron:** `/api/cron/reminders` (Vercel Cron diario 8:00 AM)

---

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

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxx"
EMAIL_FROM="Dra. Kristhy <noreply@tudominio.com>"
CRON_SECRET="secreto_para_cron"

# Seed (opcional)
SEED_DOCTOR_EMAIL="dra@example.com"
SEED_DOCTOR_PASSWORD="password_seguro"
SEED_DOCTOR_NAME="Dra. Kristhy"
```

---

## Para Testing Local

1. Clonar el repo
2. `pnpm install`
3. Configurar `.env.local` con las variables
4. `pnpm db:push` para sincronizar schema
5. `pnpm db:seed` para crear usuario doctora
6. `pnpm dev`

---

## Historial de Versiones

### v2.0.0 (Febrero 2026)
- Módulo de Ecografías (3 tipos con validación por estado de embarazo)
- Módulo de Certificados Médicos (7 tipos con templates)
- Campos sociodemográficos en Patient
- Campos de historial sexual en GynecologicalProfile
- Metadata extendida en imágenes médicas (tipo documento, laboratorio, resultados)
- Vistas de impresión para ecografías y certificados

### v1.1.0 (Enero 2026)
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
