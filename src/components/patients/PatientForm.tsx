"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { patientSchema } from "@/lib/validators/patient";
import { createPatient, updatePatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PatientFormValues = z.input<typeof patientSchema>;

const formatDateInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "";
};

type PatientFormProps = {
  patientId?: string;
  initialData?: {
    firstName?: string;
    lastName?: string;
    cedula?: string;
    dateOfBirth?: string | Date | null;
    gender?: "female" | "male" | "other";
    phone?: string;
    email?: string | null;
    address?: string;
    city?: string;
    state?: string;
    bloodType?: string | null;
    allergies?: string | null;
    emergencyContact?: string | null;
    notes?: string | null;
  };
};

export function PatientForm({ patientId, initialData }: PatientFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<PatientFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(patientSchema) as any,
    defaultValues: {
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      cedula: initialData?.cedula ?? "",
      dateOfBirth: formatDateInput(initialData?.dateOfBirth),
      gender: initialData?.gender ?? "female",
      phone: initialData?.phone ?? "",
      email: initialData?.email ?? "",
      address: initialData?.address ?? "",
      city: initialData?.city ?? "San Cristóbal",
      state: initialData?.state ?? "Táchira",
      bloodType: initialData?.bloodType ?? "",
      allergies: initialData?.allergies ?? "",
      emergencyContact: initialData?.emergencyContact ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  const onSubmit = async (values: PatientFormValues) => {
    setSubmitError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    try {
      if (patientId) {
        const result = await updatePatient(patientId, formData);
        if (result?.success) {
          router.push(`/dashboard/pacientes/${patientId}`);
          router.refresh();
        } else {
          setSubmitError("Error al actualizar paciente. Intenta de nuevo.");
        }
      } else {
        const result = await createPatient(formData);
        if (result?.success && result.patientId) {
          router.push(`/dashboard/pacientes/${result.patientId}`);
          router.refresh();
        } else {
          setSubmitError("Error al crear paciente. Verifica los datos e intenta de nuevo.");
        }
      }
    } catch (error) {
      console.error("Patient save failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setSubmitError(`No se pudo guardar el paciente: ${errorMessage}`);
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" {...form.register("firstName")} />
          {errors.firstName ? (
            <p className="text-xs text-red-600">{errors.firstName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" {...form.register("lastName")} />
          {errors.lastName ? (
            <p className="text-xs text-red-600">{errors.lastName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input id="cedula" {...form.register("cedula")} placeholder="V-12345678" />
          {errors.cedula ? (
            <p className="text-xs text-red-600">{errors.cedula.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
          <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} />
          {errors.dateOfBirth ? (
            <p className="text-xs text-red-600">{errors.dateOfBirth.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Género</Label>
          <select
            id="gender"
            {...form.register("gender")}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro</option>
          </select>
          {errors.gender ? (
            <p className="text-xs text-red-600">{errors.gender.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...form.register("phone")} placeholder="+584121234567" />
          {errors.phone ? (
            <p className="text-xs text-red-600">{errors.phone.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {errors.email ? (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" {...form.register("address")} />
          {errors.address ? (
            <p className="text-xs text-red-600">{errors.address.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" {...form.register("city")} />
          {errors.city ? (
            <p className="text-xs text-red-600">{errors.city.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" {...form.register("state")} />
          {errors.state ? (
            <p className="text-xs text-red-600">{errors.state.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bloodType">Tipo de sangre</Label>
          <select
            id="bloodType"
            {...form.register("bloodType")}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Selecciona</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.bloodType ? (
            <p className="text-xs text-red-600">{errors.bloodType.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Textarea id="allergies" rows={3} {...form.register("allergies")} />
          {errors.allergies ? (
            <p className="text-xs text-red-600">{errors.allergies.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
          <Textarea id="emergencyContact" rows={3} {...form.register("emergencyContact")} />
          {errors.emergencyContact ? (
            <p className="text-xs text-red-600">{errors.emergencyContact.message}</p>
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
        {isSubmitting ? "Guardando..." : "Guardar paciente"}
      </Button>
    </form>
  );
}
