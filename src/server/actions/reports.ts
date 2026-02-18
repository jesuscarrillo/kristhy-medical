"use server";

import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { safeDecrypt } from "@/lib/utils/encryption";

export type ReportFilters = {
  startDate?: Date;
  endDate?: Date;
  appointmentType?: string;
  appointmentStatus?: string;
};

type ReportStats = {
  overview: {
    totalPatients: number;
    activePatients: number;
    totalAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalMedicalRecords: number;
  };
  appointmentsByType: {
    type: string;
    count: number;
  }[];
  appointmentsByStatus: {
    status: string;
    count: number;
  }[];
  appointmentsByMonth: {
    month: string;
    count: number;
  }[];
  patientsByGender: {
    gender: string;
    count: number;
  }[];
  recentAppointments: {
    id: string;
    date: Date;
    type: string;
    status: string;
    patientName: string;
  }[];
};

export async function getReportStats(filters: ReportFilters = {}): Promise<ReportStats> {
  await requireDoctor();

  const { startDate, endDate, appointmentType, appointmentStatus } = filters;

  // Build date filter
  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (startDate) dateFilter.gte = startDate;
  if (endDate) dateFilter.lte = endDate;

  // Build appointment where clause
  const appointmentWhere: Record<string, unknown> = {};
  if (Object.keys(dateFilter).length > 0) appointmentWhere.date = dateFilter;
  if (appointmentType) appointmentWhere.type = appointmentType;
  if (appointmentStatus) appointmentWhere.status = appointmentStatus;

  // Fetch all stats in parallel
  const [
    totalPatients,
    activePatients,
    totalAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    totalMedicalRecords,
    appointmentsByType,
    appointmentsByStatus,
    patientsByGender,
    recentAppointmentsRaw,
    appointmentsForMonthly,
  ] = await Promise.all([
    // Patient counts
    prisma.patient.count(),
    prisma.patient.count({ where: { isActive: true } }),

    // Appointment counts with filters
    prisma.appointment.count({ where: appointmentWhere }),
    prisma.appointment.count({
      where: {
        ...appointmentWhere,
        status: "scheduled",
        date: { gte: new Date() },
      },
    }),
    prisma.appointment.count({
      where: { ...appointmentWhere, status: "completed" },
    }),
    prisma.appointment.count({
      where: { ...appointmentWhere, status: "cancelled" },
    }),

    // Medical records count
    prisma.medicalRecord.count({
      where: Object.keys(dateFilter).length > 0 ? { date: dateFilter } : undefined,
    }),

    // Appointments grouped by type
    prisma.appointment.groupBy({
      by: ["type"],
      _count: { type: true },
      where: appointmentWhere,
    }),

    // Appointments grouped by status
    prisma.appointment.groupBy({
      by: ["status"],
      _count: { status: true },
      where: appointmentWhere,
    }),

    // Patients grouped by gender
    prisma.patient.groupBy({
      by: ["gender"],
      _count: { gender: true },
      where: { isActive: true },
    }),

    // Recent appointments
    prisma.appointment.findMany({
      where: appointmentWhere,
      include: {
        patient: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { date: "desc" },
      take: 10,
    }),

    // Appointments for monthly chart (last 12 months)
    prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
        },
      },
      select: { date: true },
    }),
  ]);

  // Process monthly data
  const monthlyMap = new Map<string, number>();
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }
  appointmentsForMonthly.forEach((apt) => {
    const d = new Date(apt.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
    }
  });

  const appointmentsByMonth = Array.from(monthlyMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));

  return {
    overview: {
      totalPatients,
      activePatients,
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      totalMedicalRecords,
    },
    appointmentsByType: appointmentsByType.map((item) => ({
      type: item.type,
      count: item._count.type,
    })),
    appointmentsByStatus: appointmentsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    appointmentsByMonth,
    patientsByGender: patientsByGender.map((item) => ({
      gender: item.gender,
      count: item._count.gender,
    })),
    recentAppointments: recentAppointmentsRaw.map((apt) => ({
      id: apt.id,
      date: apt.date,
      type: apt.type,
      status: apt.status,
      patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
    })),
  };
}

type ExportData = {
  appointments: {
    id: string;
    date: string;
    type: string;
    status: string;
    duration: number;
    patientName: string;
    patientCedula: string;
    reason: string | null;
  }[];
  patients: {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    email: string | null;
    city: string;
    createdAt: string;
  }[];
};

export async function getExportData(filters: ReportFilters = {}): Promise<ExportData> {
  await requireDoctor();

  const { startDate, endDate, appointmentType, appointmentStatus } = filters;

  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (startDate) dateFilter.gte = startDate;
  if (endDate) dateFilter.lte = endDate;

  const appointmentWhere: Record<string, unknown> = {};
  if (Object.keys(dateFilter).length > 0) appointmentWhere.date = dateFilter;
  if (appointmentType) appointmentWhere.type = appointmentType;
  if (appointmentStatus) appointmentWhere.status = appointmentStatus;

  const [appointments, patients] = await Promise.all([
    prisma.appointment.findMany({
      where: appointmentWhere,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            cedula: true,
          },
        },
      },
      orderBy: { date: "desc" },
    }),
    prisma.patient.findMany({
      where: { isActive: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  return {
    appointments: appointments.map((apt) => ({
      id: apt.id,
      date: apt.date.toISOString(),
      type: apt.type,
      status: apt.status,
      duration: apt.duration,
      patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
      patientCedula: safeDecrypt(apt.patient.cedula),
      reason: apt.reason,
    })),
    patients: patients.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      cedula: safeDecrypt(p.cedula),
      gender: p.gender,
      dateOfBirth: p.dateOfBirth.toISOString().split("T")[0],
      phone: safeDecrypt(p.phone),
      email: p.email ? safeDecrypt(p.email) : null,
      city: p.city,
      createdAt: p.createdAt.toISOString().split("T")[0],
    })),
  };
}
