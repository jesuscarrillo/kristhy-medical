import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointment } from "@/server/actions/appointment";
import { Button } from "@/components/ui/button";
import { DeleteAppointmentButton } from "./DeleteAppointmentButton";

type AppointmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AppointmentDetailPage({
  params,
}: AppointmentDetailPageProps) {
  const resolvedParams = await params;
  let appointment;
  try {
    appointment = await getAppointment(resolvedParams.id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {appointment.patient.firstName} {appointment.patient.lastName}
          </h1>
          <p className="text-sm text-slate-600">
            {new Date(appointment.date).toLocaleString("es-VE", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/citas">Volver</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/citas/${resolvedParams.id}/editar`}>Editar</Link>
          </Button>
          <DeleteAppointmentButton
            appointmentId={resolvedParams.id}
            patientName={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Detalle</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">Tipo:</span>{" "}
              {formatAppointmentType(appointment.type)}
            </p>
            <p>
              <span className="font-medium">Estado:</span>{" "}
              {formatAppointmentStatus(appointment.status)}
            </p>
            <p>
              <span className="font-medium">Duración:</span> {appointment.duration} min
            </p>
            <p>
              <span className="font-medium">Motivo:</span> {appointment.reason || "—"}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Notas</h2>
          <p className="mt-4 text-sm text-slate-700">
            {appointment.notes || "Sin notas registradas."}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatAppointmentType(type: string) {
  switch (type) {
    case "prenatal":
      return "Prenatal";
    case "gynecology":
      return "Ginecología";
    case "ultrasound":
      return "Ecografía";
    case "followup":
      return "Control";
    default:
      return type;
  }
}

function formatAppointmentStatus(status: string) {
  switch (status) {
    case "scheduled":
      return "Programada";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    case "noshow":
      return "No asistió";
    default:
      return status;
  }
}
