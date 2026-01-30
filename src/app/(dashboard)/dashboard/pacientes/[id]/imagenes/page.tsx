import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { ImageUploader } from "@/components/patients/ImageUploader";
import { Button } from "@/components/ui/button";

type PatientImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientImagesPage({ params }: PatientImagesPageProps) {
  const resolvedParams = await params;
  let patient;
  try {
    patient = await getPatient(resolvedParams.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Imágenes médicas</h1>
          <p className="text-sm text-slate-600">
            {patient.firstName} {patient.lastName}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/pacientes/${resolvedParams.id}`}>Volver</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Subir archivo</h2>
          <div className="mt-4">
            <ImageUploader patientId={resolvedParams.id} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Archivos</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {patient.images.length === 0 ? (
              <p>No hay archivos cargados.</p>
            ) : (
              patient.images.map((image) => (
                <a
                  key={image.id}
                  href={image.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-slate-200 p-3 transition hover:border-slate-300"
                >
                  <div className="font-medium text-slate-800">{image.fileName}</div>
                  <div className="text-xs text-slate-500">
                    {image.fileType} ·{" "}
                    {new Date(image.date).toLocaleDateString("es-VE")}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
