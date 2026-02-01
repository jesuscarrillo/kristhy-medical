"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ultrasoundSchema, ultrasoundTypeLabels, validUltrasoundTypes } from "@/lib/validators/ultrasound";
import { createUltrasound, updateUltrasound } from "@/server/actions/ultrasound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UltrasoundTypeSelector } from "./UltrasoundTypeSelector";
import { FirstTrimesterFields } from "./FirstTrimesterFields";
import { SecondThirdTrimesterFields } from "./SecondThirdTrimesterFields";
import { GynecologicalFields } from "./GynecologicalFields";
import type { PregnancyStatus, UltrasoundType } from "@prisma/client";

type UltrasoundFormValues = z.input<typeof ultrasoundSchema>;

const formatDateTimeInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "";
};

type UltrasoundFormProps = {
  patientId: string;
  pregnancyStatus: PregnancyStatus;
  ultrasoundId?: string;
  initialData?: {
    date?: Date | string | null;
    type?: UltrasoundType;
    gestationalAge?: string | null;
    reasonForStudy?: string;
    lastMenstrualPeriod?: Date | string | null;
    estimatedDueDate?: Date | string | null;
    weight?: number | null;
    height?: number | null;
    bloodPressure?: string | null;
    measurements?: Record<string, unknown> | null;
    findings?: Record<string, unknown> | null;
    otherFindings?: string | null;
    diagnoses?: string;
    recommendations?: string | null;
  };
};

