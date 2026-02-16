import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { ToasterProvider } from "@/components/layout/ToasterProvider";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Dra. Kristhy Moreno | Obstetricia y Ginecología | San Cristóbal",
  description:
    "Obstetra ginecóloga en San Cristóbal, Táchira. Control prenatal, embarazos de alto riesgo y atención integral.",
  keywords: [
    "ginecóloga San Cristóbal",
    "obstetra Táchira",
    "control prenatal",
    "embarazo alto riesgo",
    "Dra Kristhy Moreno",
    "ginecología Venezuela",
  ],
  metadataBase: new URL("https://drakristhymoreno.com"),
  openGraph: {
    title: "Dra. Kristhy Moreno - Obstetricia y Ginecología",
    description: "Atención integral en salud reproductiva",
    images: ["/og-image.jpg"],
    type: "website",
    locale: "es_VE",
    alternateLocale: "en_US",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Dra. Kristhy Moreno - Obstetricia y Ginecología",
    description: "Consultorio especializado en obstetricia y ginecología",
    url: "https://drakristhymoreno.com",
    telephone: "+584247771234",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Cristóbal",
      addressRegion: "Táchira",
      addressCountry: "VE",
    },
    medicalSpecialty: ["Obstetrics", "Gynecology"],
    physician: {
      "@type": "Physician",
      name: "Dra. Kristhy Moreno",
      medicalSpecialty: "Obstetrics and Gynecology",
      jobTitle: "Especialista en Obstetricia y Ginecología",
    },
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <HeaderClient currentLocale={locale} />
        <main className="flex-1">{children}</main>
        <Footer currentLocale={locale} />
        <ToasterProvider />
      </div>
    </NextIntlClientProvider>
  );
}
