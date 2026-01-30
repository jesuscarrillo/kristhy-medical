import Link from "next/link";
import { getPatients } from "@/server/actions/patient";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";

export default async function NewAppointmentPage() {
  const patients = await getPatients();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Nueva cita</h1>
          <p className="text-sm text-slate-600">Agrega una cita médica.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/citas">Volver</Link>
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AppointmentForm patients={patients} />
      </div>
    </div>
  );
}
