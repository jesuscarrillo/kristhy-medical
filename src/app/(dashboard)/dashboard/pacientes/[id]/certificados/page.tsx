import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/server/actions/patient";
import { getCertificates } from "@/server/actions/certificate";
import { Button } from "@/components/ui/button";
import { certificateTypeLabels } from "@/lib/validators/certificate";

type CertificatesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CertificatesPage({ params }: CertificatesPageProps) {
  const { id: patientId } = await params;

  let patient;
  try {
    patient = await getPatient(patientId);
  } catch {
    notFound();
  }

  const certificates = await getCertificates(patientId);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-VE", {
      dateStyle: "long",
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Certificados Médicos</h1>
          <p className="text-sm text-slate-600">
            {patient.firstName} {patient.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}`}>Volver</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/pacientes/${patientId}/certificados/nuevo`}>
              Nuevo certificado
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {certificates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              No hay certificados registrados.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard/pacientes/${patientId}/certificados/nuevo`}>
                Crear primer certificado
              </Link>
            </Button>
          </div>
        ) : (
          certificates.map((certificate) => (
            <Link
              key={certificate.id}
              href={`/dashboard/pacientes/${patientId}/certificados/${certificate.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-slate-800">
                      {formatDate(certificate.date)}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      certificate.type === "REST"
                        ? "bg-orange-100 text-orange-800"
                        : certificate.type === "PREGNANCY"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {certificateTypeLabels[certificate.type]}
                    </span>
                    {certificate.restDays && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {certificate.restDays} días
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {certificate.title}
                  </p>
                  {certificate.validFrom && certificate.validUntil && (
                    <p className="mt-1 text-xs text-slate-500">
                      Vigencia: {formatDate(certificate.validFrom)} - {formatDate(certificate.validUntil)}
                    </p>
                  )}
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
