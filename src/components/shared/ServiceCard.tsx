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
    <Card className={`h-full border ${accentMap[accent]} bg-gradient-to-br shadow-sm`}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-600">{description}</p>
        <Badge variant="secondary" className="rounded-full bg-white text-xs font-semibold text-slate-600">
          {title}
        </Badge>
      </CardContent>
    </Card>
  );
}
