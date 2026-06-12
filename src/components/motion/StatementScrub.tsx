"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { statementScrub } from "@/constants/animations";

/**
 * Scroll-scrubbed word-by-word ink-up for the statement band.
 * Dim state is applied by GSAP only — no-JS / reduced-motion readers see full ink.
 */
export function StatementScrub() {
  const splitRef = useRef<SplitText | null>(null);

  useGSAP((_, contextSafe) => {
    if (!contextSafe) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Split only after fonts load so line/word boxes are final.
    document.fonts.ready.then(
      contextSafe(() => {
        const split = SplitText.create("[data-statement-line]", {
          type: "words",
          aria: "auto",
        });
        splitRef.current = split;

        // Highlighted words keep their primary color — never dimmed.
        // Dim via opacity, not color: GSAP bakes var(--ink) to a literal rgb at
        // tween init, which would freeze the pre-toggle theme's ink forever.
        const dimWords = split.words.filter((el) => !el.closest(".text-primary"));
        gsap.set(dimWords, { opacity: statementScrub.dimInkPercent / 100 });
        gsap.to(dimWords, {
          opacity: 1,
          stagger: { each: statementScrub.wordStagger },
          ease: "none",
          scrollTrigger: {
            trigger: "#statement",
            start: statementScrub.start,
            end: statementScrub.end,
            scrub: statementScrub.scrub,
          },
        });
      }),
    );
  });

  useEffect(() => {
    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, []);

  return null;
}
