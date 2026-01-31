import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getExportData, type ReportFilters } from "@/server/actions/reports";
import { logAudit } from "@/server/actions/audit";

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateCSV(
  headers: string[],
  rows: (string | null | undefined)[][]
): string {
  const headerRow = headers.map(escapeCSV).join(",");
  const dataRows = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  return `${headerRow}\n${dataRows}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    // Determine what to export based on filters
    const exportType = searchParams.get("export") || "appointments";

    let csv: string;
    let filename: string;

    if (exportType === "patients") {
      const headers = [
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
      csv = generateCSV(headers, rows);
      filename = `pacientes_${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      const headers = [
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
      csv = generateCSV(headers, rows);
      filename = `citas_${new Date().toISOString().split("T")[0]}.csv`;
    }

    // Add BOM for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    const csvWithBom = bom + csv;

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "export",
      entity: "report",
      details: `Tipo: ${exportType}, Registros: ${exportType === "patients" ? data.patients.length : data.appointments.length}`,
    });

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Error al exportar datos" },
      { status: 500 }
    );
  }
}
