# lessons.md — Mistakes & Lessons (carry forward to future projects)

**Protocol:** After ANY user correction or self-caught error, add an entry here AND distill a one-line rule into `CLAUDE.md §6`. Review at the start of every phase. Newest on top.

Entry format:
```
### <short title> — <date>
- Context: what was happening.
- Mistake / risk: what went (or would have gone) wrong.
- Lesson / rule: the durable rule to prevent recurrence.
```

---

### GSAP bakes `var(--token)` color endpoints at tween init — 2026-06-11 (Phase 9)
- Context: statement band scrubbed words from a color-mix dim to `color: "var(--ink)"`.
- Mistake / risk: GSAP resolves `var(--…)` endpoints to literal rgb ONCE (gsap.js `_getComputedProperty`), writing them inline — after a theme toggle the words keep the old theme's ink (≈1.1:1 contrast). Caught by the review panel, not the smoke run.
- Lesson: never tween CSS-variable colors on a theme-switchable site; tween opacity (or a numeric custom property) so the color stays inherited and theme-reactive.

### Token contrast is background-relative — 2026-06-11 (Phase 9)
- Context: moved WhoShouldJoin onto the cream band, keeping `text-ink-mute`.
- Mistake / risk: ink-mute passes AA on white (4.75:1) but fails on cream (3.95:1) — three independent reviewers caught it.
- Lesson: whenever a section's background token changes, re-verify AA for every text token on it; fix with theme-conditional classes (`text-ink-secondary dark:text-ink-mute`).

### visibility:hidden reveals drop keyboard focus — 2026-06-11 (Phase 9)
- Context: Join finale `from(autoAlpha: 0)` could fire while a CTA already held focus (focus-induced scroll triggers the reveal).
- Lesson: for scroll-triggered reveals of focusable content use `opacity`, not `autoAlpha` (focus drops to `<body>` when a focused element goes visibility:hidden). autoAlpha remains correct for load-time entrances where nothing can hold focus yet.

### Auto-started looping motion violates WCAG 2.2.2 — 2026-06-11 (Phase 9)
- Context: Agent Console transcript looped forever (`repeat: -1`) beside the activities list.
- Lesson: auto-started motion lasting >5s parallel to content needs an on-page pause mechanism; play-once (<5s) ending on the SSR-rendered final state is the minimal compliant design. Also keep timeline hides on `opacity` so rows never leave the accessibility tree, and pin swap-text pills to a fixed width (label-width changes reflow wrapped rows → CLS).
- Related: `prefers-reduced-motion` satisfies 2.3.3, but it is NOT the user mechanism 2.2.2 requires.

### Hide and reveal must share one gate — 2026-06-11 (Phase 9)
- Context: hero overture hid content at hydration but revealed inside `document.fonts.ready` (unbounded).
- Lesson: apply hide states inside the same gated callback that starts the reveal, and timebox the gate (`Promise.race` with a timeout that skips the animation, leaving SSR content visible). A reveal that waits must never strand a hide that already ran.

### Fixed-FOV 3D scenes need width-driven scale — 2026-06-11 (Phase 9)
- Context: hero constellation looked perfect at 1440px; at 390px the hub filled the viewport (vertical FOV is constant, horizontal shrinks).
- Lesson: scale the scene group from canvas width (`min(1, max(min, width/fullWidth))`) — and verify WebGL scenes at mobile widths, not just desktop.

### Filter pointer events by pointerType — 2026-06-11 (Phase 9)
- Context: camera-parallax `pointermove` had no type filter; touch scroll-swipes yanked (and permanently offset) the camera.
- Lesson: any pointermove-driven hover effect must early-return for non-mouse pointers; touch gets its own explicit interaction (tap burst with decay).

### View Transitions need a synchronous DOM update — 2026-06-11 (Phase 2/6)
- Context: radial theme toggle via `document.startViewTransition`.
- Risk: changing theme only through async React/Zustand state means the new-view snapshot is captured before the `.dark` class lands → no visible transition.
- Lesson: toggle the DOM class synchronously inside the `startViewTransition` callback; sync React/store state alongside for persistence.

### Prefer Tailwind v4 canonical utilities over arbitrary values — 2026-06-11 (Phase 6/7)
- Context: used `rounded-[1.5rem]` and `z-[100]`; the Tailwind IDE plugin flagged canonical equivalents.
- Lesson: use named utilities (`rounded-3xl`, `z-100`) where they exist; reserve `[..]` arbitrary values for true one-offs.

### `create-next-app --yes` pulled stale machine preferences — 2026-06-11 (Phase 0)
- Context: scaffolded with `--yes` + explicit flags; it still added ESLint and a generated `CLAUDE.md` from this machine's saved create-next-app prefs.
- Risk: silently re-introducing tooling we explicitly dropped, and clobbering the authoritative root `CLAUDE.md`.
- Lesson: after scaffolding, audit generated files — `--yes` honours saved prefs. Remove unwanted configs; never let a generator overwrite project docs.

### `@latest` installed Next.js 16 (breaking changes) — 2026-06-11 (Phase 0)
- Context: `create-next-app@latest` pulled Next 16.2.9 / React 19.2.4 — newer than training data; generated `AGENTS.md` warns of breaking changes.
- Lesson: check scaffolded versions; for Next-specific code consult `node_modules/next/dist/docs/` instead of memory.

### oxlint rule names ≠ ESLint — 2026-06-11 (Phase 0)
- Context: set `react/jsx-uses-react: off`; oxlint errored — that rule doesn't exist in its react plugin (only `react-in-jsx-scope`).
- Lesson: verify oxlint rule names against its plugins before adding them to `.oxlintrc.json`.

### Turbopack inferred the wrong workspace root — 2026-06-11 (Phase 0)
- Context: a stray `pnpm-lock.yaml` in `$HOME` made Next pick the home dir as the workspace root.
- Lesson: pin `turbopack.root` in `next.config.ts` for single-package repos on machines with other lockfiles.

### Don't adopt two overlapping framework tools — 2026-06-11 (session 0, planning)
- Context: spec listed both Next.js and TanStack Router.
- Risk: they don't combine cleanly — Next.js ships its own router; running both adds conflict and dead weight.
- Lesson: before adopting a tool, check it doesn't overlap an already-chosen one. Chose Next.js App Router; dropped TanStack Router. Kept the non-overlapping TanStack tools (Query) + Zustand + GSAP.

### Don't install libraries the current scope doesn't use — 2026-06-11 (session 0)
- Context: spec listed TanStack Form + Zod "if it has forms," but the chosen design links Apply/Join to an external form.
- Risk: installing form/validation libs with nothing to validate = dead dependencies, violating Simplicity First.
- Lesson: defer dependencies until a concrete use exists. Documented as ADR-004; install only when an on-site form is added.

### Verify template leftovers match the stack — 2026-06-11 (session 0)
- Context: spec mentioned "ruff removal" (a Python linter) for a TypeScript/React project.
- Risk: acting on instructions copied from a different stack.
- Lesson: confirm tooling matches the language. Here the linter is oxlint; ruff is N/A.

### A static content site needs no backend — 2026-06-11 (session 0)
- Context: spec asked to "choose the best backend tech stack," but all content is static club copy.
- Risk: building a database/API nobody needs.
- Lesson: question whether a backend is warranted before designing one. Chose SSG + typed constants; ADR-002.
