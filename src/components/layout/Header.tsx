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

const navAnchors = [
  { href: "#hero", key: "nav.home" },
  { href: "#services", key: "nav.services" },
  { href: "#about", key: "nav.about" },
  { href: "#contact", key: "nav.contact" },
];

export function Header({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);

  const localeBase = currentLocale === routing.defaultLocale ? "" : `/${currentLocale}`;
  const anchorHref = (hash: string) => {
    const cleaned = hash.replace("#", "");
    return `${localeBase}/#${cleaned}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-white/80 shadow-md backdrop-blur-lg" : "bg-white/60"
        }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 ${scrolled ? "py-3" : "py-4"
          } transition-all duration-300`}
      >
        <Link href={anchorHref("#hero")} className="flex items-center gap-3 font-semibold text-slate-900">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-sky-100">
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
            <span className="text-xs text-slate-500">{t("hero.specialist_field")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navAnchors.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuLink
                    href={anchorHref(item.href)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {t(item.key)}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <LanguageSwitcher currentLocale={currentLocale} />
          <Button
            asChild
            className="shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Link href={anchorHref("#contact")}>
              <CalendarClock className="mr-2 h-4 w-4" />
              {t("hero.cta_primary")}
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher currentLocale={currentLocale} />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{t("hero.title")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {navAnchors.map((item) => (
                  <Link
                    key={item.key}
                    href={anchorHref(item.href)}
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Button asChild className="mt-2">
                  <Link href={anchorHref("#contact")}>{t("hero.cta_primary")}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
