"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validators/appointment";
import { CACHE_TAGS } from "@/lib/cache";

export async function createAppointment(formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = appointmentSchema.parse(rawData);

  const appointment = await prisma.appointment.create({
    data: validatedData,
  });

  revalidatePath("/dashboard/citas");
  revalidateTag(CACHE_TAGS.appointments, "default");
  revalidateTag(CACHE_TAGS.dashboard, "default");

  return { success: true, appointmentId: appointment.id };
}

interface GetAppointmentsOptions {
  status?: string;
  page?: number;
  limit?: number;
}

export async function getAppointments(options: GetAppointmentsOptions = {}) {
  await requireDoctor();

  const { status, page = 1, limit = 20 } = options;

  const where = status ? { status } : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    appointments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAppointmentsByDateRange(
  startDate: Date,
  endDate: Date
) {
  await requireDoctor();

  return prisma.appointment.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        not: "cancelled",
      },
    },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { date: "asc" },
  });
}

export async function getAppointment(id: string) {
  await requireDoctor();

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
}

export async function updateAppointment(id: string, formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = appointmentSchema.partial().parse(rawData);

  await prisma.appointment.update({
    where: { id },
    data: validatedData,
  });

  revalidatePath(`/dashboard/citas/${id}`);
  revalidatePath("/dashboard/citas");
  revalidateTag(CACHE_TAGS.appointments, "default");
  revalidateTag(CACHE_TAGS.dashboard, "default");

  return { success: true };
}

export async function deleteAppointment(id: string) {
  await requireDoctor();

  await prisma.appointment.update({
    where: { id },
    data: { status: "cancelled" },
  });

  revalidatePath("/dashboard/citas");
  revalidateTag(CACHE_TAGS.appointments, "default");
  revalidateTag(CACHE_TAGS.dashboard, "default");

  return { success: true };
}
