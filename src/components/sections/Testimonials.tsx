import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as { name: string; role: string; text: string; rating: number }[];

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-500" />);
    }
    if (hasHalf) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-amber-300 text-amber-400" />);
    }
    return stars;
  };

  return (
    <section className="bg-white py-16 scroll-mt-24 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {t("title")}
          </p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("subtitle")}</h2>
        </div>

        <Carousel className="relative mt-10" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border border-slate-100 bg-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-rose-300 to-teal-400 opacity-80" />
                  <CardHeader className="space-y-3 pt-6">
                    <div className="flex items-center gap-1 text-amber-400 drop-shadow-sm">{renderStars(item.rating)}</div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">{item.name}</CardTitle>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.role}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-slate-600 italic">" {item.text} "</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200" />
          <CarouselNext className="-right-4 border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200" />
        </Carousel>
      </div>
    </section >
  );
}
