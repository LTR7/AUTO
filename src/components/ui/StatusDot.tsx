import { cn } from "@/lib/cn";

/** Live-system indicator: pulsing dot + mono label. Dot is decoration; label is real text. */
export function StatusDot({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-xs", className)}>
      <span aria-hidden className="status-dot h-1.5 w-1.5 rounded-full bg-cyan" />
      <span>{label}</span>
    </span>
  );
}
