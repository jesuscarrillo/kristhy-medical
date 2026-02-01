"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type GynecologicalFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  prefix?: string;
};

export function GynecologicalFields({
  register,
  errors,
  prefix = "measurements.",
}: GynecologicalFieldsProps) {
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
      {/* Útero */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Útero</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("uteroLongitud")}>Longitud (mm)</Label>
            <Input
              id={fieldName("uteroLongitud")}
              type="number"
              step="0.1"
              min="0"
              max="200"
              placeholder="0"
              {...register(fieldName("uteroLongitud"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("uteroAnteroPosterior")}>Antero-posterior (mm)</Label>
            <Input
              id={fieldName("uteroAnteroPosterior")}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0"
              {...register(fieldName("uteroAnteroPosterior"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("uteroTransverso")}>Transverso (mm)</Label>
            <Input
              id={fieldName("uteroTransverso")}
              type="number"
              step="0.1"
              min="0"
              max="150"
              placeholder="0"
              {...register(fieldName("uteroTransverso"))}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("uteroPosicion")}>Posición</Label>
            <select
              id={fieldName("uteroPosicion")}
              {...register(fieldName("uteroPosicion"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="anteversión">Anteversión</option>
              <option value="retroversión">Retroversión</option>
              <option value="intermedia">Intermedia</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("uteroContorno")}>Contorno</Label>
            <select
              id={fieldName("uteroContorno")}
              {...register(fieldName("uteroContorno"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("uteroEcogenicidad")}>Ecogenicidad</Label>
            <select
              id={fieldName("uteroEcogenicidad")}
              {...register(fieldName("uteroEcogenicidad"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="homogénea">Homogénea</option>
              <option value="heterogénea">Heterogénea</option>
            </select>
          </div>
        </div>
      </div>

      {/* Endometrio */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Endometrio</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("endometrioGrosor")}>Grosor (mm)</Label>
            <Input
              id={fieldName("endometrioGrosor")}
              type="number"
              step="0.1"
              min="0"
              max="30"
              placeholder="0"
              {...register(fieldName("endometrioGrosor"))}
            />
            <p className="text-xs text-slate-500">Medir en línea central</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("endometrioCaracteristicas")}>Características</Label>
            <select
              id={fieldName("endometrioCaracteristicas")}
              {...register(fieldName("endometrioCaracteristicas"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="proliferativo">Proliferativo</option>
              <option value="secretor">Secretor</option>
              <option value="atrófico">Atrófico</option>
              <option value="engrosado">Engrosado</option>
              <option value="irregular">Irregular</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("endometrioLinea")}>Línea endometrial</Label>
            <select
              id={fieldName("endometrioLinea")}
              {...register(fieldName("endometrioLinea"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="central">Central</option>
              <option value="desplazada">Desplazada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ovario Derecho */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Ovario Derecho</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioDerechoLongitud")}>Longitud (mm)</Label>
            <Input
              id={fieldName("ovarioDerechoLongitud")}
              type="number"
              step="0.1"
              min="0"
              max="80"
              placeholder="0"
              {...register(fieldName("ovarioDerechoLongitud"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioDerechoAnteroPosterior")}>AP (mm)</Label>
            <Input
              id={fieldName("ovarioDerechoAnteroPosterior")}
              type="number"
              step="0.1"
              min="0"
              max="50"
              placeholder="0"
              {...register(fieldName("ovarioDerechoAnteroPosterior"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioDerechoTransverso")}>Transverso (mm)</Label>
            <Input
              id={fieldName("ovarioDerechoTransverso")}
              type="number"
              step="0.1"
              min="0"
              max="50"
              placeholder="0"
              {...register(fieldName("ovarioDerechoTransverso"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioDerechoVolumen")}>Volumen (ml)</Label>
            <Input
              id={fieldName("ovarioDerechoVolumen")}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0"
              {...register(fieldName("ovarioDerechoVolumen"))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldName("ovarioDerechoCaracteristicas")}>Características</Label>
          <Textarea
            id={fieldName("ovarioDerechoCaracteristicas")}
            rows={2}
            placeholder="Folículos, quistes, masas, etc."
            {...register(fieldName("ovarioDerechoCaracteristicas"))}
          />
        </div>
      </div>

      {/* Ovario Izquierdo */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Ovario Izquierdo</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioIzquierdoLongitud")}>Longitud (mm)</Label>
            <Input
              id={fieldName("ovarioIzquierdoLongitud")}
              type="number"
              step="0.1"
              min="0"
              max="80"
              placeholder="0"
              {...register(fieldName("ovarioIzquierdoLongitud"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioIzquierdoAnteroPosterior")}>AP (mm)</Label>
            <Input
              id={fieldName("ovarioIzquierdoAnteroPosterior")}
              type="number"
              step="0.1"
              min="0"
              max="50"
              placeholder="0"
              {...register(fieldName("ovarioIzquierdoAnteroPosterior"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioIzquierdoTransverso")}>Transverso (mm)</Label>
            <Input
              id={fieldName("ovarioIzquierdoTransverso")}
              type="number"
              step="0.1"
              min="0"
              max="50"
              placeholder="0"
              {...register(fieldName("ovarioIzquierdoTransverso"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ovarioIzquierdoVolumen")}>Volumen (ml)</Label>
            <Input
              id={fieldName("ovarioIzquierdoVolumen")}
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0"
              {...register(fieldName("ovarioIzquierdoVolumen"))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldName("ovarioIzquierdoCaracteristicas")}>Características</Label>
          <Textarea
            id={fieldName("ovarioIzquierdoCaracteristicas")}
            rows={2}
            placeholder="Folículos, quistes, masas, etc."
            {...register(fieldName("ovarioIzquierdoCaracteristicas"))}
          />
        </div>
      </div>

      {/* Fondo de Saco de Douglas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Fondo de Saco de Douglas</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={fieldName("douglasLibre")}>Estado</Label>
            <select
              id={fieldName("douglasLibre")}
              {...register(fieldName("douglasLibre"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="libre">Libre</option>
              <option value="con_liquido">Con líquido libre</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("douglasCantidad")}>Cantidad/Descripción</Label>
            <Input
              id={fieldName("douglasCantidad")}
              placeholder="Ej: Escasa cantidad de líquido"
              {...register(fieldName("douglasCantidad"))}
            />
          </div>
        </div>
      </div>

      {/* DIU */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">DIU (si aplica)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <input
              id={fieldName("diuPresente")}
              type="checkbox"
              {...register(fieldName("diuPresente"))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={fieldName("diuPresente")} className="font-normal">
              DIU presente
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("diuPosicion")}>Posición del DIU</Label>
            <select
              id={fieldName("diuPosicion")}
              {...register(fieldName("diuPosicion"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="normoinserto">Normoinserto</option>
              <option value="bajo">Bajo/Descendido</option>
              <option value="expulsado">Expulsado</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
