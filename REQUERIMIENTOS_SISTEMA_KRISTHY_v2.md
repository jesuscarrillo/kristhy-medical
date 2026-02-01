# Documento de Requerimientos - Sistema de Gestión Médica Dra. Kristhy
## Versión 2.0 - Análisis de Formularios Clínicos

---

## 1. RESUMEN EJECUTIVO

### 1.1 Clasificación de Pacientes y Módulos Aplicables

El sistema debe manejar **diferentes tipos de pacientes** con módulos específicos según su condición:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SISTEMA DE GESTIÓN MÉDICA                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │              MÓDULOS GENERALES (TODOS LOS PACIENTES)                │   │
│  │                                                                     │   │
│  │  ✅ Historia Clínica        ✅ Recetas/Prescripciones               │   │
│  │  ✅ Reposo/Certificados     ✅ Informes Médicos                     │   │
│  │  ✅ Citas                   ✅ Signos Vitales                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────┐    ┌────────────────────────────────────┐  │
│  │   PACIENTES GINECOLÓGICAS  │    │    PACIENTES OBSTÉTRICAS           │  │
│  │     (NO EMBARAZADAS)       │    │       (EMBARAZADAS)                │  │
│  │                            │    │                                    │  │
│  │  ✅ ECO Ginecológico       │    │  ✅ ECO 1er Trimestre              │  │
│  │  ✅ Perfil Ginecológico    │    │  ✅ ECO 2do/3er Trimestre          │  │
│  │                            │    │  ✅ Perfil Obstétrico              │  │
│  │                            │    │  ✅ Control Prenatal               │  │
│  │                            │    │  ✅ Curvas de Crecimiento          │  │
│  │                            │    │                                    │  │
│  └────────────────────────────┘    └────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Matriz de Módulos por Tipo de Paciente

| Módulo | Paciente General | Ginecológica (No Embarazada) | Obstétrica (Embarazada) |
|--------|------------------|------------------------------|-------------------------|
| Historia Clínica | ✅ | ✅ | ✅ |
| Recetas/Prescripciones | ✅ | ✅ | ✅ |
| Reposo/Certificados | ✅ | ✅ | ✅ |
| Informes Médicos | ✅ | ✅ | ✅ |
| Citas | ✅ | ✅ | ✅ |
| Perfil Ginecológico | ❌ | ✅ | ✅ |
| ECO Ginecológico | ❌ | ✅ | ❌ |
| ECO 1er Trimestre | ❌ | ❌ | ✅ |
| ECO 2do/3er Trimestre | ❌ | ❌ | ✅ |
| Control Prenatal | ❌ | ❌ | ✅ |

---

### 1.2 Estado Actual del Sistema
El sistema cuenta con los siguientes módulos funcionales:
- ✅ Gestión de Pacientes (CRUD completo)
- ✅ Perfil Gineco-Obstétrico básico
- ✅ Historial Clínico (genérico)
- ✅ Citas y Calendario
- ✅ Prescripciones/Recetas
- ✅ Imágenes Médicas (Supabase Storage)
- ✅ Reportes y Auditoría

### 1.2 Hallazgos del Análisis
Tras revisar los formularios clínicos utilizados actualmente (Word), se identificaron las siguientes brechas:

| Área | Estado | Prioridad |
|------|--------|-----------|
| Reportes de Ecografía Obstétrica (1er Trim) | ❌ Faltante | ALTA |
| Reportes de Ecografía Obstétrica (2do/3er Trim) | ❌ Faltante | ALTA |
| Reportes de Ecografía Ginecológica | ❌ Faltante | ALTA |
| Historia Clínica Ampliada | ⚠️ Parcial | MEDIA |
| Informe Médico / Certificados | ❌ Faltante | MEDIA |
| Signos Vitales Estructurados | ⚠️ Parcial | BAJA |

---

## 2. ANÁLISIS DETALLADO DE FORMULARIOS

### 2.1 ECO Primer Trimestre (ECO 1er Trimestre.docx)

**Propósito:** Reporte ecográfico para embarazos en el primer trimestre (semanas 1-13).

**Campos identificados:**

| Campo | Tipo | Descripción | Existe en BD |
|-------|------|-------------|--------------|
| Nombre paciente | FK | Referencia a Patient | ✅ |
| Edad | Calculado | Desde dateOfBirth | ✅ |
| Fecha del estudio | DateTime | Fecha del eco | ❌ |
| EG (Edad Gestacional) | String | Semanas + días | ❌ |
| Motivo de consulta | Text | Razón del eco | ❌ |
| FUM | Date | Fecha Última Menstruación | ⚠️ En GynProfile |
| FPP | Date | Fecha Probable de Parto | ❌ |
| Gestas/Paras/Cesáreas/Abortos/Ectópicos | Int | Antecedentes | ✅ En GynProfile |
| Peso/Talla/PA/Grupo Sanguíneo | Varios | Signos vitales | ⚠️ Parcial |
| **DATOS ECOGRÁFICOS:** |
| Tipo de embarazo | Enum | Único/Múltiple | ❌ |
| Corionicidad | String | Para múltiples | ❌ |
| Localización placenta | Enum | Fúndica/Anterior/Posterior/Lateral | ❌ |
| Lado placenta | Enum | Derecha/Central/Izquierda | ❌ |
| Líquido amniótico | Enum | Normal/Anormal | ❌ |
| MBV (Máximo Bolsillo Vertical) | Float | mm | ❌ |
| Actividad cardíaca | Enum | Presente/Ausente | ❌ |
| FCF | Int | Latidos por minuto | ❌ |
| SG (Saco Gestacional) | Float | mm | ❌ |
| EG por SG | String | Semanas + días | ❌ |
| LCC/CRL (Longitud Céfalo-Caudal) | Float | mm | ❌ |
| EG por LCC | String | Semanas + días | ❌ |
| Otros hallazgos | Text | Observaciones | ❌ |
| Diagnósticos | Text | Lista de diagnósticos | ❌ |
| Sugerencias | Text | Recomendaciones | ❌ |

---

### 2.2 ECO Segundo y Tercer Trimestre (ECO 2do y 3er Trimetres.docx)

**Propósito:** Reporte ecográfico para embarazos en segundo/tercer trimestre (semanas 14-40).

