import { manifesto } from "@/constants/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GhostNumeral } from "@/components/motion/GhostNumeral";

export function Manifesto() {
  return (
    <Section id="manifesto" className="bg-canvas-soft">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div data-reveal className="max-w-3xl">
                <Eyebrow>{manifesto.eyebrow}</Eyebrow>
                <h2 className="mt-4 text-display text-ink">{manifesto.heading}</h2>
              </div>
              <GhostNumeral numbers={manifesto.principles.map((p) => p.number)} />
            </div>
          </div>

          <div data-reveal-stagger className="mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">
            {manifesto.principles.map((principle) => (
              <article
                key={principle.number}
                data-principle
                className="border-t border-hairline pt-8 pb-14"
              >
                <span className="font-mono text-sm text-primary">
                  {principle.number}
                </span>
                <h3 className="mt-4 text-heading text-ink">{principle.title}</h3>
                <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-mute">
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
