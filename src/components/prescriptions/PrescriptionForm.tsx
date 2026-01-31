"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { prescriptionSchema } from "@/lib/validators/prescription";
import {
  createPrescription,
  updatePrescription,
} from "@/server/actions/prescription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PrescriptionFormValues = z.input<typeof prescriptionSchema>;

const formatDateTimeInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

type PrescriptionFormProps = {
  patientId: string;
  prescriptionId?: string;
  initialData?: Partial<PrescriptionFormValues> & {
    date?: Date | string | null;
  };
};

export function PrescriptionForm({
  patientId,
  prescriptionId,
  initialData,
}: PrescriptionFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(prescriptionId);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId,
      date: formatDateTimeInput(initialData?.date ?? new Date()),
      medications: initialData?.medications ?? "",
      instructions: initialData?.instructions ?? "",
      diagnosis: initialData?.diagnosis ?? "",
    },
  });

  const onSubmit = async (values: PrescriptionFormValues) => {
    setSubmitError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    try {
      if (isEditing && prescriptionId) {
        await updatePrescription(prescriptionId, formData);
        router.push(
          `/dashboard/pacientes/${patientId}/prescripciones/${prescriptionId}`
        );
      } else {
        const result = await createPrescription(formData);
        if (result?.prescriptionId) {
          router.push(
            `/dashboard/pacientes/${patientId}/prescripciones/${result.prescriptionId}`
          );
        }
      }
    } catch (error) {
      console.error("Prescription save failed:", error);
      setSubmitError(
        isEditing
          ? "No se pudo actualizar la prescripción."
          : "No se pudo guardar la prescripción."
      );
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Fecha</Label>
        <Input id="date" type="datetime-local" {...form.register("date")} />
        {errors.date ? (
          <p className="text-xs text-red-600">{errors.date.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Input
          id="diagnosis"
          placeholder="Diagnóstico del paciente"
          {...form.register("diagnosis")}
        />
        {errors.diagnosis ? (
          <p className="text-xs text-red-600">{errors.diagnosis.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">
          Medicamentos <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="medications"
          rows={6}
          placeholder="Ej:&#10;1. Paracetamol 500mg - 1 tableta cada 8 horas por 5 días&#10;2. Omeprazol 20mg - 1 cápsula en ayunas por 10 días"
          {...form.register("medications")}
        />
        {errors.medications ? (
          <p className="text-xs text-red-600">{errors.medications.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instrucciones adicionales</Label>
        <Textarea
          id="instructions"
          rows={4}
          placeholder="Indicaciones especiales, dieta, reposo, etc."
          {...form.register("instructions")}
        />
        {errors.instructions ? (
          <p className="text-xs text-red-600">{errors.instructions.message}</p>
        ) : null}
      </div>

      {submitError ? (
        <p className="text-sm text-red-600">{submitError}</p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear prescripción"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/pacientes/${patientId}/prescripciones`)
          }
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
