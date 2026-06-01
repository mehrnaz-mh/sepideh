import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { addHours } from "date-fns";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24h = addHours(now, 24);
  const in25h = addHours(now, 25);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: "CONFIRMED",
      reminderSent: false,
      startTime: { gte: in24h, lte: in25h },
    },
    include: {
      client: true,
      service: { include: { translations: true } },
    },
  });

  for (const apt of appointments) {
    const locale = apt.locale as "de" | "en";
    const isDe = locale === "de";
    const serviceTitle =
      apt.service.translations.find((t) => t.locale === locale)?.title ??
      "Appointment";

    await sendEmail({
      to: apt.client.email,
      subject: isDe ? "Terminerinnerung — Morgen" : "Appointment Reminder — Tomorrow",
      html: `
        <p>${isDe ? "Liebe/r" : "Dear"} ${apt.client.firstName},</p>
        <p>${isDe ? "Erinnerung an Ihren Termin morgen:" : "Reminder of your appointment tomorrow:"}</p>
        <p><strong>${serviceTitle}</strong></p>
        <p>${apt.startTime.toLocaleString(isDe ? "de-DE" : "en-GB")}</p>
      `,
    });

    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent: true },
    });
  }

  return NextResponse.json({ sent: appointments.length });
}
