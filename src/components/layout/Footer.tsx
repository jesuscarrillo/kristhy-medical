import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock, Camera, ThumbsUp, Send } from "lucide-react";
import { routing } from "@/i18n/routing";

export function Footer({ currentLocale }: { currentLocale?: string }) {
  const t = useTranslations("footer");
  const contactT = useTranslations("contact");
  const services = t.raw("services") as string[];
  const locale = currentLocale ?? routing.defaultLocale;
  const localeBase = locale === routing.defaultLocale ? "" : `/${locale}`;
  const anchorHref = (hash: string) => {
    const cleaned = hash.replace("#", "");
    return `${localeBase}/#${cleaned}`;
  };

  return (
    <footer className="border-t border-border/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Dra. Kristhy Moreno</h3>
            <p className="text-sm text-slate-600">Obstetricia &amp; Ginecología</p>
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
                <Link href={anchorHref("#hero")} className="hover:text-slate-900">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href={anchorHref("#services")} className="hover:text-slate-900">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href={anchorHref("#about")} className="hover:text-slate-900">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href={anchorHref("#contact")} className="hover:text-slate-900">
                  {t("nav.contact")}
                </Link>
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
                <a href="tel:+584120735223" className="hover:text-slate-900">
                  {contactT("phone")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" />
                <a href="mailto:drakristhymoreno@gmail.com" className="hover:text-slate-900">
                  {contactT("email")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sky-600" />
                <span>{contactT("schedule")}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {t("social_title")}
            </h4>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com/drakristhymoreno"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Dra. Kristhy"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-amber-400 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Camera className="h-5 w-5" />
              </Link>
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                aria-label="Facebook próximamente"
                title="Próximamente"
              >
                <ThumbsUp className="h-5 w-5" />
              </span>
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                aria-label="X/Twitter próximamente"
                title="Próximamente"
              >
                <Send className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>{t("rights")}</span>
            <span className="h-3 w-px bg-slate-300" aria-hidden />
            <Link href="/privacidad" className="hover:text-slate-900">
              {t("privacy")}
            </Link>
            <span className="h-3 w-px bg-slate-300" aria-hidden />
            <Link href="/terminos" className="hover:text-slate-900">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
