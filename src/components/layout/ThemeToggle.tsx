"use client";

import { type MouseEvent, useEffect } from "react";
import { applyTheme } from "@/lib/theme";
import { useThemeStore } from "@/stores/theme";
import { startRadialThemeTransition } from "@/lib/view-transition";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  // Keep the DOM in sync with the store, and follow system changes when in
  // "system" mode.
  useEffect(() => {
    applyTheme(mode);
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    startRadialThemeTransition(
      () => {
        applyTheme(next);
        setMode(next);
      },
      { x: event.clientX, y: event.clientY },
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle color theme"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-pill border border-hairline text-ink transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className,
      )}
    >
      {/* Sun — shown in dark mode (click switches to light) */}
      <svg
        className="hidden size-[1.05rem] dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon — shown in light mode (click switches to dark) */}
      <svg
        className="size-[1.05rem] dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
