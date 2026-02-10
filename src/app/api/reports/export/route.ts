/**
 * DEPRECATED: Use /api/v1/patients/export or /api/v1/appointments/export instead
 *
 * This endpoint is maintained for backward compatibility only.
 *
 * @deprecated Use resource-specific endpoints:
 * - /api/v1/patients/export
 * - /api/v1/appointments/export
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getExportData, type ReportFilters } from "@/server/actions/reports";
import { logAudit } from "@/server/actions/audit";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import {
  unauthorizedResponse,
  handleApiError,
  rateLimitErrorResponse,
  getRequestPath,
} from "@/lib/api/responses";
import { generateCSV, addBOM, generateFilename } from "@/lib/api/csv";

export async function GET(request: NextRequest) {
  const path = getRequestPath(request);

  try {
    // Apply rate limiting
    const ip = getClientIp(request);
    const { success, reset } = rateLimit(`export:${ip}`, RATE_LIMITS.export);

    if (!success) {
      return rateLimitErrorResponse(reset, path);
    }

    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return unauthorizedResponse("Sesión no válida o expirada", path);
    }

    // Parse filters
    const { searchParams } = new URL(request.url);
    const filters: ReportFilters = {
      startDate: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
      appointmentType: searchParams.get("type") || undefined,
      appointmentStatus: searchParams.get("status") || undefined,
    };

    const data = await getExportData(filters);
    const exportType = searchParams.get("export") || "appointments";

    let csv: string;
    let filename: string;
    let entity: "patient" | "appointment";
    let count: number;

    if (exportType === "patients") {
      const csvHeaders = [
        "ID",
        "Nombre",
        "Apellido",
        "Cédula",
        "Género",
        "Fecha Nacimiento",
        "Teléfono",
        "Email",
        "Ciudad",
        "Fecha Registro",
      ];
      const rows = data.patients.map((p) => [
        p.id,
        p.firstName,
        p.lastName,
        p.cedula,
        p.gender === "female"
          ? "Femenino"
          : p.gender === "male"
            ? "Masculino"
            : "Otro",
        p.dateOfBirth,
        p.phone,
        p.email,
        p.city,
        p.createdAt,
      ]);
      csv = generateCSV(csvHeaders, rows);
      filename = generateFilename("pacientes");
      entity = "patient";
      count = data.patients.length;
    } else {
      const csvHeaders = [
        "ID",
        "Fecha",
        "Paciente",
        "Cédula",
        "Tipo",
        "Estado",
        "Duración (min)",
        "Motivo",
      ];
      const typeLabels: Record<string, string> = {
        prenatal: "Prenatal",
        gynecology: "Ginecología",
        ultrasound: "Ecografía",
        followup: "Control",
      };
      const statusLabels: Record<string, string> = {
        scheduled: "Programada",
        completed: "Completada",
        cancelled: "Cancelada",
        noshow: "No asistió",
      };
      const rows = data.appointments.map((a) => [
        a.id,
        new Date(a.date).toLocaleString("es-VE"),
        a.patientName,
        a.patientCedula,
        typeLabels[a.type] || a.type,
        statusLabels[a.status] || a.status,
        String(a.duration),
        a.reason,
      ]);
      csv = generateCSV(csvHeaders, rows);
      filename = generateFilename("citas");
      entity = "appointment";
      count = data.appointments.length;
    }

    const csvWithBom = addBOM(csv);

    // Log audit trail
    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "export",
      entity,
      details: `Exportados ${count} registros [DEPRECATED endpoint]`,
    });

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, must-revalidate",
        "X-Deprecated": "true",
        "X-Use-Instead": `/api/v1/${exportType}/export`,
      },
    });
  } catch (error) {
    return handleApiError(error, path);
  }
}
