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
    <section className="bg-white py-16 sm:py-20">
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
                <Card className="h-full border border-emerald-50 bg-gradient-to-br from-white to-emerald-50/40">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-500">{renderStars(item.rating)}</div>
                    <CardTitle className="text-lg text-slate-900">{item.name}</CardTitle>
                    <p className="text-sm text-slate-600">{item.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700">{item.text}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
    </section>
  );
}
