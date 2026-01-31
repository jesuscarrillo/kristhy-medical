import { Suspense } from "react";
import Link from "next/link";
import { getReportStats, type ReportFilters } from "@/server/actions/reports";
import { ReportFilters as ReportFiltersComponent } from "@/components/reports/ReportFilters";
import {
  SimpleBarChart,
  MonthlyBarChart,
} from "@/components/reports/SimpleBarChart";
import { Button } from "@/components/ui/button";

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

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
  noshow: "bg-orange-500",
};

const typeColors: Record<string, string> = {
  prenatal: "bg-pink-500",
  gynecology: "bg-purple-500",
  ultrasound: "bg-blue-500",
  followup: "bg-green-500",
};

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number;
  sublabel?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-800">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
}

async function ReportsContent({ filters }: { filters: ReportFilters }) {
  const stats = await getReportStats(filters);

  const hasFilters =
    filters.startDate ||
    filters.endDate ||
    filters.appointmentType ||
    filters.appointmentStatus;

  return (
    <>
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pacientes activos"
          value={stats.overview.activePatients}
          sublabel={`${stats.overview.totalPatients} totales`}
        />
        <StatCard
          label="Citas próximas"
          value={stats.overview.upcomingAppointments}
          sublabel="Programadas"
        />
        <StatCard
          label="Citas completadas"
          value={stats.overview.completedAppointments}
          sublabel={`${stats.overview.totalAppointments} totales`}
        />
        <StatCard
          label="Historiales médicos"
          value={stats.overview.totalMedicalRecords}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly trend */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <MonthlyBarChart
            data={stats.appointmentsByMonth}
            title="Citas por mes (últimos 12 meses)"
          />
        </div>

        {/* By type */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SimpleBarChart
            data={stats.appointmentsByType.map((item) => ({
              label: typeLabels[item.type] || item.type,
              value: item.count,
              color: typeColors[item.type],
            }))}
            title="Citas por tipo"
          />
        </div>

        {/* By status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SimpleBarChart
            data={stats.appointmentsByStatus.map((item) => ({
              label: statusLabels[item.status] || item.status,
              value: item.count,
              color: statusColors[item.status],
            }))}
            title="Citas por estado"
          />
        </div>

        {/* By gender */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SimpleBarChart
            data={stats.patientsByGender.map((item) => ({
              label: genderLabels[item.gender] || item.gender,
              value: item.count,
            }))}
            title="Pacientes por género"
          />
        </div>
      </div>

      {/* Recent appointments table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-sm font-medium text-slate-700">
            {hasFilters ? "Citas filtradas" : "Citas recientes"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-5 py-3 font-medium text-slate-600">Fecha</th>
                <th className="px-5 py-3 font-medium text-slate-600">
                  Paciente
                </th>
                <th className="px-5 py-3 font-medium text-slate-600">Tipo</th>
                <th className="px-5 py-3 font-medium text-slate-600">Estado</th>
                <th className="px-5 py-3 font-medium text-slate-600"></th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No hay citas para mostrar
                  </td>
                </tr>
              ) : (
                stats.recentAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-3 text-slate-800">
                      {new Date(apt.date).toLocaleDateString("es-VE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 text-slate-800">
                      {apt.patientName}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                          apt.type === "prenatal"
                            ? "bg-pink-100 text-pink-800"
                            : apt.type === "gynecology"
                              ? "bg-purple-100 text-purple-800"
                              : apt.type === "ultrasound"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {typeLabels[apt.type] || apt.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                          apt.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : apt.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : apt.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {statusLabels[apt.status] || apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/citas/${apt.id}`}
                        className="text-blue-600 hover:underline"
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
      </div>
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

  // Build export URL with current filters
  const exportParams = new URLSearchParams();
  if (params.startDate) exportParams.set("startDate", params.startDate);
  if (params.endDate) exportParams.set("endDate", params.endDate);
  if (params.type) exportParams.set("type", params.type);
  if (params.status) exportParams.set("status", params.status);
  const exportUrl = `/api/reports/export?${exportParams.toString()}`;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reportes</h1>
          <p className="text-sm text-slate-600">
            Estadísticas y análisis del consultorio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={exportUrl} download>
              Exportar CSV
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-slate-100" />}>
          <ReportFiltersComponent />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl bg-slate-100"
                />
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
