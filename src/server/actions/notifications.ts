"use server";

import { render } from "@react-email/components";
import { requireDoctor } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/email";
import { safeDecrypt } from "@/lib/utils/encryption";
import { AppointmentReminderEmail } from "@/lib/email-templates/appointment-reminder";

type SendReminderResult = {
  success: boolean;
  sent: number;
  failed: number;
  errors: string[];
};

export async function sendAppointmentReminders(): Promise<SendReminderResult> {
  if (!resend) {
    return {
      success: false,
      sent: 0,
      failed: 0,
      errors: ["Email service not configured (RESEND_API_KEY missing)"],
    };
  }

  // Get appointments for the next 24-48 hours that haven't been reminded
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Set times for the range (tomorrow 00:00 to day after tomorrow 00:00)
  const startDate = new Date(tomorrow);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(dayAfterTomorrow);
  endDate.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
      status: "scheduled",
      reminderSent: false,
    },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  const results: SendReminderResult = {
    success: true,
    sent: 0,
    failed: 0,
    errors: [],
  };

  // Filter appointments with valid emails and pre-process decryption
  const validAppointments: {
    appointment: typeof appointments[number];
    patientEmail: string;
  }[] = [];

  for (const appointment of appointments) {
    if (!appointment.patient.email) {
      results.errors.push(
        `Patient ${appointment.patient.firstName} ${appointment.patient.lastName} has no email`
      );
      results.failed++;
      continue;
    }

    const patientEmail = safeDecrypt(appointment.patient.email);
    if (patientEmail === "[DATOS NO DISPONIBLES]") {
      results.errors.push(
        `Could not decrypt email for ${appointment.patient.firstName}`
      );
      results.failed++;
      continue;
    }

    validAppointments.push({ appointment, patientEmail });
  }

  // Process all valid appointments in parallel
  const sendResults = await Promise.allSettled(
    validAppointments.map(async ({ appointment, patientEmail }) => {
      const appointmentDate = new Date(appointment.date);

      const emailHtml = await render(
        AppointmentReminderEmail({
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          appointmentDate: appointmentDate.toLocaleDateString("es-VE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appointmentTime: appointmentDate.toLocaleTimeString("es-VE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          appointmentType: appointment.type,
        })
      );

      const { error } = await resend!.emails.send({
        from: EMAIL_FROM,
        to: patientEmail,
        subject: `Recordatorio: Cita médica mañana ${appointmentDate.toLocaleDateString("es-VE")}`,
        html: emailHtml,
      });

      if (error) {
        throw new Error(`Failed to send to ${appointment.patient.firstName}: ${error.message}`);
      }

      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { reminderSent: true },
      });

      return appointment.patient.firstName;
    })
  );

  for (const result of sendResults) {
    if (result.status === "fulfilled") {
      results.sent++;
    } else {
      results.failed++;
      results.errors.push(result.reason?.message || "Unknown error");
    }
  }

  results.success = results.failed === 0;
  return results;
}

export async function sendManualReminder(appointmentId: string) {
  await requireDoctor();

  if (!resend) {
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!appointment) {
    return { success: false, error: "Appointment not found" };
  }

  if (!appointment.patient.email) {
    return { success: false, error: "Patient has no email address" };
  }

  try {
    const patientEmail = safeDecrypt(appointment.patient.email);
    if (patientEmail === "[DATOS NO DISPONIBLES]") {
      return { success: false, error: "Could not decrypt patient email" };
    }
    const appointmentDate = new Date(appointment.date);

    const emailHtml = await render(
      AppointmentReminderEmail({
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        appointmentDate: appointmentDate.toLocaleDateString("es-VE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        appointmentTime: appointmentDate.toLocaleTimeString("es-VE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        appointmentType: appointment.type,
      })
    );

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: patientEmail,
      subject: `Recordatorio: Cita médica ${appointmentDate.toLocaleDateString("es-VE")}`,
      html: emailHtml,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { reminderSent: true },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAppointmentsForReminder() {
  await requireDoctor();

  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return prisma.appointment.findMany({
    where: {
      date: {
        gte: now,
        lte: nextWeek,
      },
      status: "scheduled",
    },
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { date: "asc" },
  });
}
