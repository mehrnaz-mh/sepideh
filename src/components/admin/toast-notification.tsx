"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { CheckCircle, XCircle, X } from "lucide-react";

export function ToastNotification() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      const messages: Record<string, string> = {
        "1": "Saved successfully.",
        created: "Created successfully.",
        updated: "Updated successfully.",
        deleted: "Deleted successfully.",
      };
      setToast({ type: "success", message: messages[success] ?? "Done." });
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    } else if (error) {
      const messages: Record<string, string> = {
        "1": "Something went wrong. Please check your input.",
        time_format: 'Invalid time format. Use HH:MM (e.g. "10:00" or "18:30").',
        conflict: "This time slot conflicts with an existing appointment.",
      };
      setToast({ type: "error", message: messages[error] ?? decodeURIComponent(error) });
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-start gap-3 border px-5 py-4 shadow-lg text-sm max-w-sm ${
        toast.type === "success"
          ? "border-green-300 bg-green-50 text-green-800"
          : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-600" />
      ) : (
        <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
      )}
      <span className="flex-1">{toast.message}</span>
      <button type="button" onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
