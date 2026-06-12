# TRD — AUTO Club Website

## 1. Architecture
- **Next.js 16 App Router + React 19.** Server Components by default; client components only where interactivity is required (theme toggle, GSAP, mobile menu).
- **Rendering: SSG.** Content is build-time constant → fully static. No runtime backend.
- **Bun** as package manager + script runner.

## 2. Folder structure
```
/CLAUDE.md
/docs/{PRD,TRD,instructions}.md
/tasks/{todo,lessons}.md
/public/                      # static assets, optimized images
/src/
  app/                        # App Router: layout.tsx, page.tsx, metadata, not-found.tsx, error.tsx, sitemap.ts, robots.ts
  components/
    ui/                       # primitives: Button, Container, Section, Card, GradientText, Skeleton
    sections/                 # Hero, About, Manifesto, WhatWeDo, Projects, WhoShouldJoin, Culture, Join
    layout/                   # Nav, Footer, ThemeToggle, MobileMenu
  constants/                  # content.ts, nav.ts, site.ts, social.ts, theme.ts, animations.ts
  lib/                        # utils, hooks (useGSAP wrappers, view-transition helper)
  stores/                     # zustand: theme store
  styles/                     # globals.css (Tailwind v4 import + @theme tokens)
  types/                      # shared TS types for content
```

## 3. Data / content model
- All content in `src/constants/content.ts`, typed via `src/types`. No fetching; imported at build time.
- Each section has an explicit typed shape (e.g. `Principle`, `Project`, `Activity`, `CultureValue`).

## 4. Styling & design tokens
- Tailwind v4; theme defined with CSS `@theme` tokens in `styles/globals.css`.
- **Breakpoints = Tailwind v4 defaults** — no override needed:
  | prefix | min-width |
  |---|---|
  | sm | 40rem (640px) |
  | md | 48rem (768px) |
  | lg | 64rem (1024px) |
  | xl | 80rem (1280px) |
  | 2xl | 96rem (1536px) |
- Color tokens for light & dark via CSS variables. **Full design reference: `docs/stripe.md`.**
- **Design language = Stripe (`docs/stripe.md`), tuned to AUTO's identity:**
  - **Light theme (Stripe-faithful):** canvas `#ffffff`, soft `#f6f9fc`, cream interlude `#f5e9d4`, ink `#0d253d`, hairline `#e3e8ee`. Primary CTA indigo `#533afd`, used sparingly (one filled pill per band).
  - **Dark theme (counterpart):** canvas deep navy `#0f0f0f` / `#0d253d`, light text on dark, same gradient mesh tuned for dark surfaces.
  - **Gradient mesh** = signature hero backdrop (non-negotiable per spec). Stripe stops (cream / sherbet / lavender / indigo / ruby / magenta) blended with AUTO's sky `#0ea5e9` + cyan `#06b6d4` so the club identity reads. Implement as layered SVG / large background image — not a flat CSS gradient (organic blob shapes).
  - **Shape:** pill buttons `9999px` (padding ≥ `8px 16px`); cards `12px`; inputs `6px`. Elevation: subtle navy-tinted shadows (Level 1 `rgba(0,55,112,.08) 0 1px 3px`, Level 2 `… 0 8px 24px`); the mesh is the primary depth medium.
  - **Spacing:** 8px base unit; section padding 64–96px; feature-card padding 32px; section gaps ~96px (generous whitespace).
- **Typography:** Inter via `next/font` as the Sohne substitute — **weight 300 for all display tiers**, `font-feature-settings: "ss01"` applied globally on body, negative tracking (−1.4px @56px → −0.2px @20px). Display stair-steps 56 → 48 → 32 → 26 → 22px (drops to 36px on mobile); body 15px (`body-md`). **Never bump display weight above 300** — thin tracking is the brand signature.
- **Skip Stripe's `tnum` / tabular-figure money rules** — no money/numeric data on this site (ADR-005).

## 5. Theming (radial transition) — technical
- `stores/theme.ts` (Zustand + persist middleware): state `'light' | 'dark' | 'system'`; resolves `system` via `matchMedia('(prefers-color-scheme: dark)')` and reacts to changes.
- Apply resolved theme via `class`/`data-theme` on `<html>`. Prevent FOUC with a small inline pre-hydration script in `layout.tsx`.
- Transition: `document.startViewTransition()` then animate `::view-transition-new(root)` with a `clip-path` circle expanding from the toggle's click coordinates. **Feature-detect** `startViewTransition`; fallback = instant swap. **Skip** under `prefers-reduced-motion`.

## 6. Animation
- GSAP + `@gsap/react` `useGSAP` (automatic cleanup) inside client components only.
- ScrollTrigger for reveals / parallax / pinning / horizontal scroll. Centralize all tunables in `constants/animations.ts`.
- Every motion path guarded by `prefers-reduced-motion`.

## 7. Performance
- `next/image` (sharp) for all raster images, with explicit `width`/`height` to prevent CLS.
- RSC by default; minimize client JS; lazy-load heavy / below-the-fold client components (`next/dynamic`).
- Skeletons via Suspense + plain Tailwind (no extra package).

## 8. Accessibility & SEO
- Semantic landmarks, skip-link, `focus-visible`, ARIA on menu/toggle, AA contrast in both themes.
- Next Metadata API, Open Graph / Twitter cards, `sitemap.ts`, `robots.ts`, canonical URL.

## 9. Tooling & CI
- **oxlint** = primary linter → `bun run lint`. TS strictness via `bunx tsc --noEmit`.
- **Known gap (ADR-003):** oxlint has no Next.js-specific rules (e.g. `next/no-img-element`, `next/no-html-link-for-pages`). Start oxlint-only; optionally add `eslint-config-next` in CI *for Next rules only* if Next-specific bugs surface.
- **CI (GitHub Actions):** on push → `bun install` → `bun run lint` → `bunx tsc --noEmit` → `next build`. Block on failure.

## 10. Deployment
- **Vercel**, connected to the GitHub repo. Push to `main` → preview/prod deploy. Verify the build on Vercel each phase.

## 11. Decisions (ADR)
- **ADR-001 — Next.js App Router over TanStack Router.** Can't run both; Next's router is native, mature, best for SSR/SEO and `next/image`. Retained TanStack Query, Zustand, GSAP.
- **ADR-002 — No backend/DB.** Content is static; a backend violates Simplicity First. Apply/Join links out.
- **ADR-003 — oxlint primary; Next-rule gap accepted** (see §9).
- **ADR-004 — Forms/Zod deferred** until an on-site form is requested.
- **ADR-005 — Adopt Stripe design language (`docs/stripe.md`), tuned to AUTO; skip money/`tnum` rules.** Light theme Stripe-faithful (white canvas, navy ink, indigo CTA); dark theme is the counterpart; gradient mesh blends Stripe stops with AUTO sky/cyan. Tabular-figure rules omitted (no financial data). **Open:** primary CTA = indigo (default) vs AUTO sky/cyan — confirm before Phase 2.

## 12. Risks & mitigations
- **GSAP × RSC:** isolate in client components; guard SSR mismatch via `useGSAP` + mounted checks.
- **View Transitions API support varies:** mandatory fallback path.
- **Bun × Next edge cases:** verify the Vercel build at the end of every phase, not just locally.
