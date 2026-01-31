import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const emptyToNull = (value: unknown) => (value === "" ? null : value);

export const gynecologicalProfileSchema = z.object({
  // Antecedentes Obstétricos
  gestas: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(30).optional()),
  cesareas: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(20).optional()),
  ectopicos: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(10).optional()),
  partos: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(20).optional()),
  abortos: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(20).optional()),
  molas: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(5).optional()),
  // Ciclos Menstruales
  menstrualCycleDays: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(21).max(45).optional()
  ),
  menstrualDuration: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(10).optional()
  ),
  menstrualPain: z.preprocess(
    emptyToUndefined,
    z.enum(["none", "mild", "moderate", "severe"]).optional()
  ),
  lastMenstrualPeriod: z.preprocess(
    emptyToNull,
    z.coerce.date().max(new Date(), "FUM no puede ser futura").optional().nullable()
  ),
  menopause: z.preprocess((val) => val === "true" || val === true, z.boolean()).default(false),
  menopauseAge: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(35).max(60).optional()
  ),
  // Información adicional
  contraceptiveMethod: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500).optional()
  ),
  sexuallyActive: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return val === "true" || val === true;
    },
    z.boolean().optional()
  ),
  parity: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(50).optional()
  ),
  notes: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(2000).optional()
  ),
});

export type GynecologicalProfileInput = z.infer<typeof gynecologicalProfileSchema>;
