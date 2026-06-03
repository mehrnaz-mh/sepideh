import { siteConfig } from "@/data/content";

const colors = {
  background: "#f8f5f2",
  card: "#ffffff",
  foreground: "#171717",
  muted: "#757575",
  gold: "#b99672",
  goldLight: "#e9e1da",
  border: "#ececec",
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://sepidehmihanparast.de").replace(
    /\/$/,
    "",
  );
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
  statusTone?: "pending" | "confirmed" | "cancelled";
  showCalendarNote?: boolean;
  googleCalendarUrl?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

function statusColors(tone: "pending" | "confirmed" | "cancelled") {
  if (tone === "confirmed") return { bg: "#f0f7f0", text: "#2d5a3d", border: "#c5ddc8" };
  if (tone === "cancelled") return { bg: "#fdf2f2", text: "#7a2e2e", border: "#e8c4c4" };
  return { bg: "#faf6f0", text: "#6b5340", border: colors.goldLight };
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
  showCalendarNote = false,
  googleCalendarUrl,
  ctaPrimary,
  ctaSecondary,
}: AppointmentEmailOptions) {
  const isDe = locale === "de";
  const safeName = escapeHtml(clientName);
  const primaryCta = ctaPrimary ?? {
    label: isDe ? "Website" : "Visit website",
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

  const calendarNote = showCalendarNote
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:${colors.background};border:1px solid ${colors.border};">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${colors.gold};">
              ${isDe ? "Zum Kalender hinzufügen" : "Add to calendar"}
            </p>
            <p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.65;color:${colors.muted};">
              ${
                isDe
                  ? "iPhone: Öffnen Sie die angehängte Datei <strong>appointment.ics</strong> → tippen Sie oben auf <strong>„Hinzufügen“</strong> (nicht nur „Fertig“). Alternativ:"
                  : "iPhone: Open the attached <strong>appointment.ics</strong> file → tap <strong>Add</strong> at the top (not only Done). Or:"
              }
            </p>
            ${
              googleCalendarUrl
                ? `<a href="${escapeHtml(googleCalendarUrl)}" style="display:inline-block;padding:12px 22px;background-color:${colors.foreground};color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">
                    ${isDe ? "In Google Kalender öffnen" : "Open in Google Calendar"}
                  </a>`
                : ""
            }
          </td>
        </tr>
      </table>`
    : "";

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
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 28px;text-align:center;border-bottom:1px solid ${colors.border};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width:48px;height:1px;background-color:${colors.gold};margin:0 auto 20px;"></div>
                    <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;letter-spacing:-0.02em;color:${colors.foreground};line-height:1.2;">
                      ${escapeHtml(siteConfig.name)}
                    </p>
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.35em;text-transform:uppercase;color:${colors.gold};">
                      ${escapeHtml(siteConfig.tagline)} · Hamburg
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
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
              ${calendarNote}
              <p style="margin:28px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${colors.muted};">
                ${escapeHtml(outro)}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;">
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
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:28px 40px 36px;background-color:${colors.background};border-top:1px solid ${colors.border};text-align:center;">
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${colors.foreground};">
                ${escapeHtml(siteConfig.location)}
              </p>
              <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:13px;">
                <a href="mailto:${siteConfig.email}" style="color:${colors.gold};text-decoration:none;">${escapeHtml(siteConfig.email)}</a>
              </p>
              <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${colors.muted};">
                ${escapeHtml(siteConfig.phoneDisplay)}
              </p>
              <p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
                <a href="${siteConfig.instagram}" style="color:${colors.gold};text-decoration:none;letter-spacing:0.06em;">${escapeHtml(siteConfig.instagramHandle)}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${colors.muted};text-align:center;">
          © ${new Date().getFullYear()} ${escapeHtml(siteConfig.name)}
        </p>
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
}: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  startIso: string;
  notes: string;
}) {
  const adminUrl = `${siteUrl()}/admin/appointments`;

  return renderAppointmentEmail({
    locale: "en",
    clientName: "Sepideh",
    headline: "New booking request",
    intro: "A new appointment request has been submitted on your website.",
    outro: "Review and confirm the appointment in your admin dashboard.",
    statusLabel: "Pending",
    statusTone: "pending",
    details: [
      { label: "Client", value: clientName },
      { label: "Email", value: clientEmail },
      { label: "Phone", value: clientPhone || "—" },
      { label: "Service", value: service },
      { label: "Start", value: new Date(startIso).toLocaleString("de-DE") },
      { label: "Notes", value: notes || "—" },
    ],
    ctaPrimary: { label: "Open admin", href: adminUrl },
    ctaSecondary: { label: "Appointments", href: adminUrl },
  });
}
