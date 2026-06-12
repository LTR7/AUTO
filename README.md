# AUTO — The Agentic AI Club

A modern, creative, **Stripe-inspired** portfolio site for **AUTO**, a campus club for agentic AI & autonomous systems. Static, fast, fully themeable (light/dark with a radial transition), and animated with GSAP.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Runtime / PM | Bun |
| Linter | oxlint |
| State | Zustand (theme + persistence) |
| Animation | GSAP + `@gsap/react` |
| Images / OG | sharp (ready) · `next/og` (dynamic OG image) |
| Data fetching | TanStack Query (installed, reserved for future client data) |
| Backend | None — static SSG, content in typed constants |

## Getting started

```bash
bun install
bun run dev        # http://localhost:3000
```

## Scripts

| Script | Action |
|---|---|
| `bun run dev` | Dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | oxlint |
| `bun run typecheck` | `tsc --noEmit` |

## Structure

```
src/
  app/          layout, page, globals.css, error, not-found, icon.svg,
                opengraph-image, sitemap.ts, robots.ts
  components/
    ui/         Button, Card, Container, Section, Eyebrow, GradientText,
                GradientMesh, Skeleton
    layout/     Nav, MobileMenu, Footer, ThemeToggle
    sections/   Hero, About, Manifesto, WhatWeDo, Projects, WhoShouldJoin,
                Culture, Join
    motion/     ScrollReveal
  constants/    site, content, nav, social, animations   ← all copy lives here
  lib/          cn, theme, view-transition, gsap
  stores/       theme
  types/        content
```

## Theming

Light (Stripe-faithful: white canvas, navy ink, indigo CTA) and dark are driven by a
`.dark` class on `<html>`. Default is the system preference; an explicit choice is
persisted (Zustand + localStorage) and applied pre-paint to avoid a flash. Toggling
plays a **radial reveal** via the View Transitions API, with a fallback for
unsupported browsers and `prefers-reduced-motion`.

## Motion

`ScrollReveal` (one client component) reveals `[data-reveal]` blocks and staggers
`[data-reveal-stagger]` groups on scroll; the hero gradient mesh blobs float gently.
All motion is disabled under `prefers-reduced-motion`.

## Content & placeholders

All copy is in `src/constants/`. There is **no backend/database** — the site is fully
static. Replace these placeholders when available (in `src/constants/social.ts`):

- `APPLY_URL` — external application form (Apply / Join buttons)
- `socials.linkedin` — real LinkedIn URL

## Deploy (Vercel)

```bash
vercel login
vercel --prod
```

…or connect the GitHub repo in the Vercel dashboard for automatic deploys. CI
(`.github/workflows/ci.yml`) runs `lint → typecheck → build` on every push.

## Project docs

- `docs/PRD.md`, `docs/TRD.md`, `docs/instructions.md`, `docs/stripe.md`
- `tasks/todo.md`, `tasks/lessons.md`
- `CLAUDE.md` — working rules for AI agents on this repo
