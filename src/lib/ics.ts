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

/** Resend/Gmail: UTF-8 string + calendar MIME type. */
export function buildIcsEmailAttachment(icsContent: string) {
  return {
    filename: "appointment.ics",
    content: icsContent,
    contentType: "text/calendar; charset=utf-8",
  };
}
