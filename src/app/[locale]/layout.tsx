import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Dra. Kristhy - Obstetricia y Ginecología",
  description:
    "Atención integral en obstetricia y ginecología con un enfoque cálido, profesional y humano.",
  metadataBase: new URL("https://drakristhy.com"),
  openGraph: {
    title: "Dra. Kristhy - Obstetricia y Ginecología",
    description:
      "Agenda tu consulta con la Dra. Kristhy, especialista en salud integral para la mujer.",
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
      </div>
    </NextIntlClientProvider>
  );
}
