import { Suspense } from "react";
import Link from "next/link";
import { getAuditLogs, getAuditStats } from "@/server/actions/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  FileText,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AuditFilters } from "./AuditFilters";
import type { AuditLogFilters, AuditEntity, AuditAction } from "@/server/actions/audit";

interface PageProps {
  searchParams: Promise<{
    entity?: string;
    action?: string;
    page?: string;
  }>;
}

const actionLabels: Record<string, { label: string; badge: string }> = {
  view: { label: "Ver", badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
  create: { label: "Crear", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" },
  update: { label: "Actualizar", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" },
  delete: { label: "Eliminar", badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" },
  export: { label: "Exportar", badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" },
  login: { label: "Iniciar sesión", badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800" },
  logout: { label: "Cerrar sesión", badge: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800" },
};

const entityLabels: Record<string, string> = {
  patient: "Paciente",
  medical_record: "Historial Médico",
  appointment: "Cita",
  prescription: "Prescripción",
  medical_image: "Imagen Médica",
  report: "Reporte",
};

const STAT_CARDS = [
  { key: "total", label: "Total Registros", icon: FileText, color: "border-t-primary" },
  { key: "today", label: "Hoy", icon: Calendar, color: "border-t-blue-500" },
  { key: "week", label: "Esta Semana", icon: Activity, color: "border-t-emerald-500" },
  { key: "topAction", label: "Más Común", icon: Eye, color: "border-t-amber-500" },
] as const;

export default async function AuditPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const filters: AuditLogFilters = {
    entity: params.entity as AuditEntity | undefined,
    action: params.action as AuditAction | undefined,
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Auditoría</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Registro de actividades del sistema.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <AuditFilters
            currentEntity={params.entity}
            currentAction={params.action}
          />
        </CardContent>
      </Card>

      <Suspense fallback={<AuditSkeleton />}>
        <AuditContent filters={filters} page={page} params={params} />
      </Suspense>
    </div>
  );
}

async function AuditContent({
  filters,
  page,
  params,
}: {
  filters: AuditLogFilters;
  page: number;
  params: { entity?: string; action?: string };
}) {
  const [logsData, stats] = await Promise.all([
    getAuditLogs(filters, page),
    getAuditStats(),
  ]);

  const statValues = {
    total: stats.totalLogs,
    today: stats.todayLogs,
    week: stats.weekLogs,
    topAction: stats.byAction[0]
      ? actionLabels[stats.byAction[0].action]?.label || stats.byAction[0].action
      : "—",
  };

  const buildUrl = (newPage: number) => {
    const p = new URLSearchParams();
    if (params.entity) p.set("entity", params.entity);
    if (params.action) p.set("action", params.action);
    if (newPage > 1) p.set("page", String(newPage));
    const qs = p.toString();
    return qs ? `?${qs}` : "/dashboard/auditoria";
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.key} className={`shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-t-4 ${stat.color}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                    <StatIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {statValues[stat.key]}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Logs Table */}
      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Registros de Actividad ({logsData.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                <TableHead className="pl-6 text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Fecha/Hora</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Usuario</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Acción</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Entidad</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">Detalles</TableHead>
                <TableHead className="pr-6 text-xs uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No hay registros de auditoría.
                  </TableCell>
                </TableRow>
              ) : (
                logsData.logs.map((log) => (
                  <TableRow key={log.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/30">
                    <TableCell className="pl-6 whitespace-nowrap font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                      {new Date(log.createdAt).toLocaleString("es-VE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-sm text-slate-600 dark:text-slate-400">
                      {log.userEmail}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-5 ${actionLabels[log.action]?.badge || ""}`}
                      >
                        {actionLabels[log.action]?.label || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                      {entityLabels[log.entity] || log.entity}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-slate-500 dark:text-slate-400">
                      {log.details || "—"}
                    </TableCell>
                    <TableCell className="pr-6 text-xs text-slate-400 dark:text-slate-500 font-mono">
                      {log.ipAddress || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {logsData.totalPages > 1 && (
            <div className="flex items-center justify-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 p-4">
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Link
                    href={buildUrl(page - 1)}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                  Página {page} de {logsData.totalPages}
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={page >= logsData.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <Link
                    href={buildUrl(page + 1)}
                    className={page >= logsData.totalPages ? "pointer-events-none opacity-50" : ""}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function AuditSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 border-t-4 border-t-slate-200 dark:border-t-slate-700">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
