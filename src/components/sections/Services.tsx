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
    <section id="services" className="bg-white py-16 scroll-mt-24 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">{t("title")}</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t("subtitle")}</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(items).map(([key, value], index) => {
            const iconKey = key as keyof typeof icons;
            return (
              <Reveal key={key} delay={index * 0.05}>
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
