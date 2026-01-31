import { z } from "zod";
import { gynecologicalProfileSchema } from "./gynecologicalProfile";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const patientSchema = z.object({
  medicalRecordNumber: z.string().min(3, "Número muy corto").max(20, "Número muy largo").trim(),
  firstName: z.string().min(2, "Nombre muy corto").max(50, "Nombre muy largo").trim(),
  lastName: z.string().min(2, "Apellido muy corto").max(50, "Apellido muy largo").trim(),
  cedula: z
    .string()
    .regex(/^[VE]-?\d{7,8}$/, "Cédula inválida (formato: V-12345678)")
    .transform((val) => val.replace("-", "")),
  dateOfBirth: z.coerce.date().max(new Date(), "Fecha no puede ser futura"),
  gender: z.enum(["female", "male", "other"]),
  phone: z
    .string()
    .regex(/^(\+58)?4(12|14|24|26)\d{7}$/, "Teléfono venezolano inválido"),
  email: z.preprocess(emptyToUndefined, z.string().email("Email inválido").optional()),
  address: z.string().min(5).max(200),
  city: z.string().default("San Cristóbal"),
  state: z.string().default("Táchira"),
  bloodType: z.preprocess(
    emptyToUndefined,
    z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional()
  ),
  weight: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(20, "Peso mínimo 20kg").max(300, "Peso máximo 300kg").optional()
  ),
  height: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(100, "Talla mínima 100cm").max(250, "Talla máxima 250cm").optional()
  ),
  allergies: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  emergencyContact: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500).optional()
  ),
  notes: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
});

// Combined schema for forms that include gynecological profile
export const patientWithGynProfileSchema = patientSchema.merge(
  gynecologicalProfileSchema.partial().extend({
    gynProfileNotes: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  })
);

export type PatientInput = z.infer<typeof patientSchema>;
export type PatientWithGynProfileInput = z.infer<typeof patientWithGynProfileSchema>;
