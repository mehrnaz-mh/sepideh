"use client";

import type { ComponentProps } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this item?",
}: {
  action: NonNullable<ComponentProps<"form">["action"]>;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      className="inline"
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-muted hover:text-red-600 transition-colors disabled:opacity-50 leading-none translate-y-[2px]"
      >
        {label === "" ? <Trash2 size={16} /> : (
          <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide">
            <Trash2 size={16} />{label}
          </span>
        )}
      </button>
    </form>
  );
}
