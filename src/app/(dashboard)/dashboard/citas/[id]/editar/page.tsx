import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointment } from "@/server/actions/appointment";
import { getPatients } from "@/server/actions/patient";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";

type EditAppointmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAppointmentPage({
  params,
}: EditAppointmentPageProps) {
  const resolvedParams = await params;
  let appointment;
  try {
    appointment = await getAppointment(resolvedParams.id);
  } catch {
    notFound();
  }

  const { patients } = await getPatients(undefined, 1, 500);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Editar cita</h1>
          <p className="text-sm text-slate-600">Actualiza la cita médica.</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/citas/${resolvedParams.id}`}>Volver</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AppointmentForm
          appointmentId={resolvedParams.id}
          patients={patients}
          initialData={{
            patientId: appointment.patientId,
            date: appointment.date,
            type: appointment.type as "prenatal" | "gynecology" | "ultrasound" | "followup",
            reason: appointment.reason ?? undefined,
            notes: appointment.notes ?? undefined,
            duration: appointment.duration,
            status: appointment.status as "scheduled" | "completed" | "cancelled" | "noshow",
          }}
        />
      </div>
    </div>
  );
}
