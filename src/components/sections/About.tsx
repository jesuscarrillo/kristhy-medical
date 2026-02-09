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
    <section id="about" className="relative bg-[#FDFBF7] py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1 lg:sticky lg:top-32">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-black/5">
              <Image
                src="/images/about-dra.jpg"
                alt="Dra. Kristhy Moreno - Ginecóloga"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGAAAAAD/wAARCAAYABIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

              {/* Credential overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl border border-white/30 bg-white/90 p-5 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{t("highlights.0.title")}</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-900 leading-tight">{t("highlights.0.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-white/80 px-4 py-2 shadow-sm">
                <span className="text-xs font-semibold tracking-wide text-teal-700">{heroT("badge_secondary")}</span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">{t("title")}</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {t("subtitle")}
              </h2>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              {bio.map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-slate-600">
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
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:border-teal-200/60 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Philosophy */}
            <div className="rounded-2xl border border-teal-100/60 bg-teal-50/30 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-teal-700">
                  {t("philosophy.title")}
                </p>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                {philosophy.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              onClick={() => scrollTo("contact")}
              className="w-full rounded-full bg-teal-600 px-8 font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 sm:w-auto cursor-pointer"
            >
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
