"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  certificateSchema,
  certificateTypeValues,
  certificateTypeLabels,
  certificateTypeDescriptions,
} from "@/lib/validators/certificate";
import { createCertificate, updateCertificate } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CertificateFormValues = z.input<typeof certificateSchema>;

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

// Default templates for each certificate type
const getDefaultContent = (type: string): string => {
  switch (type) {
    case "REST":
      return `Por medio de la presente certifico que el/la paciente ha sido evaluado(a) en mi consulta y requiere reposo médico por el diagnóstico indicado.

Indicaciones:
- Reposo absoluto/relativo
- Control médico en ___ días
- Medicación indicada según récipe`;
    case "MEDICAL_REPORT":
      return `INFORME MÉDICO

Datos Clínicos:
- Motivo de consulta:
- Antecedentes:
- Examen físico:
- Estudios realizados:

Diagnóstico:

Plan de tratamiento:

Pronóstico:`;
    case "MEDICAL_CONSTANCY":
      return `Por medio de la presente hago constar que el/la paciente asistió a consulta médica en el día de la fecha.`;
    case "FITNESS":
      return `Por medio de la presente certifico que el/la paciente ha sido evaluado(a) clínicamente y se encuentra APTO(A) para realizar actividades físicas/laborales según lo solicitado.

Examen físico:
- Tensión arterial:
- Frecuencia cardíaca:
- Peso/Talla:

No presenta contraindicaciones para la actividad solicitada.`;
    case "PREGNANCY":
      return `Por medio de la presente certifico que la paciente se encuentra en estado de EMBARAZO con las siguientes características:

- Edad gestacional:
- Fecha probable de parto:
- Evolución del embarazo:

Observaciones:`;
    default:
      return "";
  }
};

type CertificateFormProps = {
  patientId: string;
  certificateId?: string;
  initialData?: {
    date?: Date | string | null;
    type?: string;
    title?: string;
    content?: string;
    restDays?: number | null;
    validFrom?: Date | string | null;
    validUntil?: Date | string | null;
    diagnosis?: string | null;
    issuedBy?: string;
    licenseNumber?: string;
  };
  doctorName?: string;
  doctorLicense?: string;
};

export function CertificateForm({
  patientId,
  certificateId,
  initialData,
  doctorName = "Dra. Kristhy Moreno",
  doctorLicense = "MPPS-00000",
}: CertificateFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(certificateId);

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema) as any,
    defaultValues: {
      patientId,
      date: formatDateTimeInput(initialData?.date ?? new Date()),
      type: (initialData?.type || "") as any,
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      restDays: initialData?.restDays ?? "",
      validFrom: formatDateInput(initialData?.validFrom),
      validUntil: formatDateInput(initialData?.validUntil),
      diagnosis: initialData?.diagnosis ?? "",
      issuedBy: initialData?.issuedBy ?? doctorName,
      licenseNumber: initialData?.licenseNumber ?? doctorLicense,
    },
  });

  const selectedType = form.watch("type");
  const restDays = form.watch("restDays");
  const validFrom = form.watch("validFrom");

  // Auto-fill content template when type changes
  useEffect(() => {
    if (!isEditing && selectedType && !form.getValues("content")) {
      form.setValue("content", getDefaultContent(selectedType));
      // Auto-set title based on type
      if (!form.getValues("title")) {
        form.setValue("title", `${certificateTypeLabels[selectedType as keyof typeof certificateTypeLabels]} - ${new Date().toLocaleDateString("es-VE")}`);
      }
    }
  }, [selectedType, isEditing, form]);

  // Auto-calculate validUntil for REST certificates
  useEffect(() => {
    if (selectedType === "REST" && restDays && typeof restDays === "number") {
      const startDate = validFrom && typeof validFrom === "string" && validFrom.length > 0
        ? new Date(validFrom)
        : new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + restDays);
      form.setValue("validUntil", formatDateInput(endDate));
    }
  }, [selectedType, restDays, validFrom, form]);

  const onSubmit = async (values: CertificateFormValues) => {
    setSubmitError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    try {
      if (isEditing && certificateId) {
        await updateCertificate(certificateId, formData);
        router.push(`/dashboard/pacientes/${patientId}/certificados/${certificateId}`);
      } else {
        const result = await createCertificate(formData);
        if (result?.certificateId) {
          router.push(`/dashboard/pacientes/${patientId}/certificados/${result.certificateId}`);
        }
      }
    } catch (error) {
      console.error("Certificate save failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setSubmitError(errorMessage);
    }
  };

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Certificate Type */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Tipo de certificado <span className="text-red-500">*</span>
        </Label>
        <select
          id="type"
          {...form.register("type")}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Selecciona un tipo</option>
          {certificateTypeValues.map((type) => (
            <option key={type} value={type}>
              {certificateTypeLabels[type]}
            </option>
          ))}
        </select>
        {selectedType && (
          <p className="text-xs text-slate-500">
            {certificateTypeDescriptions[selectedType as keyof typeof certificateTypeDescriptions]}
          </p>
        )}
        {errors.type && (
          <p className="text-xs text-red-600">{String(errors.type.message)}</p>
        )}
      </div>

      {/* Date and Title */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">
            Fecha <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="datetime-local"
            {...form.register("date")}
          />
          {errors.date && (
            <p className="text-xs text-red-600">{String(errors.date.message)}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Título del certificado"
            {...form.register("title")}
          />
          {errors.title && (
            <p className="text-xs text-red-600">{String(errors.title.message)}</p>
          )}
        </div>
      </div>

      {/* REST specific fields */}
      {selectedType === "REST" && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-4">
          <h3 className="font-medium text-orange-800">Datos del Reposo</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="restDays">
                Días de reposo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="restDays"
                type="number"
                min="1"
                max="365"
                placeholder="3"
                {...form.register("restDays")}
              />
              {errors.restDays && (
                <p className="text-xs text-red-600">{String(errors.restDays.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="validFrom">Desde</Label>
              <Input
                id="validFrom"
                type="date"
                {...form.register("validFrom")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Hasta</Label>
              <Input
                id="validUntil"
                type="date"
                {...form.register("validUntil")}
              />
              <p className="text-xs text-slate-500">Se calcula automáticamente</p>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis */}
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Input
          id="diagnosis"
          placeholder="Diagnóstico o motivo del certificado"
          {...form.register("diagnosis")}
        />
        {errors.diagnosis && (
          <p className="text-xs text-red-600">{String(errors.diagnosis.message)}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Contenido <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          rows={10}
          placeholder="Contenido del certificado..."
          {...form.register("content")}
        />
        {errors.content && (
          <p className="text-xs text-red-600">{String(errors.content.message)}</p>
        )}
      </div>

      {/* Doctor Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="issuedBy">
            Emitido por <span className="text-red-500">*</span>
          </Label>
          <Input
            id="issuedBy"
            placeholder="Nombre del médico"
            {...form.register("issuedBy")}
          />
          {errors.issuedBy && (
            <p className="text-xs text-red-600">{String(errors.issuedBy.message)}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">
            Número de licencia <span className="text-red-500">*</span>
          </Label>
          <Input
            id="licenseNumber"
            placeholder="MPPS-00000"
            {...form.register("licenseNumber")}
          />
          {errors.licenseNumber && (
            <p className="text-xs text-red-600">{String(errors.licenseNumber.message)}</p>
          )}
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
              : "Crear certificado"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/dashboard/pacientes/${patientId}/certificados`)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
