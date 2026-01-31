"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AuditFiltersProps {
  currentEntity?: string;
  currentAction?: string;
}

const entities = [
  { value: "patient", label: "Paciente" },
  { value: "medical_record", label: "Historial Médico" },
  { value: "appointment", label: "Cita" },
  { value: "prescription", label: "Prescripción" },
  { value: "medical_image", label: "Imagen Médica" },
  { value: "report", label: "Reporte" },
];

const actions = [
  { value: "view", label: "Ver" },
  { value: "create", label: "Crear" },
  { value: "update", label: "Actualizar" },
  { value: "delete", label: "Eliminar" },
  { value: "export", label: "Exportar" },
];

export function AuditFilters({
  currentEntity,
  currentAction,
}: AuditFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page when filter changes
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/dashboard/auditoria");
  };

  const hasFilters = currentEntity || currentAction;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Entidad:</span>
        <Select
          value={currentEntity || "all"}
          onValueChange={(value) =>
            updateFilter("entity", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {entities.map((entity) => (
              <SelectItem key={entity.value} value={entity.value}>
                {entity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Acción:</span>
        <Select
          value={currentAction || "all"}
          onValueChange={(value) =>
            updateFilter("action", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {actions.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
