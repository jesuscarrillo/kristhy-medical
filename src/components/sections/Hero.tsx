"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, HeartPulse, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("hero");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#FDFBF7] dark:bg-slate-950"
    >
      {/* Background layer: Grid + Noise + Animated Meshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Animated Orbs */}
        <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-teal-400/20 dark:bg-teal-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[8000ms]" />
        <div className="absolute top-[40%] -left-[15%] h-[600px] w-[600px] rounded-full bg-rose-400/20 dark:bg-rose-500/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10000ms]" />

        {/* Procedural Noise Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-screen items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200/50 dark:border-teal-700/50 bg-white/60 dark:bg-slate-800/60 px-4 py-2 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500 dark:bg-teal-400"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-teal-800 dark:text-teal-300">
                {t("badge")}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-6">
              <h1 className="text-[2.75rem] font-black leading-[1.05] tracking-tighter text-slate-900 dark:text-slate-50 sm:text-6xl lg:text-[4.5rem]">
                <span className="block drop-shadow-sm">{t("title_top")}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">
                  {t("title_bottom")}
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl font-medium tracking-wide">
                {t("tagline")}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2">
              <Button
                size="lg"
                onClick={() => scrollTo("contact")}
                className="group h-14 rounded-full bg-teal-600 px-8 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(13,148,136,0.6)] transition-all duration-300 hover:bg-teal-700 hover:shadow-[0_0_60px_-15px_rgba(13,148,136,0.8)] hover:-translate-y-0.5"
              >
                <CalendarClock className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                {t("cta_primary")}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollTo("about")}
                className="group h-14 rounded-full px-8 text-base font-semibold text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              >
                {t("cta_secondary")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">12+</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("years_label")}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">1500+</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("patients_label")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:h-[680px] group perspective-[1000px]">
            <div className="relative h-[480px] w-full overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 lg:h-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <Image
                src="/images/hero-consultorio.jpg"
                alt="Dra. Kristhy Moreno"
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGKADAAQAAAABAAAAIAAAAAD/wAARCAAgABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
                priority
                sizes="(max-width: 1023px) 100vw, 512px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Credential badge */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 transition-transform duration-700 ease-out group-hover:translate-y-[-8px]">
                <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-400">{t("specialist_title")}</p>
                      <p className="mt-1.5 text-lg font-black tracking-tight text-slate-900 dark:text-slate-50">{t("specialist_field")}</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]">
                      <CalendarClock className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 56V28C240 4 480 0 720 12C960 24 1200 48 1440 28V56H0Z" fill="#F8FAFC" fillOpacity="0.5" />
        </svg>
      </div>
    </section>
  );
}
