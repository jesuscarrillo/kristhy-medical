"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { logAudit } from "./audit";
import { medicalImageSchema } from "@/lib/validators/medicalImage";
import type { DocumentType } from "@prisma/client";
import { rateLimitAction, RATE_LIMITS } from "@/lib/rate-limit";

export async function uploadMedicalImage(formData: FormData) {
  try {
    await rateLimitAction("uploadMedicalImage", RATE_LIMITS.upload);
    const session = await requireDoctor();

    const file = formData.get("file");
    const patientId = formData.get("patientId");
    const fileType = formData.get("fileType");
    const description = formData.get("description");
    const documentType = formData.get("documentType");
    const documentDate = formData.get("documentDate");
    const laboratory = formData.get("laboratory");
    const physician = formData.get("physician");
    const results = formData.get("results");
    const isNormal = formData.get("isNormal");
    const tags = formData.get("tags");

    if (!(file instanceof File)) {
      throw new Error("Archivo requerido");
    }
    if (typeof patientId !== "string" || patientId.length === 0) {
      throw new Error("ID de paciente requerido");
    }
    if (typeof fileType !== "string" || fileType.length === 0) {
      throw new Error("Tipo de archivo requerido");
    }

    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El archivo excede el tamano maximo de 50MB");
    }

    // Validate MIME type
    const ALLOWED_MIME_TYPES = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "application/pdf", "image/tiff", "image/bmp",
    ];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Tipo de archivo no permitido");
    }

    // Validate additional fields
    const validatedData = medicalImageSchema.parse({
      patientId,
      fileType,
      description,
      documentType,
      documentDate,
      laboratory,
      physician,
      results,
      isNormal,
      tags,
    });

    const ext = file.name.split(".").pop() || "bin";
    const storageName = `${patientId}/${nanoid()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("medical-images")
      .upload(storageName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Error al subir el archivo");
    }

    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from("medical-images")
      .createSignedUrl(storageName, 60 * 60 * 24 * 30);

    if (urlError || !urlData?.signedUrl) {
      throw new Error("Error al crear URL del archivo");
    }

    const image = await prisma.medicalImage.create({
      data: {
        patientId,
        fileName: file.name,
        fileUrl: urlData.signedUrl,
        fileType,
        fileSize: file.size,
        mimeType: file.type,
        description: validatedData.description,
        documentType: validatedData.documentType as DocumentType | undefined,
        documentDate: validatedData.documentDate,
        laboratory: validatedData.laboratory,
        physician: validatedData.physician,
        results: validatedData.results,
        isNormal: validatedData.isNormal,
        tags: validatedData.tags || [],
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "medical_image",
      entityId: image.id,
      details: `Archivo: ${file.name}, Tipo: ${fileType}${validatedData.documentType ? `, Documento: ${validatedData.documentType}` : ""}`,
    });

    revalidatePath(`/dashboard/pacientes/${patientId}/imagenes`);
    revalidatePath(`/dashboard/pacientes/${patientId}`);

    return { success: true, imageId: image.id };
  } catch (error) {
    console.error("[uploadMedicalImage] Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al subir la imagen"
    );
  }
}

interface GetImagesFilters {
  documentType?: DocumentType;
  isNormal?: boolean;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
}

async function getMedicalImages(
  patientId: string,
  filters?: GetImagesFilters,
  page = 1,
  limit = 20
) {
  await requireDoctor();

  const where: Record<string, unknown> = { patientId };

  if (filters?.documentType) {
    where.documentType = filters.documentType;
  }
  if (filters?.isNormal !== undefined) {
    where.isNormal = filters.isNormal;
  }
  if (filters?.startDate || filters?.endDate) {
    where.documentDate = {
      ...(filters.startDate && { gte: filters.startDate }),
      ...(filters.endDate && { lte: filters.endDate }),
    };
  }
  if (filters?.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }

  const [images, total] = await Promise.all([
    prisma.medicalImage.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.medicalImage.count({ where }),
  ]);

  return {
    images,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

async function getMedicalImage(id: string) {
  const session = await requireDoctor();

  const image = await prisma.medicalImage.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!image) {
    throw new Error("Imagen no encontrada");
  }

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "medical_image",
    entityId: id,
    details: `Archivo: ${image.fileName}`,
  });

  return image;
}

async function updateMedicalImage(id: string, formData: FormData) {
  try {
    const session = await requireDoctor();

    const description = formData.get("description");
    const documentType = formData.get("documentType");
    const documentDate = formData.get("documentDate");
    const laboratory = formData.get("laboratory");
    const physician = formData.get("physician");
    const results = formData.get("results");
    const isNormal = formData.get("isNormal");
    const tags = formData.get("tags");

    // Get existing image
    const existing = await prisma.medicalImage.findUnique({
      where: { id },
      select: { patientId: true, fileName: true },
    });

    if (!existing) {
      throw new Error("Imagen no encontrada");
    }

    // Parse tags
    let parsedTags: string[] = [];
    if (typeof tags === "string" && tags.length > 0) {
      parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
    }

    const image = await prisma.medicalImage.update({
      where: { id },
      data: {
        description: typeof description === "string" ? description || null : undefined,
        documentType: documentType && typeof documentType === "string" ? documentType as DocumentType : undefined,
        documentDate: documentDate && typeof documentDate === "string" ? new Date(documentDate) : undefined,
        laboratory: typeof laboratory === "string" ? laboratory || null : undefined,
        physician: typeof physician === "string" ? physician || null : undefined,
        results: typeof results === "string" ? results || null : undefined,
        isNormal: isNormal === "true" ? true : isNormal === "false" ? false : undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "update",
      entity: "medical_image",
      entityId: id,
      details: `Archivo: ${existing.fileName}`,
    });

    revalidatePath(`/dashboard/pacientes/${image.patientId}/imagenes`);

    return { success: true };
  } catch (error) {
    console.error("[updateMedicalImage] Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al actualizar la imagen"
    );
  }
}

async function deleteMedicalImage(id: string) {
  try {
    const session = await requireDoctor();

    const image = await prisma.medicalImage.findUnique({
      where: { id },
      select: { patientId: true, fileName: true },
    });

    if (!image) {
      throw new Error("Imagen no encontrada");
    }

    // Delete from database (storage cleanup can be done separately)
    await prisma.medicalImage.delete({
      where: { id },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "delete",
      entity: "medical_image",
      entityId: id,
      details: `Archivo: ${image.fileName}`,
    });

    revalidatePath(`/dashboard/pacientes/${image.patientId}/imagenes`);

    return { success: true };
  } catch (error) {
    console.error("[deleteMedicalImage] Error:", error);
    throw new Error("Error al eliminar la imagen");
  }
}
