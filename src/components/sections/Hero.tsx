import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, HeartPulse, ShieldCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-rose-50/40 pb-20 pt-32 sm:pt-40"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-teal-100/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-rose-100/20 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Elegant Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-teal-200 bg-teal-50/50 px-4 py-1.5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
              {t("badge")}
            </span>
          </div>

          {/* Main Title - Big & Bold */}
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block text-slate-800">Cuidado Integral</span>
            <span className="block bg-gradient-to-r from-teal-600 to-rose-500 bg-clip-text text-transparent">
              Mujer & Vida
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl md:text-2xl leading-relaxed">
            {t("tagline")}
          </p>

          {/* Call to Actions - Centered & Premium */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              asChild
              className="h-14 min-w-[200px] rounded-full bg-slate-900 px-8 text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-2xl"
            >
              <Link href="/#contact">
                <CalendarClock className="mr-2 h-5 w-5" />
                <span className="font-semibold text-base">{t("cta_primary")}</span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 min-w-[200px] rounded-full border-2 border-slate-200 bg-white/50 px-8 text-slate-600 backdrop-blur-md transition-all hover:border-slate-900 hover:bg-white hover:text-slate-900"
            >
              <Link href="/#about">
                <span className="font-medium text-base">{t("cta_secondary")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Image - Floating Card Effect */}
        <div className="mt-20 relative mx-auto max-w-5xl rounded-[3rem] p-4 bg-white/40 ring-1 ring-white/60 backdrop-blur-xl shadow-2xl">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] shadow-inner">
            <Image
              src="/images/hero-consultorio.jpg"
              alt="Consultorio Dra. Kristhy"
              fill
              className="object-cover object-[center_20%]"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGKADAAQAAAABAAAAIAAAAAD/wAARCAAgABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

            {/* Floating Stats Cards */}
            <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">1.5k+</p>
                  <p className="text-xs text-slate-500">Pacientes Felices</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8">
              <div className="rounded-2xl bg-white/95 px-6 py-4 shadow-lg backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">Experiencia</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">12+</span>
                  <span className="text-sm font-medium text-slate-600">Años</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
