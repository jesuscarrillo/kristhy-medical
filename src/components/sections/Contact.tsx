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
    { icon: Mail, label: "WhatsApp", href: "https://wa.me/584120735223" },
    { icon: Clock, label: t("schedule"), href: undefined },
  ];

  return (
    <section id="contact" className="relative bg-[#FDFBF7] dark:bg-slate-950 py-24 scroll-mt-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center justify-center rounded-full border border-teal-200/50 dark:border-teal-700/50 bg-teal-50/50 dark:bg-slate-800/50 px-5 py-2 mb-6 shadow-sm backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-300">
              {t("title")}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl mb-5">
            {t("subtitle")}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <div className="rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-xl shadow-teal-900/5 dark:shadow-none sm:p-10 backdrop-blur-md">
            <ContactForm />
          </div>

          {/* Info + Map */}
          <div className="space-y-6">
            {/* Contact info */}
            <div className="rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-8 shadow-xl shadow-teal-900/5 dark:shadow-none backdrop-blur-md">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">{t("title")}</h3>
              <div className="space-y-5">
                {contactItems.map(({ icon: Icon, label, href }, idx) => {
                  const content = (
                    <div className="group flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/50">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </div>
                  );
                  return href ? (
                    <a key={label} href={href} className="block">{content}</a>
                  ) : (
                    <div key={label}>{content}</div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-xl shadow-teal-900/5 dark:shadow-none backdrop-blur-md" ref={mapRef}>
              {showMap ? (
                <iframe
                  title={t("map_label")}
                  className="h-64 w-full"
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15809.61057777098!2d-72.2223847!3d7.7686526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e66459a83329507%3A0x4c02561b00000000!2sSan%20Crist%C3%B3bal%2C%20T%C3%A1chira!5e0!3m2!1sen!2sve!4v1707073286435!5m2!1sen!2sve"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("loading_map")}
                </div>
              )}
              <a
                href="https://maps.google.com/?q=Centro+San+Crist%C3%B3bal+T%C3%A1chira"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between px-8 py-5 text-sm font-bold text-teal-700 dark:text-teal-400 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30"
              >
                {t("map_label")}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