export function UltrasoundForm({
  patientId,
  pregnancyStatus,
  ultrasoundId,
  initialData,
}: UltrasoundFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(ultrasoundId);

  // Determine default type based on pregnancy status
  const validTypes = validUltrasoundTypes[pregnancyStatus];
  const defaultType = initialData?.type || (validTypes.length === 1 ? validTypes[0] : undefined);

  const form = useForm<UltrasoundFormValues>({
    resolver: zodResolver(ultrasoundSchema) as any,
    defaultValues: {
      patientId,
      date: formatDateTimeInput(initialData?.date ?? new Date()),
      type: (defaultType || "") as any,
      gestationalAge: initialData?.gestationalAge ?? "",
      reasonForStudy: initialData?.reasonForStudy ?? "",
      lastMenstrualPeriod: formatDateInput(initialData?.lastMenstrualPeriod),
      estimatedDueDate: formatDateInput(initialData?.estimatedDueDate),
      weight: initialData?.weight ?? "",
      height: initialData?.height ?? "",
      bloodPressure: initialData?.bloodPressure ?? "",
      measurements: initialData?.measurements ?? {},
      findings: initialData?.findings ?? {},
      otherFindings: initialData?.otherFindings ?? "",
      diagnoses: initialData?.diagnoses ?? "",
      recommendations: initialData?.recommendations ?? "",
    },
  });

  const selectedType = form.watch("type") as UltrasoundType;

  // Calculate estimated due date from LMP
  const lmp = form.watch("lastMenstrualPeriod");
  useEffect(() => {
    if (lmp && typeof lmp === "string" && lmp.length > 0 && (selectedType === "FIRST_TRIMESTER" || selectedType === "SECOND_THIRD_TRIMESTER")) {
      const lmpDate = new Date(lmp);
      if (!Number.isNaN(lmpDate.getTime())) {
        // Add 280 days (40 weeks) to LMP
        const eddDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
        form.setValue("estimatedDueDate", formatDateInput(eddDate));
      }
    }
  }, [lmp, selectedType, form]);

  const onSubmit = async (values: UltrasoundFormValues) => {
    setSubmitError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "measurements" || key === "findings") {
        formData.append(key, JSON.stringify(value || {}));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    try {
      if (isEditing && ultrasoundId) {
        await updateUltrasound(ultrasoundId, formData);
        router.push(`/dashboard/pacientes/${patientId}/ecografias/${ultrasoundId}`);
      } else {
        const result = await createUltrasound(formData);
        if (result?.ultrasoundId) {
          router.push(`/dashboard/pacientes/${patientId}/ecografias/${result.ultrasoundId}`);
        }
      }
    } catch (error) {
      console.error("Ultrasound save failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setSubmitError(errorMessage);
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Información General</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha y hora <span className="text-red-500">*</span></Label>
            <Input
              id="date"
              type="datetime-local"
              {...form.register("date")}
            />
            {errors.date && (
              <p className="text-xs text-red-600">{String(errors.date.message)}</p>
            )}
          </div>

          <UltrasoundTypeSelector
            value={selectedType || ""}
            onChange={(value) => form.setValue("type", value as UltrasoundType)}
            pregnancyStatus={pregnancyStatus}
            error={errors.type?.message as string}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reasonForStudy">Motivo del estudio <span className="text-red-500">*</span></Label>
          <Textarea
            id="reasonForStudy"
            rows={3}
            placeholder="Indicación clínica para la ecografía"
            {...form.register("reasonForStudy")}
          />
          {errors.reasonForStudy && (
            <p className="text-xs text-red-600">{String(errors.reasonForStudy.message)}</p>
          )}
        </div>
      </div>

      {/* Obstetric data (for pregnancy-related ultrasounds) */}
      {selectedType && selectedType !== "GYNECOLOGICAL" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Datos Obstétricos</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lastMenstrualPeriod">Fecha Última Menstruación (FUM)</Label>
              <Input
                id="lastMenstrualPeriod"
                type="date"
                {...form.register("lastMenstrualPeriod")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDueDate">Fecha Probable de Parto (FPP)</Label>
              <Input
                id="estimatedDueDate"
                type="date"
                {...form.register("estimatedDueDate")}
              />
              <p className="text-xs text-slate-500">Se calcula automáticamente desde FUM</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gestationalAge">Edad Gestacional</Label>
              <Input
                id="gestationalAge"
                placeholder="Ej: 12 semanas 3 días"
                {...form.register("gestationalAge")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Vital Signs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Signos Vitales (al momento del eco)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="20"
              max="300"
              placeholder="65.5"
              {...form.register("weight")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Talla (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              min="100"
              max="250"
              placeholder="165"
              {...form.register("height")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodPressure">Presión Arterial</Label>
            <Input
              id="bloodPressure"
              placeholder="120/80"
              {...form.register("bloodPressure")}
            />
          </div>
        </div>
      </div>

      {/* Type-specific measurements */}
      {selectedType && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Mediciones - {ultrasoundTypeLabels[selectedType]}
          </h2>

          {selectedType === "FIRST_TRIMESTER" && (
            <FirstTrimesterFields register={form.register} errors={errors} />
          )}

          {selectedType === "SECOND_THIRD_TRIMESTER" && (
            <SecondThirdTrimesterFields register={form.register} errors={errors} />
          )}

          {selectedType === "GYNECOLOGICAL" && (
            <GynecologicalFields register={form.register} errors={errors} />
          )}
        </div>
      )}

      {/* Findings and Diagnosis */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Hallazgos y Conclusiones</h2>

        <div className="space-y-2">
          <Label htmlFor="otherFindings">Otros hallazgos</Label>
          <Textarea
            id="otherFindings"
            rows={3}
            placeholder="Hallazgos adicionales no incluidos en las mediciones..."
            {...form.register("otherFindings")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnoses">Diagnóstico/Conclusiones <span className="text-red-500">*</span></Label>
          <Textarea
            id="diagnoses"
            rows={4}
            placeholder="Diagnóstico ecográfico y conclusiones..."
            {...form.register("diagnoses")}
          />
          {errors.diagnoses && (
            <p className="text-xs text-red-600">{String(errors.diagnoses.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendations">Recomendaciones</Label>
          <Textarea
            id="recommendations"
            rows={3}
            placeholder="Recomendaciones para seguimiento..."
            {...form.register("recommendations")}
          />
        </div>
      </div>

      {/* Submit */}
      {submitError && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{submitError}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear ecografía"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/dashboard/pacientes/${patientId}/ecografias`)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
