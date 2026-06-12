"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { reveal, watermarkRise } from "@/constants/animations";

/**
 * Mounted once. Reveals on scroll:
 *  - [data-reveal]          → the element fades/rises in as one block
 *  - [data-reveal-stagger]  → its direct children fade/rise in, staggered
 * No-ops under prefers-reduced-motion (elements stay visible — never hidden).
 */
export function ScrollReveal() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    blocks.forEach((el) => {
      gsap.set(el, { opacity: 0, y: reveal.y });
      ScrollTrigger.create({
        trigger: el,
        start: reveal.start,
        once: true,
        onEnter: () =>
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: reveal.duration,
            ease: reveal.ease,
          }),
      });
    });

    const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]");
    groups.forEach((group) => {
      const children = Array.from(group.children) as HTMLElement[];
      gsap.set(children, { opacity: 0, y: reveal.y });
      ScrollTrigger.create({
        trigger: group,
        start: reveal.start,
        once: true,
        onEnter: () =>
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: reveal.duration,
            ease: reveal.ease,
            stagger: reveal.stagger,
          }),
      });
    });

    // Footer watermark rise — GSAP's yPercent composes with its CSS translate classes.
    const watermark = document.querySelector<HTMLElement>("[data-watermark]");
    if (watermark) {
      gsap.fromTo(
        watermark,
        { yPercent: watermarkRise.fromYPercent },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: watermark.closest("footer"),
            start: "top bottom",
            end: "bottom bottom",
            scrub: watermarkRise.scrub,
          },
        },
      );
    }
  });

  return null;
}
