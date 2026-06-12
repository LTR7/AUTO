import { whatWeDo } from "@/constants/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AgentConsole } from "@/components/mockup/AgentConsole";

export function WhatWeDo() {
  return (
    <Section id="what-we-do">
      <Container>
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div data-reveal className="max-w-3xl">
              <h2 className="text-display text-ink">{whatWeDo.heading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-secondary">
                {whatWeDo.intro}
              </p>
            </div>

            <ul data-reveal-stagger className="mt-10">
              {whatWeDo.activities.map((activity, index) => (
                <li
                  key={activity.title}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-t border-hairline py-5"
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.15em] text-ink-mute">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-medium text-ink">{activity.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-mute">
                      {activity.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="lg:col-span-7">
            <AgentConsole />
          </div>
        </div>
      </Container>
    </Section>
  );
}
