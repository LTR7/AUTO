import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 sm:py-28 lg:py-32", className)}
    >
      {children}
    </section>
  );
}
