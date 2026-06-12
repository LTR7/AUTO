"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { heroProgress } from "./sceneState";

// Code-split the WebGL scene: never SSR'd, loaded after first paint.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pause rendering when the hero scrolls out of view (saves GPU).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-dissolve driver: raw progress only — the frame loop smooths it and
  // the shaders do the rest (edges fade, nodes sink, pulses gate). No pin,
  // zero CLS. Under reduced motion the static constellation simply scrolls away.
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const write = (self: ScrollTrigger) => {
      heroProgress.value = self.progress;
    };
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      onUpdate: write,
      onRefresh: write,
    });
  });

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 z-0">
      <HeroScene active={active} />
    </div>
  );
}
