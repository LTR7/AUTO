"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { meshFloat } from "@/constants/animations";
import { cn } from "@/lib/cn";

/**
 * Signature Stripe-style gradient-mesh backdrop: pastel blobs washed across the
 * top of a section, gently floating. Decorative only; static under reduced motion.
 */
export function GradientMesh({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const blobs = gsap.utils.toArray<HTMLElement>(".mesh-blob", ref.current);
      blobs.forEach((blob, index) => {
        gsap.to(blob, {
          xPercent: gsap.utils.random(-8, 8),
          yPercent: gsap.utils.random(-6, 10),
          duration: gsap.utils.random(meshFloat.minDuration, meshFloat.maxDuration),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.25,
        });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      data-mesh
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className="mesh-blob"
        style={{ top: "-12%", left: "-6%", width: "46vw", height: "46vw", background: "var(--color-sky)" }}
      />
      <div
        className="mesh-blob"
        style={{ top: "-16%", left: "28%", width: "42vw", height: "42vw", background: "var(--color-primary)" }}
      />
      <div
        className="mesh-blob"
        style={{ top: "-10%", right: "-6%", width: "44vw", height: "44vw", background: "var(--color-magenta)" }}
      />
      <div
        className="mesh-blob"
        style={{ top: "8%", left: "54%", width: "36vw", height: "36vw", background: "var(--color-cyan)" }}
      />
    </div>
  );
}
