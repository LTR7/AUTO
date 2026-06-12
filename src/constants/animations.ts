/** Centralized motion tunables (Phase 6). */
export const reveal = {
  y: 18,
  duration: 0.7,
  ease: "power2.out",
  stagger: 0.08,
  start: "top 86%",
} as const;

export const meshFloat = {
  minDuration: 8,
  maxDuration: 12,
} as const;

/** Hero entrance: scramble lead → masked line rise → subhead → CTAs last. */
export const overture = {
  fontTimeoutMs: 1200,
  scrambleDuration: 0.9,
  scrambleChars: "01<>/_",
  scrambleSpeed: 0.4,
  lineStagger: 0.12,
  lineEase: "power4.out",
  subheadY: 12,
  ctaY: 14,
  ctaStagger: 0.08,
  ctaEase: "power3.out",
  scrollNudge: 6,
} as const;

export const consoleLoop = {
  lineStagger: 0.45,
  typeDuration: 1.2,
  start: "top 75%",
} as const;

export const statementScrub = {
  scrub: 0.5,
  wordStagger: 0.06,
  dimInkPercent: 25,
  start: "top 80%",
  end: "center 45%",
} as const;

export const joinFinale = {
  dockScale: 0.93,
  dockY: 40,
  dockScrub: 0.8,
  dockStart: "top 90%",
  dockEnd: "top 35%",
  revealStart: "top 55%",
  lineStagger: 0.14,
  ctaStagger: 0.08,
} as const;

/** Rest position carried by CSS translate; GSAP only adds the surfacing rise. */
export const watermarkRise = {
  fromYPercent: 13,
  scrub: 1,
} as const;
