import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  date: z.coerce.date(),
  duration: z.coerce.number().int().min(10).max(240).default(30),
  type: z.enum(["prenatal", "gynecology", "ultrasound", "followup"]),
  status: z.enum(["scheduled", "completed", "cancelled", "noshow"]).default("scheduled"),
  reason: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  notes: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
