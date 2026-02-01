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
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/50 pb-16 pt-20 sm:pb-24 sm:pt-32"
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-teal-100/40 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-rose-100/30 blur-[120px]" />
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-100/30 blur-[80px]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 shadow-sm backdrop-blur-sm">
                {t("badge")}
              </Badge>
              <Badge className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm backdrop-blur-sm">
                {t("badge_secondary")}
              </Badge>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {t("title")}
              </h1>
              <p className="text-lg text-slate-600 sm:text-xl">{t("tagline")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-8 text-white shadow-lg shadow-teal-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-300/50"
              >
                <Link href="/#contact">
                  <CalendarClock className="mr-2 h-5 w-5" />
                  <span className="font-semibold">{t("cta_primary")}</span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-2 border-slate-200 bg-transparent px-8 text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-tea-400 hover:bg-white hover:text-teal-700 hover:shadow-md"
              >
                <Link href="/#about">
                  <span className="font-medium">{t("cta_secondary")}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/60 bg-white/40 p-4 shadow-xl backdrop-blur-md sm:max-w-lg">
              <div className="flex items-center gap-4 p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 shadow-inner">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12+</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{t("experience")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 text-rose-500 shadow-inner">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1500+</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{t("patients")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
              <Image
                src="/images/hero-consultorio.jpg"
                alt="Dra. Kristhy en consulta"
                width={1200}
                height={1600}
                className="h-full w-full object-cover"
                priority
                quality={75}
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAIAAAAAD/wAARCAAgABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-background/20" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-slate-900">{t("title")}</p>
                    <p className="text-xs font-medium text-slate-500">{t("tagline")}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white">
                    <CalendarClock className="h-5 w-5" />
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
