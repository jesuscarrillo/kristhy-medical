"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/utils/encryption";
import { medicalRecordSchema } from "@/lib/validators/medicalRecord";

export async function createMedicalRecord(formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = medicalRecordSchema.parse(rawData);

  await prisma.medicalRecord.create({
    data: {
      ...validatedData,
      personalHistory: validatedData.personalHistory
        ? encrypt(validatedData.personalHistory)
        : undefined,
      gynecologicHistory: validatedData.gynecologicHistory
        ? encrypt(validatedData.gynecologicHistory)
        : undefined,
    },
  });

  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}/historial`);
  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}`);
  return { success: true };
}
