import { Container } from "@/components/ui/Container";
import { GradientText } from "@/components/ui/GradientText";
import { footer } from "@/constants/nav";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-hairline bg-canvas-soft">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-xl font-medium tracking-tight">
              <GradientText>AUTO</GradientText>
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink-mute">{footer.tagline}</p>
          </div>

          {footer.groups.map((group) => (
            <div key={group.title}>
              <p className="text-eyebrow text-ink-mute">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-secondary transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.copyright}</span>
          <span>{footer.rightTagline}</span>
        </div>

        {/* Monumental watermark, cut off by the footer's overflow-hidden. */}
        <div aria-hidden className="relative h-[clamp(5rem,17vw,15rem)]">
          {/* Light-on-dark needs a stronger mix to read as faint as dark-on-light. */}
          <span
            data-watermark
            className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-[22%] whitespace-nowrap font-light leading-[0.8] tracking-[-0.04em] [--wm-alpha:6%] dark:[--wm-alpha:13%]"
            style={{
              fontSize: "clamp(6rem, 22vw, 20rem)",
              color: "color-mix(in srgb, var(--ink) var(--wm-alpha), transparent)",
            }}
          >
            {footer.watermark}
          </span>
        </div>
      </Container>
    </footer>
  );
}
