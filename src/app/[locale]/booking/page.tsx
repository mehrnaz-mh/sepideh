import { Suspense } from "react";
import BookingPage from "./booking-client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: locale === "de" ? "Termin buchen" : "Book an Appointment",
    description:
      locale === "de"
        ? "Termin buchen bei Sepideh Mihanparast in Hamburg — Braut-Hair, Make-up, Red Carpet Styling."
        : "Book your appointment with Sepideh Mihanparast in Hamburg. Bridal hair, makeup, red carpet styling.",
    alternates: { canonical: `${siteUrl}/${locale}/booking` },
  };
}

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div className="luxury-container section-padding">Loading...</div>}>
      <BookingPage />
    </Suspense>
  );
}
