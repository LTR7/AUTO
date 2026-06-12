/** Shared types for the hero Three.js scene tunables (constants/scene.ts). */

export interface ConstellationConfig {
  /** Deterministic RNG seed so hot reloads never reshuffle the graph. */
  seed: number;
  nodeCount: number;
  shellRadius: number;
  jitter: number;
  neighborsPerNode: number;
  hubLinkCount: number;
  nodeBaseScale: number;
  breatheAmp: number;
  rotationSpeed: number;
  /** Frozen uTime under reduced motion — curated so the still frame composes. */
  stillTime: number;
}

export interface PacketConfig {
  speed: number;
}

export interface PulseConfig {
  max: number;
  speed: number;
  width: number;
  decaySeconds: number;
  hubResponseDelay: number;
}

export interface AttractorConfig {
  radius: number;
  maxPull: number;
  recruitLineCount: number;
  touchDecaySeconds: number;
}

export interface HandoffConfig {
  edgeFadeEnd: number;
  nodeFadeStart: number;
  nodeFadeEnd: number;
  sinkDistance: number;
}

export interface ScenePalette {
  node: string;
  edge: string;
  packet: string;
  hubRim: readonly [string, string, string, string];
  sparkle: string;
  sparkleOpacity: number;
  edgeOpacity: number;
  additive: boolean;
}
