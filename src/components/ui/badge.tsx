import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs uppercase tracking-wide",
        variant === "default" && "bg-background-secondary text-muted",
        variant === "success" && "bg-green-50 text-green-700",
        variant === "warning" && "bg-amber-50 text-amber-700",
        variant === "danger" && "bg-red-50 text-red-700",
        className,
      )}
      {...props}
    />
  );
}
