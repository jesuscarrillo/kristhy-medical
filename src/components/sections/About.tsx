import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function About() {
  const t = useTranslations("about");
  const heroT = useTranslations("hero");
  const bio = t.raw("bio") as string[];
  const philosophy = t.raw("philosophy.content") as string[];
  const highlights = t.raw("highlights") as string[];

  return (
    <section id="about" className="relative overflow-hidden bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-100 blur-3xl" />
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-sky-100 blur-3xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white shadow-xl ring-1 ring-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                alt="Dra. Kristhy en consultorio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 540px"
                priority={false}
              />
              <div className="absolute -bottom-6 -right-6 rounded-xl bg-white p-5 shadow-lg">
                <p className="text-4xl font-bold text-primary">12+</p>
                <p className="text-sm text-muted-foreground">{heroT("experience")}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Badge className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
              {heroT("badge_secondary")}
            </Badge>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">{t("title")}</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("subtitle")}</h2>
            </div>
            <div className="space-y-3 text-slate-700">
              {bio.map((paragraph, idx) => (
                <p key={idx} className="text-lg leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
            {Array.isArray(highlights) && (
              <div className="grid gap-3 md:grid-cols-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-2xl border border-sky-100/70 bg-white/80 p-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-600">
                {t("philosophy.title")}
              </p>
              <div className="space-y-3 text-slate-700">
                {philosophy.map((paragraph, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <Button size="lg" asChild className="shadow-md hover:-translate-y-0.5 transition">
              <a href="#contact">{t("cta")}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
