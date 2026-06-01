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
  const totalDuration = serviceDuration + bufferMinutes;

  for (const rule of rules) {
    let current = parseTime(date, rule.startTime);
    const end = parseTime(date, rule.endTime);

    while (addMinutes(current, totalDuration) <= end) {
      const slotEnd = addMinutes(current, serviceDuration);
      const slotWithBuffer = addMinutes(current, totalDuration);

      const blocked = blockedDates.some((b) => {
        if (b.allDay) return true;
        if (!b.startTime || !b.endTime) return false;
        const blockStart = parseTime(date, b.startTime);
        const blockEnd = parseTime(date, b.endTime);
        return current < blockEnd && slotWithBuffer > blockStart;
      });

      const hasConflict = appointments.some((apt) => {
        const aptEndWithBuffer = addMinutes(apt.endTime, bufferMinutes);
        return current < aptEndWithBuffer && slotWithBuffer > apt.startTime;
      });

      const isPast = isBefore(current, new Date());

      if (!blocked && !hasConflict && !isPast) {
        slots.push(format(current, "HH:mm"));
      }

      current = addMinutes(current, 30);
    }
  }

  return slots;
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
