"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hero } from "@/constants/content";
import { overture } from "@/constants/animations";

/**
 * Hero entrance: scrambled lead-in → masked line rise → subhead → CTAs as the
 * deliberate last beat → scroll cue nudge (killed on first scroll). Bails
 * under reduced motion; hidden states are applied only once fonts settle (and
 * never if they stall past the timebox), so the SSR hero is never blanked
 * while waiting and no-JS users always see everything.
 */
export function HeroOverture() {
  const splitRef = useRef<SplitText | null>(null);

  useGSAP((_, contextSafe) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!contextSafe) return;

    // Split only after webfonts settle — line boxes are final then. If fonts
    // stall, skip the overture entirely rather than animate unsettled lines.
    const fontsSettled = Promise.race([
      document.fonts.ready.then(() => true),
      new Promise<boolean>((resolve) => {
        window.setTimeout(() => resolve(false), overture.fontTimeoutMs);
      }),
    ]);

    fontsSettled.then(
      contextSafe((settled: boolean) => {
        if (!settled) return;

        // All hiding happens here, synchronously before the next paint — the
        // line mask conceals the headline; the rest hides via opacity only.
        const split = SplitText.create("[data-hero-line]", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });
        splitRef.current = split;
        // autoAlpha (not opacity): focus is still at <body> on load, and
        // invisible-but-focusable CTAs would be worse than a brief omission.
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set("[data-hero-subhead]", { autoAlpha: 0, y: overture.subheadY });
        gsap.set("[data-hero-ctas] > *", { autoAlpha: 0, y: overture.ctaY });
        gsap.set("[data-hero-scroll]", { autoAlpha: 0 });

        const tl = gsap.timeline();
        tl.to("[data-hero-lead]", {
          duration: overture.scrambleDuration,
          scrambleText: {
            text: hero.headlineLead,
            chars: overture.scrambleChars,
            speed: overture.scrambleSpeed,
          },
          ease: "none",
        })
          .to(
            split.lines,
            {
              yPercent: 0,
              duration: 0.9,
              ease: overture.lineEase,
              stagger: overture.lineStagger,
            },
            "-=0.6",
          )
          .to(
            "[data-hero-subhead]",
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.45",
          )
          .to("[data-hero-ctas] > *", {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: overture.ctaStagger,
            ease: overture.ctaEase,
          })
          .to(
            "[data-hero-scroll]",
            { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
            "-=0.2",
          )
          .call(() => {
            const nudge = gsap.to("[data-hero-scroll]", {
              y: overture.scrollNudge,
              duration: 1.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
            window.addEventListener(
              "scroll",
              () => {
                nudge.kill();
                gsap.to("[data-hero-scroll]", { y: 0, duration: 0.3 });
              },
              { once: true, passive: true },
            );
          });
      }),
    );
  });

  useEffect(() => () => splitRef.current?.revert(), []);

  return null;
}
