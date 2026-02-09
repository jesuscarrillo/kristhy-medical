"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { ultrasoundSchema, validUltrasoundTypes } from "@/lib/validators/ultrasound";
import { logAudit } from "./audit";
import type { PregnancyStatus, UltrasoundType } from "@prisma/client";
import { z } from "zod";
import { rateLimitAction, RATE_LIMITS } from "@/lib/rate-limit";

// Validate that ultrasound type is compatible with pregnancy status
function validateTypeVsPregnancyStatus(
  type: UltrasoundType,
  pregnancyStatus: PregnancyStatus
): boolean {
  const validTypes = validUltrasoundTypes[pregnancyStatus];
  return validTypes.includes(type as typeof validTypes[number]);
}

export async function createUltrasound(formData: FormData) {
  try {
    await rateLimitAction("createUltrasound", RATE_LIMITS.mutation);
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = ultrasoundSchema.parse(rawData);

    // Get patient to verify pregnancy status
    const patient = await prisma.patient.findUnique({
      where: { id: validatedData.patientId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        pregnancyStatus: true,
        gender: true,
      },
    });

    if (!patient) {
      throw new Error("Paciente no encontrado");
    }

    // Only female patients can have ultrasounds
    if (patient.gender !== "female") {
      throw new Error("Las ecografías solo están disponibles para pacientes femeninos");
    }

    // Validate type vs pregnancy status
    if (!validateTypeVsPregnancyStatus(validatedData.type as UltrasoundType, patient.pregnancyStatus)) {
      throw new Error(
        `El tipo de ecografía "${validatedData.type}" no es compatible con el estado de embarazo "${patient.pregnancyStatus}"`
      );
    }

    const ultrasound = await prisma.ultrasoundReport.create({
      data: {
        patientId: validatedData.patientId,
        date: validatedData.date,
        type: validatedData.type as UltrasoundType,
        gestationalAge: validatedData.gestationalAge,
        reasonForStudy: validatedData.reasonForStudy,
        lastMenstrualPeriod: validatedData.lastMenstrualPeriod,
        estimatedDueDate: validatedData.estimatedDueDate,
        weight: validatedData.weight,
        height: validatedData.height,
        bloodPressure: validatedData.bloodPressure,
        measurements: validatedData.measurements as object | undefined,
        findings: validatedData.findings as object | undefined,
        otherFindings: validatedData.otherFindings,
        diagnoses: validatedData.diagnoses,
        recommendations: validatedData.recommendations,
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "ultrasound",
      entityId: ultrasound.id,
      details: `Ecografía ${validatedData.type} - Paciente: ${patient.firstName} ${patient.lastName}`,
    });

    revalidatePath(`/dashboard/pacientes/${validatedData.patientId}/ecografias`);
    revalidatePath(`/dashboard/pacientes/${validatedData.patientId}`);

    return { success: true, ultrasoundId: ultrasound.id };
  } catch (error) {
    console.error("[createUltrasound] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos de la ecografia invalidos");
    }
    throw new Error(
      error instanceof Error ? error.message : "Error al crear la ecografia"
    );
  }
}

const _fetchUltrasounds = cache(async (patientId: string) => {
  return prisma.ultrasoundReport.findMany({
    where: { patientId, isActive: true },
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      type: true,
      gestationalAge: true,
      diagnoses: true,
      createdAt: true,
      _count: {
        select: { images: true },
      },
    },
  });
});

export async function getUltrasounds(patientId: string) {
  await requireDoctor();
  return _fetchUltrasounds(patientId);
}

export async function getUltrasound(id: string) {
  const session = await requireDoctor();

  const ultrasound = await prisma.ultrasoundReport.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cedula: true,
          dateOfBirth: true,
          phone: true,
          pregnancyStatus: true,
          weight: true,
          height: true,
        },
      },
      images: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!ultrasound) {
    throw new Error("Ecografía no encontrada");
  }

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "ultrasound",
    entityId: id,
    details: `Ecografía ${ultrasound.type} - Paciente: ${ultrasound.patient.firstName} ${ultrasound.patient.lastName}`,
  });

  return ultrasound;
}

