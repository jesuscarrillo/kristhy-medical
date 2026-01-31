import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  date: z.coerce.date(),
  medications: z.string().trim().min(5, "Debe especificar al menos un medicamento"),
  instructions: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  diagnosis: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
});

export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
