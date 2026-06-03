import ical, { ICalCalendarMethod, ICalEventStatus } from "ical-generator";
import { siteConfig } from "@/data/content";

const CALENDAR_TIMEZONE = "Europe/Berlin";

/**
 * Simple calendar event (no ATTENDEE) so iOS/Android open as editable
 * “add to calendar” — not a read-only meeting invitation.
 */
export function generateIcsEvent({
  title,
  description,
  startTime,
  endTime,
  uid,
}: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  uid: string;
}) {
  const calendar = ical({
    name: siteConfig.name,
    prodId: { company: siteConfig.name, product: "Bookings" },
    timezone: CALENDAR_TIMEZONE,
    method: ICalCalendarMethod.PUBLISH,
  });

  calendar.createEvent({
    id: uid,
    start: startTime,
    end: endTime,
    timezone: CALENDAR_TIMEZONE,
    summary: title,
    description,
    location: siteConfig.location,
    status: ICalEventStatus.CONFIRMED,
  });

  return calendar.toString();
}

/** Google Calendar fallback (works well on iPhone via browser). */
export function buildGoogleCalendarUrl({
  title,
  description,
  startTime,
  endTime,
}: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}) {
  const format = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${format(startTime)}/${format(endTime)}`,
    details: description,
    location: siteConfig.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Resend/Gmail: UTF-8 buffer + calendar MIME type. */
export function buildIcsEmailAttachment(icsContent: string) {
  return {
    filename: "appointment.ics",
    content: Buffer.from(icsContent, "utf-8"),
    contentType: "text/calendar; charset=utf-8",
  };
}
