"use client";

import { useLocale } from "next-intl";

export function BookingSkeleton() {
  const locale = useLocale();
  const steps = locale === "de"
    ? ["Service", "Datum", "Uhrzeit", "Details"]
    : ["Service", "Date", "Time", "Details"];

  return (
    <>
      <div className="mt-10 flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`flex-1 border-b-2 pb-2 text-center text-xs uppercase tracking-widest ${
              i === 0 ? "border-gold text-gold" : "border-border text-muted"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-border rounded" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-20 bg-border rounded" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
