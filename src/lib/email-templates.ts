import { siteConfig } from "@/data/content";

const colors = {
  background: "#F7F6F2",
  card: "#ffffff",
  foreground: "#2F3428",
  muted: "#6B7060",
  gold: "#969E86",
  goldLight: "#CBBFA3",
  border: "#D8D7D0",
  green: "#2d5a3d",
  greenBg: "#f0f7f0",
  greenBorder: "#c5ddc8",
  red: "#7a2e2e",
  redBg: "#fdf2f2",
  redBorder: "#e8c4c4",
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://sepidehmihanparast.de").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type DetailRow = { label: string; value: string };

type AppointmentEmailOptions = {
  locale: string;
  clientName: string;
  headline: string;
  intro: string;
  outro: string;
  details: DetailRow[];
  statusLabel?: string;
  statusTone?: "pending" | "confirmed" | "cancelled" | "rejected";
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  extraHtml?: string;
};

function statusColors(tone: "pending" | "confirmed" | "cancelled" | "rejected") {
  if (tone === "confirmed") return { bg: colors.greenBg, text: colors.green, border: colors.greenBorder };
  if (tone === "cancelled" || tone === "rejected") return { bg: colors.redBg, text: colors.red, border: colors.redBorder };
  return { bg: "#faf6f0", text: "#6b5340", border: colors.goldLight };
}

function emailFooterHtml(isDe: boolean) {
  return `
    <tr>
      <td style="padding:28px 40px 36px;background-color:${colors.background};border-top:1px solid ${colors.border};text-align:center;">
        <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${colors.foreground};">
          ${escapeHtml(siteConfig.street)}, ${escapeHtml(siteConfig.postalCode)} ${escapeHtml(siteConfig.city)}
        </p>
        <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:13px;">
          <a href="mailto:${siteConfig.email}" style="color:${colors.gold};text-decoration:none;">${escapeHtml(siteConfig.email)}</a>
        </p>
        <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:13px;">
          <a href="tel:${siteConfig.phoneTel}" style="color:${colors.muted};text-decoration:none;">${escapeHtml(siteConfig.phoneDisplay)}</a>
          &nbsp;·&nbsp;
          <a href="${siteConfig.whatsappUrl}" style="color:${colors.muted};text-decoration:none;">WhatsApp</a>
        </p>
        <p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
          <a href="${siteConfig.instagram}" style="color:${colors.gold};text-decoration:none;letter-spacing:0.06em;">${escapeHtml(siteConfig.instagramHandle)}</a>
        </p>
        <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${colors.muted};">
          © ${new Date().getFullYear()} ${escapeHtml(siteConfig.name)}
        </p>
      </td>
    </tr>`;
}

export function renderAppointmentEmail({
  locale,
  clientName,
  headline,
  intro,
  outro,
  details,
  statusLabel,
  statusTone = "pending",
  ctaPrimary,
  ctaSecondary,
  extraHtml = "",
}: AppointmentEmailOptions) {
  const isDe = locale === "de";
  const safeName = escapeHtml(clientName);
  const primaryCta = ctaPrimary ?? {
    label: isDe ? "Zur Website" : "Visit website",
    href: `${siteUrl()}/${isDe ? "de" : "en"}/booking`,
  };
  const secondaryCta = ctaSecondary ?? {
    label: "Portfolio",
    href: `${siteUrl()}/${isDe ? "de" : "en"}/portfolio`,
  };
  const statusStyle = statusColors(statusTone);

  const detailRows = details
    .map(
      (row) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${colors.border};font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${colors.muted};width:32%;vertical-align:top;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:14px 0;border-bottom:1px solid ${colors.border};font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:${colors.foreground};vertical-align:top;">
            ${escapeHtml(row.value)}
          </td>
        </tr>`,
    )
    .join("");

  const statusBadge = statusLabel
    ? `
        <tr>
          <td colspan="2" style="padding:20px 0 0;">
            <span style="display:inline-block;padding:8px 14px;border:1px solid ${statusStyle.border};background:${statusStyle.bg};color:${statusStyle.text};font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;">
              ${escapeHtml(statusLabel)}
            </span>
          </td>
        </tr>`
    : "";

  const ctaHtml = ctaPrimary || ctaSecondary
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr>
          ${primaryCta ? `<td style="padding-right:12px;">
            <a href="${escapeHtml(primaryCta.href)}" style="display:inline-block;padding:14px 28px;background-color:${colors.gold};color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
              ${escapeHtml(primaryCta.label)}
            </a>
          </td>` : ""}
          ${secondaryCta ? `<td>
            <a href="${escapeHtml(secondaryCta.href)}" style="display:inline-block;padding:13px 26px;border:1px solid ${colors.foreground};color:${colors.foreground};font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
              ${escapeHtml(secondaryCta.label)}
            </a>
          </td>` : ""}
        </tr>
      </table>`
    : `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;">
        <tr>
          <td style="padding-right:12px;">
            <a href="${escapeHtml(primaryCta.href)}" style="display:inline-block;padding:14px 28px;background-color:${colors.gold};color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
              ${escapeHtml(primaryCta.label)}
            </a>
          </td>
          <td>
            <a href="${escapeHtml(secondaryCta.href)}" style="display:inline-block;padding:13px 26px;border:1px solid ${colors.foreground};color:${colors.foreground};font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
              ${escapeHtml(secondaryCta.label)}
            </a>
          </td>
        </tr>
      </table>`;

  return `<!DOCTYPE html>
<html lang="${isDe ? "de" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0;padding:0;background-color:${colors.background};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.background};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${colors.card};border:1px solid ${colors.border};">
          <tr>
            <td style="padding:40px 40px 28px;text-align:center;border-bottom:1px solid ${colors.border};">
              <div style="width:48px;height:1px;background-color:${colors.gold};margin:0 auto 20px;"></div>
              <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;letter-spacing:-0.02em;color:${colors.foreground};line-height:1.2;">
                ${escapeHtml(siteConfig.name)}
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.35em;text-transform:uppercase;color:${colors.gold};">
                ${escapeHtml(siteConfig.tagline)} · Hamburg
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 32px;">
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${colors.gold};">
                ${isDe ? "Termin" : "Appointment"}
              </p>
              <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;line-height:1.25;color:${colors.foreground};">
                ${escapeHtml(headline)}
              </h1>
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${colors.foreground};">
                ${isDe ? "Liebe/r" : "Dear"} ${safeName},
              </p>
              <p style="margin:0 0 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${colors.muted};">
                ${escapeHtml(intro)}
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.background};border:1px solid ${colors.border};">
                <tr>
                  <td style="padding:8px 24px 4px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${detailRows}
                      ${statusBadge}
                    </table>
                  </td>
                </tr>
              </table>
              ${extraHtml}
              <p style="margin:28px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${colors.muted};">
                ${escapeHtml(outro)}
              </p>
              ${ctaHtml}
            </td>
          </tr>
          ${emailFooterHtml(isDe)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderAdminBookingEmail({
  clientName,
  clientEmail,
  clientPhone,
  service,
  startIso,
  notes,
  appointmentId,
}: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  startIso: string;
  notes: string;
  appointmentId: string;
}) {
  const adminUrl = `${siteUrl()}/admin/appointments`;
  const confirmUrl = `${siteUrl()}/admin/appointments/${appointmentId}/edit`;
  const startDate = new Date(startIso).toLocaleString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const adminActionHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;width:100%;">
      <tr>
        <td style="padding:20px;background-color:#f0f7f0;border:1px solid ${colors.greenBorder};text-align:center;">
          <p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:${colors.foreground};">
            Termin bestätigen oder ablehnen:
          </p>
          <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;padding:12px 24px;background-color:${colors.green};color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;margin-right:8px;">
            ✓ Im Admin öffnen
          </a>
          <a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:12px 24px;border:1px solid ${colors.foreground};color:${colors.foreground};font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
            Alle Termine
          </a>
        </td>
      </tr>
    </table>`;

  return renderAppointmentEmail({
    locale: "de",
    clientName: "Sepideh",
    headline: "Neue Buchungsanfrage",
    intro: "Eine neue Terminanfrage ist auf Ihrer Website eingegangen.",
    outro: "Bitte bestätigen oder lehnen Sie den Termin in Ihrem Admin-Bereich ab.",
    statusLabel: "Ausstehend",
    statusTone: "pending",
    details: [
      { label: "Kunde", value: clientName },
      { label: "Telefon", value: clientPhone || "—" },
      { label: "E-Mail", value: clientEmail },
      { label: "Leistung", value: service },
      { label: "Termin", value: startDate },
      { label: "Nachricht", value: notes || "Keine Nachricht" },
    ],
    ctaPrimary: { label: "Admin öffnen", href: confirmUrl },
    ctaSecondary: { label: "Alle Termine", href: adminUrl },
    extraHtml: adminActionHtml,
  });
}

export function renderConfirmationEmail({
  locale,
  clientName,
  service,
  startTime,
  endTime,
  appointmentId,
}: {
  locale: string;
  clientName: string;
  service: string;
  startTime: Date;
  endTime: Date;
  appointmentId: string;
}) {
  const isDe = locale === "de";
  const loc = isDe ? "de-DE" : "en-GB";

  const dateStr = startTime.toLocaleDateString(loc, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = startTime.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });

  const gcalStart = formatForGcal(startTime);
  const gcalEnd = formatForGcal(endTime);
  const gcalTitle = encodeURIComponent(`${service} bei ${siteConfig.name}`);
  const gcalDetails = encodeURIComponent(`Service: ${service}\nAdresse: ${siteConfig.addressFull}`);
  const gcalLocation = encodeURIComponent(siteConfig.addressFull);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${gcalStart}/${gcalEnd}&details=${gcalDetails}&location=${gcalLocation}&sf=true&output=xml`;
  const icalUrl = `${siteUrl()}/api/appointments/${appointmentId}/ical`;

  const calendarHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border:1px solid ${colors.border};background-color:${colors.background};">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${colors.muted};">
            ${isDe ? "Zum Kalender hinzufügen" : "Add to calendar"}
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:10px;">
            <tr>
              <td style="padding-right:10px;">
                <a href="${escapeHtml(googleCalendarUrl)}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:${colors.gold};color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;">
                  Google Calendar
                </a>
              </td>
              <td>
                <a href="${escapeHtml(icalUrl)}" style="display:inline-block;padding:9px 18px;border:1px solid ${colors.foreground};color:${colors.foreground};font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;">
                  iCal / Outlook
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${colors.muted};">
            📍 <a href="${siteConfig.googleMapsUrl}" target="_blank" style="color:${colors.gold};text-decoration:none;">${escapeHtml(siteConfig.addressFull)} ${isDe ? "auf Google Maps ansehen" : "— view on Google Maps"}</a>
          </p>
        </td>
      </tr>
    </table>`;

  return renderAppointmentEmail({
    locale,
    clientName,
    headline: isDe ? "Ihr Termin ist bestätigt!" : "Your appointment is confirmed!",
    intro: isDe
      ? "Wir freuen uns, Ihnen mitteilen zu können, dass Ihr Termin bestätigt wurde."
      : "We are pleased to confirm that your appointment has been scheduled.",
    outro: isDe
      ? "Bitte kommen Sie pünktlich. Bei Fragen erreichen Sie uns jederzeit."
      : "Please arrive on time. Feel free to reach out if you have any questions.",
    details: [
      { label: isDe ? "Leistung" : "Service", value: service },
      { label: isDe ? "Datum" : "Date", value: dateStr },
      { label: isDe ? "Uhrzeit" : "Time", value: timeStr },
      { label: isDe ? "Adresse" : "Address", value: siteConfig.addressFull },
    ],
    statusLabel: isDe ? "Bestätigt" : "Confirmed",
    statusTone: "confirmed",
    ctaPrimary: { label: isDe ? "Auf Google Maps" : "Google Maps", href: siteConfig.googleMapsUrl },
    ctaSecondary: { label: "WhatsApp", href: siteConfig.whatsappUrl },
    extraHtml: calendarHtml,
  });
}

export function renderRejectionEmail({
  locale,
  clientName,
  service,
  startTime,
  rejectionReason,
}: {
  locale: string;
  clientName: string;
  service: string;
  startTime: Date;
  rejectionReason?: string | null;
}) {
  const isDe = locale === "de";
  const loc = isDe ? "de-DE" : "en-GB";
  const dateStr = startTime.toLocaleDateString(loc, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = startTime.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
  const bookingUrl = `${siteUrl()}/${isDe ? "de" : "en"}/booking`;

  const reasonHtml = rejectionReason
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border:1px solid ${colors.redBorder};background-color:${colors.redBg};">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${colors.red};">
              ${isDe ? "Begründung" : "Reason"}
            </p>
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${colors.foreground};">
              ${escapeHtml(rejectionReason)}
            </p>
          </td>
        </tr>
      </table>`
    : "";

  return renderAppointmentEmail({
    locale,
    clientName,
    headline: isDe ? "Zu Ihrer Terminanfrage" : "Regarding your appointment request",
    intro: isDe
      ? "Leider können wir Ihren gewünschten Termin nicht bestätigen."
      : "Unfortunately, we are unable to confirm your requested appointment.",
    outro: isDe
      ? "Bitte buchen Sie einen neuen Termin oder kontaktieren Sie uns direkt — wir helfen Ihnen gerne weiter."
      : "Please book a new appointment or contact us directly — we are happy to help.",
    details: [
      { label: isDe ? "Leistung" : "Service", value: service },
      { label: isDe ? "Datum" : "Date", value: dateStr },
      { label: isDe ? "Uhrzeit" : "Time", value: timeStr },
    ],
    statusLabel: isDe ? "Abgelehnt" : "Declined",
    statusTone: "rejected",
    ctaPrimary: { label: isDe ? "Neuen Termin buchen" : "Book a new appointment", href: bookingUrl },
    ctaSecondary: { label: "WhatsApp", href: siteConfig.whatsappUrl },
    extraHtml: reasonHtml,
  });
}

function formatForGcal(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
