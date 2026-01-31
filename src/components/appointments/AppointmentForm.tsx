"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { appointmentSchema } from "@/lib/validators/appointment";
import { createAppointment, updateAppointment } from "@/server/actions/appointment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AppointmentFormValues = {
  patientId: string;
  date: string | Date;
  duration: number;
  type: "prenatal" | "gynecology" | "ultrasound" | "followup";
  status: "scheduled" | "completed" | "cancelled" | "noshow";
  reason?: string;
  notes?: string;
};

const formatDateTimeInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

type PatientOption = {
  id: string;
  firstName: string;
  lastName: string;
  cedula: string;
};

type AppointmentFormProps = {
  appointmentId?: string;
  initialData?: Partial<AppointmentFormValues>;
  patients: PatientOption[];
};

export function AppointmentForm({
  appointmentId,
  initialData,
  patients,
}: AppointmentFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<AppointmentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      patientId: initialData?.patientId ?? "",
      date: formatDateTimeInput(initialData?.date),
      duration: initialData?.duration ?? 30,
      type: initialData?.type ?? "prenatal",
      status: initialData?.status ?? "scheduled",
      reason: initialData?.reason ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  const onSubmit = async (values: AppointmentFormValues) => {
    setSubmitError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    try {
      if (appointmentId) {
        await updateAppointment(appointmentId, formData);
      } else {
        const result = await createAppointment(formData);
        if (result?.appointmentId) {
          router.push(`/dashboard/citas/${result.appointmentId}`);
          return;
        }
      }
      router.refresh();
    } catch (error) {
      console.error("Appointment save failed:", error);
      setSubmitError("No se pudo guardar la cita. Intenta de nuevo.");
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="patientId">Paciente</Label>
          <select
            id="patientId"
            {...form.register("patientId")}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Selecciona un paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} • {patient.cedula}
              </option>
            ))}
          </select>
          {errors.patientId ? (
            <p className="text-xs text-red-600">{errors.patientId.message}</p>
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
          <Label htmlFor="duration">Duración (min)</Label>
          <Input id="duration" type="number" {...form.register("duration")} />
          {errors.duration ? (
            <p className="text-xs text-red-600">{errors.duration.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de consulta</Label>
          <select
            id="type"
            {...form.register("type")}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="prenatal">Prenatal</option>
            <option value="gynecology">Ginecología</option>
            <option value="ultrasound">Ecografía</option>
            <option value="followup">Control</option>
          </select>
          {errors.type ? (
            <p className="text-xs text-red-600">{errors.type.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <select
            id="status"
            {...form.register("status")}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="scheduled">Programada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
            <option value="noshow">No asistió</option>
          </select>
          {errors.status ? (
            <p className="text-xs text-red-600">{errors.status.message}</p>
          ) : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="reason">Motivo</Label>
          <Input id="reason" {...form.register("reason")} />
          {errors.reason ? (
            <p className="text-xs text-red-600">{errors.reason.message}</p>
          ) : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" rows={4} {...form.register("notes")} />
          {errors.notes ? (
            <p className="text-xs text-red-600">{errors.notes.message}</p>
          ) : null}
        </div>
      </div>

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar cita"}
      </Button>
    </form>
  );
}
