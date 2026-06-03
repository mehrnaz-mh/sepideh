"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { AppointmentStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/admin";

const statuses: AppointmentStatus[] = ["CONFIRMED", "COMPLETED", "CANCELLED"];

export function AppointmentStatusButtons({
  appointmentId,
  currentStatus,
  updateStatus,
}: {
  appointmentId: string;
  currentStatus: AppointmentStatus;
  updateStatus: (id: string, status: AppointmentStatus) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap justify-end gap-1 transition-opacity",
        isPending && "pointer-events-none opacity-50",
      )}
    >
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          disabled={isPending || currentStatus === status}
          onClick={() => {
            startTransition(async () => {
              const result = await updateStatus(appointmentId, status);
              if (result.success) {
                router.refresh();
              }
            });
          }}
          className={cn(
            "border px-2 py-0.5 text-[10px] uppercase transition-colors",
            currentStatus === status
              ? "border-gold bg-gold/10 text-foreground"
              : "border-border hover:border-gold",
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
