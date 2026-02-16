import { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "blue" | "green" | "pink";
};

const accentStyles = {
  blue: {
    icon: "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
    hover: "group-hover:border-sky-200 dark:group-hover:border-sky-700 group-hover:bg-sky-50/30 dark:group-hover:bg-sky-900/20",
  },
  green: {
    icon: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    hover: "group-hover:border-emerald-200 dark:group-hover:border-emerald-700 group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/20",
  },
  pink: {
    icon: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    hover: "group-hover:border-pink-200 dark:group-hover:border-pink-700 group-hover:bg-pink-50/30 dark:group-hover:bg-pink-900/20",
  },
};

export function ServiceCard({ title, description, icon: Icon, accent = "blue" }: ServiceCardProps) {
  const style = accentStyles[accent];

  return (
    <div
      className={`group h-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-7 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-teal-500/10 hover:-translate-y-1 ${style.hover}`}
    >
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${style.icon} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
