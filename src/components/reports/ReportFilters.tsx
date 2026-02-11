"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Filter, Activity, X } from "lucide-react";

export function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";

  const activeFilterCount = [startDate, endDate, type, status].filter(Boolean).length;

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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="startDate" className="text-xs font-medium flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Desde
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => updateFilters({ startDate: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate" className="text-xs font-medium flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Hasta
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => updateFilters({ endDate: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Tipo de cita
          </Label>
          <Select
            value={type || "all"}
            onValueChange={(value) => updateFilters({ type: value === "all" ? "" : value })}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="prenatal">Prenatal</SelectItem>
              <SelectItem value="gynecology">Ginecología</SelectItem>
              <SelectItem value="ultrasound">Ecografía</SelectItem>
              <SelectItem value="followup">Control</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Activity className="h-3.5 w-3.5" />
            Estado
          </Label>
          <Select
            value={status || "all"}
            onValueChange={(value) => updateFilters({ status: value === "all" ? "" : value })}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="scheduled">Programada</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="noshow">No asistió</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-9 gap-1.5 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-[10px] font-bold">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
