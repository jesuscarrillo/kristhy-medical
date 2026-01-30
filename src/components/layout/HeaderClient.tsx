"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header").then((m) => m.Header), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-50 h-16 w-full bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6 lg:px-8" />
    </header>
  ),
});

export function HeaderClient({ currentLocale }: { currentLocale: string }) {
  return <Header currentLocale={currentLocale} />;
}
