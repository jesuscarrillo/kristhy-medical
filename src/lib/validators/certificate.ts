import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const emptyToNull = (value: unknown) => (value === "" ? null : value);

// Certificate type values
export const certificateTypeValues = [
  "REST",
  "MEDICAL_REPORT",
  "MEDICAL_CONSTANCY",
  "FITNESS",
  "DISABILITY",
  "PREGNANCY",
  "OTHER",
] as const;

export const certificateTypeLabels: Record<typeof certificateTypeValues[number], string> = {
  REST: "Reposo médico",
  MEDICAL_REPORT: "Informe médico",
  MEDICAL_CONSTANCY: "Constancia médica",
  FITNESS: "Aptitud física",
  DISABILITY: "Incapacidad",
  PREGNANCY: "Certificado de embarazo",
  OTHER: "Otro",
};

export const certificateTypeDescriptions: Record<typeof certificateTypeValues[number], string> = {
  REST: "Certificado que indica días de reposo por enfermedad o recuperación",
  MEDICAL_REPORT: "Informe detallado de la condición médica del paciente",
  MEDICAL_CONSTANCY: "Constancia de asistencia a consulta o tratamiento",
  FITNESS: "Certificado de aptitud física para actividades específicas",
  DISABILITY: "Certificado de incapacidad temporal o permanente",
  PREGNANCY: "Certificado que confirma estado de embarazo y edad gestacional",
  OTHER: "Otro tipo de certificado médico",
};

export const certificateSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  date: z.coerce.date(),
  type: z.enum(certificateTypeValues, { message: "Tipo de certificado requerido" }),
  title: z.string().trim().min(5, "Título muy corto").max(200, "Título muy largo"),
  content: z.string().trim().min(10, "Contenido muy corto").max(5000, "Contenido muy largo"),
  restDays: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1, "Mínimo 1 día").max(365, "Máximo 365 días").optional()
  ),
  validFrom: z.preprocess(
    emptyToNull,
    z.coerce.date().optional().nullable()
  ),
  validUntil: z.preprocess(
    emptyToNull,
    z.coerce.date().optional().nullable()
  ),
  diagnosis: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  issuedBy: z.string().trim().min(5, "Nombre del médico requerido").max(100),
  licenseNumber: z.string().trim().min(3, "Número de licencia requerido").max(50),
}).refine(
  (data) => {
    // If type is REST, restDays is required
    if (data.type === "REST" && !data.restDays) {
      return false;
    }
    return true;
  },
  {
    message: "Para certificados de reposo, debe especificar los días de reposo",
    path: ["restDays"],
  }
).refine(
  (data) => {
    // If validFrom and validUntil are provided, validUntil should be after validFrom
    if (data.validFrom && data.validUntil) {
      return new Date(data.validUntil) >= new Date(data.validFrom);
    }
    return true;
  },
  {
    message: "La fecha de vencimiento debe ser posterior a la fecha de inicio",
    path: ["validUntil"],
  }
);

export type CertificateType = typeof certificateTypeValues[number];
export type CertificateInput = z.infer<typeof certificateSchema>;
