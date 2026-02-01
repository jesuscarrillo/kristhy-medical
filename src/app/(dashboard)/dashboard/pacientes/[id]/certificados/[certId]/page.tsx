import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificate } from "@/server/actions/certificate";
import { decrypt } from "@/lib/utils/encryption";
import { Button } from "@/components/ui/button";
import { certificateTypeLabels } from "@/lib/validators/certificate";
import { DeleteCertificateButton } from "./DeleteCertificateButton";

type CertificateDetailPageProps = {
  params: Promise<{
    id: string;
    certId: string;
  }>;
};

export default async function CertificateDetailPage({
  params,
}: CertificateDetailPageProps) {
  const { id: patientId, certId } = await params;

  let certificate;
  try {
    certificate = await getCertificate(certId);
  } catch {
    notFound();
  }

  if (certificate.patientId !== patientId) {
    notFound();
  }

  const patientCedula = decrypt(certificate.patient.cedula);

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

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Certificado</h1>
            <span className={`rounded-full px-3 py-1 text-sm ${
              certificate.type === "REST"
                ? "bg-orange-100 text-orange-800"
                : certificate.type === "PREGNANCY"
                ? "bg-pink-100 text-pink-800"
                : "bg-blue-100 text-blue-800"
            }`}>
              {certificateTypeLabels[certificate.type]}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {certificate.patient.firstName} {certificate.patient.lastName} •{" "}
            {patientCedula}
          </p>
          <p className="text-xs text-slate-500">
            {formatDateTime(certificate.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/certificados`}>
              Volver
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/certificados/${certId}/editar`}>
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/pacientes/${patientId}/certificados/${certId}/imprimir`} target="_blank">
              Imprimir
            </Link>
          </Button>
          <DeleteCertificateButton
            certificateId={certId}
            patientId={patientId}
          />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Title */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-medium">{certificate.title}</h2>
        </div>

        {/* Rest Days Info */}
        {certificate.type === "REST" && certificate.restDays && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <h2 className="mb-3 text-lg font-medium text-orange-800">
              Días de Reposo
            </h2>
            <div className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <span className="text-orange-600">Días:</span>{" "}
                <span className="font-medium text-orange-900">{certificate.restDays}</span>
              </div>
              {certificate.validFrom && (
                <div>
                  <span className="text-orange-600">Desde:</span>{" "}
                  <span className="font-medium text-orange-900">
                    {formatDate(certificate.validFrom)}
                  </span>
                </div>
              )}
              {certificate.validUntil && (
                <div>
                  <span className="text-orange-600">Hasta:</span>{" "}
                  <span className="font-medium text-orange-900">
                    {formatDate(certificate.validUntil)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        {certificate.diagnosis && (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-500">Diagnóstico</h2>
            <p className="text-sm text-slate-700">{certificate.diagnosis}</p>
          </div>
        )}

        {/* Content */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">Contenido</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {certificate.content}
          </p>
        </div>

        {/* Doctor Info */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">Emitido por</h2>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <span className="text-slate-500">Médico:</span>{" "}
              <span className="font-medium">{certificate.issuedBy}</span>
            </div>
            <div>
              <span className="text-slate-500">Licencia:</span>{" "}
              <span className="font-medium">{certificate.licenseNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
