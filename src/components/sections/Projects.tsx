import { microcopy, projects } from "@/constants/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function Projects() {
  return (
    <Section id="projects" className="bg-canvas-soft">
      <Container>
        <div data-reveal className="max-w-3xl">
          <p className="mb-3 font-mono text-xs text-ink-mute">{microcopy.projectsPrompt}</p>
          <Eyebrow>{projects.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display text-ink">{projects.heading}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-secondary">
            {projects.intro}
          </p>
        </div>

        <div
          data-reveal-stagger
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.items.map((project) => (
            <SpotlightCard
              key={project.title}
              className="flex flex-col rounded-card border border-hairline bg-canvas p-6 transition-colors hover:border-primary/40"
            >
              <h3 className="text-lg font-medium text-ink">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-mute">
                {project.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-pill bg-primary/10 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-wider text-primary-deep dark:text-accent"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
