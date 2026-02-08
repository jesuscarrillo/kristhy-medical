import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Servicios | Dra. Kristhy Moreno - Ginecología y Obstetricia",
  description:
    "Control prenatal, embarazo de alto riesgo, ecografías, planificación familiar y más. Atención integral en ginecología y obstetricia en San Cristóbal, Táchira.",
  alternates: {
    canonical: "/servicios",
    languages: { es: "/servicios", en: "/en/servicios", "x-default": "/servicios" },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Services />
      <Contact />
    </>
  );
}
