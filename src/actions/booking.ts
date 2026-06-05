"use server";

import { addMinutes, parse } from "date-fns";
import { revalidatePath, unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isSlotAvailable } from "@/lib/availability";
import {
  sendAdminNewBookingNotification,
  sendBookingRequestEmail,
} from "@/lib/appointment-emails";
import { services } from "@/data/content";
import { bookingSchema } from "@/validations/booking";

export async function createBooking(formData: FormData) {
  const raw = {
    serviceSlug: formData.get("serviceSlug"),
    date: formData.get("date"),
    time: formData.get("time"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    notes: formData.get("notes") || undefined,
    locale: formData.get("locale") || "de",
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const data = parsed.data;
  const staticService = services.find((s) => s.slug === data.serviceSlug);

  let service = await prisma.service.findUnique({
    where: { slug: data.serviceSlug },
    include: { translations: true },
  });

  const duration = service?.durationMinutes ?? staticService?.durationMinutes ?? 60;
  const buffer = service?.bufferMinutes ?? staticService?.bufferMinutes ?? 15;

  const startTime = parse(
    `${data.date} ${data.time}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );
  const endTime = addMinutes(startTime, duration);

  const available = await isSlotAvailable(startTime, duration, buffer);
  if (!available) {
    return { success: false, error: "Slot no longer available" };
  }

  const client = await prisma.client.upsert({
    where: { email: data.email },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      locale: data.locale,
    },
    create: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      locale: data.locale,
    },
  });

  if (!service && staticService) {
    service = await prisma.service.findUnique({
      where: { slug: data.serviceSlug },
      include: { translations: true },
    });
  }

  if (!service) {
    return { success: false, error: "Service not found" };
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId: client.id,
      serviceId: service.id,
      startTime,
      endTime,
      status: "PENDING",
      notes: data.notes,
      locale: data.locale,
    },
    include: {
      service: { include: { translations: true } },
      client: true,
    },
  });

  const clientEmail = await sendBookingRequestEmail(appointment);
  const adminEmail = await sendAdminNewBookingNotification(appointment);

  if (!clientEmail.ok) {
    console.error("[Booking] Client email failed:", clientEmail.error);
  }
  if (!adminEmail.ok) {
    console.error("[Booking] Admin email failed:", adminEmail.error);
  }

  revalidatePath("/admin/appointments");

  return {
    success: true,
    appointmentId: appointment.id,
    emailSent: clientEmail.ok,
    emailError: clientEmail.ok ? undefined : clientEmail.error,
  };
}

async function getServiceTiming(serviceSlug: string) {
  const staticService = services.find((s) => s.slug === serviceSlug);
  const service = await prisma.service.findUnique({
    where: { slug: serviceSlug },
  });

  return {
    duration:
      service?.durationMinutes ?? staticService?.durationMinutes ?? 60,
    buffer: service?.bufferMinutes ?? staticService?.bufferMinutes ?? 15,
  };
}

export async function getAvailableSlotsAction(
  date: string,
  serviceSlug: string,
) {
  const { getAvailableSlots } = await import("@/lib/availability");
  const { duration, buffer } = await getServiceTiming(serviceSlug);
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return getAvailableSlots(parsedDate, duration, buffer);
}

const getCachedAvailableDates = unstable_cache(
  async (serviceSlug: string, dates: string[]) => {
    const { getAvailableDates } = await import("@/lib/availability");
    const { duration, buffer } = await getServiceTiming(serviceSlug);
    return getAvailableDates(dates, duration, buffer);
  },
  ["available-dates"],
  { revalidate: 300 }, // 5 minutes
);

export async function getAvailableDatesAction(
  serviceSlug: string,
  dates: string[],
) {
  return getCachedAvailableDates(serviceSlug, dates);
}
