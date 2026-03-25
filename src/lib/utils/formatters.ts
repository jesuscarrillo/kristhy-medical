/**
 * Intl formatters cacheados a nivel módulo.
 *
 * Cada instancia de Intl.DateTimeFormat / Intl.RelativeTimeFormat se crea
 * UNA SOLA VEZ cuando el módulo se carga, y se reutiliza en todos los renders
 * (tanto en el servidor Node.js como en el cliente).
 *
 * Por qué importa: new Date().toLocaleString() crea un objeto Intl interno en
 * cada llamada — O(n) instancias por tabla. Con un formatter cacheado es O(1).
 *
 * timeZone explícito garantiza output idéntico entre SSR (UTC en servidor) y
 * cliente (timezone del usuario), eliminando hydration mismatches.
 */

const TZ = "America/Caracas"; // UTC-4, sin cambio de horario

/** "24/03/2026, 10:30" — para timestamps de auditoría */
export const dateTimeFormatter = new Intl.DateTimeFormat("es-VE", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: TZ,
});

/** "24 mar. 2026" — para fecha de registro de pacientes */
export const dateShortFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TZ,
});

/** "24 mar." — para tarjetas de citas */
export const dateDayMonthFormatter = new Intl.DateTimeFormat("es-VE", {
  day: "numeric",
  month: "short",
  timeZone: TZ,
});

/** "mié., 24 mar." — para citas en el dashboard */
export const dateWeekdayFormatter = new Intl.DateTimeFormat("es-VE", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TZ,
});

/** "10:30" en 24h — para hora de citas (sin AM/PM, sin necesidad de split) */
export const timeFormatter = new Intl.DateTimeFormat("es-VE", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TZ,
});

/** Helper: acepta Date | string | number */
export function fmt(
  formatter: Intl.DateTimeFormat,
  value: Date | string | number,
): string {
  return formatter.format(value instanceof Date ? value : new Date(value));
}
