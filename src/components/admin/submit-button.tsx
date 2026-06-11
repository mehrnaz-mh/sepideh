"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useAdminLang } from "@/components/admin/lang-context";

export function SubmitButton({
  label,
  labelKey,
  pendingLabel = "...",
}: {
  label?: string;
  labelKey?: string;
  pendingLabel?: string;
}) {
  const { t } = useAdminLang();
  const { pending } = useFormStatus();
  const resolvedLabel = labelKey ? t(labelKey) : (label ?? t("save") ?? "Save");
  return (
    <Button type="submit" variant="gold" disabled={pending}>
      {pending ? pendingLabel : resolvedLabel}
    </Button>
  );
}
