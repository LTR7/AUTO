import { hero, microcopy } from "@/constants/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { StatusDot } from "@/components/ui/StatusDot";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { HeroOverture } from "@/components/motion/HeroOverture";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center overflow-hidden pt-16"
    >
      <GradientMesh />
      <HeroCanvas />
      {/* Contrast veil over the constellation — wider/stronger on narrow screens
          where the hub fills more of the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_95%_62%_at_50%_45%,color-mix(in_srgb,var(--canvas)_82%,transparent),transparent_78%)] sm:bg-[radial-gradient(ellipse_60%_45%_at_50%_42%,color-mix(in_srgb,var(--canvas)_72%,transparent),transparent_70%)]"
      />
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-display-hero text-ink">
            <GradientText className="block" data-hero-lead>
              {hero.headlineLead}
            </GradientText>
            {hero.headlineRest.map((line) => (
              <span key={line} data-hero-line className="block">
                {line}
              </span>
            ))}
          </h1>
          <p
            data-hero-subhead
            className="mx-auto mt-7 max-w-xl text-balance text-base text-ink-secondary sm:text-lg"
          >
            {hero.subhead}
          </p>
          <div
            data-hero-ctas
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href={hero.secondaryCta.href} size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>
      <div
        data-hero-scroll
        className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-4"
      >
        <StatusDot label={microcopy.heroStatus} className="text-ink-mute" />
        <span className="text-eyebrow text-ink-mute">{hero.scrollLabel}</span>
      </div>
      <HeroOverture />
    </section>
  );
}
