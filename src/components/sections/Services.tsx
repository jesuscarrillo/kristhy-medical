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
    <section id="services" className="bg-white dark:bg-slate-900 py-24 scroll-mt-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-4">
            {t("title")}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-5">
            {t("subtitle")}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(items).map(([key, value], index) => {
            const iconKey = key as keyof typeof icons;
            return (
              <Reveal key={key} delay={index * 0.08}>
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
