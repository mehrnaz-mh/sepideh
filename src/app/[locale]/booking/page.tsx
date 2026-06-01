import { Suspense } from "react";
import BookingPage from "./booking-client";

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div className="luxury-container section-padding">Loading...</div>}>
      <BookingPage />
    </Suspense>
  );
}
