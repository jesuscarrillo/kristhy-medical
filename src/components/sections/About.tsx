import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GraduationCap, Stethoscope, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function About() {
  const t = useTranslations("about");
  const heroT = useTranslations("hero");
  const bio = t.raw("bio") as string[];
  const philosophy = t.raw("philosophy.content") as string[];
  const highlights = t.raw("highlights") as { title: string; description: string }[];
  const highlightIcons = [GraduationCap, Stethoscope, Sparkles, HeartHandshake];

  return (
    <section id="about" className="relative overflow-hidden bg-white py-24 scroll-mt-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Column - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-teal-100/40 blur-3xl" />
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-rose-100/40 blur-3xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl ring-1 ring-slate-200/50 transition-transform duration-500 hover:scale-[1.02]">
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
              {/* Floating Credential Badge */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="rounded-2xl border border-white/40 bg-white/95 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-0.5">Certificada</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight">Universidad Central de Venezuela</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 space-y-8 lg:order-2">
            <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">{heroT("badge_secondary")}</span>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wide text-teal-600">{t("title")}</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {t("subtitle")}
              </h2>
            </div>

            <div className="space-y-4 text-slate-700">
              {bio.map((paragraph, idx) => (
                <p key={idx} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlights Grid */}
            {Array.isArray(highlights) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item, idx) => {
                  const Icon = highlightIcons[idx % highlightIcons.length];
                  return (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-teal-200 hover:bg-teal-50/50 hover:shadow-md"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Philosophy Card */}
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold uppercase tracking-wide text-teal-600">
                  {t("philosophy.title")}
                </p>
              </div>
              <div className="space-y-3 text-slate-700">
                {philosophy.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              <Link href="/#contact">{t("cta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
