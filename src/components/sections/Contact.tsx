"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactForm = dynamic(
  () => import("@/components/shared/ContactForm").then((m) => m.ContactForm),
  { ssr: false, loading: () => <div className="h-[420px] w-full animate-pulse rounded-xl bg-slate-100" /> },
);

export function Contact() {
  const t = useTranslations("contact");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const node = mapRef.current;
    if (!node || showMap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showMap]);

  return (
    <section id="contact" className="bg-gradient-to-b from-white to-sky-50/70 py-16 scroll-mt-24 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">{t("title")}</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("subtitle")}</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-emerald-100/70 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border border-sky-100/70 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">{t("title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-500" />
                  <span>{t("address")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-500" />
                  <a href="tel:+584247648994" className="hover:text-slate-900">
                    {t("phone")}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-sky-500" />
                  <a href="mailto:drakristhymoreno@gmail.com" className="hover:text-slate-900">
                    {t("email")}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-sky-500" />
                  <span>{t("schedule")}</span>
                </div>
              </CardContent>
            </Card>

            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm" ref={mapRef}>
              {showMap ? (
                <iframe
                  title={t("map_label")}
                  className="h-64 w-full"
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15809.61057777098!2d-72.2223847!3d7.7686526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e66459a83329507%3A0x4c02561b00000000!2sSan%20Crist%C3%B3bal%2C%20T%C3%A1chira!5e0!3m2!1sen!2sve!4v1707073286435!5m2!1sen!2sve"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-slate-50 text-sm text-slate-500">
                  Cargando mapa…
                </div>
              )}
              <a
                href="https://maps.google.com/?q=Centro+San+Crist%C3%B3bal+T%C3%A1chira"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-white px-4 py-3 text-sm font-semibold text-sky-700 underline"
              >
                {t("map_label")}
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