**Campos adicionales a los del primer trimestre:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **DATOS DEL FETO:** |
| Feto número | Int | Identificador para múltiples |
| Presentación | Enum | Cefálica/Podálica |
| Posición | Enum | Derecha/Izquierda/Superior |
| Situación | Enum | Longitudinal/Oblicua/Transversa + Anterior/Posterior/Inferior |
| **BIOMETRÍA FETAL:** |
| DBP (Diámetro Biparietal) | Float + String | mm + percentil/EG |
| CC (Circunferencia Cefálica) | Float + String | mm + percentil/EG |
| CA (Circunferencia Abdominal) | Float + String | mm + percentil/EG |
| LF (Longitud Femoral) | Float + String | mm + percentil/EG |
| FCF | Int | Latidos por minuto |
| Peso estimado fetal | Float | gramos |
| Percentil peso | String | P## |
| Sexo | Enum | Masculino/Femenino/Indeterminado |
| **LÍQUIDO AMNIÓTICO:** |
| Volumen | Float | cm³ |
| Percentil | String | P## |
| MBV | Float | cm |
| **PERFIL BIOFÍSICO:** |
| Movimientos respiratorios | Int | Puntos (0-2) |
| Movimientos fetales | Int | Puntos (0-2) |
| Tono fetal | Int | Puntos (0-2) |
| ILA | Int | Puntos (0-2) |
| Total | Int | Puntos (0-8) |
| **PLACENTA:** |
| Localización | Enum | Fúndica/Anterior/Posterior/Lateral |
| Lado | Enum | Derecha/Central/Izquierda |
| Grado Grannum | Enum | 0/I/II/III |

---

### 2.3 ECO Ginecológico (ECO Ginecologico.docx)

**Propósito:** Evaluación ecográfica del útero y ovarios en pacientes no embarazadas.

**Campos identificados:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Fecha | DateTime | Fecha del estudio |
| Transductor | Enum | Convex/Transvaginal |
| **ÚTERO:** |
| Posición | Enum | AVF/RVF/Indiferente |
| Forma | Enum | Globosa/Piriforme |
| Borde | Enum | Regular/Irregular |
| Patrón miometrial | Enum | Homogéneo/Heterogéneo |
| Cuerpo longitudinal | Float | mm |
| Cuerpo transverso | Float | mm |
| Cuerpo anteroposterior | Float | mm |
| Volumen uterino | Float | cm³ |
| Endometrio descripción | Text | Características |
| Endometrio medida | Float | mm |
| **OVARIO DERECHO:** |
| Longitudinal | Float | mm |
| Transverso | Float | mm |
| Anteroposterior | Float | mm |
| Volumen | Float | cm³ |
| **OVARIO IZQUIERDO:** |
| Longitudinal | Float | mm |
| Transverso | Float | mm |
| Anteroposterior | Float | mm |
| Volumen | Float | cm³ |
| Otros hallazgos | Text | Observaciones |
| Diagnósticos | Text | Conclusiones |

---

### 2.4 Historia Clínica (HISTORIA CLÍNICA.docx)

**Propósito:** Registro inicial completo del paciente.

**Campos que FALTAN en el modelo Patient actual:**

| Campo | Tipo | Ubicación Propuesta |
|-------|------|---------------------|
| Estado Civil | Enum | Patient |
| Ocupación | String | Patient |
| Tipo de consulta | Enum | Patient o MedicalRecord |
| Nacionalidad | String | Patient |
| Nivel de instrucción | Enum | Patient |
| Religión | String | Patient |
| Hora de la consulta | Time | MedicalRecord |

**Campos que FALTAN en GynecologicalProfile:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Menarquia | Int | Edad de primera menstruación |
| Sexarquia | Int | Edad de inicio vida sexual |
| NPS | Int | Número de parejas sexuales |

**Signos vitales que requieren estructura:**

| Campo | Tipo | Actual |
|-------|------|--------|
| PA Sistólica | Int | ⚠️ Solo hay vitalSigns (String) |
| PA Diastólica | Int | ⚠️ |
| Frecuencia Cardíaca | Int | ⚠️ |
| Frecuencia Respiratoria | Int | ⚠️ |

---

### 2.5 Informe Médico (informe medico.docx)

**Propósito:** Certificados e informes médicos generales.

**Estructura identificada:**
- Encabezado con logo
- Datos básicos del paciente
- Cuerpo del informe (texto libre)
- Firma del médico

**Propuesta:** Nuevo modelo `MedicalCertificate`

---

### 2.6 Recetas (recipes.docx)

**Observación:** El documento solo contiene imágenes del logo, sin estructura de datos. La funcionalidad de prescripciones ya existe en el sistema.

**Estado:** ✅ Cubierto por modelo `Prescription` existente.

---

### 2.7 Documentos Médicos / Adjuntos (MÓDULO UNIVERSAL)

**Propósito:** Almacenar y organizar **cualquier tipo de documento médico** adjunto al expediente del paciente. Este módulo es **UNIVERSAL** y aplica a todos los tipos de pacientes.

**Tipos de documentos soportados:**

| Tipo | Descripción | Formatos Comunes |
|------|-------------|------------------|
| **Resultados de Laboratorio** | Hematología, química sanguínea, uroanálisis, etc. | PDF, JPG, PNG |
| **Citologías** | Papanicolaou, citología cervical | PDF, JPG |
| **Biopsias** | Resultados histopatológicos | PDF, JPG |
| **Ecografías** | Imágenes de ultrasonido (referencia externa) | JPG, PNG, DICOM |
| **Rayos X / Radiografías** | Imágenes radiológicas | JPG, PNG, DICOM |
| **Resonancias / TAC** | Imágenes de resonancia magnética o tomografía | JPG, PNG, DICOM |
| **Informes Externos** | Interconsultas, referencias de otros médicos | PDF |
| **Otros** | Cualquier otro documento relevante | PDF, JPG, PNG |

**Estado actual en el sistema:**
- ✅ Existe `src/components/patients/ImageUploader.tsx`
- ✅ Existe `src/app/(dashboard)/dashboard/pacientes/[id]/imagenes/page.tsx`
- ✅ Existe `src/server/actions/images.ts`
- ✅ Existe modelo `MedicalImage` en Prisma

**Mejoras propuestas:**

