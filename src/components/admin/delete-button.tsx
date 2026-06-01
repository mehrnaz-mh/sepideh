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
        className="inline-flex items-center text-xs uppercase tracking-wide text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
      >
        {label !== "" && <Trash2 size={14} className="mr-1" />}
        {label === "" ? <Trash2 size={14} /> : label}
      </button>
    </form>
  );
}
