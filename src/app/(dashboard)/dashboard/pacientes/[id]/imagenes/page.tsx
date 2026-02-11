import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { ImageUploader } from "@/components/patients/ImageUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientPageHeader } from "@/components/patients/PatientPageHeader";
import {
  ImageIcon,
  UploadCloud,
  Eye,
  Calendar
} from "lucide-react";

type PatientImagesPageProps = {
  params: Promise<{ id: string }>;
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

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-8">
      <PatientPageHeader
        patient={patient}
        patientId={patientId}
        activeTab="imagenes"
      />

      {/* Upload Card - top on mobile, sidebar on desktop */}
      <Card className="shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 lg:hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="flex items-center gap-2 text-base">
            <UploadCloud className="h-5 w-5 text-primary" />
            Subir Imagen
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ImageUploader patientId={resolvedParams.id} />
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Galería de Archivos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patient.images.length === 0 ? (
              <Card className="col-span-full border-dashed bg-slate-50/50 dark:bg-slate-900/30">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-base font-medium text-slate-600 dark:text-slate-300">No hay imágenes cargadas</p>
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
                  className="group relative block overflow-hidden rounded-xl border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 bg-white dark:bg-slate-900/50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:ring-primary/30"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
                    <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white flex items-center font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm text-sm">
                        <Eye className="mr-2 h-4 w-4" /> Ver
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={image.fileName}>{image.fileName}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 uppercase tracking-wider font-medium">
                        {image.fileType.split('/')[1] || 'FILE'}
                      </Badge>
                      <span className="flex items-center font-mono tabular-nums">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(image.date).toLocaleDateString("es-VE")}
                      </span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <Card className="sticky top-24 shadow-sm border-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
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
