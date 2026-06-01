/**
 * Calendar dates (YYYY-MM-DD) without timezone drift.
 * Use for @db.Date fields and booking day matching.
 */

export function parseCalendarDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatCalendarDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatCalendarDateDisplay(date: Date, locale = "de-DE"): string {
  return date.toLocaleDateString(locale, {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
