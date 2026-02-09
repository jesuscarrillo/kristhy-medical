"use server";

import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, safeDecrypt } from "@/lib/utils/encryption";
import { patientSchema } from "@/lib/validators/patient";
import { gynecologicalProfileSchema } from "@/lib/validators/gynecologicalProfile";
import { logAudit } from "./audit";
import { CACHE_TAGS } from "@/lib/cache";
import { z } from "zod";
import { rateLimitAction, RATE_LIMITS } from "@/lib/rate-limit";

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
    cedula: safeDecrypt(patient.cedula ? String(patient.cedula) : null),
    phone: safeDecrypt(patient.phone ? String(patient.phone) : null),
    email: safeDecrypt(patient.email ? String(patient.email) : null),
    address: safeDecrypt(patient.address ? String(patient.address) : null),
    emergencyContact: safeDecrypt(
      patient.emergencyContact ? String(patient.emergencyContact) : null
    ),
    allergies: safeDecrypt(patient.allergies ? String(patient.allergies) : null),
  };
}

function decryptMedicalRecordFields<T extends Record<string, unknown>>(record: T) {
  return {
    ...record,
    personalHistory: safeDecrypt(record.personalHistory ? String(record.personalHistory) : null),
    gynecologicHistory: safeDecrypt(
      record.gynecologicHistory ? String(record.gynecologicHistory) : null
    ),
  };
}

export async function createPatient(formData: FormData) {
  try {
    await rateLimitAction("createPatient", RATE_LIMITS.mutation);
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);

    // Separate patient data from gynecological profile data
    const {
      gestas, cesareas, ectopicos, partos, abortos, molas,
      menstrualCycleDays, menstrualDuration, menstrualPain,
      lastMenstrualPeriod, menopause, menopauseAge,
      contraceptiveMethod, sexuallyActive, parity,
      gynProfileNotes,
      menarche, sexarche, numberOfPartners,
      ...patientData
    } = rawData;

    const validatedPatientData = patientSchema.parse(patientData);

    const patient = await prisma.$transaction(async (tx) => {
      const created = await tx.patient.create({
        data: {
          ...encryptPatientFields(validatedPatientData),
        },
      });

      // Create gynecological profile if any field is provided and patient is female
      const hasGynData = gestas || cesareas || ectopicos || partos || abortos || molas ||
        menstrualCycleDays || menstrualDuration || menstrualPain || lastMenstrualPeriod ||
        menopause || menopauseAge || contraceptiveMethod || sexuallyActive || parity || gynProfileNotes ||
        menarche || sexarche || numberOfPartners;

      if (hasGynData && validatedPatientData.gender === "female") {
        const gynData = {
          gestas, cesareas, ectopicos, partos, abortos, molas,
          menstrualCycleDays, menstrualDuration, menstrualPain,
          lastMenstrualPeriod, menopause, menopauseAge,
          contraceptiveMethod, sexuallyActive, parity,
          notes: gynProfileNotes,
          menarche, sexarche, numberOfPartners,
        };

        const validatedGynData = gynecologicalProfileSchema.parse(gynData);

        await tx.gynecologicalProfile.create({
          data: {
            patientId: created.id,
            ...validatedGynData,
          },
        });
      }

      return created;
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "patient",
      entityId: patient.id,
      details: `Paciente: ${validatedPatientData.firstName} ${validatedPatientData.lastName}`,
    });

    revalidatePath("/dashboard/pacientes");
    revalidateTag(CACHE_TAGS.patients, "default");
    revalidateTag(CACHE_TAGS.dashboard, "default");

    return { success: true, patientId: patient.id };
  } catch (error) {
    console.error("[createPatient] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos del paciente invalidos");
    }
    throw new Error("Error al crear el paciente");
  }
}

// Cached per-request deduplication for patient list queries
const _fetchPatients = cache(async (search: string | undefined, page: number, limit: number) => {
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
        createdAt: true,
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
});

export async function getPatients(search?: string, page = 1, limit = 20) {
  await requireDoctor();
  return _fetchPatients(search, page, limit);
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
      gynecologicalProfile: true,
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
    await rateLimitAction("updatePatient", RATE_LIMITS.mutation);
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);

    // Separate patient data from gynecological profile data
    const {
      gestas, cesareas, ectopicos, partos, abortos, molas,
      menstrualCycleDays, menstrualDuration, menstrualPain,
      lastMenstrualPeriod, menopause, menopauseAge,
      contraceptiveMethod, sexuallyActive, parity,
      gynProfileNotes,
      menarche, sexarche, numberOfPartners,
      ...patientData
    } = rawData;

    const validatedPatientData = patientSchema.partial().parse(patientData);

    const patient = await prisma.$transaction(async (tx) => {
      const updated = await tx.patient.update({
        where: { id },
        data: {
          ...encryptPatientFields(validatedPatientData),
        },
      });

      // Update or create gynecological profile if any field is provided and patient is female
      const hasGynData = gestas || cesareas || ectopicos || partos || abortos || molas ||
        menstrualCycleDays || menstrualDuration || menstrualPain || lastMenstrualPeriod ||
        menopause || menopauseAge || contraceptiveMethod || sexuallyActive || parity || gynProfileNotes ||
        menarche || sexarche || numberOfPartners;

      if (hasGynData && updated.gender === "female") {
        const gynData = {
          gestas, cesareas, ectopicos, partos, abortos, molas,
          menstrualCycleDays, menstrualDuration, menstrualPain,
          lastMenstrualPeriod, menopause, menopauseAge,
          contraceptiveMethod, sexuallyActive, parity,
          notes: gynProfileNotes,
          menarche, sexarche, numberOfPartners,
        };

        const validatedGynData = gynecologicalProfileSchema.partial().parse(gynData);

        await tx.gynecologicalProfile.upsert({
          where: { patientId: id },
          create: {
            patientId: id,
            ...validatedGynData,
          },
          update: validatedGynData,
        });
      }

      return updated;
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
    if (error instanceof z.ZodError) {
      throw new Error("Datos del paciente invalidos");
    }
    throw new Error("Error al actualizar el paciente");
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
