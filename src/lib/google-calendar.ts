import { google } from "googleapis";

export async function createGoogleCalendarEvent({
  title,
  description,
  startTime,
  endTime,
  attendeeEmail,
}: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
}) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !calendarId || !refreshToken) {
    console.log("[Google Calendar] Not configured — skipping event creation");
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: title,
      description,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: [{ email: attendeeEmail }],
    },
  });

  return event.data.id;
}
