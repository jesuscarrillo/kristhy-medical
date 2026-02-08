import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Visual Side */}
      <div className="hidden w-1/2 flex-col justify-between bg-zinc-900 p-10 text-white lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2982&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-zinc-900/40"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10 shadow-sm ring-1 ring-white/20 backdrop-blur-md">
            <Image
              src="/images/header-logo.png"
              alt="Logo Dra. Kristhy"
              fill
              className="object-contain p-1"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Dra. Kristhy</span>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;La atención personalizada y el seguimiento detallado son clave para el bienestar de mis pacientes.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">Dra. Kristhy</footer>
          </blockquote>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Bienvenida de nuevo
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ingresa tus credenciales para acceder al sistema clínico.
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Sistema de gestión privado. Si no tienes acceso, contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
