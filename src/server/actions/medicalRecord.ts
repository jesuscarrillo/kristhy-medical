"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, safeDecrypt } from "@/lib/utils/encryption";
import { medicalRecordSchema } from "@/lib/validators/medicalRecord";
import { logAudit } from "./audit";
import { z } from "zod";
import { rateLimitAction, RATE_LIMITS } from "@/lib/rate-limit";

function encryptMedicalRecordFields<T extends Record<string, unknown>>(data: T) {
  return {
    ...data,
    personalHistory: data.personalHistory
      ? encrypt(String(data.personalHistory))
      : undefined,
    gynecologicHistory: data.gynecologicHistory
      ? encrypt(String(data.gynecologicHistory))
      : undefined,
  } as T;
}

function decryptMedicalRecordFields<T extends Record<string, unknown>>(
  record: T
) {
  return {
    ...record,
    personalHistory: safeDecrypt(
      record.personalHistory ? String(record.personalHistory) : null
    ),
    gynecologicHistory: safeDecrypt(
      record.gynecologicHistory ? String(record.gynecologicHistory) : null
    ),
  };
}

export async function createMedicalRecord(formData: FormData) {
  try {
    await rateLimitAction("createMedicalRecord", RATE_LIMITS.mutation);
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = medicalRecordSchema.parse(rawData);

    const record = await prisma.medicalRecord.create({
      data: encryptMedicalRecordFields(validatedData),
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "medical_record",
      entityId: record.id,
      details: `Tipo: ${validatedData.consultationType}`,
    });

    revalidatePath(`/dashboard/pacientes/${validatedData.patientId}/historial`);
    revalidatePath(`/dashboard/pacientes/${validatedData.patientId}`);
    return { success: true, recordId: record.id };
  } catch (error) {
    console.error("[createMedicalRecord] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos del historial invalidos");
    }
    throw new Error("Error al crear el historial medico");
  }
}

export async function getMedicalRecords(patientId: string) {
  await requireDoctor();

  const records = await prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: { date: "desc" },
  });

  return records.map((record) => decryptMedicalRecordFields(record));
}

export async function getAllMedicalRecords() {
  await requireDoctor();

  const records = await prisma.medicalRecord.findMany({
    orderBy: { date: "desc" },
    take: 50,
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
          id: true,
        }
      }
    }
  });

  return records.map((record) => decryptMedicalRecordFields(record));
}

export async function getMedicalRecord(id: string) {
  const session = await requireDoctor();

  const record = await prisma.medicalRecord.findUnique({
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

  if (!record) {
    throw new Error("Medical record not found");
  }

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "medical_record",
    entityId: id,
    details: `Paciente: ${record.patient.firstName} ${record.patient.lastName}`,
  });

  return decryptMedicalRecordFields(record);
}

export async function updateMedicalRecord(id: string, formData: FormData) {
  try {
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = medicalRecordSchema.partial().parse(rawData);

    const record = await prisma.medicalRecord.update({
      where: { id },
      data: encryptMedicalRecordFields(validatedData),
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "update",
      entity: "medical_record",
      entityId: id,
    });

    revalidatePath(`/dashboard/pacientes/${record.patientId}/historial`);
    revalidatePath(`/dashboard/pacientes/${record.patientId}/historial/${id}`);
    revalidatePath(`/dashboard/pacientes/${record.patientId}`);
    return { success: true };
  } catch (error) {
    console.error("[updateMedicalRecord] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos del historial invalidos");
    }
    throw new Error("Error al actualizar el historial medico");
  }
}

export async function deleteMedicalRecord(id: string) {
  try {
    const session = await requireDoctor();

    const record = await prisma.medicalRecord.delete({
      where: { id },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "delete",
      entity: "medical_record",
      entityId: id,
    });

    revalidatePath(`/dashboard/pacientes/${record.patientId}/historial`);
    revalidatePath(`/dashboard/pacientes/${record.patientId}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteMedicalRecord] Error:", error);
    throw new Error("Error al eliminar el historial medico");
  }
}
