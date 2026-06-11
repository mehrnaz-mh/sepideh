"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminLang } from "@/components/admin/lang-context";

export function AdminFormShell({
  titleKey,
  title,
  backHref,
  action,
  children,
  submitLabel,
}: {
  titleKey?: string;
  title?: string;
  backHref: string;
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";
  const resolvedTitle = titleKey ? t(titleKey) : title ?? "";
  const backLabel = isRtl ? "→ بازگشت" : "← Back";
  const cancelLabel = isRtl ? "انصراف" : "Cancel";

  return (
    <div>
      <div className="mb-6">
        <Link href={backHref} className="text-sm text-muted hover:text-gold">
          {backLabel}
        </Link>
        <h1 className="mt-2 text-3xl">{resolvedTitle}</h1>
      </div>
      <form action={action} className="max-w-3xl space-y-6">
        {children}
        <div className="flex gap-3">
          <SubmitButton label={submitLabel} labelKey={submitLabel ? undefined : "save"} />
          <Button asChild variant="outline" type="button">
            <Link href={backHref}>{cancelLabel}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
