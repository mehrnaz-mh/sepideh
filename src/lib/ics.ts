import ical, { ICalCalendarMethod } from "ical-generator";
import { siteConfig } from "@/data/content";

export function generateIcsEvent({
  title,
  description,
  startTime,
  endTime,
  attendeeEmail,
  attendeeName,
}: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
  attendeeName: string;
}) {
  const calendar = ical({ name: siteConfig.name, method: ICalCalendarMethod.REQUEST });

  calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: title,
    description,
    location: siteConfig.location,
    organizer: {
      name: siteConfig.name,
      email: siteConfig.email,
    },
    attendees: [{ name: attendeeName, email: attendeeEmail, rsvp: true }],
  });

  return calendar.toString();
}
