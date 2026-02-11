import { Suspense } from "react";
import Link from "next/link";
import { getAppointments } from "@/server/actions/appointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

type AppointmentsPageProps = {
  searchParams?: Promise<{
    status?: string;
    page?: string;
  }>;
};

const STATUS_FILTERS = [
  { key: "all", label: "Todas" },
  { key: "scheduled", label: "Programadas" },
  { key: "completed", label: "Completadas" },
  { key: "cancelled", label: "Canceladas" },
] as const;

const TYPE_STYLES: Record<string, { border: string; badge: string }> = {
  prenatal: {
    border: "border-l-pink-400",
    badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  },
  gynecology: {
    border: "border-l-purple-400",
    badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  ultrasound: {
    border: "border-l-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  followup: {
    border: "border-l-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
};

const STATUS_BADGES: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  noshow: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
};

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const resolvedParams = await searchParams;
  const status = resolvedParams?.status;
  const currentStatus = status === "all" ? undefined : (status ?? "scheduled");
  const page = parseInt(resolvedParams?.page || "1");

  const buildUrl = (newStatus?: string, newPage?: number) => {
    const params = new URLSearchParams();
    const s = newStatus ?? (status ?? "scheduled");
    const p = newPage ?? page;
    if (s && s !== "all") params.set("status", s);
    if (s === "all") params.set("status", "all");
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `?${qs}` : "/dashboard/citas";
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Citas</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Administra las citas y consultas programadas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="shadow-sm hover:shadow-md transition-all">
            <Link href="/dashboard/citas/calendario">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendario
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            <Link href="/dashboard/citas/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nueva cita
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = filter.key === "all"
            ? status === "all"
            : currentStatus === filter.key;
          return (
            <Button
              key={filter.key}
              asChild
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={isActive ? "" : "hover:bg-slate-50 dark:hover:bg-slate-800"}
            >
              <Link href={buildUrl(filter.key, 1)}>{filter.label}</Link>
            </Button>
          );
        })}
      </div>

      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsContent
          currentStatus={currentStatus}
          status={status}
          page={page}
          buildUrl={buildUrl}
        />
      </Suspense>
    </div>
  );
}

async function AppointmentsContent({
  currentStatus,
  status,
  page,
  buildUrl,
}: {
  currentStatus?: string;
  status?: string;
  page: number;
  buildUrl: (newStatus?: string, newPage?: number) => string;
}) {
  const { appointments, total, totalPages } = await getAppointments({ status: currentStatus, page });

  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {total} cita{total !== 1 ? "s" : ""} en total
      </p>

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <Card className="border-dashed bg-slate-50/50 dark:bg-slate-900/30">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-base font-medium text-slate-600 dark:text-slate-300">No hay citas</p>
              <p className="text-sm text-slate-400 mt-1">
                No hay citas {status ? `con estado "${formatAppointmentStatus(status)}"` : "programadas"}.
              </p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => {
            const typeStyle = TYPE_STYLES[appointment.type] || { border: "border-l-slate-300", badge: "" };
            const statusBadge = STATUS_BADGES[appointment.status] || "";
            return (
              <Link
                key={appointment.id}
                href={`/dashboard/citas/${appointment.id}`}
                className="group block"
              >
                <Card className={`border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 ${typeStyle.border} transition-all hover:shadow-md hover:ring-primary/30`}>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      {/* Time Block */}
                      <div className="flex h-14 w-16 flex-col items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800/50 shrink-0">
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none tabular-nums">
                          {new Date(appointment.date).toLocaleTimeString("es-VE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                          {new Date(appointment.date).toLocaleDateString("es-VE", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${typeStyle.badge}`}>
                            {formatAppointmentType(appointment.type)}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${statusBadge}`}>
                            {formatAppointmentStatus(appointment.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
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
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Link>
          </Button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 tabular-nums">
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
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-l-4 border-l-slate-200 dark:border-l-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatAppointmentType(type: string) {
  switch (type) {
    case "prenatal": return "Prenatal";
    case "gynecology": return "Ginecología";
    case "ultrasound": return "Ecografía";
    case "followup": return "Control";
    default: return type;
  }
}

function formatAppointmentStatus(status: string) {
  switch (status) {
    case "scheduled": return "Programada";
    case "completed": return "Completada";
    case "cancelled": return "Cancelada";
    case "noshow": return "No asistió";
    default: return status;
  }
}
