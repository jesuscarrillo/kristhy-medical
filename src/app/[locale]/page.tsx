import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

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

  // Garantiza que la imagen LCP sea detectable en el HTML inicial con fetchpriority=high.
  // ReactDOM.preload() en un Server Component inyecta el <link rel="preload"> en el <head>
  // durante SSR, independientemente de que Hero sea un client component.
  ReactDOM.preload(
    "/_next/image?url=%2Fimages%2Fhero-consultorio.jpg&w=640&q=75",
    {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: [
        "/_next/image?url=%2Fimages%2Fhero-consultorio.jpg&w=384&q=75 384w",
        "/_next/image?url=%2Fimages%2Fhero-consultorio.jpg&w=640&q=75 640w",
        "/_next/image?url=%2Fimages%2Fhero-consultorio.jpg&w=750&q=75 750w",
        "/_next/image?url=%2Fimages%2Fhero-consultorio.jpg&w=828&q=75 828w",
      ].join(", "),
      imageSizes: "(max-width: 1023px) 100vw, 512px",
    },
  );

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
