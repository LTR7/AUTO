import type {
  AttractorConfig,
  ConstellationConfig,
  HandoffConfig,
  PacketConfig,
  PulseConfig,
  ScenePalette,
} from "@/types/scene";

/** Hero "Agent Constellation" tunables. Every hex is a documented token stop. */

export const constellation = {
  seed: 421,
  nodeCount: 110,
  shellRadius: 1.9,
  jitter: 0.22,
  neighborsPerNode: 3,
  hubLinkCount: 10,
  nodeBaseScale: 0.045,
  breatheAmp: 0.25,
  rotationSpeed: 0.04,
  stillTime: 7.3,
} as const satisfies ConstellationConfig;

export const packets = { speed: 0.35 } as const satisfies PacketConfig;

export const pulses = {
  max: 4,
  speed: 2.2,
  width: 0.35,
  decaySeconds: 1.6,
  hubResponseDelay: 0.3,
} as const satisfies PulseConfig;

export const attractor = {
  radius: 1.2,
  maxPull: 0.35,
  recruitLineCount: 6,
  touchDecaySeconds: 5,
} as const satisfies AttractorConfig;

export const handoff = {
  edgeFadeEnd: 0.3,
  nodeFadeStart: 0.45,
  nodeFadeEnd: 0.85,
  sinkDistance: 1.2,
} as const satisfies HandoffConfig;

export const themeTweenSeconds = 0.6;

/** Vertical FOV is fixed, so narrow viewports shrink the whole constellation. */
export const responsiveScale = {
  fullWidth: 1200,
  min: 0.6,
} as const;

export const scenePalette = {
  light: {
    node: "#0d253d",
    edge: "#533afd",
    packet: "#665efd",
    hubRim: ["#0ea5e9", "#06b6d4", "#533afd", "#f96bee"],
    sparkle: "#0ea5e9",
    sparkleOpacity: 0.35,
    edgeOpacity: 0.22,
    additive: false,
  },
  dark: {
    node: "#e9eef7",
    edge: "#06b6d4",
    packet: "#0ea5e9",
    hubRim: ["#0ea5e9", "#06b6d4", "#665efd", "#f96bee"],
    sparkle: "#0ea5e9",
    sparkleOpacity: 0.7,
    edgeOpacity: 0.45,
    additive: true,
  },
} as const satisfies Record<"light" | "dark", ScenePalette>;
