import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "blue" | "green" | "pink";
};

const accentMap = {
  blue: "from-sky-100 to-white text-sky-600 border-sky-100",
  green: "from-emerald-100 to-white text-emerald-600 border-emerald-100",
  pink: "from-pink-100 to-white text-pink-600 border-pink-100",
};

export function ServiceCard({ title, description, icon: Icon, accent = "blue" }: ServiceCardProps) {
  return (
    <Card
      className={`group h-full transform border bg-gradient-to-br ${accentMap[accent]} shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 backdrop-blur-sm`}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-800 leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p className="text-base leading-relaxed text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
