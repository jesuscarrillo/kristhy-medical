import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, HeartPulse, ShieldCheck, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 pb-16 pt-10 sm:pb-20 sm:pt-16"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute right-0 top-20 h-48 w-48 rounded-full bg-pink-100 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
                {t("badge")}
              </Badge>
              <Badge className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
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
                className="shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:scale-[1.02]"
              >
                <a href="#contact">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {t("cta_primary")}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-sky-200 text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
              >
                <a href="#about">
                  {t("cta_secondary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white bg-white/70 p-4 shadow-lg sm:max-w-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12+</p>
                  <p className="text-sm text-slate-600">{t("experience")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1500+</p>
                  <p className="text-sm text-slate-600">{t("patients")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=75"
                alt="Dra. Kristhy en consulta"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                priority
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0d3f0HwAFWAKvVr1TngAAAABJRU5ErkJggg=="
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/85 p-3 shadow-lg backdrop-blur">
                <p className="text-sm font-semibold text-slate-900">{t("title")}</p>
                <p className="text-xs text-slate-600">{t("tagline")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
