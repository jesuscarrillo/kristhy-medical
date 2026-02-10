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

/**
 * GET /api/v1/appointments/export
 *
 * Export appointments data as CSV
 *
 * @query startDate - Filter by appointment date (ISO 8601)
 * @query endDate - Filter by appointment date (ISO 8601)
 * @query type - Filter by appointment type (prenatal, gynecology, ultrasound, followup)
 * @query status - Filter by status (scheduled, completed, cancelled, noshow)
 * @returns CSV file download
 * @returns 401 - Unauthorized
 * @returns 429 - Rate limit exceeded
 * @returns 500 - Server error
 */
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

    // Parse filters from query params
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

    // Fetch data
    const data = await getExportData(filters);

    // Generate CSV
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

    const csv = generateCSV(csvHeaders, rows);
    const csvWithBom = addBOM(csv);
    const filename = generateFilename("citas");

    // Log audit trail
    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "export",
      entity: "appointment",
      details: `Exportadas ${data.appointments.length} citas`,
    });

    // Return CSV file
    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    return handleApiError(error, path);
  }
}
