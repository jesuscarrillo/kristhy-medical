"use client";

type BarChartData = {
  label: string;
  value: number;
  color?: string;
};

type SimpleBarChartProps = {
  data: BarChartData[];
  title?: string;
  maxValue?: number;
};

const defaultColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

export function SimpleBarChart({ data, title, maxValue }: SimpleBarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      )}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium text-slate-800">{item.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  item.color || defaultColors[index % defaultColors.length]
                }`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type MonthlyChartProps = {
  data: { month: string; count: number }[];
  title?: string;
};

const monthNames: Record<string, string> = {
  "01": "Ene",
  "02": "Feb",
  "03": "Mar",
  "04": "Abr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dic",
};

export function MonthlyBarChart({ data, title }: MonthlyChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      )}
      <div className="flex h-32 items-end gap-1">
        {data.map((item) => {
          const monthPart = item.month.split("-")[1];
          const height = (item.count / max) * 100;
          return (
            <div
              key={item.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              <div
                className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                style={{ height: `${Math.max(height, 4)}%` }}
              />
              <span className="mt-1 text-[10px] text-slate-500">
                {monthNames[monthPart] || monthPart}
              </span>
              <div className="absolute -top-6 hidden rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                {item.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
