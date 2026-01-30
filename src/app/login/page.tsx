import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20">
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl font-semibold">Acceso clínico</h1>
            <p className="text-sm text-white/70">
              Inicia sesión para gestionar pacientes y citas.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
