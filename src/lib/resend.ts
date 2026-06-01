import { Resend } from "resend";

function getResendApiKey() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key === '""' || key === "''") return undefined;
  return key;
}

export const resend = (() => {
  const key = getResendApiKey();
  return key ? new Resend(key) : null;
})();

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; mock?: boolean };

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[];
}): Promise<SendEmailResult> {
  if (!resend) {
    console.warn(
      "[Email] RESEND_API_KEY is not set — email was not sent.",
      { to, subject },
    );
    return {
      ok: false,
      error: "Email is not configured (missing RESEND_API_KEY)",
      mock: true,
    };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ||
    (process.env.NODE_ENV === "development"
      ? "onboarding@resend.dev"
      : "bookings@sepidehmihanparast.de");

  const { data, error } = await resend.emails.send({
    from: `${siteName()} <${from}>`,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    attachments,
  });

  if (error) {
    console.error("[Email] Resend API error:", error);
    return { ok: false, error: error.message || "Failed to send email" };
  }

  return { ok: true, id: data?.id };
}

export function isEmailConfigured() {
  return Boolean(getResendApiKey());
}

function siteName() {
  return "Sepideh Mihanparast";
}