```prisma
// Actualizar modelo MedicalImage existente
model MedicalImage {
  id          String   @id @default(cuid())
  patientId   String
  fileName    String
  fileUrl     String
  fileType    String
  fileSize    Int
  mimeType    String
  description String?

  // NUEVOS CAMPOS para clasificación
  documentType    DocumentType  @default(OTHER)  // Tipo de documento
  documentDate    DateTime?                       // Fecha del documento (ej: fecha del laboratorio)
  laboratory      String?                         // Nombre del laboratorio/centro
  physician       String?                         // Médico que ordenó/realizó
  results         String?       @db.Text          // Resumen de resultados (opcional)
  isNormal        Boolean?                        // ¿Resultados normales?
  tags            String[]                        // Etiquetas para búsqueda

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("medical_images")
  @@index([patientId])
  @@index([documentType])
  @@index([documentDate])
}

enum DocumentType {
  LAB_RESULT        // Resultado de laboratorio
  CYTOLOGY          // Citología
  BIOPSY            // Biopsia
  ULTRASOUND        // Ecografía (imagen suelta)
  XRAY              // Rayos X
  MRI_CT            // Resonancia / TAC
  EXTERNAL_REPORT   // Informe externo
  PRESCRIPTION      // Receta (escaneada)
  OTHER             // Otro
}
```

**Componentes a actualizar:**

```
src/components/patients/
├── ImageUploader.tsx          # Actualizar para soportar DocumentType
├── DocumentTypeSelector.tsx   # NUEVO: Selector de tipo de documento
└── DocumentGallery.tsx        # NUEVO: Vista de galería con filtros
```

---

## 3. PROPUESTA DE NUEVOS MODELOS

### 3.1 Modelo: UltrasoundReport (Reporte de Ecografía)

```prisma
model UltrasoundReport {
  id                    String   @id @default(cuid())
  patientId             String
  date                  DateTime @default(now())

  // Tipo de ecografía
  type                  UltrasoundType  // FIRST_TRIMESTER, SECOND_THIRD_TRIMESTER, GYNECOLOGICAL

  // Datos comunes
  gestationalAge        String?         // EG: "12 semanas 3 días"
  reasonForStudy        String?         // Motivo de consulta
  lastMenstrualPeriod   DateTime?       // FUM (puede diferir del perfil)
  estimatedDueDate      DateTime?       // FPP

  // Signos vitales al momento del eco
  weight                Float?          // kg
  height                Float?          // cm
  bloodPressure         String?         // "120/80"

  // JSON estructurado según tipo
  measurements          Json?           // Biometría según tipo de eco
  findings              Json?           // Hallazgos estructurados

  // Conclusiones
  otherFindings         String?  @db.Text
  diagnoses             String?  @db.Text
  recommendations       String?  @db.Text

  // Imágenes del eco (referencias)
  images                UltrasoundImage[]

  // Metadatos
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  patient               Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("ultrasound_reports")
  @@index([patientId])
  @@index([date])
  @@index([type])
}

enum UltrasoundType {
  FIRST_TRIMESTER       // ECO 1er Trimestre
  SECOND_THIRD_TRIMESTER // ECO 2do/3er Trimestre
  GYNECOLOGICAL         // ECO Ginecológico
}

model UltrasoundImage {
  id                String   @id @default(cuid())
  ultrasoundReportId String
  fileName          String
  fileUrl           String
  description       String?
  createdAt         DateTime @default(now())
  ultrasoundReport  UltrasoundReport @relation(fields: [ultrasoundReportId], references: [id], onDelete: Cascade)

  @@map("ultrasound_images")
  @@index([ultrasoundReportId])
}
```

### 3.2 JSON Schemas para Measurements

#### 3.2.1 Primer Trimestre
```typescript
interface FirstTrimesterMeasurements {
  pregnancy: {
    type: 'single' | 'multiple';
    chorionicity?: string;
  };
  placenta: {
    location: 'fundic' | 'anterior' | 'posterior' | 'lateral';
    side: 'right' | 'center' | 'left';
  };
  amnioticFluid: {
    status: 'normal' | 'abnormal';
    mbv: number; // mm
  };
  cardiacActivity: {
    present: boolean;
    fcf?: number; // lpm
  };
  gestationalSac: {
    diameter: number; // mm
    gestationalAge: string; // "X semanas Y días"
  };
  crownRumpLength: {
    length: number; // mm
    gestationalAge: string;
  };
}
```

#### 3.2.2 Segundo/Tercer Trimestre
```typescript
interface SecondThirdTrimesterMeasurements {
  fetus: {
    number: number;
    presentation: 'cephalic' | 'breech';
    position: 'right' | 'left' | 'superior';
    situation: 'longitudinal' | 'oblique' | 'transverse';
    orientation: 'anterior' | 'posterior' | 'inferior';
  };
  biometry: {
    bpd: { value: number; percentile?: string; ga?: string }; // Diámetro Biparietal
    hc: { value: number; percentile?: string; ga?: string };  // Circunferencia Cefálica
    ac: { value: number; percentile?: string; ga?: string };  // Circunferencia Abdominal
    fl: { value: number; percentile?: string; ga?: string };  // Longitud Femoral
  };
  fcf: number; // Frecuencia cardíaca fetal
  estimatedWeight: {
    value: number; // gramos
    percentile?: string;
  };
  sex: 'male' | 'female' | 'undetermined';
  amnioticFluid: {
    volume: number; // cm³
    percentile?: string;
    mbv: number; // cm
  };
  biophysicalProfile: {
    respiratoryMovements: number; // 0-2
    fetalMovements: number; // 0-2
    fetalTone: number; // 0-2
    ila: number; // 0-2
    total: number; // 0-8
  };
  placenta: {
    location: 'fundic' | 'anterior' | 'posterior' | 'lateral';
    side: 'right' | 'center' | 'left';
    grannumGrade: 0 | 1 | 2 | 3;
  };
}
```

#### 3.2.3 Ginecológico
```typescript
interface GynecologicalMeasurements {
  transducer: 'convex' | 'transvaginal';
  uterus: {
    position: 'avf' | 'rvf' | 'indifferent';
    shape: 'globose' | 'piriform';
    border: 'regular' | 'irregular';
    myometrialPattern: 'homogeneous' | 'heterogeneous';
    body: {
      longitudinal: number; // mm
      transverse: number; // mm
      anteroposterior: number; // mm
      volume: number; // cm³
    };
    endometrium: {
      description: string;
      thickness: number; // mm
    };
  };
  rightOvary: {
    longitudinal: number;
    transverse: number;
    anteroposterior: number;
    volume: number; // cm³
  };
  leftOvary: {
    longitudinal: number;
    transverse: number;
    anteroposterior: number;
    volume: number; // cm³
  };
}
```

