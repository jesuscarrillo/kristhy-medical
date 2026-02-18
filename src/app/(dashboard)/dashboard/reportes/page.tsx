import { Suspense } from "react";
import Link from "next/link";
import { getReportStats, type ReportFilters } from "@/server/actions/reports";
import { ReportFilters as ReportFiltersComponent } from "@/components/reports/ReportFilters";
import {
  SimpleBarChart,
  MonthlyBarChart,
} from "@/components/reports/SimpleBarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Users,
  CalendarClock,
  CalendarCheck,
  FileText,
} from "lucide-react";

type ReportsPageProps = {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
  }>;
};

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

const genderLabels: Record<string, string> = {
  female: "Femenino",
  male: "Masculino",
  other: "Otro",
};

const typeColors: Record<string, string> = {
  prenatal: "bg-pink-500",
  gynecology: "bg-purple-500",
  ultrasound: "bg-blue-500",
  followup: "bg-green-500",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
  noshow: "bg-orange-500",
};

const STAT_CONFIGS = [
  { key: "activePatients", label: "Pacientes activos", icon: Users, color: "teal", borderColor: "border-t-teal-500" },
  { key: "upcomingAppointments", label: "Citas próximas", icon: CalendarClock, color: "blue", borderColor: "border-t-blue-500" },
  { key: "completedAppointments", label: "Citas completadas", icon: CalendarCheck, color: "emerald", borderColor: "border-t-emerald-500" },
  { key: "totalMedicalRecords", label: "Historiales médicos", icon: FileText, color: "amber", borderColor: "border-t-amber-500" },
] as const;

const STAT_ICON_STYLES: Record<string, string> = {
  teal: "bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 dark:from-teal-900/30 dark:to-teal-800/20 dark:text-teal-400",
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-900/30 dark:to-blue-800/20 dark:text-blue-400",
  emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:text-emerald-400",
  amber: "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 dark:from-amber-900/30 dark:to-amber-800/20 dark:text-amber-400",
};

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  borderColor,
  iconStyle,
}: {
  label: string;
  value: number;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  borderColor: string;
  iconStyle: string;
}) {
  return (
    <Card className={`border-0 border-t-4 ${borderColor} ring-1 ring-slate-200/50 dark:ring-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{value}</p>
            {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
          </div>
          <div className={`rounded-xl p-2.5 ${iconStyle}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function ReportsContent({ filters }: { filters: ReportFilters }) {
  const stats = await getReportStats(filters);

  const hasFilters =
    filters.startDate ||
    filters.endDate ||
    filters.appointmentType ||
    filters.appointmentStatus;

  const statValues: Record<string, { value: number; sublabel?: string }> = {
    activePatients: { value: stats.overview.activePatients, sublabel: `${stats.overview.totalPatients} totales` },
    upcomingAppointments: { value: stats.overview.upcomingAppointments, sublabel: "Programadas" },
    completedAppointments: { value: stats.overview.completedAppointments, sublabel: `${stats.overview.totalAppointments} totales` },
    totalMedicalRecords: { value: stats.overview.totalMedicalRecords },
  };

  return (
    <>
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CONFIGS.map((cfg) => (
          <StatCard
            key={cfg.key}
            label={cfg.label}
            value={statValues[cfg.key].value}
            sublabel={statValues[cfg.key].sublabel}
            icon={cfg.icon}
            borderColor={cfg.borderColor}
            iconStyle={STAT_ICON_STYLES[cfg.color]}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Citas por mes (últimos 12 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyBarChart data={stats.appointmentsByMonth} />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Citas por tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={stats.appointmentsByType.map((item) => ({
                label: typeLabels[item.type] || item.type,
                value: item.count,
                color: typeColors[item.type],
              }))}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Citas por estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={stats.appointmentsByStatus.map((item) => ({
                label: statusLabels[item.status] || item.status,
                value: item.count,
                color: statusColors[item.status],
              }))}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Pacientes por género
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={stats.patientsByGender.map((item) => ({
                label: genderLabels[item.gender] || item.gender,
                value: item.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent appointments table */}
      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
            {hasFilters ? "Citas filtradas" : "Citas recientes"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 text-left">
                  <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No hay citas para mostrar
                    </td>
                  </tr>
                ) : (
                  stats.recentAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/30"
                    >
                      <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 font-mono text-xs tabular-nums">
                        {new Date(apt.date).toLocaleDateString("es-VE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                        {apt.patientName}
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 ${
                          apt.type === "prenatal"
                            ? "border-pink-200 text-pink-700 bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:bg-pink-900/20"
                            : apt.type === "gynecology"
                              ? "border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-900/20"
                              : apt.type === "ultrasound"
                                ? "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20"
                                : "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/20"
                        }`}>
                          {typeLabels[apt.type] || apt.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 ${
                          apt.status === "completed"
                            ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-900/20"
                            : apt.status === "scheduled"
                              ? "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20"
                              : apt.status === "cancelled"
                                ? "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-900/20"
                                : "border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-900/20"
                        }`}>
                          {statusLabels[apt.status] || apt.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/dashboard/citas/${apt.id}`}
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;

  const filters: ReportFilters = {
    startDate: params.startDate ? new Date(params.startDate) : undefined,
    endDate: params.endDate ? new Date(params.endDate) : undefined,
    appointmentType: params.type || undefined,
    appointmentStatus: params.status || undefined,
  };

  // Build export URLs with current filters
  const patientParams = new URLSearchParams();
  if (params.startDate) patientParams.set("startDate", params.startDate);
  if (params.endDate) patientParams.set("endDate", params.endDate);
  const patientsExportUrl = `/api/v1/patients/export?${patientParams.toString()}`;

  const appointmentParams = new URLSearchParams();
  if (params.startDate) appointmentParams.set("startDate", params.startDate);
  if (params.endDate) appointmentParams.set("endDate", params.endDate);
  if (params.type) appointmentParams.set("type", params.type);
  if (params.status) appointmentParams.set("status", params.status);
  const appointmentsExportUrl = `/api/v1/appointments/export?${appointmentParams.toString()}`;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Reportes
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Estadísticas y análisis del consultorio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
            <a href={patientsExportUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Exportar Pacientes
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
            <a href={appointmentsExportUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Exportar Citas
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-slate-100" />}>
          <ReportFiltersComponent />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(["patients", "upcoming", "completed", "records"] as const).map((id) => (
                <Card key={id} className="border-0 ring-1 ring-slate-200/50 shadow-sm overflow-hidden">
                  <div className="h-1 w-full animate-pulse bg-slate-200" />
                  <CardContent className="p-5">
                    <div className="h-20 animate-pulse rounded bg-slate-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <ReportsContent filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
