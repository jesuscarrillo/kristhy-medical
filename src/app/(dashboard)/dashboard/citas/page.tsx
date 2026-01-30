import Link from "next/link";
import { getAppointments } from "@/server/actions/appointment";
import { Button } from "@/components/ui/button";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Citas</h1>
          <p className="text-sm text-slate-600">Agenda y controla las citas médicas.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/citas/nuevo">Nueva cita</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {appointments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            No hay citas programadas.
          </div>
        ) : (
          appointments.map((appointment) => (
            <Link
              key={appointment.id}
              href={`/dashboard/citas/${appointment.id}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(appointment.date).toLocaleString("es-VE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  {formatAppointmentType(appointment.type)} ·{" "}
                  {formatAppointmentStatus(appointment.status)}
                </div>
              </div>
            </Link>
          ))
        )}
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
