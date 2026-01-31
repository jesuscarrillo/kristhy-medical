"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/utils/encryption";
import { patientSchema } from "@/lib/validators/patient";
import { logAudit } from "./audit";
import { CACHE_TAGS } from "@/lib/cache";

function encryptPatientFields<T extends Record<string, unknown>>(data: T) {
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
  } as T;
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
  try {
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = patientSchema.parse(rawData);

    const patient = await prisma.patient.create({
      data: {
        ...encryptPatientFields(validatedData),
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "patient",
      entityId: patient.id,
      details: `Paciente: ${validatedData.firstName} ${validatedData.lastName}`,
    });

    revalidatePath("/dashboard/pacientes");
    revalidateTag(CACHE_TAGS.patients, "default");
    revalidateTag(CACHE_TAGS.dashboard, "default");

    return { success: true, patientId: patient.id };
  } catch (error) {
    console.error("[createPatient] Error:", error);
    throw error;
  }
}

export async function getPatients(search?: string, page = 1, limit = 20) {
  await requireDoctor();

  const where = search
    ? {
        isActive: true,
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { isActive: true };

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { lastName: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cedula: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        city: true,
      },
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    patients: patients.map((patient) => decryptPatientFields(patient)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPatient(id: string) {
  const session = await requireDoctor();

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

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "patient",
    entityId: id,
    details: `Paciente: ${patient.firstName} ${patient.lastName}`,
  });

  return {
    ...decryptPatientFields(patient),
    medicalRecords: patient.medicalRecords.map((record) =>
      decryptMedicalRecordFields(record)
    ),
  };
}

export async function updatePatient(id: string, formData: FormData) {
  try {
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = patientSchema.partial().parse(rawData);

    await prisma.patient.update({
      where: { id },
      data: {
        ...encryptPatientFields(validatedData),
      },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "update",
      entity: "patient",
      entityId: id,
    });

    revalidatePath(`/dashboard/pacientes/${id}`);
    revalidateTag(CACHE_TAGS.patients, "default");
    revalidateTag(CACHE_TAGS.dashboard, "default");

    return { success: true };
  } catch (error) {
    console.error("[updatePatient] Error:", error);
    throw error;
  }
}

export async function deletePatient(id: string) {
  const session = await requireDoctor();

  await prisma.patient.update({
    where: { id },
    data: { isActive: false },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "delete",
    entity: "patient",
    entityId: id,
  });

  revalidatePath("/dashboard/pacientes");
  revalidateTag(CACHE_TAGS.patients, "default");
  revalidateTag(CACHE_TAGS.dashboard, "default");

  return { success: true };
}
