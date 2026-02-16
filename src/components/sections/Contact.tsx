"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";

const ContactForm = dynamic(
  () => import("@/components/shared/ContactForm").then((m) => m.ContactForm),
  { ssr: false, loading: () => <div className="h-[420px] w-full animate-pulse rounded-2xl bg-slate-50" /> },
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

  const contactItems = [
    { icon: MapPin, label: t("address"), href: undefined },
    { icon: Phone, label: t("phone"), href: `tel:${t("phone").replace(/\s+/g, "")}` },
    { icon: Mail, label: t("email"), href: "mailto:drakristhymoreno@gmail.com" },
    { icon: Clock, label: t("schedule"), href: undefined },
  ];

  return (
    <section id="contact" className="bg-[#FDFBF7] dark:bg-slate-950 py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
            {t("title")}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-5">
            {t("subtitle")}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>

          {/* Info + Map */}
          <div className="space-y-5">
            {/* Contact info */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">{t("title")}</h3>
              <div className="space-y-4">
                {contactItems.map(({ icon: Icon, label, href }, idx) => {
                  const content = (
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                  return href ? (
                    <a key={idx} href={href}>{content}</a>
                  ) : (
                    <div key={idx}>{content}</div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm" ref={mapRef}>
              {showMap ? (
                <iframe
                  title={t("map_label")}
                  className="h-56 w-full"
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15809.61057777098!2d-72.2223847!3d7.7686526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e66459a83329507%3A0x4c02561b00000000!2sSan%20Crist%C3%B3bal%2C%20T%C3%A1chira!5e0!3m2!1sen!2sve!4v1707073286435!5m2!1sen!2sve"
                />
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-slate-50 dark:bg-slate-900 text-sm text-slate-400">
                  {t("loading_map")}
                </div>
              )}
              <a
                href="https://maps.google.com/?q=Centro+San+Crist%C3%B3bal+T%C3%A1chira"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-5 py-3 text-sm font-medium text-teal-700 dark:text-teal-400 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30"
              >
                {t("map_label")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
