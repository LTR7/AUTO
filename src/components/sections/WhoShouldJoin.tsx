import { whoShouldJoin } from "@/constants/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

export function WhoShouldJoin() {
  return (
    <Section id="who-should-join" className="bg-canvas-cream">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div data-reveal className="max-w-3xl lg:col-span-5">
            <h2 className="text-display text-ink">{whoShouldJoin.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-secondary">
              {whoShouldJoin.intro}
            </p>
          </div>

          <ul data-reveal-stagger className="lg:col-span-7">
            {whoShouldJoin.profiles.map((profile, i) => (
              <li
                key={profile.role}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-t border-ink/10 py-5 sm:grid-cols-[3rem_8rem_1fr] dark:border-white/10"
              >
                {/* ink-mute fails AA on the cream fill (3.95:1) — secondary in light only */}
                <span className="pt-1 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-ink-secondary dark:text-ink-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-medium text-ink">{profile.role}</h3>
                <p className="col-start-2 text-sm leading-relaxed text-ink-secondary dark:text-ink-mute sm:col-start-3">
                  {profile.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