---

### 3.3 Actualización Modelo Patient

```prisma
model Patient {
  // ... campos existentes ...

  // NUEVOS CAMPOS - Datos sociodemográficos
  maritalStatus         String?         // Soltero, Casado, Divorciado, Viudo, Unión Libre
  occupation            String?
  nationality           String?         @default("Venezolana")
  educationLevel        String?         // Primaria, Secundaria, Universitaria, Postgrado
  religion              String?

  // NUEVO CAMPO CRÍTICO - Estado de embarazo (controla qué ecografías puede recibir)
  pregnancyStatus       PregnancyStatus @default(NOT_PREGNANT)

  // Relación con ecografías
  ultrasoundReports     UltrasoundReport[]
  medicalCertificates   MedicalCertificate[]
}

enum PregnancyStatus {
  NOT_PREGNANT          // No embarazada → Solo ECO Ginecológico
  FIRST_TRIMESTER       // 1er Trimestre → Solo ECO 1er Trimestre
  SECOND_TRIMESTER      // 2do Trimestre → Solo ECO 2do/3er Trimestre
  THIRD_TRIMESTER       // 3er Trimestre → Solo ECO 2do/3er Trimestre
  POSTPARTUM            // Postparto → Solo ECO Ginecológico (después de cuarentena)
}
```

#### Reglas de Negocio para Ecografías

```typescript
// Validación en el backend antes de crear ecografía
function validateUltrasoundType(patient: Patient, ultrasoundType: UltrasoundType): boolean {
  const { pregnancyStatus } = patient;

  switch (ultrasoundType) {
    case 'GYNECOLOGICAL':
      // Solo para NO embarazadas o postparto
      return pregnancyStatus === 'NOT_PREGNANT' || pregnancyStatus === 'POSTPARTUM';

    case 'FIRST_TRIMESTER':
      // Solo para embarazadas en 1er trimestre
      return pregnancyStatus === 'FIRST_TRIMESTER';

    case 'SECOND_THIRD_TRIMESTER':
      // Solo para embarazadas en 2do o 3er trimestre
      return pregnancyStatus === 'SECOND_TRIMESTER' || pregnancyStatus === 'THIRD_TRIMESTER';

    default:
      return false;
  }
}
```

### 3.4 Actualización GynecologicalProfile

```prisma
model GynecologicalProfile {
  // ... campos existentes ...

  // NUEVOS CAMPOS
  menarche              Int?            // Edad de menarquia
  sexarche              Int?            // Edad de sexarquia
  numberOfPartners      Int?            // NPS
}
```

### 3.5 Modelo: MedicalCertificate (Aplica a TODOS los pacientes)

Este modelo es **universal** y puede ser usado por cualquier tipo de paciente (general, ginecológica o embarazada).

```prisma
model MedicalCertificate {
  id              String            @id @default(cuid())
  patientId       String
  date            DateTime          @default(now())
  type            CertificateType   // Tipo de certificado

  // Datos del certificado
  title           String?           // Título personalizado
  content         String            @db.Text  // Cuerpo del certificado

  // Para certificados de reposo
  restDays        Int?              // Días de reposo
  validFrom       DateTime?         // Fecha inicio del reposo
  validUntil      DateTime?         // Fecha fin del reposo

  // Para informes médicos
  diagnosis       String?           @db.Text  // Diagnóstico principal

  // Metadatos
  issuedBy        String?           // Nombre del médico
  licenseNumber   String?           // Número de colegiatura
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  patient         Patient           @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("medical_certificates")
  @@index([patientId])
  @@index([date])
  @@index([type])
}

enum CertificateType {
  REST              // Reposo médico (con días y fechas)
  MEDICAL_REPORT    // Informe médico general
  MEDICAL_CONSTANCY // Constancia médica
  FITNESS           // Apto para actividades
  DISABILITY        // Certificado de discapacidad
  PREGNANCY         // Certificado de embarazo (solo obstétricas)
  OTHER             // Otro tipo
}
```

#### Plantillas de Certificados

```typescript
// Plantillas predefinidas para cada tipo
const certificateTemplates = {
  REST: {
    title: "CERTIFICADO DE REPOSO MÉDICO",
    template: `Por medio de la presente certifico que el/la paciente {{patientName}},
titular de la C.I. {{patientCI}}, fue atendido/a en consulta médica el día {{date}},
y se le indica reposo médico por {{restDays}} días, desde el {{validFrom}} hasta el {{validUntil}}.

Diagnóstico: {{diagnosis}}

Se expide el presente certificado a solicitud de la parte interesada.`
  },

  MEDICAL_REPORT: {
    title: "INFORME MÉDICO",
    template: `DATOS DEL PACIENTE:
Nombre: {{patientName}}
C.I.: {{patientCI}}
Edad: {{patientAge}} años
Fecha: {{date}}

{{content}}`
  },

  MEDICAL_CONSTANCY: {
    title: "CONSTANCIA MÉDICA",
    template: `Quien suscribe, {{doctorName}}, médico cirujano inscrito en el Colegio
de Médicos bajo el N° {{licenseNumber}}, hace constar que:

El/La paciente {{patientName}}, C.I. {{patientCI}}, asistió a consulta médica
el día {{date}}.

{{content}}

Constancia que se expide a solicitud de la parte interesada.`
  },

  PREGNANCY: {
    title: "CERTIFICADO DE EMBARAZO",
    template: `Por medio de la presente certifico que la paciente {{patientName}},
C.I. {{patientCI}}, de {{patientAge}} años de edad, se encuentra en estado de gravidez.

Fecha de Última Menstruación (FUM): {{fum}}
Edad Gestacional: {{gestationalAge}}
Fecha Probable de Parto (FPP): {{fpp}}

{{content}}`
  }
};
```

### 3.6 Modelo: VitalSigns (Opcional - Para mayor granularidad)

