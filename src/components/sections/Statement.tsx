import { statement } from "@/constants/content";
import { Container } from "@/components/ui/Container";
import { StatementScrub } from "@/components/motion/StatementScrub";

/** Splits a line into [lead, highlight] when it ends with the highlight word. */
function splitHighlight(line: string, highlight: string): [string, string] | null {
  if (!line.endsWith(highlight)) return null;
  return [line.slice(0, line.length - highlight.length), highlight];
}

/** Full-bleed typographic shout between Culture and Join. Plain <section> — the Section primitive's padding scale is intentionally not used here. */
export function Statement() {
  return (
    <section id="statement" className="scroll-mt-24 bg-canvas py-32 sm:py-40">
      <Container>
        {/* No aria-label: ARIA prohibits naming role=paragraph; SplitText's
            aria:'auto' labels the line spans under motion. text-display-hero
            keeps the statement within the brand's type scale (hero = apex). */}
        <p className="max-w-5xl text-display-hero text-ink">
          {statement.lines.map((line) => {
            const parts = splitHighlight(line, statement.highlight);
            return (
              <span key={line} data-statement-line className="block">
                {parts ? (
                  <>
                    {parts[0]}
                    <span className="text-primary">{parts[1]}</span>
                  </>
                ) : (
                  line
                )}
              </span>
            );
          })}
        </p>
      </Container>
      <StatementScrub />
    </section>
  );
}
