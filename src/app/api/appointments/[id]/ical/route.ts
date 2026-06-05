import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIcsEvent } from "@/lib/ics";
import { services } from "@/data/content";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      service: { include: { translations: true } },
      client: true,
    },
  });

  if (!appointment || appointment.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const locale = appointment.locale === "en" ? "en" : "de";
  const title =
    appointment.service.translations.find((t) => t.locale === locale)?.title ??
    services.find((s) => s.slug === appointment.service.slug)?.[locale].title ??
    appointment.service.slug;

  const ics = generateIcsEvent({
    title,
    description: appointment.notes || title,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    uid: `appointment-${appointment.id}@sepidehmihanparast.de`,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="appointment-${id}.ics"`,
    },
  });
}