```prisma
model VitalSigns {
  id                String   @id @default(cuid())
  patientId         String
  medicalRecordId   String?  // Opcional, para vincular a consulta
  date              DateTime @default(now())

  systolicBP        Int?     // Presión sistólica
  diastolicBP       Int?     // Presión diastólica
  heartRate         Int?     // Frecuencia cardíaca
  respiratoryRate   Int?     // Frecuencia respiratoria
  temperature       Float?   // Temperatura
  oxygenSaturation  Int?     // SpO2
  weight            Float?   // kg
  height            Float?   // cm

  notes             String?
  createdAt         DateTime @default(now())
  patient           Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  medicalRecord     MedicalRecord? @relation(fields: [medicalRecordId], references: [id])

  @@map("vital_signs")
  @@index([patientId])
  @@index([date])
}
```

---

## 4. FLUJO DE TRABAJO PROPUESTO

### 4.0 Flujo Universal (TODOS LOS PACIENTES)

Los siguientes módulos están disponibles para **cualquier tipo de paciente**, independientemente de si es ginecológica, obstétrica o consulta general:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MÓDULOS UNIVERSALES - CUALQUIER PACIENTE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │   HISTORIA   │    │   RECETAS    │    │    REPOSO    │                  │
│   │   CLÍNICA    │    │ Prescripción │    │ Certificados │                  │
│   │              │    │              │    │   Informes   │                  │
│   └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │    CITAS     │    │   SIGNOS     │    │  DOCUMENTOS  │                  │
│   │  Calendario  │    │   VITALES    │    │   MÉDICOS    │                  │
│   │              │    │              │    │ (Ver 2.7)    │                  │
│   └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Flujo de Consulta Ginecológica (Paciente NO Embarazada)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   1. Recepción  │ ──► │  2. Historia    │ ──► │  3. Examen      │
│   (Datos Demo)  │     │   Clínica       │     │   Físico        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  6. Seguimiento │ ◄── │ 5. Prescripción │ ◄── │ 4. ECO Gineco   │
│  (Cita/Reposo)  │     │ (Recetas)       │     │ (Solo NO Emb.)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Ecografías permitidas:** Solo ECO Ginecológico

### 4.2 Flujo de Control Prenatal (Paciente EMBARAZADA)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. Primera     │ ──► │  2. ECO 1er     │ ──► │  3. Controles   │
│    Consulta     │     │   Trimestre     │     │   Mensuales     │
│  (Hx Clínica)   │     │ (Solo 1er Trim) │     │ (Recetas/Reposo)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┘
                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  4. ECO 2do/3er │ ──► │  5. Preparación │ ──► │  6. Parto/      │
│   Trimestre     │     │    Parto        │     │   Cesárea       │
│(Solo 2do/3er T) │     │(Recetas/Reposo) │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Ecografías permitidas:**
- 1er Trimestre: Solo ECO 1er Trimestre
- 2do/3er Trimestre: Solo ECO 2do/3er Trimestre

### 4.3 Flujo de Consulta General (Cualquier Paciente)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   1. Registro   │ ──► │  2. Historia    │ ──► │  3. Examen      │
│    Paciente     │     │   Clínica       │     │   Físico        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  6. Seguimiento │ ◄── │ 5. Certificados │ ◄── │ 4. Diagnóstico  │
│    (Cita)       │     │  Reposo/Informe │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  7. Recetas     │
                        │  Prescripción   │
                        └─────────────────┘
```

**Módulos disponibles:** Historia Clínica, Recetas, Reposo, Certificados, Citas

---

## 5. RUTAS Y COMPONENTES PROPUESTOS

### 5.1 Estructura Actual vs Propuesta

**Rutas YA EXISTENTES en el proyecto:**
```
/dashboard/pacientes/[id]/                    ✅ Detalle del paciente
/dashboard/pacientes/[id]/editar              ✅ Editar paciente
/dashboard/pacientes/[id]/historial           ✅ Historial clínico
/dashboard/pacientes/[id]/historial/[recordId] ✅ Ver registro médico
/dashboard/pacientes/[id]/imagenes            ✅ Imágenes/Documentos médicos
/dashboard/pacientes/[id]/prescripciones      ✅ Lista de prescripciones
/dashboard/pacientes/[id]/prescripciones/nuevo ✅ Nueva prescripción
/dashboard/pacientes/[id]/prescripciones/[id] ✅ Ver prescripción
/dashboard/pacientes/[id]/prescripciones/[id]/imprimir ✅ Imprimir prescripción
```

**Rutas NUEVAS a crear:**
```
# ═══════════════════════════════════════════════════════════════════
# CERTIFICADOS (UNIVERSAL - Todos los pacientes)
# ═══════════════════════════════════════════════════════════════════
/dashboard/pacientes/[id]/certificados            # Lista de certificados
/dashboard/pacientes/[id]/certificados/nuevo      # Nuevo certificado (selector de tipo)
/dashboard/pacientes/[id]/certificados/[certId]   # Ver certificado
/dashboard/pacientes/[id]/certificados/[certId]/editar
/dashboard/pacientes/[id]/certificados/[certId]/imprimir

# ═══════════════════════════════════════════════════════════════════
# ECOGRAFÍAS (Filtradas por estado de embarazo)
# ═══════════════════════════════════════════════════════════════════
/dashboard/pacientes/[id]/ecografias              # Lista de ecografías
/dashboard/pacientes/[id]/ecografias/nuevo        # Nueva ecografía (selector inteligente)
/dashboard/pacientes/[id]/ecografias/[ecoId]      # Ver ecografía
/dashboard/pacientes/[id]/ecografias/[ecoId]/editar
/dashboard/pacientes/[id]/ecografias/[ecoId]/imprimir

