"use client";

import { Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface AuditFiltersProps {
  currentEntity?: string;
  currentAction?: string;
}

// Objetos de opciones fuera del componente — referencia estable, sin re-creación
const entities = [
  { value: "patient",        label: "Paciente" },
  { value: "medical_record", label: "Historial Médico" },
  { value: "appointment",    label: "Cita" },
  { value: "prescription",   label: "Prescripción" },
  { value: "medical_image",  label: "Imagen Médica" },
  { value: "report",         label: "Reporte" },
] as const;

const actions = [
  { value: "view",   label: "Ver" },
  { value: "create", label: "Crear" },
  { value: "update", label: "Actualizar" },
  { value: "delete", label: "Eliminar" },
  { value: "export", label: "Exportar" },
] as const;

// Export público: componente auto-contenido con su propio Suspense boundary
export function AuditFilters(props: AuditFiltersProps) {
  return (
    <Suspense fallback={null}>
      <AuditFiltersInner {...props} />
    </Suspense>
  );
}

function AuditFiltersInner({ currentEntity, currentAction }: AuditFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // useTransition: marca router.push() como actualización no urgente
  // React puede interrumpir el render si el usuario sigue interactuando
  // sin bloquear la UI mientras se procesa la navegación
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/dashboard/auditoria");
    });
  };

  const hasFilters = currentEntity ?? currentAction;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Entidad:</span>
        <Select
          value={currentEntity ?? "all"}
          onValueChange={(value) =>
            updateFilter("entity", value === "all" ? null : value)
          }
          disabled={isPending}
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
          value={currentAction ?? "all"}
          onValueChange={(value) =>
            updateFilter("action", value === "all" ? null : value)
          }
          disabled={isPending}
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

      {isPending && (
        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
      )}

      {hasFilters && !isPending && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
