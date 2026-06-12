"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { joinFinale } from "@/constants/animations";

/** Counter-parallax ranges for the two panel mesh blobs (transform-only). */
const blobRanges = [
  { from: 18, to: -6 },
  { from: 10, to: -12 },
] as const;

/**
 * Join panel finale: scrubbed dock-in (phase 1) + one-shot content reveal (phase 2).
 * Phase 2 from-states are applied only at trigger time, so deep links to #join
 * never see hidden content. Reduced motion: panel renders exactly as authored.
 */
export function JoinFinale() {
  const splitRef = useRef<SplitText | null>(null);

  useGSAP((_, contextSafe) => {
    if (!contextSafe) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Phase 1 — dock: panel scales/settles into place on scroll.
    gsap.fromTo(
      "[data-join-panel]",
      { scale: joinFinale.dockScale, y: joinFinale.dockY, transformOrigin: "center bottom" },
      {
        scale: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-join-panel]",
          start: joinFinale.dockStart,
          end: joinFinale.dockEnd,
          scrub: joinFinale.dockScrub,
        },
      },
    );

    gsap.utils.toArray<HTMLElement>("[data-join-blob]").forEach((blob, i) => {
      const range = blobRanges[i];
      if (!range) return;
      gsap.fromTo(
        blob,
        { yPercent: range.from },
        {
          yPercent: range.to,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-join-panel]",
            start: joinFinale.dockStart,
            end: joinFinale.dockEnd,
            scrub: joinFinale.dockScrub,
          },
        },
      );
    });

    // Phase 2 — one-shot reveal.
    ScrollTrigger.create({
      trigger: "[data-join-panel]",
      start: joinFinale.revealStart,
      once: true,
      onEnter: () => {
        document.fonts.ready.then(
          contextSafe(() => {
            const split = SplitText.create("[data-join-headline]", {
              type: "lines",
              mask: "lines",
            });
            splitRef.current = split;
            gsap
              .timeline()
              .from(split.lines, {
                yPercent: 110,
                stagger: joinFinale.lineStagger,
                ease: "power4.out",
              })
              // opacity (not autoAlpha): visibility:hidden on a focused link
              // drops keyboard focus to <body> when the trigger fires mid-tab.
              .from(
                ["[data-join-body]", "[data-join-social]"],
                { opacity: 0, y: 10 },
                "-=0.2",
              )
              .from("[data-join-ctas] > *", {
                opacity: 0,
                y: 14,
                stagger: joinFinale.ctaStagger,
                ease: "power3.out",
              });
          }),
        );
      },
    });
  });

  useEffect(() => {
    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, []);

  return null;
}
