# instructions.md — How Claude Works on This Project

Tailored from the user's workflow orchestration + Karpathy coding guidelines. `CLAUDE.md` is the quick reference; this file is the detailed protocol.

## A. Workflow orchestration
1. **Plan first.** For any non-trivial task (3+ steps or an architectural choice), enter plan mode and get sign-off before coding. If something goes sideways mid-task, **stop and re-plan** — don't keep pushing.
2. **Subagents for breadth.** Offload research/exploration/parallel analysis to subagents to keep the main context clean. One task per subagent.
3. **Self-improvement loop.** After ANY user correction: append the pattern to `tasks/lessons.md` and distill a one-line rule into `CLAUDE.md §6`. Review lessons at the start of every phase.
4. **Verification before done.** Never mark a task complete without proving it works (build + lint + types + demonstrated behavior). Ask: "Would a staff engineer approve this?"
5. **Demand elegance (balanced).** For non-trivial changes, pause: "is there a more elegant way?" If a fix feels hacky, redo it properly. Skip this ceremony for trivial fixes.
6. **Autonomous bug fixing.** Given a bug/log/failing test, just fix it — point at the evidence and resolve it without hand-holding.

## B. Core principles
- **Simplicity first** — minimal code, minimal surface area.
- **No laziness** — find root causes; no temporary patches; senior standard.
- **Minimal impact** — changes touch only what's necessary; avoid introducing regressions.

## C. SOLID for React components
- **S — Single responsibility:** one component = one job. Split data-shaping, layout, and presentation. Section components compose `ui/` primitives.
- **O — Open/closed:** extend via props/composition/`children`, not by editing a component's internals for each new case.
- **L — Liskov:** variants share a consistent prop contract (a `Button` variant must be swappable without breaking callers).
- **I — Interface segregation:** small, focused prop types; don't force consumers to pass props they don't use.
- **D — Dependency inversion:** components depend on abstractions (hooks, props, the theme store) — not on concrete fetch/DOM details. Side effects live in `lib/` hooks.

## D. Definition of Done (gate for every phase)
- [ ] `bun run lint` (oxlint) — clean.
- [ ] `bunx tsc --noEmit` — no type errors.
- [ ] `bun run build` (`next build`) — succeeds.
- [ ] Behavior demonstrated (screenshot / described interaction / passing check).
- [ ] Responsive verified at sm/md/lg/xl/2xl for new UI.
- [ ] A11y pass for new UI (keyboard, focus, contrast, reduced-motion).
- [ ] `tasks/todo.md` updated; `tasks/lessons.md` + `CLAUDE.md` updated if anything was learned.
- [ ] Committed + pushed to GitHub.

## E. Coding conventions
- TypeScript strict. No `any` (use `unknown` + narrowing). Explicit return types on exported functions.
- All business content imported from `src/constants/*` — never inline copy in components.
- Client components: add `'use client'` only where required (state, effects, GSAP, browser APIs).
- Name files by role: `Hero.tsx` (component), `useViewTransition.ts` (hook), `content.ts` (constants).
- Comments explain *why*, not *what*. Match surrounding density.

## F. Git & GitHub
- Branch per phase (`phase/<n>-<slug>`), or commit directly to `main` if the user prefers — confirm once.
- Conventional-ish messages: `feat(theme): radial transition toggle`.
- Push at the end of each phase only after the DoD gate passes. CI (lint + types + build) must be green.

## G. Token discipline (fresh chat per phase)
- The docs are the shared memory across chats. Keep them current so the next chat needs zero re-explanation.
- At the start of a phase, read the docs, restate scope, then execute — don't re-derive prior decisions.
