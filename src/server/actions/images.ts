"use server";

import { requireDoctor } from "@/server/middleware/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { logAudit } from "./audit";

export async function uploadMedicalImage(formData: FormData) {
  const session = await requireDoctor();

  const file = formData.get("file");
  const patientId = formData.get("patientId");
  const fileType = formData.get("fileType");

  if (!(file instanceof File)) {
    throw new Error("File is required");
  }
  if (typeof patientId !== "string" || patientId.length === 0) {
    throw new Error("Patient ID is required");
  }
  if (typeof fileType !== "string" || fileType.length === 0) {
    throw new Error("File type is required");
  }

  const ext = file.name.split(".").pop() || "bin";
  const storageName = `${patientId}/${nanoid()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("medical-images")
    .upload(storageName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Error uploading file");
  }

  const { data: urlData, error: urlError } = await supabaseAdmin.storage
    .from("medical-images")
    .createSignedUrl(storageName, 60 * 60 * 24 * 365);

  if (urlError || !urlData?.signedUrl) {
    throw new Error("Error creating signed URL");
  }

  const image = await prisma.medicalImage.create({
    data: {
      patientId,
      fileName: file.name,
      fileUrl: urlData.signedUrl,
      fileType,
      fileSize: file.size,
      mimeType: file.type,
    },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "create",
    entity: "medical_image",
    entityId: image.id,
    details: `Archivo: ${file.name}, Tipo: ${fileType}`,
  });

  return { success: true };
}
