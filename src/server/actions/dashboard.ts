"use server";

import { unstable_cache } from "next/cache";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { safeDecrypt } from "@/lib/utils/encryption";
import { CACHE_TAGS } from "@/lib/cache";

async function fetchDashboardStats() {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    totalPatients,
    totalAppointments,
    todayAppointments,
    monthAppointments,
    pendingAppointments,
    recentPatients,
    upcomingAppointments,
  ] = await Promise.all([
    prisma.patient.count({ where: { isActive: true } }),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: { not: "cancelled" },
      },
    }),
    prisma.appointment.count({
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
        status: "completed",
      },
    }),
    prisma.appointment.count({
      where: { status: "scheduled" },
    }),
    prisma.patient.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cedula: true,
        createdAt: true,
      },
    }),
    prisma.appointment.findMany({
      where: {
        date: { gte: today },
        status: "scheduled",
      },
      orderBy: { date: "asc" },
      take: 5,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return {
    totalPatients,
    totalAppointments,
    todayAppointments,
    monthAppointments,
    pendingAppointments,
    recentPatients: recentPatients.map((p) => ({
      ...p,
      cedula: safeDecrypt(p.cedula),
    })),
    upcomingAppointments,
  };
}

// Caché de 30 segundos para el dashboard
const getCachedDashboardStats = unstable_cache(
  fetchDashboardStats,
  [CACHE_TAGS.dashboard],
  { revalidate: 30, tags: [CACHE_TAGS.dashboard, CACHE_TAGS.patients, CACHE_TAGS.appointments] }
);

export async function getDashboardStats() {
  await requireDoctor();
  return getCachedDashboardStats();
}
