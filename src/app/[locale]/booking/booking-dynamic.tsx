"use client";

import dynamic from "next/dynamic";
import { BookingSkeleton } from "./booking-skeleton";
import type { PublicService } from "@/lib/services-data";

const BookingClientInner = dynamic(() => import("./booking-client"), {
  ssr: false,
  loading: () => <BookingSkeleton />,
});

export function BookingClient({ services }: { services: PublicService[] }) {
  return <BookingClientInner services={services} />;
}
