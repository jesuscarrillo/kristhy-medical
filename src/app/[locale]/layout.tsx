import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToasterProvider } from "@/components/layout/ToasterProvider";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Dra. Kristhy Moreno | Obstetricia y Ginecología | San Cristóbal",
  description:
    "Especialista en Obstetricia y Ginecología con 12+ años de experiencia. Atención personalizada, control prenatal, embarazos de alto riesgo. San Cristóbal, Táchira.",
  keywords: [
    "ginecóloga San Cristóbal",
    "obstetra Táchira",
    "control prenatal",
    "embarazo alto riesgo",
    "Dra Kristhy Moreno",
    "ginecología Venezuela",
  ],
  metadataBase: new URL("https://drakristhy.com"),
  openGraph: {
    title: "Dra. Kristhy Moreno - Obstetricia y Ginecología",
    description: "Atención integral en salud reproductiva con 12+ años de experiencia",
    images: ["/og-image.jpg"],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
        <Header currentLocale={locale} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ToasterProvider />
      </div>
    </NextIntlClientProvider>
  );
}
