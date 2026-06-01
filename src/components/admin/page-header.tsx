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
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {createHref && (
        <Button asChild variant="gold" size="sm">
          <Link href={createHref}>{createLabel}</Link>
        </Button>
      )}
    </div>
  );
}