# ═══════════════════════════════════════════════════════════════════
# CONTROL PRENATAL (Solo embarazadas)
# ═══════════════════════════════════════════════════════════════════
/dashboard/pacientes/[id]/control-prenatal        # Resumen control prenatal
```

### 5.2 Componentes Existentes vs Nuevos

**Componentes YA EXISTENTES:**
```
src/components/
├── patients/
│   ├── GynecologicalProfileFields.tsx  ✅ Campos del perfil ginecológico
│   ├── ImageUploader.tsx               ✅ Cargador de imágenes (actualizar)
│   ├── MedicalRecordForm.tsx           ✅ Formulario de registro médico
│   ├── PatientCombobox.tsx             ✅ Selector de paciente
│   └── PatientForm.tsx                 ✅ Formulario de paciente (actualizar)
│
├── prescriptions/
│   └── PrescriptionForm.tsx            ✅ Formulario de prescripción
│
├── appointments/
│   ├── AppointmentForm.tsx             ✅ Formulario de citas
│   └── CalendarView.tsx                ✅ Vista de calendario
│
└── ui/                                 ✅ Componentes base (shadcn/ui)
```

**Componentes NUEVOS a crear:**
```
src/components/
│
├── patients/
│   ├── PatientTypeIndicator.tsx        🆕 Badge: General | Gineco | Embarazada
│   ├── PregnancyStatusSelector.tsx     🆕 Selector de estado de embarazo
│   ├── DocumentTypeSelector.tsx        🆕 Selector tipo de documento adjunto
│   └── DocumentGallery.tsx             🆕 Galería con filtros por tipo
│
├── ultrasound/                         🆕 CARPETA NUEVA
│   ├── UltrasoundTypeSelector.tsx      🆕 Selector inteligente según embarazo
│   ├── FirstTrimesterForm.tsx          🆕 Formulario ECO 1er trimestre
│   ├── SecondThirdTrimesterForm.tsx    🆕 Formulario ECO 2do/3er trimestre
│   ├── GynecologicalForm.tsx           🆕 Formulario ECO ginecológico
│   ├── UltrasoundPrintView.tsx         🆕 Vista de impresión (3 templates)
│   └── UltrasoundImageGallery.tsx      🆕 Galería de imágenes del eco
│
└── certificates/                       🆕 CARPETA NUEVA
    ├── CertificateTypeSelector.tsx     🆕 Selector de tipo
    ├── RestCertificateForm.tsx         🆕 Formulario de reposo
    ├── MedicalReportForm.tsx           🆕 Formulario de informe médico
    ├── CertificateTemplates.tsx        🆕 Plantillas predefinidas
    └── CertificatePrintView.tsx        🆕 Vista de impresión
```

**Server Actions EXISTENTES vs NUEVAS:**
```
src/server/actions/
├── appointment.ts      ✅ Existe
├── audit.ts            ✅ Existe
├── dashboard.ts        ✅ Existe
├── images.ts           ✅ Existe (actualizar para DocumentType)
├── medicalRecord.ts    ✅ Existe
├── notifications.ts    ✅ Existe
├── patient.ts          ✅ Existe (actualizar para PregnancyStatus)
├── prescription.ts     ✅ Existe
├── reports.ts          ✅ Existe
├── ultrasound.ts       🆕 NUEVO - CRUD ecografías
└── certificate.ts      🆕 NUEVO - CRUD certificados
```

**Validadores EXISTENTES vs NUEVOS:**
```
src/lib/validators/
├── appointment.ts              ✅ Existe
├── gynecologicalProfile.ts     ✅ Existe (actualizar: menarche, sexarche, NPS)
├── medicalRecord.ts            ✅ Existe
├── patient.ts                  ✅ Existe (actualizar: pregnancyStatus, datos sociodem.)
├── prescription.ts             ✅ Existe
├── ultrasound.ts               🆕 NUEVO - Validación ecografías
└── certificate.ts              🆕 NUEVO - Validación certificados
```

### 5.3 Lógica de UI para Selector de Ecografías

```tsx
// UltrasoundTypeSelector.tsx
interface Props {
  patient: Patient;
  onSelect: (type: UltrasoundType) => void;
}

