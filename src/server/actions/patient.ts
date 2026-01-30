"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/utils/encryption";
import { patientSchema } from "@/lib/validators/patient";

function encryptPatientFields(data: Record<string, unknown>) {
  return {
    ...data,
    cedula: data.cedula ? encrypt(String(data.cedula)) : undefined,
    phone: data.phone ? encrypt(String(data.phone)) : undefined,
    email: data.email ? encrypt(String(data.email)) : undefined,
    address: data.address ? encrypt(String(data.address)) : undefined,
    emergencyContact: data.emergencyContact
      ? encrypt(String(data.emergencyContact))
      : undefined,
    allergies: data.allergies ? encrypt(String(data.allergies)) : undefined,
  };
}

function decryptPatientFields<T extends Record<string, unknown>>(patient: T) {
  return {
    ...patient,
    cedula: patient.cedula ? decrypt(String(patient.cedula)) : null,
    phone: patient.phone ? decrypt(String(patient.phone)) : null,
    email: patient.email ? decrypt(String(patient.email)) : null,
    address: patient.address ? decrypt(String(patient.address)) : null,
    emergencyContact: patient.emergencyContact
      ? decrypt(String(patient.emergencyContact))
      : null,
    allergies: patient.allergies ? decrypt(String(patient.allergies)) : null,
  };
}

function decryptMedicalRecordFields<T extends Record<string, unknown>>(record: T) {
  return {
    ...record,
    personalHistory: record.personalHistory ? decrypt(String(record.personalHistory)) : null,
    gynecologicHistory: record.gynecologicHistory
      ? decrypt(String(record.gynecologicHistory))
      : null,
  };
}

export async function createPatient(formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = patientSchema.parse(rawData);

  const patient = await prisma.patient.create({
    data: {
      ...encryptPatientFields(validatedData),
    },
  });

  revalidatePath("/dashboard/pacientes");

  return { success: true, patientId: patient.id };
}

export async function getPatients(search?: string) {
  await requireDoctor();

  const patients = await prisma.patient.findMany({
    where: search
      ? {
          isActive: true,
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : { isActive: true },
    orderBy: { lastName: "asc" },
    take: 100,
  });

  return patients.map((patient) => decryptPatientFields(patient));
}

export async function getPatient(id: string) {
  await requireDoctor();

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { date: "desc" },
        take: 10,
      },
      medicalRecords: {
        orderBy: { date: "desc" },
        take: 10,
      },
      images: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  return {
    ...decryptPatientFields(patient),
    medicalRecords: patient.medicalRecords.map((record) =>
      decryptMedicalRecordFields(record)
    ),
  };
}

export async function updatePatient(id: string, formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = patientSchema.partial().parse(rawData);

  await prisma.patient.update({
    where: { id },
    data: {
      ...encryptPatientFields(validatedData),
    },
  });

  revalidatePath(`/dashboard/pacientes/${id}`);

  return { success: true };
}

export async function deletePatient(id: string) {
  await requireDoctor();

  await prisma.patient.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/pacientes");

  return { success: true };
}
