import type { AppointmentStatus, Prisma } from "@prisma/client";
import { services } from "@/data/content";
import { generateIcsEvent } from "@/lib/ics";
import { sendEmail, type SendEmailResult } from "@/lib/resend";

export type AppointmentWithDetails = Prisma.AppointmentGetPayload<{
  include: {
    client: true;
    service: { include: { translations: true } };
  };
}>;

function resolveClientEmail(email: string) {
  const testEmail = process.env.BOOKING_TEST_EMAIL?.trim();
  if (testEmail && process.env.NODE_ENV === "development") {
    return testEmail;
  }
  return email;
}

function adminEmail() {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    "se.mihanparast@yahoo.com"
  );
}

function serviceTitle(appointment: AppointmentWithDetails) {
  const locale = appointment.locale === "en" ? "en" : "de";
  return (
    appointment.service.translations.find((t) => t.locale === locale)?.title ??
    services.find((s) => s.slug === appointment.service.slug)?.[locale].title ??
    appointment.service.slug
  );
}

function formatDateTime(date: Date, locale: string) {
  const loc = locale === "de" ? "de-DE" : "en-GB";
  return {
    date: date.toLocaleDateString(loc, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString(loc, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function emailLayout(body: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #171717;">
      <h1 style="font-weight: 400; font-size: 24px;">Sepideh Mihanparast</h1>
      ${body}
    </div>
  `;
}

function bookingRequestHtml(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;
  const service = serviceTitle(appointment);
  const { date, time } = formatDateTime(appointment.startTime, appointment.locale);

  return emailLayout(`
    <p style="color: #757575;">${isDe ? "Liebe/r" : "Dear"} ${name},</p>
    <p style="color: #757575;">
      ${
        isDe
          ? "Vielen Dank für Ihre Buchungsanfrage."
          : "Thank you for your booking request."
      }
    </p>
    <div style="background: #F8F5F2; padding: 24px; margin: 24px 0;">
      <p><strong>${isDe ? "Leistung" : "Service"}:</strong> ${service}</p>
      <p><strong>${isDe ? "Datum" : "Date"}:</strong> ${date}</p>
      <p><strong>${isDe ? "Uhrzeit" : "Time"}:</strong> ${time}</p>
      <p><strong>Status:</strong> ${isDe ? "Ausstehend" : "Pending"}</p>
    </div>
    <p style="color: #757575;">
      ${
        isDe
          ? "Ich bestätige Ihren Termin innerhalb von 24–48 Stunden."
          : "I will confirm your appointment within 24–48 hours."
      }
    </p>
  `);
}

function bookingConfirmedHtml(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;
  const service = serviceTitle(appointment);
  const { date, time } = formatDateTime(appointment.startTime, appointment.locale);

  return emailLayout(`
    <p style="color: #757575;">${isDe ? "Liebe/r" : "Dear"} ${name},</p>
    <p style="color: #757575;">
      ${
        isDe
          ? "Ihr Termin wurde bestätigt."
          : "Your appointment has been confirmed."
      }
    </p>
    <div style="background: #F8F5F2; padding: 24px; margin: 24px 0;">
      <p><strong>${isDe ? "Leistung" : "Service"}:</strong> ${service}</p>
      <p><strong>${isDe ? "Datum" : "Date"}:</strong> ${date}</p>
      <p><strong>${isDe ? "Uhrzeit" : "Time"}:</strong> ${time}</p>
    </div>
    <p style="color: #757575;">
      ${isDe ? "Wir freuen uns auf Sie." : "We look forward to seeing you."}
    </p>
  `);
}

function bookingCancelledHtml(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;
  const service = serviceTitle(appointment);
  const { date, time } = formatDateTime(appointment.startTime, appointment.locale);

  return emailLayout(`
    <p style="color: #757575;">${isDe ? "Liebe/r" : "Dear"} ${name},</p>
    <p style="color: #757575;">
      ${
        isDe
          ? "Ihr Termin wurde storniert."
          : "Your appointment has been cancelled."
      }
    </p>
    <div style="background: #F8F5F2; padding: 24px; margin: 24px 0;">
      <p><strong>${isDe ? "Leistung" : "Service"}:</strong> ${service}</p>
      <p><strong>${isDe ? "Datum" : "Date"}:</strong> ${date}</p>
      <p><strong>${isDe ? "Uhrzeit" : "Time"}:</strong> ${time}</p>
    </div>
    <p style="color: #757575;">
      ${
        isDe
          ? "Bei Fragen können Sie uns jederzeit kontaktieren."
          : "Please contact us if you have any questions."
      }
    </p>
  `);
}

function adminNewBookingHtml(appointment: AppointmentWithDetails) {
  const service = serviceTitle(appointment);
  const client = appointment.client;

  return `
    <h2>New Booking Request</h2>
    <p><strong>Client:</strong> ${client.firstName} ${client.lastName}</p>
    <p><strong>Email:</strong> ${client.email}</p>
    <p><strong>Phone:</strong> ${client.phone || "N/A"}</p>
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Start:</strong> ${appointment.startTime.toISOString()}</p>
    <p><strong>Notes:</strong> ${appointment.notes || "—"}</p>
  `;
}

export async function sendBookingRequestEmail(
  appointment: AppointmentWithDetails,
): Promise<SendEmailResult> {
  const isDe = appointment.locale === "de";
  const service = serviceTitle(appointment);
  const clientName = `${appointment.client.firstName} ${appointment.client.lastName}`;

  const ics = generateIcsEvent({
    title: service,
    description: appointment.notes || service,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    attendeeEmail: appointment.client.email,
    attendeeName: clientName,
  });

  return sendEmail({
    to: resolveClientEmail(appointment.client.email),
    subject: isDe
      ? "Ihre Buchungsanfrage — Sepideh Mihanparast"
      : "Your Booking Request — Sepideh Mihanparast",
    html: bookingRequestHtml(appointment),
    attachments: [{ filename: "appointment.ics", content: ics }],
  });
}

export async function sendAdminNewBookingNotification(
  appointment: AppointmentWithDetails,
): Promise<SendEmailResult> {
  const client = appointment.client;

  return sendEmail({
    to: adminEmail(),
    subject: `New Booking: ${client.firstName} ${client.lastName}`,
    html: adminNewBookingHtml(appointment),
  });
}

export async function notifyAppointmentStatusChange(
  appointment: AppointmentWithDetails,
  previousStatus: AppointmentStatus,
): Promise<SendEmailResult> {
  const { status } = appointment;
  const isDe = appointment.locale === "de";

  if (status === "CONFIRMED" && previousStatus !== "CONFIRMED") {
    const service = serviceTitle(appointment);
    const clientName = `${appointment.client.firstName} ${appointment.client.lastName}`;
    const ics = generateIcsEvent({
      title: service,
      description: appointment.notes || service,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      attendeeEmail: appointment.client.email,
      attendeeName: clientName,
    });

    return sendEmail({
      to: resolveClientEmail(appointment.client.email),
      subject: isDe
        ? "Termin bestätigt — Sepideh Mihanparast"
        : "Appointment Confirmed — Sepideh Mihanparast",
      html: bookingConfirmedHtml(appointment),
      attachments: [{ filename: "appointment.ics", content: ics }],
    });
  }

  if (status === "CANCELLED" && previousStatus !== "CANCELLED") {
    return sendEmail({
      to: resolveClientEmail(appointment.client.email),
      subject: isDe
        ? "Termin storniert — Sepideh Mihanparast"
        : "Appointment Cancelled — Sepideh Mihanparast",
      html: bookingCancelledHtml(appointment),
    });
  }

  return { ok: true };
}
