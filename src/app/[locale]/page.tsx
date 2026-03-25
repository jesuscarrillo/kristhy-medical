import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/sections/Hero";

const Services = dynamic(() => import("@/components/sections/Services").then((m) => ({ default: m.Services })));
const About = dynamic(() => import("@/components/sections/About").then((m) => ({ default: m.About })));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials })));
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => ({ default: m.Contact })));

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = locale === "es" ? "/" : `/${locale}`;

  return {
    alternates: {
      canonical,
      languages: {
        es: "/",
        en: "/en",
        "x-default": "/",
      },
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}
