import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Política de Privacidad</h1>
      <p className="mt-2 text-sm text-slate-500">Última actualización: 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Recopilamos tu nombre, correo y teléfono únicamente para gestionar tus consultas médicas. No
          compartimos tus datos con terceros y puedes solicitar su eliminación en cualquier momento.
        </p>
        <p>
          Usamos la información para agendar citas, responder preguntas y enviarte indicaciones médicas cuando sea
          necesario. Cumplimos con la normativa vigente en Venezuela y mantenemos medidas de seguridad para proteger
          tu información.
        </p>
        <p>
          Si tienes dudas sobre esta política, contáctanos en{" "}
          <a className="text-sky-600 underline" href="mailto:drakristhymoreno@gmail.com">
            drakristhymoreno@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
