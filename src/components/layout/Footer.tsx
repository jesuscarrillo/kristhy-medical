import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const contactT = useTranslations("contact");
  const services = t.raw("services") as string[];

  return (
    <footer className="border-t border-border/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Dra. Kristhy Moreno</h3>
            <p className="text-sm text-slate-600">Obstetricia &amp; Ginecología</p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="rounded-full bg-sky-50 px-3 py-1">{t("badges.cmt")}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1">{t("badges.mpps")}</span>
            </div>
            <p className="text-sm text-slate-600">{t("mini_bio")}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {t("nav.services")}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {services.map((item, idx) => (
                <li key={idx} className="hover:text-slate-900">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {t("nav.home")}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#hero" className="hover:text-slate-900">
                  {t("nav.home")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-slate-900">
                  {t("nav.services")}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-slate-900">
                  {t("nav.about")}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-slate-900">
                  {t("nav.contact")}
                </a>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-slate-900">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-slate-900">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {t("nav.contact")}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sky-600" />
                <span>{contactT("address")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-sky-600" />
                <a href="tel:+584247648994" className="hover:text-slate-900">
                  {contactT("phone")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" />
                <a href="mailto:contacto@drakristhy.com" className="hover:text-slate-900">
                  {contactT("email")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-600" />
                <span>{contactT("schedule")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>{t("rights")}</span>
            <span className="h-3 w-px bg-slate-300" aria-hidden />
            <a href="#privacy" className="hover:text-slate-900">
              {t("privacy")}
            </a>
            <span className="h-3 w-px bg-slate-300" aria-hidden />
            <a href="#terms" className="hover:text-slate-900">
              {t("terms")}
            </a>
          </div>
          <span className="text-slate-500">{t("crafted")}</span>
        </div>
      </div>
    </footer>
  );
}
