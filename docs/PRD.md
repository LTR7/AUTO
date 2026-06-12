# PRD — AUTO Club Website

## 1. Vision
A modern, creative, world-class portfolio site that establishes AUTO's online presence and turns visitors into applicants. Tone: bold, technical, optimistic. Visual language **inspired by Stripe** (signature gradients, generous whitespace, crisp typography, subtle depth/elevation), accented with AUTO's sky/cyan palette.

## 2. Audience
- **Primary:** prospective student members — browse, get inspired, click *Apply*.
- **Secondary:** faculty / sponsors / collaborators — understand the mission and credibility.

## 3. Goals & success metrics
- **G1 — Communicate the mission clearly.** Signal: high scroll depth, low bounce.
- **G2 — Drive applications.** Signal: Apply/Join CTA click-through.
- **G3 — Feel premium & fast.** Targets: Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95; LCP < 2.5s; CLS < 0.1.

## 4. Scope — sections (content sourced from the existing repo)
1. **Navigation** — sticky, glassmorphic, smooth-scroll, theme toggle.
2. **Hero** — headline + CTAs (Apply, Manifesto), signature animated gradient.
3. **About** — mission / value statement.
4. **Manifesto** — 4 core principles (icon + text).
5. **What We Do** — 7 activities (grid).
6. **Projects** — 6 example projects with category tags (candidate for horizontal scroll).
7. **Who Should Join** — 8 audience profiles.
8. **Culture** — 6 cultural values.
9. **Join** — final membership CTA.
10. **Footer** — nav links + socials.

## 5. Features
- **Theme:** dark/light, **system default**, persisted, **radial transition**.
- **Motion:** scroll-triggered reveals, parallax, optional horizontal scroll for Projects, animated Stripe-style gradient. Always respects `prefers-reduced-motion`.
- **Responsive:** sm / md / lg / xl / 2xl (Tailwind v4 defaults).
- **Resilience:** loading skeletons (no extra packages — Suspense + Tailwind), error boundaries.

## 6. Out of scope (non-goals)
- No CMS, database, or backend.
- No user accounts / auth.
- No on-site application form (Apply/Join → external link). Revisit only if explicitly requested.
- No blog / events system (content is static).

## 7. Open inputs (pending from user)
- **Stripe design-system file** — refine tokens once provided. Until then: Stripe public design language + AUTO palette.
- **External Apply/Join URL** — placeholder until provided.
- **Real project copy & imagery** — placeholders until provided.
