"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdminLang } from "@/components/admin/lang-context";

export function AdminPageHeader({
  titleKey,
  title,
  descriptionKey,
  description,
  createHref,
  createLabel,
  createLabelKey,
}: {
  titleKey?: string;
  title?: string;
  descriptionKey?: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  createLabelKey?: string;
}) {
  const { t, lang } = useAdminLang();
  const resolvedTitle = titleKey ? t(titleKey) : (title ?? "");
  const resolvedDesc = descriptionKey ? t(descriptionKey) : description;
  const resolvedCreateLabel = createLabelKey ? t(createLabelKey) : (createLabel ?? t("addNew"));
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl text-foreground sm:text-3xl">{resolvedTitle}</h1>
        {resolvedDesc && <p className="mt-1 text-sm text-muted">{resolvedDesc}</p>}
      </div>
      {createHref && (
        <Button asChild variant="gold" size="sm" className="shrink-0 rounded-sm">
          <Link href={createHref}>{resolvedCreateLabel}</Link>
        </Button>
      )}
    </div>
  );
}