export function UltrasoundTypeSelector({ patient, onSelect }: Props) {
  const { pregnancyStatus } = patient;

  // Determinar opciones disponibles según estado de embarazo
  const availableOptions = useMemo(() => {
    switch (pregnancyStatus) {
      case 'NOT_PREGNANT':
      case 'POSTPARTUM':
        return [{ value: 'GYNECOLOGICAL', label: 'ECO Ginecológico' }];

      case 'FIRST_TRIMESTER':
        return [{ value: 'FIRST_TRIMESTER', label: 'ECO 1er Trimestre' }];

      case 'SECOND_TRIMESTER':
      case 'THIRD_TRIMESTER':
        return [{ value: 'SECOND_THIRD_TRIMESTER', label: 'ECO 2do/3er Trimestre' }];

      default:
        return [];
    }
  }, [pregnancyStatus]);

  return (
    <Select
      label="Tipo de Ecografía"
      options={availableOptions}
      onChange={(value) => onSelect(value as UltrasoundType)}
    />
  );
}
```

---

## 6. PRIORIZACIÓN DE DESARROLLO

### Fase 1: Alta Prioridad (Sprint 1-2) - Módulo de Ecografías

| # | Archivo a Crear/Modificar | Tipo | Descripción |
|---|---------------------------|------|-------------|
| 1 | `prisma/schema.prisma` | Modificar | Agregar `PregnancyStatus`, `UltrasoundType`, `UltrasoundReport`, `UltrasoundImage` |
| 2 | `prisma/migrations/xxx_add_ultrasound` | Crear | Migración de BD |
| 3 | `src/lib/validators/ultrasound.ts` | Crear | Validaciones Zod para ecografías |
| 4 | `src/server/actions/ultrasound.ts` | Crear | Server actions CRUD ecografías |
| 5 | `src/components/patients/PregnancyStatusSelector.tsx` | Crear | Selector de estado de embarazo |
| 6 | `src/components/patients/PatientTypeIndicator.tsx` | Crear | Badge indicador tipo paciente |
| 7 | `src/components/ultrasound/UltrasoundTypeSelector.tsx` | Crear | Selector inteligente de tipo ECO |
| 8 | `src/components/ultrasound/FirstTrimesterForm.tsx` | Crear | Formulario ECO 1er trim |
| 9 | `src/components/ultrasound/SecondThirdTrimesterForm.tsx` | Crear | Formulario ECO 2do/3er trim |
| 10 | `src/components/ultrasound/GynecologicalForm.tsx` | Crear | Formulario ECO ginecológico |
| 11 | `src/components/ultrasound/UltrasoundPrintView.tsx` | Crear | Vista impresión (3 templates) |
| 12 | `src/app/(dashboard)/dashboard/pacientes/[id]/ecografias/page.tsx` | Crear | Lista de ecografías |
| 13 | `src/app/(dashboard)/dashboard/pacientes/[id]/ecografias/nuevo/page.tsx` | Crear | Nueva ecografía |
| 14 | `src/app/(dashboard)/dashboard/pacientes/[id]/ecografias/[ecoId]/page.tsx` | Crear | Ver ecografía |
| 15 | `src/app/(dashboard)/dashboard/pacientes/[id]/ecografias/[ecoId]/imprimir/page.tsx` | Crear | Imprimir ecografía |
| 16 | `src/lib/validators/patient.ts` | Modificar | Agregar `pregnancyStatus` |
| 17 | `src/components/patients/PatientForm.tsx` | Modificar | Agregar selector de embarazo |

### Fase 2: Media Prioridad (Sprint 3) - Certificados y Mejoras

| # | Archivo a Crear/Modificar | Tipo | Descripción |
|---|---------------------------|------|-------------|
| 1 | `prisma/schema.prisma` | Modificar | Agregar `CertificateType`, `MedicalCertificate` |
| 2 | `prisma/migrations/xxx_add_certificates` | Crear | Migración de BD |
| 3 | `src/lib/validators/certificate.ts` | Crear | Validaciones Zod |
| 4 | `src/server/actions/certificate.ts` | Crear | Server actions CRUD |
| 5 | `src/components/certificates/CertificateTypeSelector.tsx` | Crear | Selector de tipo |
| 6 | `src/components/certificates/RestCertificateForm.tsx` | Crear | Formulario reposo |
| 7 | `src/components/certificates/MedicalReportForm.tsx` | Crear | Formulario informe |
| 8 | `src/components/certificates/CertificatePrintView.tsx` | Crear | Vista impresión |
| 9 | `src/app/(dashboard)/dashboard/pacientes/[id]/certificados/page.tsx` | Crear | Lista certificados |
| 10 | `src/app/(dashboard)/dashboard/pacientes/[id]/certificados/nuevo/page.tsx` | Crear | Nuevo certificado |
| 11 | `src/app/(dashboard)/dashboard/pacientes/[id]/certificados/[certId]/page.tsx` | Crear | Ver certificado |
| 12 | `src/app/(dashboard)/dashboard/pacientes/[id]/certificados/[certId]/imprimir/page.tsx` | Crear | Imprimir |
| 13 | `prisma/schema.prisma` | Modificar | Actualizar Patient (datos sociodemográficos) |
| 14 | `src/lib/validators/gynecologicalProfile.ts` | Modificar | Agregar menarche, sexarche, NPS |
| 15 | `src/components/patients/GynecologicalProfileFields.tsx` | Modificar | Nuevos campos |

### Fase 3: Mejoras al Módulo de Documentos (Sprint 4)

| # | Archivo a Crear/Modificar | Tipo | Descripción |
|---|---------------------------|------|-------------|
| 1 | `prisma/schema.prisma` | Modificar | Agregar `DocumentType` a MedicalImage |
| 2 | `src/components/patients/DocumentTypeSelector.tsx` | Crear | Selector tipo documento |
| 3 | `src/components/patients/DocumentGallery.tsx` | Crear | Galería con filtros |
| 4 | `src/components/patients/ImageUploader.tsx` | Modificar | Soportar DocumentType |
| 5 | `src/server/actions/images.ts` | Modificar | Filtros por tipo |
| 6 | `src/app/(dashboard)/dashboard/pacientes/[id]/imagenes/page.tsx` | Modificar | Filtros y categorías |

### Fase 4: Funcionalidades Avanzadas (Sprint 5+)

| # | Funcionalidad | Descripción |
|---|---------------|-------------|
| 1 | Modelo `VitalSigns` | Signos vitales estructurados |
| 2 | Curvas de crecimiento fetal | Gráficos con recharts |
| 3 | Calculadoras obstétricas | FPP, EG automáticos |
| 4 | Dashboard por tipo paciente | Estadísticas segmentadas |
| 5 | Exportación PDF historia clínica | Historia completa en PDF |
| 6 | Control prenatal | Vista resumen para embarazadas |

---

## 7. CONSIDERACIONES TÉCNICAS

### 7.1 Encriptación
Los siguientes campos deben encriptarse (AES-256-GCM):
- `UltrasoundReport.diagnoses`
- `UltrasoundReport.findings`
- `MedicalCertificate.content`

### 7.2 Validaciones Zod

```typescript
// Validador para ecografía
export const ultrasoundReportSchema = z.object({
  type: z.enum(['FIRST_TRIMESTER', 'SECOND_THIRD_TRIMESTER', 'GYNECOLOGICAL']),
  date: z.date(),
  gestationalAge: z.string().optional(),
  measurements: z.record(z.unknown()), // Validar según tipo
  diagnoses: z.string().min(1, 'Debe incluir al menos un diagnóstico'),
  // ...
});
```

### 7.3 Generación de PDF
Usar la librería existente o implementar nuevas plantillas:
- Template para ECO 1er Trimestre
- Template para ECO 2do/3er Trimestre
- Template para ECO Ginecológico
- Template para Certificados Médicos

---

## 8. CONCLUSIONES

El sistema actual tiene una base sólida, pero requiere expansión para cubrir el flujo de trabajo completo de un consultorio de ginecología y obstetricia. Las principales adiciones son:

1. **Módulo de Ecografías** - Crítico para el seguimiento obstétrico
2. **Certificados Médicos** - Necesario para documentación formal
3. **Datos ampliados del paciente** - Mejora la historia clínica

La arquitectura propuesta mantiene la coherencia con el diseño actual, utilizando:
- Campos JSON para datos estructurados flexibles
- Relaciones 1:N para ecografías y certificados
- Reutilización de componentes existentes (ImageUploader, PrintView)

---

## ANEXO A: Schema Prisma Propuesto Completo

```prisma
// ═══════════════════════════════════════════════════════════════════
// NUEVOS ENUMS
// ═══════════════════════════════════════════════════════════════════

enum PregnancyStatus {
  NOT_PREGNANT          // No embarazada → Solo ECO Ginecológico
  FIRST_TRIMESTER       // 1er Trimestre → Solo ECO 1er Trimestre
  SECOND_TRIMESTER      // 2do Trimestre → Solo ECO 2do/3er Trimestre
  THIRD_TRIMESTER       // 3er Trimestre → Solo ECO 2do/3er Trimestre
  POSTPARTUM            // Postparto → Solo ECO Ginecológico
}

