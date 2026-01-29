import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span className="font-medium text-slate-700">Dra. Kristhy</span>
        <div className="flex flex-wrap items-center gap-3">
          <span>{t("rights")}</span>
          <span className="h-4 w-px bg-slate-300" aria-hidden />
          <a href="#contact" className="hover:text-slate-900">
            {t("privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}
