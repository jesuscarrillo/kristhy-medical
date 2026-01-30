import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { HeaderClient } from "@/components/layout/HeaderClient";
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
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
        <HeaderClient currentLocale={locale} />
        <main className="flex-1">{children}</main>
        <Footer currentLocale={locale} />
        <WhatsAppButton />
        <ToasterProvider />
      </div>
    </NextIntlClientProvider>
  );
}
