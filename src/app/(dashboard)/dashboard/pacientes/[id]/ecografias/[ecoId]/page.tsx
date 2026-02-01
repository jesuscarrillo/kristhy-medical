import Link from "next/link";
import { notFound } from "next/navigation";
import { getUltrasound } from "@/server/actions/ultrasound";
import { decrypt } from "@/lib/utils/encryption";
import { Button } from "@/components/ui/button";
import { UltrasoundImageUploader } from "@/components/ultrasound";
import { ultrasoundTypeLabels, pregnancyStatusLabels } from "@/lib/validators/ultrasound";
import { DeleteUltrasoundButton } from "./DeleteUltrasoundButton";

type UltrasoundDetailPageProps = {
  params: Promise<{
    id: string;
    ecoId: string;
  }>;
};

export default async function UltrasoundDetailPage({
  params,
}: UltrasoundDetailPageProps) {
  const { id: patientId, ecoId } = await params;

  let ultrasound;
  try {
    ultrasound = await getUltrasound(ecoId);
  } catch {
    notFound();
  }

  if (ultrasound.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(ultrasound.patient.cedula);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      dateStyle: "long",
    });
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("es-VE", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const m = (ultrasound.measurements as Record<string, any>) || {};

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Ecografía</h1>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
              {ultrasoundTypeLabels[ultrasound.type]}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {ultrasound.patient.firstName} {ultrasound.patient.lastName} •{" "}
            {patientCedula}
          </p>
          <p className="text-xs text-slate-500">
            {formatDateTime(ultrasound.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias`}>
              Volver
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/ecografias/${ecoId}/editar`}>
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/pacientes/${patientId}/ecografias/${ecoId}/imprimir`} target="_blank">
              Imprimir
            </Link>
          </Button>
          <DeleteUltrasoundButton
            ultrasoundId={ecoId}
            patientId={patientId}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-medium">Datos del Paciente</h2>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="text-slate-500">Estado de embarazo:</span>{" "}
                <span className="font-medium">
                  {pregnancyStatusLabels[ultrasound.patient.pregnancyStatus]}
                </span>
              </div>
              {ultrasound.gestationalAge && (
                <div>
                  <span className="text-slate-500">Edad gestacional:</span>{" "}
                  <span className="font-medium">{ultrasound.gestationalAge}</span>
                </div>
              )}
              {ultrasound.lastMenstrualPeriod && (
                <div>
                  <span className="text-slate-500">FUM:</span>{" "}
                  <span className="font-medium">
                    {formatDate(ultrasound.lastMenstrualPeriod)}
                  </span>
                </div>
              )}
              {ultrasound.estimatedDueDate && (
                <div>
                  <span className="text-slate-500">FPP:</span>{" "}
                  <span className="font-medium">
                    {formatDate(ultrasound.estimatedDueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Vital Signs */}
          {(ultrasound.weight || ultrasound.height || ultrasound.bloodPressure) && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-medium">Signos Vitales</h2>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                {ultrasound.weight && (
                  <div>
                    <span className="text-slate-500">Peso:</span>{" "}
                    <span className="font-medium">{ultrasound.weight} kg</span>
                  </div>
                )}
                {ultrasound.height && (
                  <div>
                    <span className="text-slate-500">Talla:</span>{" "}
                    <span className="font-medium">{ultrasound.height} cm</span>
                  </div>
                )}
                {ultrasound.bloodPressure && (
                  <div>
                    <span className="text-slate-500">PA:</span>{" "}
                    <span className="font-medium">{ultrasound.bloodPressure} mmHg</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason for Study */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-medium">Motivo del Estudio</h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {ultrasound.reasonForStudy}
            </p>
          </div>

          {/* Measurements */}
          {Object.keys(m).length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-medium">Mediciones</h2>
              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(m).map(([key, value]) => {
                  if (value === null || value === undefined || value === "") return null;
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <div key={key} className="border-b border-slate-100 pb-2">
                      <span className="text-slate-500">{label}:</span>{" "}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Findings */}
          {ultrasound.otherFindings && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-medium">Otros Hallazgos</h2>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {ultrasound.otherFindings}
              </p>
            </div>
          )}

          {/* Diagnosis */}
          <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-5">
            <h2 className="mb-4 text-lg font-medium text-purple-800">
              Diagnóstico / Conclusiones
            </h2>
            <p className="text-sm text-purple-900 whitespace-pre-wrap">
              {ultrasound.diagnoses}
            </p>
          </div>

          {/* Recommendations */}
          {ultrasound.recommendations && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-medium">Recomendaciones</h2>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {ultrasound.recommendations}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Images */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-medium">Imágenes</h2>
            <UltrasoundImageUploader
              ultrasoundId={ecoId}
              images={ultrasound.images}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
