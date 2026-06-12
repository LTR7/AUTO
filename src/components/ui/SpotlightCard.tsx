"use client";

import { type MouseEvent, type ReactNode, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Card with an Aceternity-style spotlight that follows the cursor on hover.
 * Pass the full card styling via `className`; children render above the glow.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn("group/spot relative isolate overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 72%)",
        }}
      />
      {children}
    </div>
  );
}
