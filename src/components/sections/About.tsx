"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { GraduationCap, Stethoscope, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlightIcons = [GraduationCap, Stethoscope, Sparkles, HeartHandshake];

export function About() {
  const t = useTranslations("about");
  const heroT = useTranslations("hero");
  const bio = t.raw("bio") as string[];
  const philosophy = t.raw("philosophy.content") as string[];
  const highlights = t.raw("highlights") as { title: string; description: string }[];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="about" className="relative bg-[#FDFBF7] dark:bg-slate-950 py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1 lg:sticky lg:top-36 group perspective-[1000px]">
            <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <Image
                src="/images/about-dra.jpg"
                alt="Dra. Kristhy Moreno - Ginecóloga"
                fill
                sizes="(max-width: 1023px) 100vw, 568px"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGAAAAAD/wAARCAAYABIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
                loading="lazy"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Credential overlay */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 transition-transform duration-700 ease-out group-hover:translate-y-[-6px]">
                <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-400">{t("highlights.0.title")}</p>
                      <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-50 leading-tight">{t("highlights.0.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* Header */}
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center justify-center rounded-full border border-teal-200/50 dark:border-teal-700/50 bg-white/60 dark:bg-slate-800/60 px-5 py-2 shadow-sm backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-300">
                  {t("title")}
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                {t("subtitle")}
              </h2>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              {bio.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlights */}
            {Array.isArray(highlights) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item, idx) => {
                  const Icon = highlightIcons[idx % highlightIcons.length];
                  return (
                    <div
                      key={item.title ?? idx}
                      className="group flex items-start gap-4 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 p-5 transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-300/50 dark:hover:border-teal-600/50 hover:shadow-xl hover:shadow-teal-900/5 dark:hover:shadow-teal-900/20 hover:-translate-y-1"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/50 mt-0.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">{item.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Philosophy */}
            <div className="rounded-2xl border border-teal-100/60 dark:border-teal-800/60 bg-teal-50/30 dark:bg-teal-900/20 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 dark:bg-teal-500 text-white">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-teal-700 dark:text-teal-400">
                  {t("philosophy.title")}
                </p>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {philosophy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => scrollTo("contact")}
                className="group h-14 w-full sm:w-auto rounded-full bg-teal-600 px-8 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(13,148,136,0.5)] transition-all duration-300 hover:bg-teal-700 hover:shadow-[0_0_60px_-15px_rgba(13,148,136,0.7)] hover:-translate-y-0.5"
              >
                {t("cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
