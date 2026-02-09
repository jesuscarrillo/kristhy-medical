"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { prescriptionSchema } from "@/lib/validators/prescription";
import { logAudit } from "./audit";

export async function createPrescription(formData: FormData) {
  const session = await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = prescriptionSchema.parse(rawData);

  const prescription = await prisma.prescription.create({
    data: validatedData,
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "create",
    entity: "prescription",
    entityId: prescription.id,
  });

  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}/prescripciones`);
  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}`);
  return { success: true, prescriptionId: prescription.id };
}

const _fetchPrescriptions = cache(async (patientId: string) => {
  return prisma.prescription.findMany({
    where: { patientId, isActive: true },
    orderBy: { date: "desc" },
  });
});

export async function getPrescriptions(patientId: string) {
  await requireDoctor();
  return _fetchPrescriptions(patientId);
}

export async function getPrescription(id: string) {
  const session = await requireDoctor();

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

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "prescription",
    entityId: id,
    details: `Paciente: ${prescription.patient.firstName} ${prescription.patient.lastName}`,
  });

  return prescription;
}

export async function updatePrescription(id: string, formData: FormData) {
  const session = await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = prescriptionSchema.partial().parse(rawData);

  const prescription = await prisma.prescription.update({
    where: { id },
    data: validatedData,
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "update",
    entity: "prescription",
    entityId: id,
  });

  revalidatePath(`/dashboard/pacientes/${prescription.patientId}/prescripciones`);
  revalidatePath(`/dashboard/pacientes/${prescription.patientId}/prescripciones/${id}`);
  return { success: true };
}

export async function deletePrescription(id: string) {
  const session = await requireDoctor();

  const prescription = await prisma.prescription.update({
    where: { id },
    data: { isActive: false },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "delete",
    entity: "prescription",
    entityId: id,
  });

  revalidatePath(`/dashboard/pacientes/${prescription.patientId}/prescripciones`);
  return { success: true };
}
