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
      className="relative min-h-screen overflow-hidden bg-[#FDFBF7]"
    >
      {/* Subtle warm organic shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] h-[900px] w-[900px] rounded-full bg-teal-50/60 blur-[100px]" />
        <div className="absolute -bottom-[30%] -left-[15%] h-[600px] w-[600px] rounded-full bg-rose-50/40 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-screen items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200/60 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-teal-700">
                {t("badge")}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-5">
              <h1 className="text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.25rem]">
                <span className="block">{t("title_top")}</span>
                <span className="block text-teal-600">
                  {t("title_bottom")}
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
                {t("tagline")}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={() => scrollTo("contact")}
                className="h-13 rounded-full bg-teal-600 px-8 text-base font-semibold text-white shadow-lg shadow-teal-600/20 transition-all duration-200 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 cursor-pointer"
              >
                <CalendarClock className="mr-2 h-5 w-5" />
                {t("cta_primary")}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollTo("about")}
                className="h-13 rounded-full px-8 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                {t("cta_secondary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">12+</p>
                  <p className="text-xs font-medium text-slate-500">{t("years_label")}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">1500+</p>
                  <p className="text-xs font-medium text-slate-500">{t("patients_label")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:h-[640px]">
            <div className="relative h-[480px] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-black/5 lg:h-full">
              <Image
                src="/images/hero-consultorio.jpg"
                alt="Dra. Kristhy Moreno"
                fill
                className="object-cover object-center"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGKADAAQAAAABAAAAIAAAAAD/wAARCAAgABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />

              {/* Credential badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl border border-white/30 bg-white/90 p-5 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{t("specialist_title")}</p>
                      <p className="mt-1 text-base font-bold text-slate-900">{t("specialist_field")}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-white shadow-md">
                      <CalendarClock className="h-5 w-5" />
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