export async function updateUltrasound(id: string, formData: FormData) {
  try {
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = ultrasoundSchema.partial().parse(rawData);

    // Get existing ultrasound to verify patient
    const existing = await prisma.ultrasoundReport.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            pregnancyStatus: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error("Ecografía no encontrada");
    }

    // If type is being changed, validate against pregnancy status
    if (validatedData.type) {
      if (!validateTypeVsPregnancyStatus(
        validatedData.type as UltrasoundType,
        existing.patient.pregnancyStatus
      )) {
        throw new Error(
          `El tipo de ecografía "${validatedData.type}" no es compatible con el estado de embarazo`
        );
      }
    }

    const ultrasound = await prisma.ultrasoundReport.update({
      where: { id },
      data: {
        date: validatedData.date,
        type: validatedData.type as UltrasoundType | undefined,
        gestationalAge: validatedData.gestationalAge,
        reasonForStudy: validatedData.reasonForStudy,
        lastMenstrualPeriod: validatedData.lastMenstrualPeriod,
        estimatedDueDate: validatedData.estimatedDueDate,
        weight: validatedData.weight,
        height: validatedData.height,
        bloodPressure: validatedData.bloodPressure,
        measurements: validatedData.measurements as object | undefined,
        findings: validatedData.findings as object | undefined,
        otherFindings: validatedData.otherFindings,
        diagnoses: validatedData.diagnoses,
        recommendations: validatedData.recommendations,
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "update",
      entity: "ultrasound",
      entityId: id,
      details: `Paciente: ${existing.patient.firstName} ${existing.patient.lastName}`,
    });

    revalidatePath(`/dashboard/pacientes/${ultrasound.patientId}/ecografias`);
    revalidatePath(`/dashboard/pacientes/${ultrasound.patientId}/ecografias/${id}`);

    return { success: true };
  } catch (error) {
    console.error("[updateUltrasound] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos de la ecografia invalidos");
    }
    throw new Error(
      error instanceof Error ? error.message : "Error al actualizar la ecografia"
    );
  }
}

export async function deleteUltrasound(id: string) {
  try {
    const session = await requireDoctor();

    const ultrasound = await prisma.ultrasoundReport.update({
      where: { id },
      data: { isActive: false },
      include: {
        patient: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "delete",
      entity: "ultrasound",
      entityId: id,
      details: `Paciente: ${ultrasound.patient.firstName} ${ultrasound.patient.lastName}`,
    });

    revalidatePath(`/dashboard/pacientes/${ultrasound.patientId}/ecografias`);

    return { success: true };
  } catch (error) {
    console.error("[deleteUltrasound] Error:", error);
    throw new Error("Error al eliminar la ecografia");
  }
}

export async function uploadUltrasoundImage(formData: FormData) {
  try {
    await rateLimitAction("uploadUltrasoundImage", RATE_LIMITS.upload);
    const session = await requireDoctor();

    const file = formData.get("file");
    const ultrasoundId = formData.get("ultrasoundId");
    const description = formData.get("description");

    if (!(file instanceof File)) {
      throw new Error("Archivo requerido");
    }
    if (typeof ultrasoundId !== "string" || ultrasoundId.length === 0) {
      throw new Error("ID de ecografía requerido");
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El archivo excede el tamano maximo de 50MB");
    }

    // Validate MIME type
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Tipo de archivo no permitido. Use: JPG, PNG, WebP, GIF o PDF");
    }

    // Verify ultrasound exists
    const ultrasound = await prisma.ultrasoundReport.findUnique({
      where: { id: ultrasoundId },
      select: {
        id: true,
        patientId: true,
        patient: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!ultrasound) {
      throw new Error("Ecografía no encontrada");
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() || "jpg";
    const storageName = `ultrasounds/${ultrasound.patientId}/${ultrasoundId}/${nanoid()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("medical-images")
      .upload(storageName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Error al subir la imagen");
    }

    // Create signed URL (30 days)
    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from("medical-images")
      .createSignedUrl(storageName, 60 * 60 * 24 * 30);

    if (urlError || !urlData?.signedUrl) {
      throw new Error("Error al crear URL de imagen");
    }

    // Save to database
    const image = await prisma.ultrasoundImage.create({
      data: {
        ultrasoundId,
        fileName: file.name,
        fileUrl: urlData.signedUrl,
        fileSize: file.size,
        mimeType: file.type,
        description: typeof description === "string" ? description : undefined,
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "ultrasound_image",
      entityId: image.id,
      details: `Ecografía: ${ultrasoundId} - Archivo: ${file.name}`,
    });

    revalidatePath(`/dashboard/pacientes/${ultrasound.patientId}/ecografias/${ultrasoundId}`);

    return { success: true, imageId: image.id };
  } catch (error) {
    console.error("[uploadUltrasoundImage] Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al subir la imagen"
    );
  }
}

export async function deleteUltrasoundImage(id: string) {
  try {
    const session = await requireDoctor();

    const image = await prisma.ultrasoundImage.findUnique({
      where: { id },
      include: {
        ultrasound: {
          select: { patientId: true, id: true },
        },
      },
    });

    if (!image) {
      throw new Error("Imagen no encontrada");
    }

    // Delete from database (storage cleanup can be done separately)
    await prisma.ultrasoundImage.delete({
      where: { id },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "delete",
      entity: "ultrasound_image",
      entityId: id,
      details: `Archivo: ${image.fileName}`,
    });

    revalidatePath(
      `/dashboard/pacientes/${image.ultrasound.patientId}/ecografias/${image.ultrasoundId}`
    );

    return { success: true };
  } catch (error) {
    console.error("[deleteUltrasoundImage] Error:", error);
    throw new Error("Error al eliminar la imagen");
  }
}
