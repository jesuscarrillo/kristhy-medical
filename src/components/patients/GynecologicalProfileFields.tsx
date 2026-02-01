"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type GynecologicalProfileFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

export function GynecologicalProfileFields({
  register,
  errors,
}: GynecologicalProfileFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Antecedentes Obstétricos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Antecedentes Obstétricos</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="gestas">Gestas</Label>
            <Input
              id="gestas"
              type="number"
              min="0"
              placeholder="0"
              {...register("gestas")}
            />
            {errors.gestas ? (
              <p className="text-xs text-red-600">{String(errors.gestas.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="partos">Partos</Label>
            <Input
              id="partos"
              type="number"
              min="0"
              placeholder="0"
              {...register("partos")}
            />
            {errors.partos ? (
              <p className="text-xs text-red-600">{String(errors.partos.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cesareas">Cesáreas</Label>
            <Input
              id="cesareas"
              type="number"
              min="0"
              placeholder="0"
              {...register("cesareas")}
            />
            {errors.cesareas ? (
              <p className="text-xs text-red-600">{String(errors.cesareas.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="abortos">Abortos</Label>
            <Input
              id="abortos"
              type="number"
              min="0"
              placeholder="0"
              {...register("abortos")}
            />
            {errors.abortos ? (
              <p className="text-xs text-red-600">{String(errors.abortos.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ectopicos">Ectópicos</Label>
            <Input
              id="ectopicos"
              type="number"
              min="0"
              placeholder="0"
              {...register("ectopicos")}
            />
            {errors.ectopicos ? (
              <p className="text-xs text-red-600">{String(errors.ectopicos.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="molas">Molas</Label>
            <Input
              id="molas"
              type="number"
              min="0"
              placeholder="0"
              {...register("molas")}
            />
            {errors.molas ? (
              <p className="text-xs text-red-600">{String(errors.molas.message)}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="parity">Fórmula Obstétrica (ej: G3P2A1)</Label>
          <Input
            id="parity"
            placeholder="G3P2A1"
            {...register("parity")}
          />
          {errors.parity ? (
            <p className="text-xs text-red-600">{String(errors.parity.message)}</p>
          ) : null}
        </div>
      </div>

      {/* Ciclos Menstruales */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ciclos Menstruales</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="menstrualCycleDays">Cada cuántos días (ciclo)</Label>
            <Input
              id="menstrualCycleDays"
              type="number"
              min="21"
              max="45"
              placeholder="28"
              {...register("menstrualCycleDays")}
            />
            <p className="text-xs text-slate-500">Duración del ciclo menstrual (días)</p>
            {errors.menstrualCycleDays ? (
              <p className="text-xs text-red-600">{String(errors.menstrualCycleDays.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="menstrualDuration">Cuántos días dura</Label>
            <Input
              id="menstrualDuration"
              type="number"
              min="1"
              max="10"
              placeholder="5"
              {...register("menstrualDuration")}
            />
            <p className="text-xs text-slate-500">Duración del sangrado (días)</p>
            {errors.menstrualDuration ? (
              <p className="text-xs text-red-600">{String(errors.menstrualDuration.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="menstrualPain">Dolor menstrual</Label>
            <select
              id="menstrualPain"
              {...register("menstrualPain")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecciona</option>
              <option value="none">Ninguno</option>
              <option value="mild">Leve</option>
              <option value="moderate">Moderado</option>
              <option value="severe">Severo</option>
            </select>
            {errors.menstrualPain ? (
              <p className="text-xs text-red-600">{String(errors.menstrualPain.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastMenstrualPeriod">Fecha Última Menstruación (FUM)</Label>
            <Input
              id="lastMenstrualPeriod"
              type="date"
              {...register("lastMenstrualPeriod")}
            />
            {errors.lastMenstrualPeriod ? (
              <p className="text-xs text-red-600">{String(errors.lastMenstrualPeriod.message)}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="menopause"
            type="checkbox"
            {...register("menopause")}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="menopause" className="font-normal">¿En menopausia?</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="menopauseAge">Edad de menopausia (si aplica)</Label>
          <Input
            id="menopauseAge"
            type="number"
            min="35"
            max="60"
            placeholder="50"
            {...register("menopauseAge")}
          />
          {errors.menopauseAge ? (
            <p className="text-xs text-red-600">{String(errors.menopauseAge.message)}</p>
          ) : null}
        </div>
      </div>

      {/* Información Sexual y Reproductiva */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Sexual y Reproductiva</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="menarche">Menarquia (edad)</Label>
            <Input
              id="menarche"
              type="number"
              min="8"
              max="20"
              placeholder="12"
              {...register("menarche")}
            />
            <p className="text-xs text-slate-500">Edad de primera menstruación</p>
            {errors.menarche ? (
              <p className="text-xs text-red-600">{String(errors.menarche.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexarche">Sexarquia (edad)</Label>
            <Input
              id="sexarche"
              type="number"
              min="10"
              max="50"
              placeholder="18"
              {...register("sexarche")}
            />
            <p className="text-xs text-slate-500">Edad de primera relación sexual</p>
            {errors.sexarche ? (
              <p className="text-xs text-red-600">{String(errors.sexarche.message)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfPartners">Número de parejas sexuales</Label>
            <Input
              id="numberOfPartners"
              type="number"
              min="0"
              max="100"
              placeholder="1"
              {...register("numberOfPartners")}
            />
            {errors.numberOfPartners ? (
              <p className="text-xs text-red-600">{String(errors.numberOfPartners.message)}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <Label>¿Sexualmente activa?</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="true"
                  {...register("sexuallyActive")}
                  className="h-4 w-4"
                />
                <span>Sí</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="false"
                  {...register("sexuallyActive")}
                  className="h-4 w-4"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contraceptiveMethod">Método anticonceptivo actual</Label>
          <Textarea
            id="contraceptiveMethod"
            rows={2}
            placeholder="Describe el método anticonceptivo utilizado"
            {...register("contraceptiveMethod")}
          />
          {errors.contraceptiveMethod ? (
            <p className="text-xs text-red-600">{String(errors.contraceptiveMethod.message)}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gynProfileNotes">Notas adicionales</Label>
          <Textarea
            id="gynProfileNotes"
            rows={4}
            placeholder="Información adicional relevante"
            {...register("gynProfileNotes")}
          />
          {errors.gynProfileNotes ? (
            <p className="text-xs text-red-600">{String(errors.gynProfileNotes.message)}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
