import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Términos y Condiciones</h1>
      <p className="mt-2 text-sm text-slate-500">Última actualización: 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          La información en este sitio es de carácter informativo y no sustituye una consulta médica. Cada caso es
          evaluado de manera individual en consulta presencial o virtual.
        </p>
        <p>
          Al enviar el formulario aceptas ser contactado para coordinar tu cita y recibir información relacionada con
          tu atención. Nos reservamos el derecho de actualizar estos términos en cualquier momento.
        </p>
        <p>
          Si tienes preguntas sobre estos términos, escríbenos a{" "}
          <a className="text-sky-600 underline" href="mailto:drakristhymoreno@gmail.com">
            drakristhymoreno@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
