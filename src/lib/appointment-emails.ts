import type { AppointmentStatus, Prisma } from "@prisma/client";
import { services, siteConfig } from "@/data/content";
import { renderAdminBookingEmail, renderAppointmentEmail } from "@/lib/email-templates";
import {
  buildGoogleCalendarUrl,
  buildIcsEmailAttachment,
  generateIcsEvent,
} from "@/lib/ics";
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

function appointmentDetails(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const service = serviceTitle(appointment);
  const { date, time } = formatDateTime(appointment.startTime, appointment.locale);

  return [
    { label: isDe ? "Leistung" : "Service", value: service },
    { label: isDe ? "Datum" : "Date", value: date },
    { label: isDe ? "Uhrzeit" : "Time", value: time },
    { label: isDe ? "Ort" : "Location", value: "Hamburg, Germany" },
  ];
}

function calendarLinks(appointment: AppointmentWithDetails) {
  const service = serviceTitle(appointment);
  return buildGoogleCalendarUrl({
    title: `${service} — ${siteConfig.name}`,
    description: appointment.notes || service,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
  });
}

function bookingRequestHtml(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;

  return renderAppointmentEmail({
    locale: appointment.locale,
    clientName: name,
    headline: isDe ? "Buchungsanfrage erhalten" : "Booking request received",
    intro: isDe
      ? "Vielen Dank für Ihre Buchungsanfrage. Ich freue mich darauf, Sie bald zu verwöhnen."
      : "Thank you for your booking request. I look forward to welcoming you soon.",
    outro: isDe
      ? "Ich bestätige Ihren Termin in der Regel innerhalb von 24–48 Stunden. Sie erhalten eine weitere E-Mail, sobald alles bestätigt ist."
      : "I will confirm your appointment within 24–48 hours. You will receive another email once everything is confirmed.",
    details: [
      ...appointmentDetails(appointment),
      { label: "Status", value: isDe ? "Ausstehend" : "Pending" },
    ],
    statusLabel: isDe ? "Ausstehend" : "Pending",
    statusTone: "pending",
    showCalendarNote: true,
    googleCalendarUrl: calendarLinks(appointment),
  });
}

function bookingConfirmedHtml(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;

  return renderAppointmentEmail({
    locale: appointment.locale,
    clientName: name,
    headline: isDe ? "Ihr Termin ist bestätigt" : "Your appointment is confirmed",
    intro: isDe
      ? "Es ist mir eine Freude, Ihnen mitteilen zu können, dass Ihr Termin bestätigt wurde."
      : "It is my pleasure to confirm that your appointment has been scheduled.",
    outro: isDe
      ? "Ich freue mich auf Sie und darauf, einen eleganten, individuellen Look für Sie zu kreieren."
      : "I look forward to seeing you and creating an elegant, tailored look just for you.",
    details: appointmentDetails(appointment),
    statusLabel: isDe ? "Bestätigt" : "Confirmed",
    statusTone: "confirmed",
    showCalendarNote: true,
    googleCalendarUrl: calendarLinks(appointment),
  });
}

function bookingCancelledHtml(appointment: AppointmentWithDetails) {
  const isDe = appointment.locale === "de";
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;

  return renderAppointmentEmail({
    locale: appointment.locale,
    clientName: name,
    headline: isDe ? "Termin storniert" : "Appointment cancelled",
    intro: isDe
      ? "Ihr Termin wurde storniert. Bei Fragen oder einem neuen Wunschtermin stehe ich Ihnen gerne zur Verfügung."
      : "Your appointment has been cancelled. If you have any questions or would like to rebook, please get in touch.",
    outro: isDe
      ? "Sie können jederzeit eine neue Buchungsanfrage über die Website stellen."
      : "You are welcome to submit a new booking request at any time via the website.",
    details: appointmentDetails(appointment),
    statusLabel: isDe ? "Storniert" : "Cancelled",
    statusTone: "cancelled",
  });
}

export async function sendBookingRequestEmail(
  appointment: AppointmentWithDetails,
): Promise<SendEmailResult> {
  const isDe = appointment.locale === "de";
  const service = serviceTitle(appointment);

  const ics = generateIcsEvent({
    title: service,
    description: appointment.notes || service,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    uid: `booking-${appointment.id}@sepidehmihanparast.de`,
  });

  return sendEmail({
    to: resolveClientEmail(appointment.client.email),
    subject: isDe
      ? "Ihre Buchungsanfrage — Sepideh Mihanparast"
      : "Your Booking Request — Sepideh Mihanparast",
    html: bookingRequestHtml(appointment),
    attachments: [buildIcsEmailAttachment(ics)],
  });
}

export async function sendAdminNewBookingNotification(
  appointment: AppointmentWithDetails,
): Promise<SendEmailResult> {
  const client = appointment.client;
  const service = serviceTitle(appointment);

  return sendEmail({
    to: adminEmail(),
    subject: `New Booking: ${client.firstName} ${client.lastName}`,
    html: renderAdminBookingEmail({
      clientName: `${client.firstName} ${client.lastName}`,
      clientEmail: client.email,
      clientPhone: client.phone ?? "",
      service,
      startIso: appointment.startTime.toISOString(),
      notes: appointment.notes ?? "",
    }),
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
    const ics = generateIcsEvent({
      title: service,
      description: appointment.notes || service,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      uid: `appointment-${appointment.id}@sepidehmihanparast.de`,
    });

    return sendEmail({
      to: resolveClientEmail(appointment.client.email),
      subject: isDe
        ? "Termin bestätigt — Sepideh Mihanparast"
        : "Appointment Confirmed — Sepideh Mihanparast",
      html: bookingConfirmedHtml(appointment),
      attachments: [buildIcsEmailAttachment(ics)],
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
