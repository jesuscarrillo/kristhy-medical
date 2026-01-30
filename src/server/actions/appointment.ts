"use server";

import { revalidatePath } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validators/appointment";

export async function createAppointment(formData: FormData) {
  await requireDoctor();

  const rawData = Object.fromEntries(formData);
  const validatedData = appointmentSchema.parse(rawData);

  const appointment = await prisma.appointment.create({
    data: validatedData,
  });

  revalidatePath("/dashboard/citas");
  return { success: true, appointmentId: appointment.id };
}

export async function getAppointments() {
  await requireDoctor();

  return prisma.appointment.findMany({
    include: {
      patient: true,
    },
    orderBy: { date: "asc" },
    take: 200,
  });
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
  return { success: true };
}

export async function deleteAppointment(id: string) {
  await requireDoctor();

  await prisma.appointment.update({
    where: { id },
    data: { status: "cancelled" },
  });

  revalidatePath("/dashboard/citas");
  return { success: true };
}
