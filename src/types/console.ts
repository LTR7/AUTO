/** Types for the Agent Console product-mockup transcript (constants/console.ts). */

export interface ConsoleRow {
  agent: string;
  call: string;
  ms: number;
}

export interface AgentConsoleContent {
  command: string;
  rows: readonly ConsoleRow[];
  output: string;
  statuses: readonly ["queued", "running", "done"];
}
