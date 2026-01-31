"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/dashboard/reportes?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/dashboard/reportes");
  };

  const hasFilters = startDate || endDate || type || status;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-xs">
            Desde
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => updateFilters({ startDate: e.target.value })}
            className="h-9 w-40"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="endDate" className="text-xs">
            Hasta
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => updateFilters({ endDate: e.target.value })}
            className="h-9 w-40"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="type" className="text-xs">
            Tipo de cita
          </Label>
          <select
            id="type"
            value={type}
            onChange={(e) => updateFilters({ type: e.target.value })}
            className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos</option>
            <option value="prenatal">Prenatal</option>
            <option value="gynecology">Ginecología</option>
            <option value="ultrasound">Ecografía</option>
            <option value="followup">Control</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="status" className="text-xs">
            Estado
          </Label>
          <select
            id="status"
            value={status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos</option>
            <option value="scheduled">Programada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
            <option value="noshow">No asistió</option>
          </select>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
