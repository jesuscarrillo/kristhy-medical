import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { ImageUploader } from "@/components/patients/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ImageIcon,
  UploadCloud,
  Eye,
  Calendar
} from "lucide-react";

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

  const patientId = resolvedParams.id;
  const isFemale = patient.gender === "female";

  const tabs = [
    { label: "Resumen", href: `/dashboard/pacientes/${patientId}`, active: false },
    { label: "Historial Clínico", href: `/dashboard/pacientes/${patientId}/historial`, active: false },
    { label: "Imágenes", href: `/dashboard/pacientes/${patientId}/imagenes`, active: true },
    { label: "Prescripciones", href: `/dashboard/pacientes/${patientId}/prescripciones`, active: false },
    ...(isFemale ? [
      { label: "Ecografías", href: `/dashboard/pacientes/${patientId}/ecografias`, active: false }
    ] : []),
    { label: "Certificados", href: `/dashboard/pacientes/${patientId}/certificados`, active: false },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div>
        <Button asChild variant="ghost" className="pl-0 text-slate-500 hover:text-primary">
          <Link href={`/dashboard/pacientes/${patientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al paciente
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Imágenes Médicas</h1>
        <p className="mt-1 text-slate-500">
          {patient.firstName} {patient.lastName}
        </p>
      </div>

      {/* Navigation Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`
                whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors
                ${tab.active
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}
              `}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Galería de Archivos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patient.images.length === 0 ? (
              <Card className="col-span-full border-dashed bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-slate-100 p-4 mb-4">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-base font-medium text-slate-600">No hay imágenes cargadas</p>
                  <p className="text-sm text-slate-400 mt-1 max-w-xs">Sube archivos como radiografías, resultados de laboratorio u otros documentos visuales.</p>
                </CardContent>
              </Card>
            ) : (
              patient.images.map((image) => (
                <a
                  key={image.id}
                  href={image.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    {/* Placeholder or actual preview if possible. For now generic icon or maybe if logic allows detection */}
                    <ImageIcon className="h-10 w-10 text-slate-300 group-hover:scale-110 transition-transform" />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white flex items-center font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <Eye className="mr-2 h-4 w-4" /> Ver
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-800 truncate" title={image.fileName}>{image.fileName}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="uppercase tracking-wider font-medium bg-slate-100 px-2 py-0.5 rounded">{image.fileType.split('/')[1] || 'FILE'}</span>
                      <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(image.date).toLocaleDateString("es-VE")}</span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 shadow-lg shadow-slate-200/50 border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-base">
                <UploadCloud className="h-5 w-5 text-primary" />
                Subir Imagen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ImageUploader patientId={resolvedParams.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
