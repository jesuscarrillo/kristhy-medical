import Link from "next/link";
import { getAppointments } from "@/server/actions/appointment";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

type AppointmentsPageProps = {
  searchParams?: Promise<{
    status?: string;
    page?: string;
  }>;
};

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const resolvedParams = await searchParams;
  const status = resolvedParams?.status; // Default is intentionally undefined unless specified otherwise, but logically we want "scheduled" as initial view if user comes cleanly.
  // Actually, user wants default view to be "scheduled" but also ability to see "all".
  // If status is undefined, we usually show all. To show scheduled by default, resolvedParams.status should default to 'scheduled' only if not provided?
  // But if user clicks 'All', we need a way to represent 'all'.
  // Let's use 'all' string for all, or empty string.

  // Revised approach:
  // If no params, default status = 'scheduled'
  // If params ?status=all, status = undefined (or handle as all)

  const currentStatus = status === "all" ? undefined : (status ?? "scheduled");
  const page = parseInt(resolvedParams?.page || "1");
  const { appointments, total, totalPages } = await getAppointments({ status: currentStatus, page });

  const buildUrl = (newStatus?: string, newPage?: number) => {
    const params = new URLSearchParams();
    // If selecting 'All', we pass 'all' to the URL so that it overrides the default 'scheduled'
    const s = newStatus ?? (status ?? "scheduled");
    const p = newPage ?? page;

    if (s && s !== "all") params.set("status", s);
    if (s === "all") params.set("status", "all"); // explicit all

    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `?${qs}` : "/dashboard/citas";
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Citas</h1>
          <p className="text-sm text-slate-600">
            {total} cita{total !== 1 ? "s" : ""} en total
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/citas/calendario">
              <Calendar className="mr-2 h-4 w-4" />
              Calendario
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/citas/nuevo">Nueva cita</Link>
          </Button>
        </div>
      </div>

      {/* Status filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          asChild
          variant={status === "all" ? "default" : "outline"}
          size="sm"
        >
          <Link href={buildUrl("all", 1)}>Todas</Link>
        </Button>
        <Button
          asChild
          variant={currentStatus === "scheduled" ? "default" : "outline"}
          size="sm"
        >
          <Link href={buildUrl("scheduled", 1)}>Programadas</Link>
        </Button>
        <Button
          asChild
          variant={currentStatus === "completed" ? "default" : "outline"}
          size="sm"
        >
          <Link href={buildUrl("completed", 1)}>Completadas</Link>
        </Button>
        <Button
          asChild
          variant={currentStatus === "cancelled" ? "default" : "outline"}
          size="sm"
        >
          <Link href={buildUrl("cancelled", 1)}>Canceladas</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {appointments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            No hay citas {status ? `con estado "${formatAppointmentStatus(status)}"` : "programadas"}.
          </div>
        ) : (
          appointments.map((appointment) => (
            <Link
              key={appointment.id}
              href={`/dashboard/citas/${appointment.id}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(appointment.date).toLocaleString("es-VE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  {formatAppointmentType(appointment.type)} ·{" "}
                  <span className={getStatusColor(appointment.status)}>
                    {formatAppointmentStatus(appointment.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
          >
            <Link
              href={buildUrl(status, page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          </Button>
          <span className="text-sm text-slate-600">
            Página {page} de {totalPages}
          </span>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link
              href={buildUrl(status, page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function formatAppointmentType(type: string) {
  switch (type) {
    case "prenatal":
      return "Prenatal";
    case "gynecology":
      return "Ginecología";
    case "ultrasound":
      return "Ecografía";
    case "followup":
      return "Control";
    default:
      return type;
  }
}

function formatAppointmentStatus(status: string) {
  switch (status) {
    case "scheduled":
      return "Programada";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    case "noshow":
      return "No asistió";
    default:
      return status;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "scheduled":
      return "text-blue-600";
    case "completed":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    case "noshow":
      return "text-orange-600";
    default:
      return "";
  }
}
