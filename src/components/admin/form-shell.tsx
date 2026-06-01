import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";

export function AdminFormShell({
  title,
  backHref,
  action,
  children,
  submitLabel = "Save",
}: {
  title: string;
  backHref: string;
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  return (
    <div>
      <div className="mb-6">
        <Link href={backHref} className="text-sm text-muted hover:text-gold">
          ← Back
        </Link>
        <h1 className="mt-2 font-serif text-3xl">{title}</h1>
      </div>
      <form action={action} className="max-w-3xl space-y-6">
        {children}
        <div className="flex gap-3">
          <SubmitButton label={submitLabel} />
          <Button asChild variant="outline" type="button">
            <Link href={backHref}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
