import type { AgentConsoleContent } from "@/types/console";

/** Transcript for the WhatWeDo Agent Console mockup. The component renders only this. */
export const agentConsole = {
  command: '$ auto orchestrate --task "literature-review" --agents 3',
  rows: [
    { agent: "scout", call: 'web.search("agent planning surveys")', ms: 142 },
    { agent: "scout", call: 'papers.fetch("arxiv:2402.01030")', ms: 318 },
    { agent: "reader", call: 'pdf.extract(sections=["method","results"])', ms: 894 },
    { agent: "reader", call: "memory.write(claims=12)", ms: 67 },
    { agent: "writer", call: 'draft.compose(format="structured-review")', ms: 1240 },
  ],
  output: "✓ 3 agents · 5 tool calls · review drafted in 2.7 s",
  statuses: ["queued", "running", "done"],
} as const satisfies AgentConsoleContent;
