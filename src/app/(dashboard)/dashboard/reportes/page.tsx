import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const [patientsCount, upcomingAppointments, totalAppointments] = await Promise.all([
    prisma.patient.count({ where: { isActive: true } }),
    prisma.appointment.count({
      where: {
        status: "scheduled",
        date: {
          gte: new Date(),
        },
      },
    }),
    prisma.appointment.count(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <p className="text-sm text-slate-600">Resumen general del consultorio.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Pacientes activos</p>
          <p className="mt-3 text-3xl font-semibold">{patientsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Citas próximas</p>
          <p className="mt-3 text-3xl font-semibold">{upcomingAppointments}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Citas totales</p>
          <p className="mt-3 text-3xl font-semibold">{totalAppointments}</p>
        </div>
      </div>
    </div>
  );
}
