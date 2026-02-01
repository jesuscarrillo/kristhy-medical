import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getUltrasounds } from "@/server/actions/ultrasound";
import { Button } from "@/components/ui/button";
import { ultrasoundTypeLabels } from "@/lib/validators/ultrasound";

type UltrasoundsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UltrasoundsPage({ params }: UltrasoundsPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  // Only female patients can have ultrasounds
  if (patient.gender !== "female") {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Ecografías</h1>
            <p className="text-sm text-slate-600">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}`}>Volver</Link>
          </Button>
        </div>
        <div className="mt-8 rounded-lg border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">
            Las ecografías solo están disponibles para pacientes femeninos.
          </p>
        </div>
      </div>
    );
  }

  const ultrasounds = await getUltrasounds(patientId);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ecografías</h1>
          <p className="text-sm text-slate-600">
            {patient.firstName} {patient.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}`}>Volver</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/pacientes/${patientId}/ecografias/nuevo`}>
              Nueva ecografía
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {ultrasounds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              No hay ecografías registradas.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard/pacientes/${patientId}/ecografias/nuevo`}>
                Crear primera ecografía
              </Link>
            </Button>
          </div>
        ) : (
          ultrasounds.map((ultrasound) => (
            <Link
              key={ultrasound.id}
              href={`/dashboard/pacientes/${patientId}/ecografias/${ultrasound.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(ultrasound.date).toLocaleDateString("es-VE", {
                        dateStyle: "long",
                      })}
                    </p>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                      {ultrasoundTypeLabels[ultrasound.type]}
                    </span>
                    {ultrasound._count.images > 0 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {ultrasound._count.images} imagen{ultrasound._count.images > 1 ? "es" : ""}
                      </span>
                    )}
                  </div>
                  {ultrasound.gestationalAge && (
                    <p className="mt-1 text-sm text-slate-500">
                      EG: {ultrasound.gestationalAge}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {ultrasound.diagnoses}
                  </p>
                </div>
                <span className="text-xs text-slate-400">Ver →</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
