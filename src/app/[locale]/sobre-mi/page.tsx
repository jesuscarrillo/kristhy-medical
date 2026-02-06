import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Sobre Mi | Dra. Kristhy Moreno - Ginecologa Obstetra",
  description:
    "Conoce a la Dra. Kristhy Moreno, especialista en ginecologia y obstetricia con 12+ anos de experiencia. Formacion, trayectoria y compromiso con la salud de la mujer.",
  alternates: {
    canonical: "/sobre-mi",
    languages: { es: "/es/sobre-mi", en: "/en/sobre-mi" },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}
