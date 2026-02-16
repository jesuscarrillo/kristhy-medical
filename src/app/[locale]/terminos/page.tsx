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
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 sm:p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Términos y Condiciones</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Última actualización: Febrero 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">1. Información General</h2>
            <p>
              La información presentada en este sitio web tiene carácter exclusivamente informativo y educativo.
              No sustituye una consulta médica profesional. Cada caso clínico es evaluado de manera individual
              en consulta presencial o virtual.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">2. Formulario de Contacto</h2>
            <p>
              Al utilizar nuestro formulario de contacto, serás redirigido/a a WhatsApp para comunicarte directamente
              con la Dra. Kristhy Moreno. <strong className="text-slate-900 dark:text-slate-100">No almacenamos tu información personal
              en ninguna base de datos</strong>. La comunicación se realiza exclusivamente a través de WhatsApp.
            </p>
            <p className="mt-2">
              Al contactarnos, aceptas:
            </p>
            <ul className="mt-2 ml-6 space-y-1 list-disc">
              <li>Ser contactado/a para coordinar tu cita médica</li>
              <li>Recibir información relacionada con tu atención médica</li>
              <li>Que la comunicación se realice vía WhatsApp</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">3. Privacidad</h2>
            <p>
              Tu privacidad es importante para nosotros. La información que compartas a través de WhatsApp
              será tratada con total confidencialidad y utilizada únicamente para fines médicos relacionados
              con tu atención.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">4. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de actualizar estos términos en cualquier momento. Las modificaciones
              entrarán en vigor inmediatamente después de su publicación en este sitio web.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              Si tienes preguntas sobre estos términos, contáctanos en{" "}
              <a
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline transition-colors"
                href="mailto:drakristhymoreno@gmail.com"
              >
                drakristhymoreno@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
