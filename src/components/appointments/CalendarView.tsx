"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Appointment = {
  id: string;
  date: Date;
  duration: number;
  type: string;
  status: string;
  reason: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

type CalendarViewProps = {
  appointments: Appointment[];
  initialDate?: Date;
};

type ViewMode = "month" | "week";

const typeColors: Record<string, string> = {
  prenatal: "bg-pink-100/50 text-pink-700 border-pink-200 hover:bg-pink-100",
  gynecology: "bg-purple-100/50 text-purple-700 border-purple-200 hover:bg-purple-100",
  ultrasound: "bg-blue-100/50 text-blue-700 border-blue-200 hover:bg-blue-100",
  followup: "bg-emerald-100/50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
};

const statusIndicators: Record<string, string> = {
  scheduled: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
  noshow: "bg-orange-500",
};

const typeLabels: Record<string, string> = {
  prenatal: "Prenatal",
  gynecology: "Ginecología",
  ultrasound: "Ecografía",
  followup: "Control",
};

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  return days;
}

function getWeekDays(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekStart = new Date(date.getFullYear(), date.getMonth(), diff);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(
      new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i)
    );
  }
  return days;
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Extraído como componente para evitar inline render function (react-doctor)
function DayCell({
  date,
  isWeekView = false,
  appointmentsByDate,
  today,
}: {
  date: Date | null;
  isWeekView?: boolean;
  appointmentsByDate: Map<string, Appointment[]>;
  today: Date;
}) {
  if (!date) return <div className="min-h-[140px] bg-slate-50/30" />;

  const dayAppointments = appointmentsByDate.get(date.toDateString()) || [];
  const isToday = isSameDay(date, today);
  const isPast = date < today && !isToday;

  return (
    <div
      className={cn(
        "group relative flex min-h-[140px] flex-col border-t border-slate-100 p-2 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/50",
        isPast && "bg-slate-50/30 dark:bg-slate-900/20",
        isWeekView && "min-h-[200px]"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all",
            isToday
              ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-110"
              : isPast
                ? "text-slate-400"
                : "text-slate-700 font-medium dark:text-slate-300"
          )}
        >
          {date.getDate()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-primary"
          asChild
        >
          <Link href={`/dashboard/citas/nuevo?date=${date.toISOString().split("T")[0]}`}>
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 customize-scrollbar">
        {dayAppointments
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .slice(0, isWeekView ? 10 : 3)
          .map((apt) => (
            <Link
              key={apt.id}
              href={`/dashboard/citas/${apt.id}`}
              className={cn(
                "flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-all hover:scale-[1.02] hover:shadow-sm",
                typeColors[apt.type] || "bg-slate-100 text-slate-800 border-slate-200"
              )}
            >
              <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusIndicators[apt.status] || "bg-slate-400")} />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold leading-none">{formatTime(apt.date)}</span>
                <span className="truncate opacity-90 mt-0.5">
                  {apt.patient.firstName} {apt.patient.lastName.charAt(0)}.
                </span>
              </div>
            </Link>
          ))}

        {dayAppointments.length > (isWeekView ? 10 : 3) && (
          <div className="mt-1 text-center">
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              +{dayAppointments.length - (isWeekView ? 10 : 3)} más
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export function CalendarView({ appointments, initialDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate ?? new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((apt) => {
      const dateKey = new Date(apt.date).toDateString();
      const existing = map.get(dateKey) || [];
      existing.push({
        ...apt,
        date: new Date(apt.date),
      });
      map.set(dateKey, existing);
    });
    return map;
  }, [appointments]);

  const navigatePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const weekDays = getWeekDays(currentDate);
  const today = new Date();

  const getHeaderText = () => {
    if (viewMode === "month") {
      return (
        <span className="capitalize">{`${MONTHS_ES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</span>
      );
    }
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${MONTHS_ES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
    }
    return `${weekStart.getDate()} ${MONTHS_ES[weekStart.getMonth()].slice(0, 3)} - ${weekEnd.getDate()} ${MONTHS_ES[weekEnd.getMonth()].slice(0, 3)} ${weekEnd.getFullYear()}`;
  };

  return (
    <Card className="border-0 shadow-xl shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800 dark:shadow-none">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-white/50 p-6 dark:bg-slate-950 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <Button variant="ghost" size="icon" onClick={navigatePrev} className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <Button variant="ghost" size="icon" onClick={navigateNext} className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday} className="hidden sm:flex">
            Hoy
          </Button>
          <h2 className="ml-2 text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {getHeaderText()}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg dark:bg-slate-900">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                viewMode === "month"
                  ? "bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-primary-foreground"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              )}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                viewMode === "week"
                  ? "bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-primary-foreground"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              )}
            >
              Semana
            </button>
          </div>
          <Button asChild size="sm" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
            <Link href="/dashboard/citas/nuevo">
              <Plus className="mr-1.5 h-4 w-4" />
              Nueva Cita
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 bg-slate-50/30 px-6 py-3 dark:bg-slate-900/10 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Leyenda:</span>
        {Object.entries(typeLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-950", statusIndicators[key] || typeColors[key]?.split(" ")[0])} />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div className={cn("grid grid-cols-7 bg-slate-200 gap-px dark:bg-slate-800", viewMode === "month" ? "" : "")}>
        {DAYS_ES.map((day) => (
          <div
            key={day}
            className="bg-slate-50 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:text-slate-400"
          >
            {day}
          </div>
        ))}
        {viewMode === "month" ? (
          monthDays.map((date, index) => (
            <div key={date?.toISOString() ?? `empty-${index}`} className="bg-white dark:bg-slate-950 min-h-[140px]">
              <DayCell date={date} appointmentsByDate={appointmentsByDate} today={today} />
            </div>
          ))
        ) : (
          weekDays.map((date) => (
            <div key={date.toISOString()} className="bg-white dark:bg-slate-950 min-h-[200px]">
              <DayCell date={date} isWeekView appointmentsByDate={appointmentsByDate} today={today} />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
