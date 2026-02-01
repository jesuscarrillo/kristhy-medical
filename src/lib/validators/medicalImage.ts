import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (value === null || value === undefined || value === "") return undefined;
  return value;
};

const emptyToNull = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  return value;
};

// Document type values
export const documentTypeValues = [
  "LAB_RESULT",
  "CYTOLOGY",
  "BIOPSY",
  "ULTRASOUND",
  "XRAY",
  "MRI_CT",
  "EXTERNAL_REPORT",
  "PRESCRIPTION",
  "OTHER",
] as const;

export const documentTypeLabels: Record<typeof documentTypeValues[number], string> = {
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

export const documentTypeColors: Record<typeof documentTypeValues[number], string> = {
  LAB_RESULT: "bg-green-100 text-green-800",
  CYTOLOGY: "bg-pink-100 text-pink-800",
  BIOPSY: "bg-red-100 text-red-800",
  ULTRASOUND: "bg-purple-100 text-purple-800",
  XRAY: "bg-blue-100 text-blue-800",
  MRI_CT: "bg-indigo-100 text-indigo-800",
  EXTERNAL_REPORT: "bg-yellow-100 text-yellow-800",
  PRESCRIPTION: "bg-orange-100 text-orange-800",
  OTHER: "bg-slate-100 text-slate-800",
};

export const medicalImageSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  fileType: z.string().min(1, "Tipo de archivo requerido"),
  description: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  // New v2 fields
  documentType: z.preprocess(
    emptyToUndefined,
    z.enum(documentTypeValues).optional()
  ),
  documentDate: z.preprocess(
    emptyToNull,
    z.coerce.date().optional().nullable()
  ),
  laboratory: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  physician: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  results: z.preprocess(emptyToUndefined, z.string().trim().max(5000).optional()),
  isNormal: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return val === "true" || val === true;
    },
    z.boolean().optional()
  ),
  tags: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.split(",").map(t => t.trim()).filter(Boolean);
      }
      return val || [];
    },
    z.array(z.string()).optional()
  ),
});

export type DocumentType = typeof documentTypeValues[number];
export type MedicalImageInput = z.infer<typeof medicalImageSchema>;
