import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(100),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/^[0-9+\\-\\s()]+$/, "Teléfono inválido")
    .min(7, "Teléfono inválido"),
  reason: z.enum([
    "prenatal",
    "highRisk",
    "gynecology",
    "surgery",
    "ultrasound",
    "cervical",
    "other",
  ]),
  message: z.string().min(10, "Mensaje muy corto").max(1000),
  privacy: z.boolean().refine((val) => val === true, "Debes aceptar"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
