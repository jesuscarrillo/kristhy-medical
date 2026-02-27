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
    <section id="services" className="relative bg-[#FDFBF7] dark:bg-slate-950 py-28 scroll-mt-24 sm:py-36 overflow-hidden">
      {/* Subtle radial gradients for depth */}
      <div className="absolute inset-x-0 top-0 h-[800px] w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.1),rgba(15,23,42,0))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="inline-flex items-center justify-center rounded-full border border-teal-200/50 dark:border-teal-700/50 bg-teal-50/50 dark:bg-slate-800/50 px-5 py-2 mb-6 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-300">
              {t("title")}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl mb-6">
            {t("subtitle")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto font-medium">
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
