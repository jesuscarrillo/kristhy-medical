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
    <section className="bg-slate-50/50 py-24 scroll-mt-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">{t("title")}</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            {t("subtitle")}
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            La confianza de mis pacientes es mi mayor logro profesional.
          </p>
        </div>

        <Carousel className="relative" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-0 bg-white shadow-md transition-all hover:shadow-xl">
                  {/* Decorative Top Border */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-rose-300 to-teal-400" />

                  <CardHeader className="space-y-4 pt-8 pb-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating)}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-base leading-relaxed text-slate-700 italic">
                      "{item.text}"
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                      {/* Avatar Placeholder */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-rose-100 text-teal-700 font-bold text-lg">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900">{item.name}</CardTitle>
                        <p className="text-sm text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 h-12 w-12 border-slate-200 bg-white text-slate-600 shadow-lg hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200" />
          <CarouselNext className="-right-4 h-12 w-12 border-slate-200 bg-white text-slate-600 shadow-lg hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200" />
        </Carousel>
      </div>
    </section>
  );
}
