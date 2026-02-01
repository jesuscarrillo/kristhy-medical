"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { certificateSchema } from "@/lib/validators/certificate";
import { logAudit } from "./audit";
import type { CertificateType } from "@prisma/client";

export async function createCertificate(formData: FormData) {
  const session = await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = certificateSchema.parse(rawData);

  // Verify patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: validatedData.patientId },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!patient) {
    throw new Error("Paciente no encontrado");
  }

  // For REST type, auto-calculate validUntil if not provided
  let validUntil = validatedData.validUntil;
  if (validatedData.type === "REST" && validatedData.restDays && !validUntil) {
    const startDate = validatedData.validFrom || validatedData.date;
    validUntil = new Date(startDate);
    validUntil.setDate(validUntil.getDate() + validatedData.restDays);
  }

  const certificate = await prisma.medicalCertificate.create({
    data: {
      patientId: validatedData.patientId,
      date: validatedData.date,
      type: validatedData.type as CertificateType,
      title: validatedData.title,
      content: validatedData.content,
      restDays: validatedData.restDays,
      validFrom: validatedData.validFrom,
      validUntil: validUntil,
      diagnosis: validatedData.diagnosis,
      issuedBy: validatedData.issuedBy,
      licenseNumber: validatedData.licenseNumber,
    },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "create",
    entity: "certificate",
    entityId: certificate.id,
    details: `Certificado ${validatedData.type} - Paciente: ${patient.firstName} ${patient.lastName}`,
  });

  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}/certificados`);
  revalidatePath(`/dashboard/pacientes/${validatedData.patientId}`);

  return { success: true, certificateId: certificate.id };
}

export async function getCertificates(patientId: string) {
  await requireDoctor();

  return prisma.medicalCertificate.findMany({
    where: { patientId, isActive: true },
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      type: true,
      title: true,
      restDays: true,
      validFrom: true,
      validUntil: true,
      createdAt: true,
    },
  });
}

export async function getCertificate(id: string) {
  const session = await requireDoctor();

  const certificate = await prisma.medicalCertificate.findUnique({
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
          address: true,
        },
      },
    },
  });

  if (!certificate) {
    throw new Error("Certificado no encontrado");
  }

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "certificate",
    entityId: id,
    details: `Certificado ${certificate.type} - Paciente: ${certificate.patient.firstName} ${certificate.patient.lastName}`,
  });

  return certificate;
}

export async function updateCertificate(id: string, formData: FormData) {
  const session = await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = certificateSchema.partial().parse(rawData);

  const existing = await prisma.medicalCertificate.findUnique({
    where: { id },
    include: {
      patient: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  if (!existing) {
    throw new Error("Certificado no encontrado");
  }

  // For REST type, auto-calculate validUntil if not provided
  let validUntil = validatedData.validUntil;
  if (validatedData.type === "REST" && validatedData.restDays && !validUntil) {
    const startDate = validatedData.validFrom || validatedData.date || existing.date;
    validUntil = new Date(startDate);
    validUntil.setDate(validUntil.getDate() + validatedData.restDays);
  }

  const certificate = await prisma.medicalCertificate.update({
    where: { id },
    data: {
      date: validatedData.date,
      type: validatedData.type as CertificateType | undefined,
      title: validatedData.title,
      content: validatedData.content,
      restDays: validatedData.restDays,
      validFrom: validatedData.validFrom,
      validUntil: validUntil,
      diagnosis: validatedData.diagnosis,
      issuedBy: validatedData.issuedBy,
      licenseNumber: validatedData.licenseNumber,
    },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "update",
    entity: "certificate",
    entityId: id,
    details: `Paciente: ${existing.patient.firstName} ${existing.patient.lastName}`,
  });

  revalidatePath(`/dashboard/pacientes/${certificate.patientId}/certificados`);
  revalidatePath(`/dashboard/pacientes/${certificate.patientId}/certificados/${id}`);

  return { success: true };
}

export async function deleteCertificate(id: string) {
  const session = await requireDoctor();

  const certificate = await prisma.medicalCertificate.update({
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
    entity: "certificate",
    entityId: id,
    details: `Paciente: ${certificate.patient.firstName} ${certificate.patient.lastName}`,
  });

  revalidatePath(`/dashboard/pacientes/${certificate.patientId}/certificados`);

  return { success: true };
}
