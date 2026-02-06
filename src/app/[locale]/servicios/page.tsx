import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Servicios | Dra. Kristhy Moreno - Ginecologia y Obstetricia",
  description:
    "Control prenatal, embarazo de alto riesgo, ecografias, planificacion familiar y mas. Atencion integral en ginecologia y obstetricia en San Cristobal, Tachira.",
  alternates: {
    canonical: "/servicios",
    languages: { es: "/es/servicios", en: "/en/servicios" },
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
