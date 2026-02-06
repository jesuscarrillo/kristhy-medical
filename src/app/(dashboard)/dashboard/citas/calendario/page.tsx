import { Suspense } from "react";
import Link from "next/link";
import { getAppointmentsByDateRange } from "@/server/actions/appointment";
import { CalendarView } from "@/components/appointments/CalendarView";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendario de Citas</h1>
          <p className="text-sm text-slate-600">
            Visualiza y gestiona las citas en el calendario.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/citas">Ver lista</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Suspense fallback={<CalendarSkeleton />}>
          <CalendarContent />
        </Suspense>
      </div>
    </div>
  );
}

async function CalendarContent() {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const appointments = await getAppointmentsByDateRange(startDate, endDate);

  return <CalendarView appointments={appointments} />;
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
