import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const emptyToNull = (value: unknown) => (value === "" ? null : value);

// Pregnancy status values
export const pregnancyStatusValues = [
  "NOT_PREGNANT",
  "FIRST_TRIMESTER",
  "SECOND_TRIMESTER",
  "THIRD_TRIMESTER",
  "POSTPARTUM",
] as const;

export const pregnancyStatusLabels: Record<typeof pregnancyStatusValues[number], string> = {
  NOT_PREGNANT: "No embarazada",
  FIRST_TRIMESTER: "Primer trimestre",
  SECOND_TRIMESTER: "Segundo trimestre",
  THIRD_TRIMESTER: "Tercer trimestre",
  POSTPARTUM: "Postparto",
};

// Ultrasound type values
export const ultrasoundTypeValues = [
  "FIRST_TRIMESTER",
  "SECOND_THIRD_TRIMESTER",
  "GYNECOLOGICAL",
] as const;

export const ultrasoundTypeLabels: Record<typeof ultrasoundTypeValues[number], string> = {
  FIRST_TRIMESTER: "Primer trimestre",
  SECOND_THIRD_TRIMESTER: "Segundo/Tercer trimestre",
  GYNECOLOGICAL: "Ginecológico",
};

// Map of valid ultrasound types per pregnancy status
export const validUltrasoundTypes: Record<typeof pregnancyStatusValues[number], typeof ultrasoundTypeValues[number][]> = {
  NOT_PREGNANT: ["GYNECOLOGICAL"],
  FIRST_TRIMESTER: ["FIRST_TRIMESTER", "GYNECOLOGICAL"],
  SECOND_TRIMESTER: ["SECOND_THIRD_TRIMESTER", "GYNECOLOGICAL"],
  THIRD_TRIMESTER: ["SECOND_THIRD_TRIMESTER", "GYNECOLOGICAL"],
  POSTPARTUM: ["GYNECOLOGICAL"],
};

// First trimester measurements schema
export const firstTrimesterMeasurementsSchema = z.object({
  // Saco gestacional
  sacoDiameter: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()), // mm
  // CRL (Crown-rump length)
  crl: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()), // mm
  // Frecuencia cardíaca fetal
  fcf: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(250).optional()), // lpm
  // Translucencia nucal
  translucenciaNucal: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(10).optional()), // mm
  // Hueso nasal
  huesoNasal: z.preprocess(emptyToUndefined, z.enum(["visible", "no_visible", "no_evaluable"]).optional()),
  // Ductus venoso
  ductusVenoso: z.preprocess(emptyToUndefined, z.enum(["normal", "reverso", "no_evaluable"]).optional()),
  // Número de embriones/fetos
  numeroFetos: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(5).optional()),
  // Corionicidad (embarazos múltiples)
  corionicidad: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  // Saco vitelino
  sacoVitelino: z.preprocess(emptyToUndefined, z.enum(["presente", "ausente", "anormal"]).optional()),
  sacoVitelinoDiameter: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(20).optional()), // mm
  // Actividad cardíaca
  actividadCardiaca: z.preprocess(emptyToUndefined, z.enum(["presente", "ausente"]).optional()),
  // Movimientos fetales
  movimientosFetales: z.preprocess(emptyToUndefined, z.enum(["presentes", "ausentes"]).optional()),
});

// Second/Third trimester measurements schema (biometría fetal)
export const secondThirdTrimesterMeasurementsSchema = z.object({
  // Biometría fetal
  dbp: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(120).optional()), // Diámetro biparietal mm
  cc: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(400).optional()),  // Circunferencia cefálica mm
  ca: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(450).optional()),  // Circunferencia abdominal mm
  lf: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(90).optional()),   // Longitud femoral mm
  // Peso fetal estimado
  pesoFetal: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(6000).optional()), // gramos
  // Frecuencia cardíaca fetal
  fcf: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(250).optional()), // lpm
  // Presentación
  presentacion: z.preprocess(emptyToUndefined, z.enum(["cefalica", "podalica", "transversa", "variable"]).optional()),
  // Dorso fetal
  dorsoFetal: z.preprocess(emptyToUndefined, z.enum(["anterior", "posterior", "lateral_derecho", "lateral_izquierdo"]).optional()),
  // Líquido amniótico
  liquidoAmnioticoTipo: z.preprocess(emptyToUndefined, z.enum(["normal", "oligoamnios", "polihidramnios"]).optional()),
  ila: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(50).optional()), // Índice de líquido amniótico cm
  bolsilloMayor: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(20).optional()), // cm
  // Placenta
  placentaLocalizacion: z.preprocess(emptyToUndefined, z.enum([
    "anterior", "posterior", "fúndica", "lateral_derecha", "lateral_izquierda", "previa_total", "previa_parcial", "marginal"
  ]).optional()),
  placentaGrado: z.preprocess(emptyToUndefined, z.enum(["0", "1", "2", "3"]).optional()),
  placentaGrosor: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(80).optional()), // mm
  // Cordón umbilical
  cordonVasos: z.preprocess(emptyToUndefined, z.enum(["3_vasos", "2_vasos"]).optional()),
  insercionCordon: z.preprocess(emptyToUndefined, z.enum(["central", "paracentral", "marginal", "velamentosa"]).optional()),
  // Cuello uterino
  longitudCervical: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(60).optional()), // mm
  // Anatomía fetal
  anatomiaFetal: z.preprocess(emptyToUndefined, z.enum(["normal", "anormal", "limitada"]).optional()),
  // Sexo fetal
  sexoFetal: z.preprocess(emptyToUndefined, z.enum(["masculino", "femenino", "no_determinado"]).optional()),
  // Número de fetos
  numeroFetos: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(5).optional()),
  // Movimientos fetales
  movimientosFetales: z.preprocess(emptyToUndefined, z.enum(["presentes", "ausentes", "disminuidos"]).optional()),
  // Tono fetal
  tonoFetal: z.preprocess(emptyToUndefined, z.enum(["normal", "disminuido"]).optional()),
  // Respiración fetal
  respiracionFetal: z.preprocess(emptyToUndefined, z.enum(["presente", "ausente"]).optional()),
});

