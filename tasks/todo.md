# todo.md — AUTO Club Website (build log)

Legend: `[x]` done · `[~]` partial / blocked on input · `[ ]` todo

---

## Phase 0 — Scaffold & tooling ✅
- [x] Next.js 16.2.9 + React 19.2.4 + TS (strict) + Tailwind v4, via bun; ESLint removed → oxlint.
- [x] Deps: gsap, @gsap/react, zustand, @tanstack/react-query, sharp; oxlint (dev). (Forms/Zod deferred — ADR-004.)
- [x] Scripts: `dev`/`build`/`start`/`lint` (oxlint)/`typecheck`; `.oxlintrc.json`; `turbopack.root`; `.gitattributes`.
- [x] Folder structure (TRD §2); `constants/site.ts`; base layout, 404, error pages.
- [x] git (`main`) + GitHub Actions CI (install → lint → typecheck → build).
- [~] GitHub remote/push — **pending: choose strategy (old Vite app still on `main`); authenticate.**
- [~] Vercel deploy — **pending: your `vercel login`.**

## Phase 1 — Content & types ✅
- [x] Verbatim copy from the existing site → `constants/{content,nav,social}.ts`, typed via `types/content.ts`.
- [x] Actual counts: 4 principles · 5 activities · 6 projects · 6 profiles · 6 culture values.
- [x] Placeholders flagged: Apply URL, LinkedIn URL (contact email kept).

## Phase 2 — Design system & theming ✅
- [x] Tailwind v4 `@theme` tokens (Stripe-tuned), light/dark via `.dark`, fluid type tiers, gradient-text + mesh utilities.
- [x] Zustand theme store (persist) + system resolve + FOUC inline script.
- [x] Radial theme transition (View Transitions API) with reduced-motion + no-support fallback.
- [x] UI primitives: Button, Card, Container, Section, Eyebrow, GradientText, GradientMesh, Skeleton; ThemeToggle.

## Phase 3 — Layout shell ✅
- [x] Glassmorphic sticky Nav (transparent → frosted on scroll); accessible MobileMenu (Esc, scroll-lock).
- [x] Footer (Navigate / Connect groups + legal). Smooth scroll (reduced-motion aware).

## Phase 4 — Sections pt.1 ✅
- [x] Hero (gradient mesh, gradient "AUTO", dual CTAs), About (3 pillars), Manifesto (4 principles).

## Phase 5 — Sections pt.2 ✅
- [x] WhatWeDo (5), Projects (6 + tag pills), WhoShouldJoin (6 + closing), Culture (6), Join (featured dark CTA).
- [x] page.tsx assembles all 8 sections.

## Phase 6 — Motion layer ✅
- [x] GSAP setup + tunables; `ScrollReveal` driver ([data-reveal] / [data-reveal-stagger]); floating mesh.
- [x] All motion reduced-motion safe (content never hidden without JS/motion).

## Phase 7 — Polish: perf, a11y, SEO ✅
- [x] Metadata (OG, Twitter, keywords, canonical) + viewport themeColor; dynamic OG image; favicon.
- [x] sitemap.ts + robots.ts; skip-to-content link.
- [x] No CLS (opacity/transform reveals only); no raster images to optimize. Skeleton primitive kept for future async.

## Phase 8 — Finalize ✅ (deploy pending you)
- [x] README; build log (this file); lessons updated.
- [x] Final verification: `bun run lint` + `typecheck` + `build` green (routes: /, /_not-found, /icon.svg, /opengraph-image, /robots.txt, /sitemap.xml — all static).
- [ ] Push to GitHub (strategy + auth) and Vercel deploy — **your action.**

## Phase 9 — Masterpiece enhancement ✅ (design-panel directed)
Vision (judged by a 4-designer / 3-judge panel, synthesized): "the page is AUTO's first shipped agentic system."
- [x] **Agent Constellation hero** (replaces the distort-blob): 110 seeded fibonacci-sphere agent nodes (one InstancedMesh) + kNN edges with sliding packets (one LineSegments) + fresnel-rimmed orchestrator hub, all custom ShaderMaterials sharing one uniforms object. Interactive: cursor attractor + 6 recruitment lines, click-to-dispatch pulse waves (4-slot ring buffer) with hub call-and-response, scroll dissolve (edges fade → nodes sink), theme-reactive palettes tweened via MutationObserver on `.dark` (blueprint-on-white ↔ mission-control glow), width-driven scene scale for mobile. Reduced motion: curated still frame.
- [x] **Hero overture**: ScrambleText lead + SplitText masked line rise + staggered CTAs last; hide states applied only after fonts settle (1.2s timebox; overture skipped if fonts stall).
- [x] **Agent Console** product mockup (WhatWeDo → 5/7 asymmetric composite): server-rendered finished transcript, plays once on scroll (WCAG 2.2.2), tnum ms timings, fixed-width status pills (CLS-proof).
- [x] **Editorial back half**: About editorial split; Manifesto sticky chapter read + ghost numeral; WhoShouldJoin = the page's single cream interlude (ruled table, AA-fixed ink-secondary); full-bleed Statement band (scroll-scrubbed word ink-up via opacity); Join finale (scrubbed dock + one-shot reveal, focus-safe); footer watermark with scroll rise.
- [x] Brand fixes: eyebrow micro-cap per stripe.md, tag pill tokens, scene palette = documented stops only.
- [x] Review: 4-dimension agent review (correctness/a11y/brand/perf) + adversarial verification → 13 confirmed findings, all fixed (see lessons).
- [x] Verified: lint/types/build green; Playwright runtime pass (both themes, mobile, reduced-motion, theme-toggle-after-scrub, console play-once) — zero page errors.
- [ ] Push to GitHub — **still pending remote setup (your action, Phase 0 item).**

---
### Pending external inputs
- [ ] External Apply/Join URL → `constants/social.ts` `APPLY_URL`.
- [ ] Real LinkedIn URL → `constants/social.ts` `socials.linkedin`.
- [ ] (Optional) refine palette: primary CTA = indigo (current default) vs AUTO sky/cyan — ADR-005.
