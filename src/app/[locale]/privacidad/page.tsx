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
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 sm:p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Última actualización: Febrero 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">1. Información que NO Recopilamos</h2>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Este sitio web NO almacena tu información personal en ninguna base de datos</strong>.
              Cuando utilizas nuestro formulario de contacto, eres redirigido/a directamente a WhatsApp para comunicarte
              con la Dra. Kristhy Moreno. Toda la información que compartas se gestiona exclusivamente a través de WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">2. Comunicación vía WhatsApp</h2>
            <p>
              Al contactarnos a través de WhatsApp, la información que compartas (nombre, teléfono, motivo de consulta, etc.)
              será utilizada únicamente para:
            </p>
            <ul className="mt-2 ml-6 space-y-1 list-disc">
              <li>Coordinar y agendar citas médicas</li>
              <li>Responder tus consultas y preguntas</li>
              <li>Enviarte indicaciones médicas cuando sea necesario</li>
              <li>Brindar seguimiento a tu atención médica</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">3. Confidencialidad Médica</h2>
            <p>
              Toda la información médica que compartas será tratada con estricta confidencialidad, cumpliendo con
              el secreto profesional médico y las normativas vigentes en Venezuela sobre protección de datos de salud.
            </p>
            <p className="mt-2">
              <strong className="text-slate-900 dark:text-slate-100">No compartimos tu información con terceros</strong> sin tu
              consentimiento explícito, excepto cuando sea requerido por ley.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">4. Cookies y Tecnologías de Seguimiento</h2>
            <p>
              Este sitio web utiliza tecnologías estándar de navegación. No utilizamos cookies de seguimiento
              publicitario ni compartimos información con redes publicitarias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">5. Tus Derechos</h2>
            <p>
              Como la comunicación se realiza a través de WhatsApp, tienes control total sobre tu información:
            </p>
            <ul className="mt-2 ml-6 space-y-1 list-disc">
              <li>Puedes eliminar conversaciones en cualquier momento</li>
              <li>Puedes bloquear el contacto si deseas cesar la comunicación</li>
              <li>Puedes solicitar aclaraciones sobre cómo se maneja tu información</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">6. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad. Las modificaciones
              serán publicadas en esta página con su fecha correspondiente.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              Si tienes dudas sobre esta política de privacidad, contáctanos en{" "}
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
