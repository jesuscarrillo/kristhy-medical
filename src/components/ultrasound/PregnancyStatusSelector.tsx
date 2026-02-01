"use client";

import { Label } from "@/components/ui/label";
import {
  pregnancyStatusValues,
  pregnancyStatusLabels,
} from "@/lib/validators/ultrasound";

type PregnancyStatusSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function PregnancyStatusSelector({
  value,
  onChange,
  disabled = false,
}: PregnancyStatusSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="pregnancyStatus">Estado de embarazo</Label>
      <select
        id="pregnancyStatus"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pregnancyStatusValues.map((status) => (
          <option key={status} value={status}>
            {pregnancyStatusLabels[status]}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500">
        Determina qué tipos de ecografía están disponibles
      </p>
    </div>
  );
}
