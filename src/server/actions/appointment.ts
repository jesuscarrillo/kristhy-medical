"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validators/appointment";
import { logAudit } from "./audit";
import { CACHE_TAGS } from "@/lib/cache";
import { z } from "zod";
import { rateLimitAction, RATE_LIMITS } from "@/lib/rate-limit";

export async function createAppointment(formData: FormData) {
  try {
    await rateLimitAction("createAppointment", RATE_LIMITS.mutation);
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = appointmentSchema.parse(rawData);

    const appointment = await prisma.appointment.create({
      data: validatedData,
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "create",
      entity: "appointment",
      entityId: appointment.id,
      details: `Cita: ${validatedData.type}`,
    });

    revalidatePath("/dashboard/citas");
    revalidateTag(CACHE_TAGS.appointments, "default");
    revalidateTag(CACHE_TAGS.dashboard, "default");

    return { success: true, appointmentId: appointment.id };
  } catch (error) {
    console.error("[createAppointment] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos de la cita invalidos");
    }
    throw new Error("Error al crear la cita");
  }
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
  const session = await requireDoctor();

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
    },
  });

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "view",
    entity: "appointment",
    entityId: id,
  });

  return appointment;
}

export async function updateAppointment(id: string, formData: FormData) {
  try {
    const session = await requireDoctor();

    const rawData = Object.fromEntries(formData);
    const validatedData = appointmentSchema.partial().parse(rawData);

    await prisma.appointment.update({
      where: { id },
      data: validatedData,
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "update",
      entity: "appointment",
      entityId: id,
    });

    revalidatePath(`/dashboard/citas/${id}`);
    revalidatePath("/dashboard/citas");
    revalidateTag(CACHE_TAGS.appointments, "default");
    revalidateTag(CACHE_TAGS.dashboard, "default");

    return { success: true };
  } catch (error) {
    console.error("[updateAppointment] Error:", error);
    if (error instanceof z.ZodError) {
      throw new Error("Datos de la cita invalidos");
    }
    throw new Error("Error al actualizar la cita");
  }
}

export async function deleteAppointment(id: string) {
  try {
    const session = await requireDoctor();

    await prisma.appointment.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "delete",
      entity: "appointment",
      entityId: id,
    });

    revalidatePath("/dashboard/citas");
    revalidateTag(CACHE_TAGS.appointments, "default");
    revalidateTag(CACHE_TAGS.dashboard, "default");

    return { success: true };
  } catch (error) {
    console.error("[deleteAppointment] Error:", error);
    throw new Error("Error al cancelar la cita");
  }
}
