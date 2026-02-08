import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contacto | Dra. Kristhy Moreno - Agendar Cita",
  description:
    "Agenda tu cita con la Dra. Kristhy Moreno. Consultorio en San Cristóbal, Táchira. Atención personalizada en ginecología y obstetricia.",
  alternates: {
    canonical: "/contacto",
    languages: { es: "/contacto", en: "/en/contacto", "x-default": "/contacto" },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Contact />;
}
