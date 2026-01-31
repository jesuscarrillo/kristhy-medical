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
import { Shield, Eye, FileText, Calendar, Activity } from "lucide-react";
import { AuditFilters } from "./AuditFilters";

interface PageProps {
  searchParams: Promise<{
    entity?: string;
    action?: string;
    page?: string;
  }>;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  view: { label: "Ver", color: "bg-blue-100 text-blue-800" },
  create: { label: "Crear", color: "bg-green-100 text-green-800" },
  update: { label: "Actualizar", color: "bg-yellow-100 text-yellow-800" },
  delete: { label: "Eliminar", color: "bg-red-100 text-red-800" },
  export: { label: "Exportar", color: "bg-purple-100 text-purple-800" },
  login: { label: "Iniciar sesión", color: "bg-cyan-100 text-cyan-800" },
  logout: { label: "Cerrar sesión", color: "bg-gray-100 text-gray-800" },
};

const entityLabels: Record<string, string> = {
  patient: "Paciente",
  medical_record: "Historial Médico",
  appointment: "Cita",
  prescription: "Prescripción",
  medical_image: "Imagen Médica",
  report: "Reporte",
};

export default async function AuditPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const filters = {
    entity: params.entity as
      | "patient"
      | "medical_record"
      | "appointment"
      | "prescription"
      | "medical_image"
      | "report"
      | undefined,
    action: params.action as
      | "view"
      | "create"
      | "update"
      | "delete"
      | "export"
      | "login"
      | "logout"
      | undefined,
  };

  const [logsData, stats] = await Promise.all([
    getAuditLogs(filters, page),
    getAuditStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Auditoría</h1>
          <p className="text-muted-foreground">
            Registro de actividades del sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Registros
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weekLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Acción Más Común
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byAction[0]
                ? actionLabels[stats.byAction[0].action]?.label ||
                  stats.byAction[0].action
                : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditFilters
            currentEntity={params.entity}
            currentAction={params.action}
          />
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Registros de Actividad ({logsData.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData.logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No hay registros de auditoría
                  </TableCell>
                </TableRow>
              ) : (
                logsData.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("es-VE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {log.userEmail}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          actionLabels[log.action]?.color || "bg-gray-100"
                        }
                      >
                        {actionLabels[log.action]?.label || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entityLabels[log.entity] || log.entity}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {log.details || "-"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.ipAddress || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {logsData.totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: logsData.totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, page - 3),
                  Math.min(logsData.totalPages, page + 2)
                )
                .map((p) => (
                  <a
                    key={p}
                    href={`?page=${p}${params.entity ? `&entity=${params.entity}` : ""}${params.action ? `&action=${params.action}` : ""}`}
                    className={`px-3 py-1 rounded ${
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {p}
                  </a>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
