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
 * GET /api/v1/patients/export
 *
 * Export patients data as CSV
 *
 * @query startDate - Filter by creation date (ISO 8601)
 * @query endDate - Filter by creation date (ISO 8601)
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
    };

    // Fetch data
    const data = await getExportData(filters);

    // Generate CSV
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

    const csv = generateCSV(csvHeaders, rows);
    const csvWithBom = addBOM(csv);
    const filename = generateFilename("pacientes");

    // Log audit trail
    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "export",
      entity: "patient",
      details: `Exportados ${data.patients.length} pacientes`,
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
