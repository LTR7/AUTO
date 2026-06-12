"use client";

import { useEffect, useState } from "react";
import { navCta, navLinks } from "@/constants/nav";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/cn";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-hairline bg-canvas/70 backdrop-blur-xl"
          : "border-transparent",
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4" aria-label="Primary">
          <a
            href="#hero"
            className="flex items-center gap-2 text-lg font-medium tracking-tight text-ink"
            aria-label="AUTO home"
          >
            <img src="/logo.svg" alt="" className="h-7 w-7 dark:invert" />
            AUTO
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-ink-secondary transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button href={navCta.href} className="hidden sm:inline-flex">
              {navCta.label}
            </Button>
            <MobileMenu />
          </div>
        </nav>
      </Container>
    </header>
  );
}
