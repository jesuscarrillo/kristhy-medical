import { useTranslations } from "next-intl";
import { Baby, ShieldPlus, Stethoscope, Scan, Syringe, Activity } from "lucide-react";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Reveal } from "@/components/shared/Reveal";

const icons = {
  prenatal: Baby,
  highRisk: ShieldPlus,
  gynecology: Stethoscope,
  surgery: Syringe,
  ultrasound: Scan,
  urogynecology: Activity,
};

const accents: ("blue" | "green" | "pink")[] = ["blue", "green", "pink", "blue", "green", "pink"];

export function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as Record<keyof typeof icons, { title: string; description: string }>;

  return (
    <section id="services" className="bg-white py-20 scroll-mt-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{t("title")}</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{t("subtitle")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          {Object.entries(items).map(([key, value], index) => {
            const iconKey = key as keyof typeof icons;
            // Make every 4th item span 2 columns for "Bento" look
            const isLarge = index === 0 || index === 3;

            return (
              <Reveal key={key} delay={index * 0.05} className={`${isLarge ? 'md:col-span-2' : ''} h-full`}>
                <ServiceCard
                  title={value.title}
                  description={value.description}
                  icon={icons[iconKey]}
                  accent={accents[index % accents.length]}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
