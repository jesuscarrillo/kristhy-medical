"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { medicalRecordSchema } from "@/lib/validators/medicalRecord";
import {
  createMedicalRecord,
  updateMedicalRecord,
} from "@/server/actions/medicalRecord";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MedicalRecordFormValues = z.input<typeof medicalRecordSchema>;

const formatDateTimeInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

type MedicalRecordFormProps = {
  patientId: string;
  recordId?: string;
  initialData?: Partial<MedicalRecordFormValues> & {
    date?: Date | string | null;
    followUpDate?: Date | string | null;
  };
  onSuccess?: () => void;
};

export function MedicalRecordForm({
  patientId,
  recordId,
  initialData,
  onSuccess,
}: MedicalRecordFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(recordId);

  const form = useForm<MedicalRecordFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(medicalRecordSchema) as any,
    defaultValues: {
      patientId,
      consultationType: initialData?.consultationType ?? "prenatal",
      date: formatDateTimeInput(initialData?.date ?? new Date()),
      chiefComplaint: initialData?.chiefComplaint ?? "",
      symptoms: initialData?.symptoms ?? "",
      diagnosis: initialData?.diagnosis ?? "",
      treatment: initialData?.treatment ?? "",
      vitalSigns: initialData?.vitalSigns ?? "",
      personalHistory: initialData?.personalHistory ?? "",
      gynecologicHistory: initialData?.gynecologicHistory ?? "",
      obstetricalHistory: initialData?.obstetricalHistory ?? "",
      physicalExam: initialData?.physicalExam ?? "",
      treatmentPlan: initialData?.treatmentPlan ?? "",
      followUpDate: formatDateTimeInput(initialData?.followUpDate) || undefined,
      notes: initialData?.notes ?? "",
    },
  });

  const onSubmit = async (values: MedicalRecordFormValues) => {
    setSubmitError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    try {
      if (isEditing && recordId) {
        await updateMedicalRecord(recordId, formData);
        router.push(`/dashboard/pacientes/${patientId}/historial/${recordId}`);
      } else {
        await createMedicalRecord(formData);
        form.reset({
          patientId,
          consultationType: "prenatal",
          date: formatDateTimeInput(new Date()),
          chiefComplaint: "",
          symptoms: "",
          diagnosis: "",
          treatment: "",
          vitalSigns: "",
          personalHistory: "",
          gynecologicHistory: "",
          obstetricalHistory: "",
          physicalExam: "",
          treatmentPlan: "",
          followUpDate: undefined,
          notes: "",
        });
        router.refresh();
      }
      onSuccess?.();
    } catch (error) {
      console.error("Medical record save failed:", error);
      setSubmitError(
        isEditing
          ? "No se pudo actualizar el historial."
          : "No se pudo guardar el historial."
      );
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="consultationType">Tipo de consulta</Label>
        <select
          id="consultationType"
          {...form.register("consultationType")}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="prenatal">Prenatal</option>
          <option value="gynecology">Ginecología</option>
          <option value="emergency">Emergencia</option>
          <option value="followup">Control</option>
        </select>
        {errors.consultationType ? (
          <p className="text-xs text-red-600">
            {errors.consultationType.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Fecha y hora</Label>
        <Input id="date" type="datetime-local" {...form.register("date")} />
        {errors.date ? (
          <p className="text-xs text-red-600">{errors.date.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="chiefComplaint">Motivo de consulta</Label>
        <Textarea
          id="chiefComplaint"
          rows={3}
          {...form.register("chiefComplaint")}
        />
        {errors.chiefComplaint ? (
          <p className="text-xs text-red-600">
            {errors.chiefComplaint.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Síntomas</Label>
        <Textarea id="symptoms" rows={3} {...form.register("symptoms")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vitalSigns">Signos vitales</Label>
        <Textarea id="vitalSigns" rows={2} {...form.register("vitalSigns")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="physicalExam">Examen físico</Label>
        <Textarea
          id="physicalExam"
          rows={3}
          {...form.register("physicalExam")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Textarea id="diagnosis" rows={3} {...form.register("diagnosis")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Tratamiento</Label>
        <Textarea id="treatment" rows={3} {...form.register("treatment")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatmentPlan">Plan de tratamiento</Label>
        <Textarea
          id="treatmentPlan"
          rows={3}
          {...form.register("treatmentPlan")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalHistory">Antecedentes personales</Label>
        <Textarea
          id="personalHistory"
          rows={3}
          {...form.register("personalHistory")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gynecologicHistory">Antecedentes ginecológicos</Label>
        <Textarea
          id="gynecologicHistory"
          rows={3}
          {...form.register("gynecologicHistory")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="obstetricalHistory">Antecedentes obstétricos</Label>
        <Textarea
          id="obstetricalHistory"
          rows={3}
          {...form.register("obstetricalHistory")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="followUpDate">Fecha de seguimiento</Label>
        <Input
          id="followUpDate"
          type="datetime-local"
          {...form.register("followUpDate")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" rows={3} {...form.register("notes")} />
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
              : "Agregar historial"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/pacientes/${patientId}/historial`)
            }
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
