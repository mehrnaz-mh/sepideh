import type { AppointmentStatus, Prisma } from "@prisma/client";
import { services } from "@/data/content";
import {
  renderAdminBookingEmail,
  renderAppointmentEmail,
  renderConfirmationEmail,
  renderRejectionEmail,
} from "@/lib/email-templates";
import { buildIcsEmailAttachment, generateIcsEvent } from "@/lib/ics";
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

export async function sendBookingRequestEmail(
  appointment: AppointmentWithDetails,
): Promise<SendEmailResult> {
  const isDe = appointment.locale === "de";
  const service = serviceTitle(appointment);
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;
  const locale = appointment.locale;
  const loc = isDe ? "de-DE" : "en-GB";

  const dateStr = appointment.startTime.toLocaleDateString(loc, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = appointment.startTime.toLocaleTimeString(loc, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const ics = generateIcsEvent({
    title: service,
    description: appointment.notes || service,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    uid: `booking-${appointment.id}@sepidehmihanparast.de`,
  });

  const html = renderAppointmentEmail({
    locale,
    clientName: name,
    headline: isDe ? "Terminanfrage erhalten" : "Appointment request received",
    intro: isDe
      ? "Vielen Dank für Ihre Terminanfrage! Wir haben Ihre Anfrage erhalten und werden sie so schnell wie möglich bearbeiten."
      : "Thank you for your appointment request! We have received your request and will process it as soon as possible.",
    outro: isDe
      ? "Sie erhalten eine Bestätigungs-E-Mail, sobald Ihr Termin von uns bestätigt wurde. Bei Fragen stehen wir Ihnen gerne zur Verfügung."
      : "You will receive a confirmation email once your appointment has been confirmed. Feel free to contact us if you have any questions.",
    details: [
      { label: isDe ? "Leistung" : "Service", value: service },
      { label: isDe ? "Datum" : "Date", value: dateStr },
      { label: isDe ? "Uhrzeit" : "Time", value: timeStr },
      { label: "Status", value: isDe ? "Ausstehend" : "Pending" },
    ],
    statusLabel: isDe ? "Ausstehend" : "Pending",
    statusTone: "pending",
  });

  return sendEmail({
    to: resolveClientEmail(appointment.client.email),
    subject: isDe
      ? `Terminanfrage erhalten — ${service}`
      : `Appointment request received — ${service}`,
    html,
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
    subject: `[NEUE BUCHUNG] ${client.firstName} ${client.lastName} — ${service} — ${appointment.startTime.toLocaleString("de-DE")}`,
    html: renderAdminBookingEmail({
      clientName: `${client.firstName} ${client.lastName}`,
      clientEmail: client.email,
      clientPhone: client.phone ?? "",
      service,
      startIso: appointment.startTime.toISOString(),
      notes: appointment.notes ?? "",
      appointmentId: appointment.id,
    }),
  });
}

export async function notifyAppointmentStatusChange(
  appointment: AppointmentWithDetails,
  previousStatus: AppointmentStatus,
  rejectionReason?: string | null,
): Promise<SendEmailResult> {
  const { status } = appointment;
  const isDe = appointment.locale === "de";
  const service = serviceTitle(appointment);
  const name = `${appointment.client.firstName} ${appointment.client.lastName}`;

  if (status === "CONFIRMED" && previousStatus !== "CONFIRMED") {
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
        ? `Termin bestätigt — ${service} am ${appointment.startTime.toLocaleDateString("de-DE")}`
        : `Appointment confirmed — ${service} on ${appointment.startTime.toLocaleDateString("en-GB")}`,
      html: renderConfirmationEmail({
        locale: appointment.locale,
        clientName: name,
        service,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        appointmentId: appointment.id,
      }),
      attachments: [buildIcsEmailAttachment(ics)],
    });
  }

  if (
    (status === "CANCELLED" || status === "REJECTED" as AppointmentStatus) &&
    previousStatus !== status
  ) {
    return sendEmail({
      to: resolveClientEmail(appointment.client.email),
      subject: isDe
        ? `Zu Ihrer Terminanfrage — ${service}`
        : `Regarding your appointment request — ${service}`,
      html: renderRejectionEmail({
        locale: appointment.locale,
        clientName: name,
        service,
        startTime: appointment.startTime,
        rejectionReason: rejectionReason ?? (appointment as AppointmentWithDetails & { rejectionReason?: string | null }).rejectionReason,
      }),
    });
  }

  return { ok: true };
}
