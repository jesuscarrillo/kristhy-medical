import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <p className="mt-3 text-sm text-white/70">
          Tu sesión no tiene permisos para ver esta sección.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900"
        >
          Volver al login
        </Link>
      </div>
    </div>
  );
}
