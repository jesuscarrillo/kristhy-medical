"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FirstTrimesterFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  prefix?: string;
};

export function FirstTrimesterFields({
  register,
  errors,
  prefix = "measurements.",
}: FirstTrimesterFieldsProps) {
  const fieldName = (name: string) => `${prefix}${name}`;
  const getError = (name: string) => {
    const parts = `${prefix}${name}`.split(".");
    let error: any = errors;
    for (const part of parts) {
      error = error?.[part];
    }
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6">
      {/* Embarazo */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Características del Embarazo</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("numeroFetos")}>Número de fetos</Label>
            <Input
              id={fieldName("numeroFetos")}
              type="number"
              min="1"
              max="5"
              placeholder="1"
              {...register(fieldName("numeroFetos"))}
            />
            {getError("numeroFetos") && (
              <p className="text-xs text-red-600">{getError("numeroFetos")}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("corionicidad")}>Corionicidad (si múltiple)</Label>
            <Input
              id={fieldName("corionicidad")}
              placeholder="Ej: Bicorial biamniótico"
              {...register(fieldName("corionicidad"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("actividadCardiaca")}>Actividad cardíaca</Label>
            <select
              id={fieldName("actividadCardiaca")}
              {...register(fieldName("actividadCardiaca"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saco Gestacional */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Saco Gestacional</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("sacoDiameter")}>Diámetro medio (mm)</Label>
            <Input
              id={fieldName("sacoDiameter")}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0"
              {...register(fieldName("sacoDiameter"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("sacoVitelino")}>Saco vitelino</Label>
            <select
              id={fieldName("sacoVitelino")}
              {...register(fieldName("sacoVitelino"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
              <option value="anormal">Anormal</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("sacoVitelinoDiameter")}>Diámetro saco vitelino (mm)</Label>
            <Input
              id={fieldName("sacoVitelinoDiameter")}
              type="number"
              step="0.1"
              min="0"
              max="20"
              placeholder="0"
              {...register(fieldName("sacoVitelinoDiameter"))}
            />
          </div>
        </div>
      </div>

      {/* Embrión */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Embrión/Feto</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("crl")}>CRL - Longitud cráneo-caudal (mm)</Label>
            <Input
              id={fieldName("crl")}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0"
              {...register(fieldName("crl"))}
            />
            <p className="text-xs text-slate-500">Crown-rump length</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("fcf")}>FCF - Frecuencia cardíaca (lpm)</Label>
            <Input
              id={fieldName("fcf")}
              type="number"
              min="0"
              max="250"
              placeholder="0"
              {...register(fieldName("fcf"))}
            />
            <p className="text-xs text-slate-500">Normal: 120-180 lpm</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("movimientosFetales")}>Movimientos fetales</Label>
            <select
              id={fieldName("movimientosFetales")}
              {...register(fieldName("movimientosFetales"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="presentes">Presentes</option>
              <option value="ausentes">Ausentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Marcadores primer trimestre */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Marcadores del Primer Trimestre</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("translucenciaNucal")}>Translucencia nucal (mm)</Label>
            <Input
              id={fieldName("translucenciaNucal")}
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0"
              {...register(fieldName("translucenciaNucal"))}
            />
            <p className="text-xs text-slate-500">Normal: &lt; 3mm (11-14 sem)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("huesoNasal")}>Hueso nasal</Label>
            <select
              id={fieldName("huesoNasal")}
              {...register(fieldName("huesoNasal"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="visible">Visible</option>
              <option value="no_visible">No visible</option>
              <option value="no_evaluable">No evaluable</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ductusVenoso")}>Ductus venoso</Label>
            <select
              id={fieldName("ductusVenoso")}
              {...register(fieldName("ductusVenoso"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="normal">Normal (onda A positiva)</option>
              <option value="reverso">Reverso (onda A negativa)</option>
              <option value="no_evaluable">No evaluable</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
