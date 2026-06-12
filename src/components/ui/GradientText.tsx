import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function GradientText({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span {...rest} className={cn("gradient-text", className)}>
      {children}
    </span>
  );
}
