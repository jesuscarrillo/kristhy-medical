import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { ToasterProvider } from "@/components/layout/ToasterProvider";
import { LocaleHtmlLang } from "@/components/shared/LocaleHtmlLang";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Dra. Kristhy Moreno | Obstetra Ginecóloga · San Cristóbal",
  description:
    "Obstetra ginecóloga en San Cristóbal, Táchira. Especialista en control prenatal, embarazos de alto riesgo, ecografías obstétricas y ginecología integral.",
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
    description:
      "Obstetra ginecóloga en San Cristóbal, Táchira. Especialista en control prenatal, embarazos de alto riesgo y atención ginecológica integral para la mujer.",
    siteName: "Dra. Kristhy Moreno",
    url: "https://drakristhymoreno.com",
    images: [
      {
        url: "/images/logo.png",
        width: 1152,
        height: 896,
        alt: "Dra. Kristhy Moreno - Obstetricia y Ginecología",
      },
    ],
    type: "website",
    locale: "es_VE",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dra. Kristhy Moreno | Obstetricia y Ginecología",
    description:
      "Obstetra ginecóloga en San Cristóbal, Táchira. Control prenatal, embarazos de alto riesgo y atención integral.",
    images: ["/images/logo.png"],
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
    telephone: "+584120735223",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Cristóbal",
      addressRegion: "Táchira",
      addressCountry: "VE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.7686526,
      longitude: -72.2223847,
    },
    openingHours: ["Mo-Fr 08:00-17:00", "Sa 08:00-12:00"],
    priceRange: "$$",
    image: "https://drakristhymoreno.com/images/logo.png",
    medicalSpecialty: ["Obstetrics", "Gynecology"],
    physician: {
      "@type": "Physician",
      name: "Dra. Kristhy Moreno",
      medicalSpecialty: "Obstetrics and Gynecology",
      jobTitle: "Especialista en Obstetricia y Ginecología",
      image: "https://drakristhymoreno.com/dra-kristhy.webp",
    },
  };

  const skipText = locale === "en" ? "Skip to main content" : "Ir al contenido principal";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocaleHtmlLang locale={locale} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-white focus:font-bold focus:shadow-lg"
        >
          {skipText}
        </a>
        <HeaderClient currentLocale={locale} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer currentLocale={locale} />
        <ToasterProvider />
      </div>
    </NextIntlClientProvider>
  );
}
