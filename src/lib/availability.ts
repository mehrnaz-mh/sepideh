import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { parseCalendarDate } from "@/lib/dates";
import { workingHours as defaultWorkingHours } from "@/data/content";
import type { DayOfWeek } from "@prisma/client";

const DAY_MAP: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

function parseTime(baseDate: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return setMinutes(setHours(startOfDay(baseDate), hours), minutes);
}

export async function getAvailableSlots(
  date: Date,
  serviceDuration: number,
  bufferMinutes: number,
) {
  const dayOfWeek = DAY_MAP[date.getDay()];

  let rules = await prisma.availabilityRule.findMany({
    where: { dayOfWeek, isActive: true },
  });

  if (rules.length === 0) {
    const fallback = defaultWorkingHours.find((r) => r.dayOfWeek === dayOfWeek);
    if (!fallback) return [];
    rules = [
      {
        id: "fallback",
        dayOfWeek,
        startTime: fallback.startTime,
        endTime: fallback.endTime,
        isActive: true,
      },
    ];
  }

  const blockedDates = await prisma.blockedDate.findMany({
    where: { date: parseCalendarDate(format(date, "yyyy-MM-dd")) },
  });

  if (blockedDates.some((b) => b.allDay)) return [];

  const dayStart = startOfDay(date);
  const dayEnd = addMinutes(dayStart, 24 * 60 - 1);

  const appointments = await prisma.appointment.findMany({
    where: {
      startTime: { gte: dayStart, lte: dayEnd },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  const slots: string[] = [];
  // Minimum 2-hour gap between appointments
  const effectiveBuffer = Math.max(bufferMinutes, 120);
  const totalDuration = serviceDuration + effectiveBuffer;

  for (const rule of rules) {
    let current = parseTime(date, rule.startTime);
    // Round up to next full hour
    const mins = current.getMinutes();
    if (mins !== 0) current = addMinutes(current, 60 - mins);
    const end = parseTime(date, rule.endTime);

    while (current <= end) {
      const slotWithBuffer = addMinutes(current, totalDuration);

      const blocked = blockedDates.some((b) => {
        if (b.allDay) return true;
        if (!b.startTime || !b.endTime) return false;
        const blockStart = parseTime(date, b.startTime);
        const blockEnd = parseTime(date, b.endTime);
        return current < blockEnd && slotWithBuffer > blockStart;
      });

      const hasConflict = appointments.some((apt) => {
        const aptEndWithBuffer = addMinutes(apt.endTime, effectiveBuffer);
        return current < aptEndWithBuffer && slotWithBuffer > apt.startTime;
      });

      const isPast = isBefore(current, new Date());

      if (!blocked && !hasConflict && !isPast) {
        slots.push(format(current, "HH:mm"));
      }

      current = addMinutes(current, 120);
    }
  }

  return [...new Set(slots)].sort();
}

export async function getAvailableDates(
  dates: string[],
  serviceDuration: number,
  bufferMinutes: number,
): Promise<string[]> {
  if (dates.length === 0) return [];

  const effectiveBuffer = Math.max(bufferMinutes, 120);
  const totalDuration = serviceDuration + effectiveBuffer;

  const firstDate = parse(dates[0], "yyyy-MM-dd", new Date());
  const lastDate = parse(dates[dates.length - 1], "yyyy-MM-dd", new Date());
  const rangeStart = startOfDay(firstDate);
  const rangeEnd = addMinutes(startOfDay(lastDate), 24 * 60 - 1);

  // Single batch fetch for entire date range
  const [allRules, allBlocked, allAppointments] = await Promise.all([
    prisma.availabilityRule.findMany({ where: { isActive: true } }),
    prisma.blockedDate.findMany({
      where: { date: { gte: rangeStart, lte: rangeEnd } },
    }),
    prisma.appointment.findMany({
      where: {
        startTime: { gte: rangeStart, lte: rangeEnd },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
  ]);

  const available: string[] = [];

  for (const dateStr of dates) {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    const dayOfWeek = DAY_MAP[date.getDay()];

    let rules = allRules.filter((r) => r.dayOfWeek === dayOfWeek);
    if (rules.length === 0) {
      const fallback = defaultWorkingHours.find((r) => r.dayOfWeek === dayOfWeek);
      if (!fallback) continue;
      rules = [{ id: "fallback", dayOfWeek, startTime: fallback.startTime, endTime: fallback.endTime, isActive: true }];
    }

    const dayStart = startOfDay(date);
    const dayEnd = addMinutes(dayStart, 24 * 60 - 1);

    const dayBlocked = allBlocked.filter(
      (b) => b.date >= dayStart && b.date <= dayEnd,
    );
    if (dayBlocked.some((b) => b.allDay)) continue;

    const dayAppointments = allAppointments.filter(
      (a) => a.startTime >= dayStart && a.startTime <= dayEnd,
    );

    let hasSlot = false;
    for (const rule of rules) {
      let current = parseTime(date, rule.startTime);
      const mins = current.getMinutes();
      if (mins !== 0) current = addMinutes(current, 60 - mins);
      const end = parseTime(date, rule.endTime);

      while (current <= end) {
        const slotWithBuffer = addMinutes(current, totalDuration);

        const blocked = dayBlocked.some((b) => {
          if (b.allDay) return true;
          if (!b.startTime || !b.endTime) return false;
          const blockStart = parseTime(date, b.startTime);
          const blockEnd = parseTime(date, b.endTime);
          return current < blockEnd && slotWithBuffer > blockStart;
        });

        const hasConflict = dayAppointments.some((apt) => {
          const aptEndWithBuffer = addMinutes(apt.endTime, effectiveBuffer);
          return current < aptEndWithBuffer && slotWithBuffer > apt.startTime;
        });

        const isPast = isBefore(current, new Date());

        if (!blocked && !hasConflict && !isPast) {
          hasSlot = true;
          break;
        }
        current = addMinutes(current, 120);
      }
      if (hasSlot) break;
    }

    if (hasSlot) available.push(dateStr);
  }

  return available;
}

export async function isSlotAvailable(
  startTime: Date,
  serviceDuration: number,
  bufferMinutes: number,
) {
  const slots = await getAvailableSlots(
    startTime,
    serviceDuration,
    bufferMinutes,
  );
  const timeStr = format(startTime, "HH:mm");
  return slots.includes(timeStr);
}
