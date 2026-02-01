"use client";

import { Label } from "@/components/ui/label";
import {
  ultrasoundTypeValues,
  ultrasoundTypeLabels,
  validUltrasoundTypes,
  type PregnancyStatus,
  type UltrasoundType,
} from "@/lib/validators/ultrasound";

type UltrasoundTypeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  pregnancyStatus: PregnancyStatus;
  disabled?: boolean;
  error?: string;
};

export function UltrasoundTypeSelector({
  value,
  onChange,
  pregnancyStatus,
  disabled = false,
  error,
}: UltrasoundTypeSelectorProps) {
  const validTypes = validUltrasoundTypes[pregnancyStatus] || [];

  return (
    <div className="space-y-2">
      <Label htmlFor="ultrasoundType">
        Tipo de ecografía <span className="text-red-500">*</span>
      </Label>
      <select
        id="ultrasoundType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Selecciona un tipo</option>
        {ultrasoundTypeValues.map((type) => {
          const isValid = validTypes.includes(type as UltrasoundType);
          return (
            <option key={type} value={type} disabled={!isValid}>
              {ultrasoundTypeLabels[type]}
              {!isValid ? " (no disponible)" : ""}
            </option>
          );
        })}
      </select>
      <p className="text-xs text-slate-500">
        Tipos disponibles según estado de embarazo: {validTypes.map(t => ultrasoundTypeLabels[t]).join(", ")}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
