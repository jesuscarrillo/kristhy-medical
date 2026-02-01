"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  patientWithGynProfileSchema,
  pregnancyStatusValues,
  pregnancyStatusLabels,
  maritalStatusValues,
  maritalStatusLabels,
  educationLevelValues,
  educationLevelLabels,
} from "@/lib/validators/patient";
import { createPatient, updatePatient } from "@/server/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GynecologicalProfileFields } from "./GynecologicalProfileFields";

type PatientFormValues = z.input<typeof patientWithGynProfileSchema>;

const formatDateInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] ?? "";
};

type PatientFormProps = {
  patientId?: string;
  initialData?: {
    medicalRecordNumber?: string;
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
    weight?: number | null;
    height?: number | null;
    allergies?: string | null;
    emergencyContact?: string | null;
    notes?: string | null;
    // New v2 fields
    pregnancyStatus?: string;
    maritalStatus?: string | null;
    occupation?: string | null;
    nationality?: string | null;
    educationLevel?: string | null;
    religion?: string | null;
    gynecologicalProfile?: any; // TODO: type this properly
  };
};

export function PatientForm({ patientId, initialData }: PatientFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showGynProfile, setShowGynProfile] = useState(false);
  const form = useForm<PatientFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(patientWithGynProfileSchema) as any,
    defaultValues: {
      medicalRecordNumber: initialData?.medicalRecordNumber ?? "",
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
      weight: initialData?.weight ?? "",
      height: initialData?.height ?? "",
      allergies: initialData?.allergies ?? "",
      emergencyContact: initialData?.emergencyContact ?? "",
      notes: initialData?.notes ?? "",
      // New v2 fields
      pregnancyStatus: initialData?.pregnancyStatus ?? "NOT_PREGNANT",
      maritalStatus: initialData?.maritalStatus ?? "",
      occupation: initialData?.occupation ?? "",
      nationality: initialData?.nationality ?? "Venezolana",
      educationLevel: initialData?.educationLevel ?? "",
      religion: initialData?.religion ?? "",
      // Gynecological Profile fields
      gestas: initialData?.gynecologicalProfile?.gestas ?? "",
      partos: initialData?.gynecologicalProfile?.partos ?? "",
      cesareas: initialData?.gynecologicalProfile?.cesareas ?? "",
      abortos: initialData?.gynecologicalProfile?.abortos ?? "",
      ectopicos: initialData?.gynecologicalProfile?.ectopicos ?? "",
      molas: initialData?.gynecologicalProfile?.molas ?? "",
      parity: initialData?.gynecologicalProfile?.parity ?? "",
      menstrualCycleDays: initialData?.gynecologicalProfile?.menstrualCycleDays ?? "",
      menstrualDuration: initialData?.gynecologicalProfile?.menstrualDuration ?? "",
      menstrualPain: initialData?.gynecologicalProfile?.menstrualPain ?? "",
      lastMenstrualPeriod: formatDateInput(initialData?.gynecologicalProfile?.lastMenstrualPeriod),
      menopause: initialData?.gynecologicalProfile?.menopause ?? false,
      menopauseAge: initialData?.gynecologicalProfile?.menopauseAge ?? "",
      contraceptiveMethod: initialData?.gynecologicalProfile?.contraceptiveMethod ?? "",
      sexuallyActive: initialData?.gynecologicalProfile?.sexuallyActive ?? "",
      gynProfileNotes: initialData?.gynecologicalProfile?.notes ?? "",
      // New v2 gynecological profile fields
      menarche: initialData?.gynecologicalProfile?.menarche ?? "",
      sexarche: initialData?.gynecologicalProfile?.sexarche ?? "",
      numberOfPartners: initialData?.gynecologicalProfile?.numberOfPartners ?? "",
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="medicalRecordNumber">Número de Historia Médica</Label>
          <Input
            id="medicalRecordNumber"
            {...form.register("medicalRecordNumber")}
            placeholder="HM-000001"
          />
          {errors.medicalRecordNumber ? (
            <p className="text-xs text-red-600">{errors.medicalRecordNumber.message}</p>
          ) : null}
        </div>
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
          {errors.weight ? (
            <p className="text-xs text-red-600">{errors.weight.message}</p>
          ) : null}
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
          {errors.height ? (
            <p className="text-xs text-red-600">{errors.height.message}</p>
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

      {/* Sociodemographic Data Section */}
      <div className="space-y-4 rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold">Datos Sociodemográficos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Estado civil</Label>
            <select
              id="maritalStatus"
              {...form.register("maritalStatus")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              {maritalStatusValues.map((status) => (
                <option key={status} value={status}>
                  {maritalStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation">Ocupación</Label>
            <Input
              id="occupation"
              {...form.register("occupation")}
              placeholder="Ej: Docente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nacionalidad</Label>
            <Input
              id="nationality"
              {...form.register("nationality")}
              placeholder="Venezolana"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="educationLevel">Nivel educativo</Label>
            <select
              id="educationLevel"
              {...form.register("educationLevel")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              {educationLevelValues.map((level) => (
                <option key={level} value={level}>
                  {educationLevelLabels[level]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="religion">Religión</Label>
            <Input
              id="religion"
              {...form.register("religion")}
              placeholder="Ej: Católica"
            />
          </div>
        </div>
      </div>

      {/* Pregnancy Status (only for female patients) */}
      {form.watch("gender") === "female" && (
        <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-6">
          <h2 className="text-lg font-semibold text-purple-800">Estado de Embarazo</h2>
          <div className="space-y-2">
            <Label htmlFor="pregnancyStatus">Estado actual</Label>
            <select
              id="pregnancyStatus"
              {...form.register("pregnancyStatus")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {pregnancyStatusValues.map((status) => (
                <option key={status} value={status}>
                  {pregnancyStatusLabels[status]}
                </option>
              ))}
            </select>
            <p className="text-xs text-purple-600">
              Este estado determina qué tipos de ecografías están disponibles para la paciente.
            </p>
          </div>
        </div>
      )}

      {/* Gynecological Profile Section (only for female patients) */}
      {(form.watch("gender") === "female" || !form.watch("gender")) && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-6">
          <button
            type="button"
            onClick={() => setShowGynProfile(!showGynProfile)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="text-lg font-semibold">
              Antecedentes Gineco-Obstétricos
              <span className="ml-2 text-sm font-normal text-slate-500">(Opcional)</span>
            </h2>
            <span className="text-slate-400">
              {showGynProfile ? "▼" : "▶"}
            </span>
          </button>
          {showGynProfile && (
            <GynecologicalProfileFields register={form.register} errors={errors} />
          )}
        </div>
      )}

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar paciente"}
      </Button>
    </form>
  );
}
