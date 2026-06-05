"use client";

import dynamic from "next/dynamic";
import { BookingSkeleton } from "./booking-skeleton";

const BookingClient = dynamic(() => import("./booking-client"), {
  ssr: false,
  loading: () => <BookingSkeleton />,
});

export { BookingClient };
