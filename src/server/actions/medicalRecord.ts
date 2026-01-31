"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/utils/encryption";
import { medicalRecordSchema } from "@/lib/validators/medicalRecord";
import { logAudit } from "./audit";

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
    personalHistory: record.personalHistory
      ? decrypt(String(record.personalHistory))
      : null,
    gynecologicHistory: record.gynecologicHistory
      ? decrypt(String(record.gynecologicHistory))
      : null,
  };
}

export async function createMedicalRecord(formData: FormData) {
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
}

export async function getMedicalRecords(patientId: string) {
  await requireDoctor();

  const records = await prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: { date: "desc" },
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
}

export async function deleteMedicalRecord(id: string) {
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
}
