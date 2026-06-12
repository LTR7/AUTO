import { culture } from "@/constants/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function Culture() {
  return (
    <Section id="culture" className="bg-canvas-soft">
      <Container>
        <Eyebrow>{culture.eyebrow}</Eyebrow>
        <p data-reveal className="mt-6 max-w-3xl text-display text-ink">
          {culture.intro}
        </p>

        <div
          data-reveal-stagger
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {culture.values.map((value) => (
            <SpotlightCard
              key={value.title}
              className="rounded-card border border-hairline bg-canvas p-6 transition-colors hover:border-primary/40"
            >
              <h3 className="text-base font-medium text-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">
                {value.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
