# CLAUDE.md — AUTO Club Website

> Operational source of truth for Claude Code on this project. **Read this FIRST every session.**
> When the user corrects you: append the lesson to `tasks/lessons.md` AND distill a one-line rule into §6 below.

## 1. Project
- **AUTO** = campus club for agentic AI & autonomous systems.
- Goal: a modern, creative, **Stripe-inspired portfolio/landing site** that showcases the club and converts visitors into applicants.
- Content source: copy/sections from https://github.com/LTR7/AUTO — **rebuild from scratch; reuse only the *content*, never the old code.**
- **Solo** developer. Each build phase runs in a **fresh chat** to conserve context/tokens.
- Visual design language: **Stripe-inspired**, tuned to AUTO (reference: `docs/stripe.md`; resolved tokens in TRD §4 / ADR-005).

## 2. Locked tech stack (do NOT substitute without explicit approval)
| Concern | Choice |
|---|---|
| Runtime / package manager | **Bun** |
| Framework | **Next.js 16 (App Router)** + **React 19** |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** |
| Linter | **oxlint** (primary) |
| State + persistence | **Zustand** (+ localStorage) |
| Animation | **GSAP** + `@gsap/react` (`useGSAP`) |
| Images | **sharp** (via `next/image`) |
| Client data fetching | **TanStack Query** — only where client async is genuinely needed |
| Forms / validation | **TanStack Form + Zod** — **DEFERRED** (no on-site form yet; Apply/Join links out) |
| Deploy | **Vercel** |
| Backend / DB | **NONE** — static SSG, content lives in typed constants |

> **Next.js 16 has breaking changes vs older versions.** Before writing Next-specific code (routing, metadata, caching, dynamic params), consult `AGENTS.md` and `node_modules/next/dist/docs/` rather than relying on memory.

### Dropped / not used (with reason)
- **TanStack Router** — dropped. Next.js App Router *is* the router. (ADR-001 in TRD.)
- **Ruff** — N/A. Ruff is a Python linter; this is a TS project. Lint = **oxlint**.

## 3. Hard rules
- **Simplicity first.** Minimum code that solves the task. No speculative abstractions, no unrequested config/flexibility, no error handling for impossible cases. If 200 lines could be 50, rewrite to 50.
- **Surgical changes.** Touch only what the task needs. Don't refactor/reformat adjacent code. Match existing style. Mention unrelated dead code — don't delete it.
- **Constants, not magic.** All copy, nav items, social links, theme tokens, and animation params live in `src/constants/*`, typed via `src/types`. **No business content hard-coded inside components.**
- **SOLID per React component** (see `docs/instructions.md` §SOLID).
- **Accessibility is non-negotiable.** Semantic HTML, keyboard nav, visible focus, alt text, `prefers-reduced-motion`, AA contrast in both themes.
- **No phase is "done" until verified:** `bun run build` passes, `bun run lint` (oxlint) is clean, `bunx tsc --noEmit` is clean, behavior is demonstrated — *then* commit + push.
- **Stay in the current phase.** Don't pull work forward from later phases.
- **Think before coding.** State assumptions; if multiple interpretations exist, surface them instead of silently picking.

## 4. Per-phase ritual (every fresh chat)
1. Read in order: this file → `docs/instructions.md` → `docs/PRD.md` → `docs/TRD.md` → `tasks/todo.md` → `tasks/lessons.md`.
2. Find the current phase in `tasks/todo.md`. **Restate its scope** and do ONLY that phase.
3. Implement.
4. Verify: `bun run lint` + `bunx tsc --noEmit` + `bun run build` + demonstrate behavior.
5. Update `tasks/todo.md` (check items), append mistakes/lessons to `tasks/lessons.md`, distill hard rules into §6.
6. Commit + push to GitHub.

## 5. Theme behavior (requirement)
- Toggle dark / light. **Default = system** preference. Persist the user's explicit choice (Zustand + localStorage).
- Transition = **radial progressive reveal**: View Transitions API + an expanding `clip-path` circle originating from the toggle button. Feature-detect; fallback to instant swap. Skip the animation under `prefers-reduced-motion`. Prevent FOUC with a pre-hydration inline script.

## 6. Lessons applied (grows over time — newest on top)
- Never GSAP-tween `var(--token)` colors (endpoints bake to literal rgb at init; theme toggles strand them) — tween opacity instead.
- Re-verify AA contrast for every text token whenever a section's background token changes (ink-mute passes on white, fails on cream).
- Scroll-triggered reveals of focusable content use `opacity`, not `autoAlpha` (visibility:hidden drops focus to `<body>`); autoAlpha only for load-time entrances.
- Auto-started motion >5s beside content violates WCAG 2.2.2 — play once ending on the SSR final state, or add a pause control.
- Apply hide states inside the same gated callback that reveals them, and timebox the gate (skip the animation if it stalls).
- Scale WebGL scene groups from canvas width and verify at mobile widths (vertical FOV is constant; narrow screens magnify).
- pointermove handlers must filter `pointerType` — touch scroll-swipes fire pointermove.
- View Transitions: toggle the DOM `.dark` class synchronously inside the `startViewTransition` callback (async React state is too late for the snapshot).
- Prefer Tailwind v4 canonical utilities (`rounded-3xl`, `z-100`) over arbitrary `[..]` values.
- After scaffolding, audit generated files — `create-next-app --yes` honours saved machine prefs (can re-add ESLint / overwrite project docs).
- Next.js 16 has breaking changes — consult `node_modules/next/dist/docs/` + `AGENTS.md` before writing Next-specific code.
- Verify oxlint rule names against its plugins (ESLint names like `jsx-uses-react` may not exist in oxlint).
- Pin `turbopack.root` in `next.config.ts` to avoid wrong workspace-root inference from stray lockfiles.
- Verify two tools don't overlap before adopting both (Next.js router vs TanStack Router → kept Next.js).
- Don't install libraries the current scope doesn't use (forms/Zod deferred until a real form exists).
- Template leftovers (e.g. "ruff removal") may not match this stack — confirm tooling matches the language before acting.
- A static content site needs no backend/DB — resist adding one.
