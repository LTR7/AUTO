import { about } from "@/constants/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

export function About() {
  return (
    <Section id="about">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div data-reveal className="max-w-3xl lg:col-span-5">
            <h2 className="text-display text-ink">{about.heading}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
              {about.body}
            </p>
          </div>

          <div data-reveal-stagger className="lg:col-span-6 lg:col-start-7">
            {about.pillars.map((pillar, index) => (
              <div key={pillar.title} className="border-t border-hairline pt-6 pb-8">
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-ink-mute">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-medium text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
