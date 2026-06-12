"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Oversized chapter numeral pinned beside the manifesto principles.
 * Crossfades to the number of whichever [data-principle] article is in view.
 * Static first numeral is the no-JS / reduced-motion / mobile default.
 */
export function GhostNumeral({ numbers }: { numbers: string[] }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const span = spanRef.current;
        if (!span) return;
        // Articles live outside this component's subtree — query the document.
        const articles = document.querySelectorAll<HTMLElement>("[data-principle]");
        articles.forEach((article, i) => {
          ScrollTrigger.create({
            trigger: article,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (!self.isActive || numbers[i] === undefined) return;
              // Opacity-only crossfade — zero layout shift.
              gsap.to(span, {
                autoAlpha: 0,
                duration: 0.15,
                onComplete: () => {
                  span.textContent = numbers[i];
                },
              });
              gsap.to(span, { autoAlpha: 1, duration: 0.3, delay: 0.15 });
            },
          });
        });
      },
    );
  });

  return (
    <span
      ref={spanRef}
      aria-hidden
      data-ghost-numeral
      className="mt-10 hidden font-light leading-none tracking-[-0.04em] lg:block"
      style={{
        fontSize: "clamp(7rem, 12vw, 10rem)",
        color: "color-mix(in srgb, var(--ink) 12%, transparent)",
      }}
    >
      {numbers[0]}
    </span>
  );
}
