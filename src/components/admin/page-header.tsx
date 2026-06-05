import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  createHref,
  createLabel = "Add New",
}: {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {createHref && (
        <Button asChild variant="gold" size="sm" className="shrink-0 rounded-sm">
          <Link href={createHref}>{createLabel}</Link>
        </Button>
      )}
    </div>
  );
}