// Gynecological measurements schema
export const gynecologicalMeasurementsSchema = z.object({
  // Útero
  uteroLongitud: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(200).optional()), // mm
  uteroAnteroPosterior: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()), // mm
  uteroTransverso: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(150).optional()), // mm
  uteroPosicion: z.preprocess(emptyToUndefined, z.enum(["anteversión", "retroversión", "intermedia"]).optional()),
  uteroContorno: z.preprocess(emptyToUndefined, z.enum(["regular", "irregular"]).optional()),
  uteroEcogenicidad: z.preprocess(emptyToUndefined, z.enum(["homogénea", "heterogénea"]).optional()),
  // Endometrio
  endometrioGrosor: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(30).optional()), // mm
  endometrioCaracteristicas: z.preprocess(emptyToUndefined, z.enum([
    "proliferativo", "secretor", "atrófico", "engrosado", "irregular"
  ]).optional()),
  endometrioLinea: z.preprocess(emptyToUndefined, z.enum(["central", "desplazada"]).optional()),
  // Ovario derecho
  ovarioDerechoLongitud: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(80).optional()), // mm
  ovarioDerechoAnteroPosterior: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(50).optional()), // mm
  ovarioDerechoTransverso: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(50).optional()), // mm
  ovarioDerechoVolumen: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()), // ml
  ovarioDerechoCaracteristicas: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
  // Ovario izquierdo
  ovarioIzquierdoLongitud: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(80).optional()), // mm
  ovarioIzquierdoAnteroPosterior: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(50).optional()), // mm
  ovarioIzquierdoTransverso: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(50).optional()), // mm
  ovarioIzquierdoVolumen: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(100).optional()), // ml
  ovarioIzquierdoCaracteristicas: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
  // Fondo de saco de Douglas
  douglasLibre: z.preprocess(emptyToUndefined, z.enum(["libre", "con_liquido"]).optional()),
  douglasCantidad: z.preprocess(emptyToUndefined, z.string().max(200).optional()),
  // DIU (si aplica)
  diuPresente: z.preprocess(emptyToUndefined, z.boolean().optional()),
  diuPosicion: z.preprocess(emptyToUndefined, z.enum(["normoinserto", "bajo", "expulsado"]).optional()),
});

// Base ultrasound schema
export const ultrasoundBaseSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  date: z.coerce.date(),
  type: z.enum(ultrasoundTypeValues, { message: "Tipo de ecografía requerido" }),
  reasonForStudy: z.string().trim().min(5, "Motivo del estudio muy corto").max(2000),
  gestationalAge: z.preprocess(emptyToUndefined, z.string().max(50).optional()),
  lastMenstrualPeriod: z.preprocess(
    emptyToNull,
    z.coerce.date().max(new Date(), "FUM no puede ser futura").optional().nullable()
  ),
  estimatedDueDate: z.preprocess(
    emptyToNull,
    z.coerce.date().optional().nullable()
  ),
  weight: z.preprocess(emptyToUndefined, z.coerce.number().min(20).max(300).optional()),
  height: z.preprocess(emptyToUndefined, z.coerce.number().min(100).max(250).optional()),
  bloodPressure: z.preprocess(emptyToUndefined, z.string().max(20).optional()),
  diagnoses: z.string().trim().min(5, "Diagnóstico muy corto").max(2000),
  recommendations: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
  otherFindings: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
});

// Complete schema with measurements (JSON fields)
export const ultrasoundSchema = ultrasoundBaseSchema.extend({
  measurements: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim()) {
        try {
          return JSON.parse(val);
        } catch {
          return {};
        }
      }
      return val || {};
    },
    z.record(z.string(), z.unknown()).optional()
  ),
  findings: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim()) {
        try {
          return JSON.parse(val);
        } catch {
          return {};
        }
      }
      return val || {};
    },
    z.record(z.string(), z.unknown()).optional()
  ),
});

// Schema for ultrasound images
export const ultrasoundImageSchema = z.object({
  ultrasoundId: z.string().min(1, "Ecografía requerida"),
  fileName: z.string().min(1, "Nombre de archivo requerido"),
  fileUrl: z.string().url("URL de archivo inválida"),
  fileSize: z.number().int().min(1, "Tamaño de archivo requerido"),
  mimeType: z.string().min(1, "Tipo MIME requerido"),
  description: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
});

export type PregnancyStatus = typeof pregnancyStatusValues[number];
export type UltrasoundType = typeof ultrasoundTypeValues[number];
export type UltrasoundInput = z.infer<typeof ultrasoundSchema>;
export type UltrasoundImageInput = z.infer<typeof ultrasoundImageSchema>;
export type FirstTrimesterMeasurements = z.infer<typeof firstTrimesterMeasurementsSchema>;
export type SecondThirdTrimesterMeasurements = z.infer<typeof secondThirdTrimesterMeasurementsSchema>;
export type GynecologicalMeasurements = z.infer<typeof gynecologicalMeasurementsSchema>;
