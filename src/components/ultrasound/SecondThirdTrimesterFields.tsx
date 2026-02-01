"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SecondThirdTrimesterFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  prefix?: string;
};

export function SecondThirdTrimesterFields({
  register,
  errors,
  prefix = "measurements.",
}: SecondThirdTrimesterFieldsProps) {
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
      {/* Biometría Fetal */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Biometría Fetal</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor={fieldName("dbp")}>DBP (mm)</Label>
            <Input
              id={fieldName("dbp")}
              type="number"
              step="0.1"
              min="0"
              max="120"
              placeholder="0"
              {...register(fieldName("dbp"))}
            />
            <p className="text-xs text-slate-500">Diámetro biparietal</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("cc")}>CC (mm)</Label>
            <Input
              id={fieldName("cc")}
              type="number"
              step="0.1"
              min="0"
              max="400"
              placeholder="0"
              {...register(fieldName("cc"))}
            />
            <p className="text-xs text-slate-500">Circunferencia cefálica</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ca")}>CA (mm)</Label>
            <Input
              id={fieldName("ca")}
              type="number"
              step="0.1"
              min="0"
              max="450"
              placeholder="0"
              {...register(fieldName("ca"))}
            />
            <p className="text-xs text-slate-500">Circunferencia abdominal</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("lf")}>LF (mm)</Label>
            <Input
              id={fieldName("lf")}
              type="number"
              step="0.1"
              min="0"
              max="90"
              placeholder="0"
              {...register(fieldName("lf"))}
            />
            <p className="text-xs text-slate-500">Longitud femoral</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("pesoFetal")}>Peso fetal estimado (g)</Label>
            <Input
              id={fieldName("pesoFetal")}
              type="number"
              min="0"
              max="6000"
              placeholder="0"
              {...register(fieldName("pesoFetal"))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("fcf")}>FCF (lpm)</Label>
            <Input
              id={fieldName("fcf")}
              type="number"
              min="0"
              max="250"
              placeholder="0"
              {...register(fieldName("fcf"))}
            />
            <p className="text-xs text-slate-500">Normal: 110-160 lpm</p>
          </div>
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
          </div>
        </div>
      </div>

      {/* Posición y Situación Fetal */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Situación Fetal</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("presentacion")}>Presentación</Label>
            <select
              id={fieldName("presentacion")}
              {...register(fieldName("presentacion"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="cefalica">Cefálica</option>
              <option value="podalica">Podálica</option>
              <option value="transversa">Transversa</option>
              <option value="variable">Variable</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("dorsoFetal")}>Dorso fetal</Label>
            <select
              id={fieldName("dorsoFetal")}
              {...register(fieldName("dorsoFetal"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="anterior">Anterior</option>
              <option value="posterior">Posterior</option>
              <option value="lateral_derecho">Lateral derecho</option>
              <option value="lateral_izquierdo">Lateral izquierdo</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("sexoFetal")}>Sexo fetal</Label>
            <select
              id={fieldName("sexoFetal")}
              {...register(fieldName("sexoFetal"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_determinado">No determinado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actividad Fetal */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Actividad Fetal</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor={fieldName("movimientosFetales")}>Movimientos</Label>
            <select
              id={fieldName("movimientosFetales")}
              {...register(fieldName("movimientosFetales"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="presentes">Presentes</option>
              <option value="ausentes">Ausentes</option>
              <option value="disminuidos">Disminuidos</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("tonoFetal")}>Tono fetal</Label>
            <select
              id={fieldName("tonoFetal")}
              {...register(fieldName("tonoFetal"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="normal">Normal</option>
              <option value="disminuido">Disminuido</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("respiracionFetal")}>Respiración</Label>
            <select
              id={fieldName("respiracionFetal")}
              {...register(fieldName("respiracionFetal"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("anatomiaFetal")}>Anatomía fetal</Label>
            <select
              id={fieldName("anatomiaFetal")}
              {...register(fieldName("anatomiaFetal"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="normal">Normal</option>
              <option value="anormal">Anormal</option>
              <option value="limitada">Limitada por posición</option>
            </select>
          </div>
        </div>
      </div>

      {/* Líquido Amniótico */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Líquido Amniótico</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("liquidoAmnioticoTipo")}>Valoración</Label>
            <select
              id={fieldName("liquidoAmnioticoTipo")}
              {...register(fieldName("liquidoAmnioticoTipo"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="normal">Normal</option>
              <option value="oligoamnios">Oligoamnios</option>
              <option value="polihidramnios">Polihidramnios</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("ila")}>ILA (cm)</Label>
            <Input
              id={fieldName("ila")}
              type="number"
              step="0.1"
              min="0"
              max="50"
              placeholder="0"
              {...register(fieldName("ila"))}
            />
            <p className="text-xs text-slate-500">Normal: 5-25 cm</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("bolsilloMayor")}>Bolsillo mayor (cm)</Label>
            <Input
              id={fieldName("bolsilloMayor")}
              type="number"
              step="0.1"
              min="0"
              max="20"
              placeholder="0"
              {...register(fieldName("bolsilloMayor"))}
            />
            <p className="text-xs text-slate-500">Normal: 2-8 cm</p>
          </div>
        </div>
      </div>

      {/* Placenta */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Placenta</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={fieldName("placentaLocalizacion")}>Localización</Label>
            <select
              id={fieldName("placentaLocalizacion")}
              {...register(fieldName("placentaLocalizacion"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="anterior">Anterior</option>
              <option value="posterior">Posterior</option>
              <option value="fúndica">Fúndica</option>
              <option value="lateral_derecha">Lateral derecha</option>
              <option value="lateral_izquierda">Lateral izquierda</option>
              <option value="previa_total">Previa total</option>
              <option value="previa_parcial">Previa parcial</option>
              <option value="marginal">Marginal</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("placentaGrado")}>Grado de madurez</Label>
            <select
              id={fieldName("placentaGrado")}
              {...register(fieldName("placentaGrado"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="0">Grado 0</option>
              <option value="1">Grado I</option>
              <option value="2">Grado II</option>
              <option value="3">Grado III</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("placentaGrosor")}>Grosor (mm)</Label>
            <Input
              id={fieldName("placentaGrosor")}
              type="number"
              step="0.1"
              min="0"
              max="80"
              placeholder="0"
              {...register(fieldName("placentaGrosor"))}
            />
          </div>
        </div>
      </div>

      {/* Cordón Umbilical */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Cordón Umbilical</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={fieldName("cordonVasos")}>Número de vasos</Label>
            <select
              id={fieldName("cordonVasos")}
              {...register(fieldName("cordonVasos"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="3_vasos">3 vasos (normal)</option>
              <option value="2_vasos">2 vasos (arteria única)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldName("insercionCordon")}>Inserción</Label>
            <select
              id={fieldName("insercionCordon")}
              {...register(fieldName("insercionCordon"))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="central">Central</option>
              <option value="paracentral">Paracentral</option>
              <option value="marginal">Marginal</option>
              <option value="velamentosa">Velamentosa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cuello Uterino */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Cuello Uterino</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={fieldName("longitudCervical")}>Longitud cervical (mm)</Label>
            <Input
              id={fieldName("longitudCervical")}
              type="number"
              step="0.1"
              min="0"
              max="60"
              placeholder="0"
              {...register(fieldName("longitudCervical"))}
            />
            <p className="text-xs text-slate-500">Normal: &gt;25mm antes de sem 24</p>
          </div>
        </div>
      </div>
    </div>
  );
}
