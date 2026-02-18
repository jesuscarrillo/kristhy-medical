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
    <div className="space-y-4">
      {title && (
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.label} className="group space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="font-mono font-semibold tabular-nums text-slate-800 dark:text-slate-200">{item.value}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100/80 dark:bg-slate-800/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-80 ${
                  item.color || defaultColors[index % defaultColors.length]
                }`}
                style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
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
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  // Generate grid lines (4 lines)
  const gridLines = [0.25, 0.5, 0.75, 1].map((pct) => Math.round(max * pct));

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      )}
      <div className="relative">
        {/* Grid lines */}
        <div className="absolute inset-x-0 top-0 h-48 pointer-events-none">
          {gridLines.map((val, i) => (
            <div
              key={String(val)}
              className="absolute w-full border-t border-dashed border-slate-200/60 dark:border-slate-700/40"
              style={{ bottom: `${((i + 1) / 4) * 100}%` }}
            >
              <span className="absolute -top-2.5 -left-1 text-[8px] text-slate-400 font-mono tabular-nums">
                {val}
              </span>
            </div>
          ))}
        </div>

        <div className="flex h-48 items-end gap-1.5 pl-5">
          {data.map((item) => {
            const monthPart = item.month.split("-")[1];
            const height = (item.count / max) * 100;
            const isCurrentMonth = item.month === currentMonth;
            return (
              <div
                key={item.month}
                className="group relative flex flex-1 flex-col items-center"
              >
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isCurrentMonth
                      ? "bg-gradient-to-t from-primary to-primary/70 shadow-sm shadow-primary/20"
                      : "bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500"
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className={`mt-1.5 text-[10px] font-medium ${
                  isCurrentMonth ? "text-primary font-bold" : "text-slate-500 dark:text-slate-400"
                }`}>
                  {monthNames[monthPart] || monthPart}
                </span>
                {/* Tooltip */}
                <div className="absolute -top-9 hidden rounded-lg bg-slate-800 dark:bg-slate-700 px-2.5 py-1 text-[11px] font-mono font-semibold text-white shadow-lg group-hover:block z-10">
                  {item.count}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-700" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
