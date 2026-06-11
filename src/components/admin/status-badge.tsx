"use client";

import { useAdminLang } from "@/components/admin/lang-context";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-background-secondary text-muted",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-red-100 text-red-700",
};

const statusKeys: Record<string, string> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "noShow",
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useAdminLang();
  return (
    <span className={`rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider ${statusStyles[status] ?? "bg-background-secondary text-muted"}`}>
      {statusKeys[status] ? t(statusKeys[status]) : status}
    </span>
  );
}
