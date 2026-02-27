"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CalendarClock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const navAnchors = [
  { href: "#hero", key: "nav.home" },
  { href: "#services", key: "nav.services" },
  { href: "#about", key: "nav.about" },
  { href: "#contact", key: "nav.contact" },
];

export function Header({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const localeBase = currentLocale === routing.defaultLocale ? "" : `/${currentLocale}`;
  const anchorHref = (hash: string) => {
    const cleaned = hash.replace("#", "");
    return `${localeBase}/#${cleaned}`;
  };
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, hash: string) => {
    const cleaned = hash.replace("#", "");
    const element = document.getElementById(cleaned);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', anchorHref(hash));
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar el menú móvil si el viewport pasa al breakpoint desktop (md = 768px)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-lg" : "bg-white/60 dark:bg-slate-900/60"
        }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 ${scrolled ? "py-3" : "py-4"
          } transition-all duration-300`}
      >
        <Link
          href={anchorHref("#hero")}
          onClick={(e) => handleScrollTo(e, "#hero")}
          className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white dark:bg-slate-800 shadow-lg ring-1 ring-sky-100 dark:ring-slate-700">
            <Image
              src="/images/header-logo.png"
              alt={`Logo ${t("hero.title")}`}
              fill
              sizes="80px"
              className="object-contain scale-125"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base">{t("hero.title")}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t("hero.specialist_field")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navAnchors.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuLink
                    href={anchorHref(item.href)}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                  >
                    {t(item.key)}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
          <LanguageSwitcher currentLocale={currentLocale} />
          <Button
            onClick={(e) => handleScrollTo(e, "#contact")}
            className="group rounded-full bg-teal-600 px-6 font-bold text-white shadow-[0_0_20px_-5px_rgba(13,148,136,0.4)] transition-all duration-300 hover:bg-teal-700 hover:shadow-[0_0_25px_-5px_rgba(13,148,136,0.6)] hover:-translate-y-0.5 cursor-pointer"
          >
            <CalendarClock className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {t("hero.cta_primary")}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageSwitcher currentLocale={currentLocale} />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} className="w-72">
              <SheetHeader>
                <SheetTitle>{t("hero.title")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {navAnchors.map((item) => (
                  <Link
                    key={item.key}
                    href={anchorHref(item.href)}
                    onClick={(e) => { handleScrollTo(e, item.href); setMobileOpen(false); }}
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Button
                  onClick={(e) => { handleScrollTo(e, "#contact"); setMobileOpen(false); }}
                  className="group mt-2 rounded-full bg-teal-600 px-6 font-bold text-white shadow-[0_0_20px_-5px_rgba(13,148,136,0.4)] transition-all duration-300 hover:bg-teal-700 hover:shadow-[0_0_25px_-5px_rgba(13,148,136,0.6)] cursor-pointer"
                >
                  <CalendarClock className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  {t("hero.cta_primary")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
