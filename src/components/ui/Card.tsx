import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "cream" | "featured";

const variants: Record<CardVariant, string> = {
  default: "border border-hairline bg-canvas text-ink",
  cream: "border border-transparent bg-canvas-cream text-[#0d253d]",
  featured: "border border-transparent bg-[#0d253d] text-white",
};

export function Card({
  variant = "default",
  className,
  children,
}: {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-card p-8 transition-colors", variants[variant], className)}>
      {children}
    </div>
  );
}
