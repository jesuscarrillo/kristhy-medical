import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  consultationType: z.enum(["prenatal", "gynecology", "emergency", "followup"]),
  date: z.coerce.date(),
  chiefComplaint: z.string().trim().min(5, "Motivo muy corto"),
  symptoms: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  diagnosis: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  treatment: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  vitalSigns: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  personalHistory: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  gynecologicHistory: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(2000).optional()
  ),
  obstetricalHistory: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(2000).optional()
  ),
  physicalExam: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  treatmentPlan: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  followUpDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
});

export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>;
