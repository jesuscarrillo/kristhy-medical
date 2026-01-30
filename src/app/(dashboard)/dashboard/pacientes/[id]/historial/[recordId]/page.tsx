import Link from "next/link";
import { notFound } from "next/navigation";
import { getMedicalRecord } from "@/server/actions/medicalRecord";
import { Button } from "@/components/ui/button";
import { DeleteRecordButton } from "./DeleteRecordButton";

type MedicalRecordDetailPageProps = {
  params: Promise<{
    id: string;
    recordId: string;
  }>;
};

const consultationTypeLabels: Record<string, string> = {
  prenatal: "Prenatal",
  gynecology: "Ginecología",
  emergency: "Emergencia",
  followup: "Control",
};

function DetailSection({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="whitespace-pre-wrap text-sm text-slate-800">{value}</p>
    </div>
  );
}

export default async function MedicalRecordDetailPage({
  params,
}: MedicalRecordDetailPageProps) {
  const { id: patientId, recordId } = await params;

  let record;
  try {
    record = await getMedicalRecord(recordId);
  } catch {
    notFound();
  }

  if (record.patientId !== patientId) {
    notFound();
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleString("es-VE", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detalle del registro</h1>
          <p className="text-sm text-slate-600">
            {record.patient.firstName} {record.patient.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/pacientes/${patientId}/historial`}>
              Volver
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`/dashboard/pacientes/${patientId}/historial/${recordId}/editar`}
            >
              Editar
            </Link>
          </Button>
          <DeleteRecordButton recordId={recordId} patientId={patientId} />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {consultationTypeLabels[record.consultationType] ||
                record.consultationType}
            </span>
          </div>
          <p className="text-sm text-slate-500">{formatDate(record.date)}</p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <DetailSection
              label="Motivo de consulta"
              value={record.chiefComplaint}
            />
            <DetailSection label="Síntomas" value={record.symptoms} />
            <DetailSection label="Signos vitales" value={record.vitalSigns} />
            <DetailSection label="Examen físico" value={record.physicalExam} />
            <DetailSection label="Diagnóstico" value={record.diagnosis} />
            <DetailSection label="Tratamiento" value={record.treatment} />
            <DetailSection
              label="Plan de tratamiento"
              value={record.treatmentPlan}
            />
          </div>

          <div className="space-y-6">
            <DetailSection
              label="Antecedentes personales"
              value={record.personalHistory}
            />
            <DetailSection
              label="Antecedentes ginecológicos"
              value={record.gynecologicHistory}
            />
            <DetailSection
              label="Antecedentes obstétricos"
              value={record.obstetricalHistory}
            />
            {record.followUpDate && (
              <DetailSection
                label="Fecha de seguimiento"
                value={formatDate(record.followUpDate)}
              />
            )}
            <DetailSection label="Notas" value={record.notes} />
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Creado: {formatDate(record.createdAt)} | Actualizado:{" "}
            {formatDate(record.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
