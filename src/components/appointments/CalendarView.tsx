"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  prenatal: "bg-pink-100 text-pink-800 border-pink-200",
  gynecology: "bg-purple-100 text-purple-800 border-purple-200",
  ultrasound: "bg-blue-100 text-blue-800 border-blue-200",
  followup: "bg-green-100 text-green-800 border-green-200",
};

const statusColors: Record<string, string> = {
  scheduled: "border-l-blue-500",
  completed: "border-l-green-500",
  cancelled: "border-l-red-500 opacity-50",
  noshow: "border-l-orange-500",
};

const typeLabels: Record<string, string> = {
  prenatal: "Prenatal",
  gynecology: "Ginecología",
  ultrasound: "Ecografía",
  followup: "Control",
};

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
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
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    } else {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 7
        )
      );
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    } else {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 7
        )
      );
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthDays = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const weekDays = getWeekDays(currentDate);
  const today = new Date();

  const getHeaderText = () => {
    if (viewMode === "month") {
      return `${MONTHS_ES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${MONTHS_ES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
    }
    return `${weekStart.getDate()} ${MONTHS_ES[weekStart.getMonth()].slice(0, 3)} - ${weekEnd.getDate()} ${MONTHS_ES[weekEnd.getMonth()].slice(0, 3)} ${weekEnd.getFullYear()}`;
  };

  const renderDayCell = (date: Date | null, isWeekView = false) => {
    if (!date) {
      return <div className="min-h-24 bg-slate-50" />;
    }

    const dayAppointments = appointmentsByDate.get(date.toDateString()) || [];
    const isToday = isSameDay(date, today);
    const isPast = date < today && !isToday;

    return (
      <div
        className={`min-h-24 border-t border-slate-200 p-1 ${
          isPast ? "bg-slate-50" : "bg-white"
        } ${isWeekView ? "min-h-32" : ""}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
              isToday
                ? "bg-blue-600 font-semibold text-white"
                : isPast
                  ? "text-slate-400"
                  : "text-slate-700"
            }`}
          >
            {date.getDate()}
          </span>
          {dayAppointments.length === 0 && !isPast && (
            <Link
              href={`/dashboard/citas/nuevo?date=${date.toISOString().split("T")[0]}`}
              className="text-xs text-slate-400 hover:text-blue-600"
            >
              +
            </Link>
          )}
        </div>
        <div className="mt-1 space-y-1">
          {dayAppointments
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, isWeekView ? 10 : 3)
            .map((apt) => (
              <Link
                key={apt.id}
                href={`/dashboard/citas/${apt.id}`}
                className={`block truncate rounded border-l-2 px-1.5 py-0.5 text-xs transition-opacity hover:opacity-80 ${
                  typeColors[apt.type] || "bg-slate-100 text-slate-800"
                } ${statusColors[apt.status] || ""}`}
              >
                <span className="font-medium">{formatTime(apt.date)}</span>
                {isWeekView && (
                  <span className="ml-1">
                    {apt.patient.firstName} {apt.patient.lastName.charAt(0)}.
                  </span>
                )}
              </Link>
            ))}
          {dayAppointments.length > (isWeekView ? 10 : 3) && (
            <p className="text-xs text-slate-500">
              +{dayAppointments.length - (isWeekView ? 10 : 3)} más
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <h2 className="ml-2 text-lg font-semibold text-slate-800">
            {getHeaderText()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 text-sm ${
                viewMode === "month"
                  ? "bg-slate-100 font-medium text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 text-sm ${
                viewMode === "week"
                  ? "bg-slate-100 font-medium text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Semana
            </button>
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/citas/nuevo">Nueva cita</Link>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 border-b border-slate-100 px-4 py-2">
        {Object.entries(typeLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded ${typeColors[key]?.split(" ")[0] || "bg-slate-200"}`}
            />
            <span className="text-xs text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {viewMode === "month" ? (
        <div className="grid grid-cols-7">
          {/* Day headers */}
          {DAYS_ES.map((day) => (
            <div
              key={day}
              className="border-b border-slate-200 bg-slate-50 px-2 py-2 text-center text-xs font-medium text-slate-600"
            >
              {day}
            </div>
          ))}
          {/* Day cells */}
          {monthDays.map((date, index) => (
            <div
              key={index}
              className={`border-r border-slate-200 ${
                index % 7 === 6 ? "border-r-0" : ""
              }`}
            >
              {renderDayCell(date)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7">
          {/* Day headers for week view */}
          {weekDays.map((date, index) => (
            <div
              key={index}
              className={`border-b border-slate-200 bg-slate-50 px-2 py-2 text-center ${
                isSameDay(date, today) ? "bg-blue-50" : ""
              }`}
            >
              <p className="text-xs font-medium text-slate-600">
                {DAYS_ES[date.getDay()]}
              </p>
              <p
                className={`text-lg ${
                  isSameDay(date, today)
                    ? "font-bold text-blue-600"
                    : "text-slate-800"
                }`}
              >
                {date.getDate()}
              </p>
            </div>
          ))}
          {/* Day cells for week view */}
          {weekDays.map((date, index) => (
            <div
              key={index}
              className={`border-r border-slate-200 ${
                index === 6 ? "border-r-0" : ""
              }`}
            >
              {renderDayCell(date, true)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
