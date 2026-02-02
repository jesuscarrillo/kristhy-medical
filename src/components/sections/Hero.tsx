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
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50/40 via-white to-rose-50/40"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-teal-100/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-rose-100/20 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-screen items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Elegant Badge */}
            <div className="inline-flex w-fit items-center rounded-full border border-teal-200 bg-teal-50/50 px-4 py-1.5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
                {t("badge")}
              </span>
            </div>

            {/* Main Title - Big & Bold */}
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                <span className="block text-slate-800">Cuidado Integral</span>
                <span className="block bg-gradient-to-r from-teal-600 to-rose-500 bg-clip-text text-transparent">
                  Mujer & Vida
                </span>
              </h1>

              <p className="text-lg text-slate-600 sm:text-xl leading-relaxed max-w-xl">
                {t("tagline")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                asChild
                className="h-14 w-full sm:w-auto rounded-full bg-slate-900 px-8 text-white shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-slate-800"
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
                className="h-14 w-full sm:w-auto rounded-full border-2 border-slate-200 bg-white/50 px-8 text-slate-600 backdrop-blur-md transition-colors duration-200 hover:border-slate-900 hover:bg-white hover:text-slate-900"
              >
                <Link href="/#about">
                  <span className="font-medium text-base">{t("cta_secondary")}</span>
                </Link>
              </Button>
            </div>

            {/* Stats - Inline */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12+</p>
                  <p className="text-sm text-slate-600">Años de Experiencia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 text-rose-500 shadow-sm">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1500+</p>
                  <p className="text-sm text-slate-600">Pacientes Felices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative lg:h-[700px]">
            <div className="relative h-[500px] lg:h-full w-full overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-slate-200/50">
              <Image
                src="/images/hero-consultorio.jpg"
                alt="Dra. Kristhy Moreno"
                fill
                className="object-cover object-center"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGKADAAQAAAABAAAAIAAAAAD/wAARCAAgABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="rounded-2xl border border-white/40 bg-white/95 p-6 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-rose-500 mb-1">{t("specialist_title")}</p>
                      <p className="text-lg font-bold text-slate-900">{t("specialist_field")}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white">
                      <CalendarClock className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
