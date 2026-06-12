"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { agentConsole } from "@/constants/console";
import { consoleLoop } from "@/constants/animations";

/**
 * Agent-run transcript that plays ONCE on scroll-into-view (auto-started
 * motion beside other content must stay under 5s — WCAG 2.2.2). The finished
 * state is server-rendered so no-JS and reduced-motion visitors see a complete
 * console, never a blank panel; hidden states use opacity only so rows never
 * leave the accessibility tree mid-read.
 */
export function AgentConsole() {
  const figureRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const figure = figureRef.current;
      if (!figure) return;

      const command = figure.querySelector<HTMLElement>("[data-console-command]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-console-row]", figure);
      const pills = gsap.utils.toArray<HTMLElement>("[data-console-status]", figure);
      const output = figure.querySelector<HTMLElement>("[data-console-output]");
      if (!command || !output || rows.length === 0) return;

      const [queued, running, done] = agentConsole.statuses;
      const setPill = (index: number, label: string) => () => {
        pills[index].textContent = label;
      };

      const tl = gsap.timeline({ paused: true });

      // Hidden states live only inside the timeline — SSR output stays visible.
      tl.set([command, ...rows, output], { opacity: 0, y: 6 }, 0);
      tl.call(
        () => {
          pills.forEach((pill) => {
            pill.textContent = queued;
          });
        },
        undefined,
        0,
      );
      tl.to(
        command,
        { opacity: 1, y: 0, duration: consoleLoop.typeDuration, ease: "power2.out" },
        0,
      );

      const rowsAt = consoleLoop.typeDuration;
      tl.to(
        rows,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          stagger: consoleLoop.lineStagger,
        },
        rowsAt,
      );
      for (let i = 0; i < rows.length; i++) {
        const at = rowsAt + i * consoleLoop.lineStagger;
        tl.call(setPill(i, running), undefined, at);
        tl.call(setPill(i, done), undefined, at + consoleLoop.lineStagger);
      }
      tl.to(
        output,
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        rowsAt + rows.length * consoleLoop.lineStagger + 0.2,
      );

      ScrollTrigger.create({
        trigger: figure,
        start: consoleLoop.start,
        once: true,
        onEnter: () => tl.play(0),
      });

      // Don't burn main-thread cycles while the console is offscreen.
      ScrollTrigger.create({
        trigger: figure,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
        onEnterBack: () => tl.resume(),
        onEnter: () => {
          if (tl.totalTime() > 0) tl.resume();
        },
      });
    },
    { scope: figureRef },
  );

  return (
    <figure
      ref={figureRef}
      aria-label="AUTO agent console demo"
      className="overflow-hidden rounded-card border border-white/10 bg-[#0d253d] shadow-[0_8px_24px_rgba(0,55,112,0.08),0_2px_6px_rgba(0,55,112,0.04)]"
    >
      <div className="flex h-9 items-center gap-2 border-b border-white/10 px-4">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ruby" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-magenta" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-cyan" />
      </div>
      {/* No min-height: reveals are opacity-only, so boxes (and panel height)
          never change during the play — a reserve would just be dead space. */}
      <div className="whitespace-pre-wrap p-6 font-mono text-[13px] leading-7 text-white/80">
        <p data-console-command className="text-white">
          {agentConsole.command}
        </p>
        {agentConsole.rows.map((row) => (
          <p key={row.call} data-console-row>
            {`→ agent:${row.agent} · ${row.call} · `}
            <span style={{ fontFeatureSettings: '"tnum"', letterSpacing: "-0.42px" }}>
              {row.ms} ms
            </span>{" "}
            {/* Fixed width so label swaps never reflow wrapped rows (CLS);
                aria-hidden + sr-only twin so SRs always read the final state. */}
            <span
              data-console-status
              aria-hidden="true"
              className="inline-block min-w-18 rounded-pill bg-primary-soft px-2 py-0.5 text-center text-[0.625rem] font-medium uppercase tracking-[0.15em] text-white"
            >
              done
            </span>
            <span className="sr-only">done</span>
          </p>
        ))}
        <p data-console-output>
          {agentConsole.output}{" "}
          <span
            aria-hidden="true"
            className="console-caret inline-block h-[1.1em] w-0.5 bg-cyan align-middle motion-safe:animate-[caret-blink_1s_steps(2)_8]"
          />
        </p>
      </div>
    </figure>
  );
}
