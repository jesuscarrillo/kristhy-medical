import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, StarHalf, Quote } from "lucide-react";

// Extraído como componente para evitar inline render function (react-doctor)
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  // Usar el número de estrella (1-based) como clave estable, sin índice de array
  const starNumbers = Array.from({ length: full }, (_, i) => i + 1);
  return (
    <>
      {starNumbers.map((starNum) => (
        <Star key={starNum} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && <StarHalf key="half" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
    </>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as { name: string; role: string; text: string; rating: number }[];

  return (
    <section className="bg-white dark:bg-slate-900 py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-4">
            {t("title")}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-5">
            {t("subtitle")}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Carousel */}
        <Carousel className="relative" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-5">
            {items.map((item, index) => (
              <CarouselItem key={item.name ?? index} className="pl-5 md:basis-1/2 lg:basis-1/3">
                <div className="relative h-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-[#FDFBF7] dark:bg-slate-800/90 p-7 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-teal-500/10">
                  {/* Quote icon */}
                  <Quote className="mb-4 h-8 w-8 text-teal-100 dark:text-slate-700" />

                  {/* Stars */}
                  <div className="mb-4 flex items-center gap-0.5">
                    <StarRating rating={item.rating} />
                  </div>

                  {/* Text */}
                  <p className="mb-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    &ldquo;{item.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-700 pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30 text-sm font-bold text-teal-700 dark:text-teal-400">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 h-10 w-10 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-700 transition-colors" />
          <CarouselNext className="-right-4 h-10 w-10 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-700 transition-colors" />
        </Carousel>
      </div>
    </section>
  );
}
