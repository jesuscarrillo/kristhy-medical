import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="mb-2 text-6xl font-bold text-sky-600">404</p>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">No encontrado</h2>
        <p className="mb-6 text-slate-500">
          El recurso que buscas no existe o fue eliminado.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