enum UltrasoundType {
  FIRST_TRIMESTER       // ECO 1er Trimestre (solo embarazadas 1er trim)
  SECOND_THIRD_TRIMESTER // ECO 2do/3er Trimestre (solo embarazadas 2do/3er)
  GYNECOLOGICAL         // ECO Ginecológico (solo NO embarazadas)
}

enum CertificateType {
  REST                  // Reposo médico
  MEDICAL_REPORT        // Informe médico general
  MEDICAL_CONSTANCY     // Constancia médica
  FITNESS               // Apto para actividades
  DISABILITY            // Certificado de discapacidad
  PREGNANCY             // Certificado de embarazo
  OTHER                 // Otro tipo
}

// ═══════════════════════════════════════════════════════════════════
// MODELO: UltrasoundReport (Reportes de Ecografía)
// ═══════════════════════════════════════════════════════════════════

model UltrasoundReport {
  id                    String           @id @default(cuid())
  patientId             String
  date                  DateTime         @default(now())
  type                  UltrasoundType

  // Datos comunes
  gestationalAge        String?          // EG: "12 semanas 3 días"
  reasonForStudy        String?          // Motivo de consulta
  lastMenstrualPeriod   DateTime?        // FUM
  estimatedDueDate      DateTime?        // FPP

  // Signos vitales al momento del eco
  weight                Float?           // kg
  height                Float?           // cm
  bloodPressure         String?          // "120/80"

  // Datos estructurados según tipo (JSON)
  measurements          Json?            // Biometría según tipo de eco
  findings              Json?            // Hallazgos estructurados

  // Conclusiones
  otherFindings         String?          @db.Text
  diagnoses             String?          @db.Text
  recommendations       String?          @db.Text

  // Metadatos
  createdAt             DateTime         @default(now())
  updatedAt             DateTime         @updatedAt

  // Relaciones
  patient               Patient          @relation(fields: [patientId], references: [id], onDelete: Cascade)
  images                UltrasoundImage[]

  @@map("ultrasound_reports")
  @@index([patientId])
  @@index([date])
  @@index([type])
}

model UltrasoundImage {
  id                 String           @id @default(cuid())
  ultrasoundReportId String
  fileName           String
  fileUrl            String
  fileType           String
  fileSize           Int
  mimeType           String
  description        String?
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt
  ultrasoundReport   UltrasoundReport @relation(fields: [ultrasoundReportId], references: [id], onDelete: Cascade)

  @@map("ultrasound_images")
  @@index([ultrasoundReportId])
}

// ═══════════════════════════════════════════════════════════════════
// MODELO: MedicalCertificate (Certificados - UNIVERSAL)
// Aplica a TODOS los pacientes: generales, ginecológicas, embarazadas
// ═══════════════════════════════════════════════════════════════════

model MedicalCertificate {
  id              String            @id @default(cuid())
  patientId       String
  date            DateTime          @default(now())
  type            CertificateType

  // Datos del certificado
  title           String?
  content         String            @db.Text

  // Para certificados de reposo
  restDays        Int?
  validFrom       DateTime?
  validUntil      DateTime?

  // Para informes médicos
  diagnosis       String?           @db.Text

  // Metadatos
  issuedBy        String?
  licenseNumber   String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relaciones
  patient         Patient           @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@map("medical_certificates")
  @@index([patientId])
  @@index([date])
  @@index([type])
}

// ═══════════════════════════════════════════════════════════════════
// MODIFICACIONES A MODELOS EXISTENTES
// ═══════════════════════════════════════════════════════════════════

// Agregar a modelo Patient existente:
model Patient {
  // ... campos existentes ...

  // NUEVOS CAMPOS - Datos sociodemográficos
  maritalStatus         String?
  occupation            String?
  nationality           String?         @default("Venezolana")
  educationLevel        String?
  religion              String?

  // NUEVO CAMPO CRÍTICO - Control de tipo de paciente
  pregnancyStatus       PregnancyStatus @default(NOT_PREGNANT)

  // NUEVAS RELACIONES
  ultrasoundReports     UltrasoundReport[]
  medicalCertificates   MedicalCertificate[]
}

// Agregar a modelo GynecologicalProfile existente:
model GynecologicalProfile {
  // ... campos existentes ...

  // NUEVOS CAMPOS
  menarche              Int?            // Edad de menarquia
  sexarche              Int?            // Edad de sexarquia
  numberOfPartners      Int?            // NPS (número de parejas sexuales)
}
```

---

## ANEXO B: Resumen de Cambios por Modelo

| Modelo | Acción | Campos Nuevos |
|--------|--------|---------------|
| Patient | Modificar | `maritalStatus`, `occupation`, `nationality`, `educationLevel`, `religion`, `pregnancyStatus` |
| GynecologicalProfile | Modificar | `menarche`, `sexarche`, `numberOfPartners` |
| MedicalImage | Modificar | `documentType`, `documentDate`, `laboratory`, `physician`, `results`, `isNormal`, `tags` |
| UltrasoundReport | Crear | (modelo completo) |
| UltrasoundImage | Crear | (modelo completo) |
| MedicalCertificate | Crear | (modelo completo) |
| PregnancyStatus | Crear | (enum) |
| UltrasoundType | Crear | (enum) |
| CertificateType | Crear | (enum) |
| DocumentType | Crear | (enum: LAB_RESULT, CYTOLOGY, BIOPSY, ULTRASOUND, XRAY, MRI_CT, EXTERNAL_REPORT, PRESCRIPTION, OTHER) |

---

## ANEXO C: Comandos de Migración

```bash
# 1. Agregar nuevos campos y modelos
npx prisma migrate dev --name add_ultrasound_and_certificates

# 2. Si hay datos existentes, puede ser necesario un script de migración
# para establecer pregnancyStatus por defecto

# 3. Regenerar cliente Prisma
npx prisma generate

# 4. Verificar esquema
npx prisma db push --dry-run
```

---

**Documento preparado por:** Equipo de Producto y Desarrollo
**Fecha:** Enero 2026
**Versión:** 2.1 (Actualizado con clasificación de pacientes)
