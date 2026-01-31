"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { prescriptionSchema } from "@/lib/validators/prescription";

export async function createPrescription(formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = prescriptionSchema.parse(rawData);

  const prescription = await prisma.prescription.create({
    data: validatedData,
  });

  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}/prescripciones`);
  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}`);
  return { success: true, prescriptionId: prescription.id };
}

export async function getPrescriptions(patientId: string) {
  await requireDoctor();

  return prisma.prescription.findMany({
    where: { patientId, isActive: true },
    orderBy: { date: "desc" },
  });
}

export async function getPrescription(id: string) {
  await requireDoctor();

  const prescription = await prisma.prescription.findUnique({
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
        },
      },
    },
  });

  if (!prescription) {
    throw new Error("Prescription not found");
  }

  return prescription;
}

export async function updatePrescription(id: string, formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = prescriptionSchema.partial().parse(rawData);

  const prescription = await prisma.prescription.update({
    where: { id },
    data: validatedData,
  });

  revalidatePath(`/dashboard/pacientes/${prescription.patientId}/prescripciones`);
  revalidatePath(`/dashboard/pacientes/${prescription.patientId}/prescripciones/${id}`);
  return { success: true };
}

export async function deletePrescription(id: string) {
  await requireDoctor();

  const prescription = await prisma.prescription.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath(`/dashboard/pacientes/${prescription.patientId}/prescripciones`);
  return { success: true };
}
