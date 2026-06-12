import { join, microcopy } from "@/constants/content";
import { socials } from "@/constants/social";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import { JoinFinale } from "@/components/motion/JoinFinale";

export function Join() {
  return (
    <Section id="join">
      <Container>
        <div
          data-join-panel
          className="relative overflow-hidden rounded-3xl bg-[#0d253d] px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
            <div
              data-join-blob
              className="mesh-blob"
              style={{ top: "-30%", left: "-5%", width: "40%", height: "120%", background: "var(--color-primary)" }}
            />
            <div
              data-join-blob
              className="mesh-blob"
              style={{ top: "-20%", right: "-5%", width: "38%", height: "120%", background: "var(--color-cyan)" }}
            />
          </div>

          <StatusDot label={microcopy.joinStatus} className="absolute right-6 top-6 text-white/60" />

          <div className="relative mx-auto max-w-2xl">
            <h2 data-join-headline className="text-display text-white">{join.heading}</h2>
            <p data-join-body className="mt-6 text-base leading-relaxed text-white/70">
              {join.body}
            </p>
            <p data-join-social className="mt-4 text-sm text-white/60">
              {join.socialPrompt.before}
              <a
                href={socials.linkedin}
                className="text-white underline underline-offset-4 transition-colors hover:text-white/80"
              >
                {join.socialPrompt.linkLabel}
              </a>
              {join.socialPrompt.after}
            </p>
            <div data-join-ctas className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href={join.primaryCta.href} size="lg">
                {join.primaryCta.label}
              </Button>
              <a
                href={join.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/30 px-6 py-3 text-[0.9375rem] text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {join.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </Container>
      <JoinFinale />
    </Section>
  );
}
