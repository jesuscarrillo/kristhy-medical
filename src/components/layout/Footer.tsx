import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock, Camera } from "lucide-react";
import { routing } from "@/i18n/routing";

export function Footer({ currentLocale }: { currentLocale?: string }) {
  const t = useTranslations("footer");
  const contactT = useTranslations("contact");
  const heroT = useTranslations("hero");
  const services = t.raw("services") as string[];
  const locale = currentLocale ?? routing.defaultLocale;
  const localeBase = locale === routing.defaultLocale ? "" : `/${locale}`;
  const anchorHref = (hash: string) => {
    const cleaned = hash.replace("#", "");
    return `${localeBase}/#${cleaned}`;
  };

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{heroT("title")}</h3>
            <p className="text-xs font-medium uppercase tracking-wider text-teal-600 dark:text-teal-400">{heroT("specialist_field")}</p>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t("mini_bio")}</p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t("nav.services")}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              {services.map((item, idx) => (
                <li key={idx} className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t("nav.home")}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href={anchorHref("#hero")} className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href={anchorHref("#services")} className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href={anchorHref("#about")} className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href={anchorHref("#contact")} className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t("nav.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-500 dark:text-teal-400" />
                <span>{contactT("address")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-teal-500 dark:text-teal-400" />
                <a href={`tel:${contactT("phone").replace(/\s+/g, "")}`} className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {contactT("phone")}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-teal-500 dark:text-teal-400" />
                <a href="mailto:drakristhymoreno@gmail.com" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  {contactT("email")}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-teal-500 dark:text-teal-400" />
                <span>{contactT("schedule")}</span>
              </li>
            </ul>

            {/* Social */}
            <div className="pt-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">{t("social_title")}</p>
              <Link
                href="https://www.instagram.com/drakristhymoreno"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Dra. Kristhy"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-400 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <Camera className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("rights")}</span>
          <div className="flex items-center gap-4">
            <Link href="/privacidad" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              {t("privacy")}
            </Link>
            <Link href="/terminos" className="transition-colors hover:text-slate-700 dark:hover:text-slate-300">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
