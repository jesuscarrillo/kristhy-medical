import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <p className="mb-2 text-6xl font-bold text-sky-600">404</p>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">Pagina no encontrada</h2>
        <p className="mb-6 text-slate-500">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
