import { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "blue" | "green" | "pink";
};

const accentStyles = {
  blue: {
    icon: "bg-sky-50 text-sky-600",
    hover: "group-hover:border-sky-200 group-hover:bg-sky-50/30",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    hover: "group-hover:border-emerald-200 group-hover:bg-emerald-50/30",
  },
  pink: {
    icon: "bg-pink-50 text-pink-600",
    hover: "group-hover:border-pink-200 group-hover:bg-pink-50/30",
  },
};

export function ServiceCard({ title, description, icon: Icon, accent = "blue" }: ServiceCardProps) {
  const style = accentStyles[accent];

  return (
    <div
      className={`group h-full rounded-2xl border border-slate-100 bg-white p-7 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/80 hover:-translate-y-1 ${style.hover}`}
    >
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${style.icon} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
