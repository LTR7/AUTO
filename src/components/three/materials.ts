import {
  AdditiveBlending,
  NormalBlending,
  ShaderMaterial,
  Vector3,
  Vector4,
} from "three";
import type { Blending } from "three";
import {
  attractor,
  constellation,
  handoff,
  packets,
  pulses,
  scenePalette,
} from "@/constants/scene";

/**
 * Custom shaders for the Agent Constellation. All materials share ONE uniforms
 * object so the frame loop writes each value exactly once. Colors are kept in
 * raw sRGB (ShaderMaterial skips three's colorspace chunks), so rendered hexes
 * match the CSS tokens. GLSL is ANGLE/D3D-safe: constant loop bounds, highp,
 * no derivatives.
 */

type Uniform<T> = { value: T };

export type SceneUniforms = {
  uTime: Uniform<number>;
  uTheme: Uniform<number>;
  uCursor: Uniform<Vector3>;
  uCursorStrength: Uniform<number>;
  uPulses: Uniform<Vector4[]>;
  uHubKick: Uniform<number>;
  uProgress: Uniform<number>;
  uNodeA: Uniform<Vector3>;
  uNodeB: Uniform<Vector3>;
  uEdgeA: Uniform<Vector3>;
  uEdgeB: Uniform<Vector3>;
  uPacketA: Uniform<Vector3>;
  uPacketB: Uniform<Vector3>;
  uOpacityA: Uniform<number>;
  uOpacityB: Uniform<number>;
  uRimA: Uniform<Vector3[]>;
  uRimB: Uniform<Vector3[]>;
};

/** Raw sRGB components — bypasses three's working-colorspace conversion. */
function srgb(hex: string): Vector3 {
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function glsl(hex: string): string {
  const v = srgb(hex);
  return `vec3(${v.x.toFixed(5)}, ${v.y.toFixed(5)}, ${v.z.toFixed(5)})`;
}

const f = (n: number): string => n.toFixed(5);

// Compile-time constants (tunables that never change at runtime).
const DEFINES = /* glsl */ `
  #define BREATHE_AMP ${f(constellation.breatheAmp)}
  #define ATTRACT_RADIUS ${f(attractor.radius)}
  #define ATTRACT_PULL ${f(attractor.maxPull)}
  #define SINK_DIST ${f(handoff.sinkDistance)}
  #define NODE_FADE_START ${f(handoff.nodeFadeStart)}
  #define NODE_FADE_END ${f(handoff.nodeFadeEnd)}
  #define EDGE_FADE_END ${f(handoff.edgeFadeEnd)}
  #define PACKET_SPEED ${f(packets.speed)}
  #define PULSE_SPEED ${f(pulses.speed)}
  #define PULSE_DECAY ${f(pulses.decaySeconds)}
  #define PULSE_LIFE ${f(pulses.decaySeconds * 4)}
  #define COL_SKY ${glsl("#0ea5e9")}
  #define COL_CYAN ${glsl("#06b6d4")}
  #define COL_PRIMARY ${glsl("#533afd")}
  #define COL_INK ${glsl("#0d253d")}
`;

// Task pulses: an expanding spherical wave from the clicked node, tinted
// sky → cyan → indigo over its life. Shared by node and edge fragments.
const PULSE_GLOW = /* glsl */ `
  uniform vec4 uPulses[4];

  vec3 pulseGlow(vec3 p, float gate) {
    vec3 glow = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      float age = uTime - uPulses[i].w;
      float live = step(0.0, age) * (1.0 - step(PULSE_LIFE, age));
      float wave = exp(-abs(distance(p, uPulses[i].xyz) - age * PULSE_SPEED) * 6.0)
        * exp(-min(age, PULSE_LIFE) / PULSE_DECAY) * live;
      float t = clamp(age / PULSE_DECAY, 0.0, 1.0);
      vec3 tint = mix(
        mix(COL_SKY, COL_CYAN, clamp(t * 2.0, 0.0, 1.0)),
        COL_PRIMARY,
        clamp(t * 2.0 - 1.0, 0.0, 1.0)
      );
      glow += tint * wave;
    }
    return glow * gate;
  }
`;

const NODE_VERT = /* glsl */ `
  ${DEFINES}
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uCursor;
  uniform float uCursorStrength;
  uniform float uProgress;
  varying vec3 vCenter;

  void main() {
    float breath = 1.0 + BREATHE_AMP * sin(uTime * 0.8 + aSeed * 6.2832);
    #ifdef USE_INSTANCING
      mat4 im = instanceMatrix;
    #else
      mat4 im = mat4(1.0);
    #endif
    vec3 center = (im * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 toCursor = uCursor - center;
    float dist = length(toCursor);
    float pullAmt = (1.0 - smoothstep(0.0, ATTRACT_RADIUS, dist))
      * ATTRACT_PULL * uCursorStrength * (1.0 - uProgress);
    vec3 pull = dist > 0.0001 ? normalize(toCursor) * pullAmt : vec3(0.0);
    float sink = uProgress * SINK_DIST * (0.5 + 0.5 * aSeed);
    vec3 local = (im * vec4(position * breath, 1.0)).xyz - center;
    vCenter = center;
    gl_Position = projectionMatrix * modelViewMatrix
      * vec4(center + pull + vec3(0.0, -sink, 0.0) + local, 1.0);
  }
`;

const NODE_FRAG = /* glsl */ `
  precision highp float;
  ${DEFINES}
  uniform float uTime;
  uniform float uTheme;
  uniform vec3 uCursor;
  uniform float uCursorStrength;
  uniform float uProgress;
  uniform vec3 uNodeA;
  uniform vec3 uNodeB;
  varying vec3 vCenter;
  ${PULSE_GLOW}

  void main() {
    vec3 base = mix(uNodeA, uNodeB, uTheme);
    float prox = (1.0 - smoothstep(0.0, ATTRACT_RADIUS, distance(vCenter, uCursor)))
      * uCursorStrength * (1.0 - uProgress);
    vec3 col = base
      + pulseGlow(vCenter, 1.0 - uProgress)
      + mix(COL_SKY, COL_CYAN, 0.5) * prox * 0.45;
    float alpha = 1.0 - smoothstep(NODE_FADE_START, NODE_FADE_END, uProgress);
    gl_FragColor = vec4(col, alpha);
  }
`;

const EDGE_VERT = /* glsl */ `
  ${DEFINES}
  attribute float aLineU;
  attribute float aPhase;
  uniform vec3 uCursor;
  uniform float uCursorStrength;
  uniform float uProgress;
  varying float vLineU;
  varying float vPhase;
  varying vec3 vPos;

  void main() {
    vec3 p = position;
    // Recruit endpoints are CPU-computed (already pulled); graph edges follow
    // the same pull as node centers so lines never detach from their nodes.
    #ifndef RECRUIT
      vec3 toCursor = uCursor - p;
      float dist = length(toCursor);
      float pullAmt = (1.0 - smoothstep(0.0, ATTRACT_RADIUS, dist))
        * ATTRACT_PULL * uCursorStrength * (1.0 - uProgress);
      if (dist > 0.0001) p += normalize(toCursor) * pullAmt;
    #endif
    vLineU = aLineU;
    vPhase = aPhase;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const EDGE_FRAG = /* glsl */ `
  precision highp float;
  ${DEFINES}
  uniform float uTime;
  uniform float uTheme;
  uniform float uProgress;
  uniform float uCursorStrength;
  uniform vec3 uEdgeA;
  uniform vec3 uEdgeB;
  uniform vec3 uPacketA;
  uniform vec3 uPacketB;
  uniform float uOpacityA;
  uniform float uOpacityB;
  varying float vLineU;
  varying float vPhase;
  varying vec3 vPos;
  ${PULSE_GLOW}

  void main() {
    vec3 edge = mix(uEdgeA, uEdgeB, uTheme);
    vec3 packetCol = mix(uPacketA, uPacketB, uTheme);
    float baseOpacity = mix(uOpacityA, uOpacityB, uTheme);
    float u = fract(uTime * PACKET_SPEED + vPhase);
    float packet = 1.0 - smoothstep(0.0, 0.06, abs(vLineU - u));
    vec3 glow = pulseGlow(vPos, 1.0 - uProgress);
    float fade = 1.0 - smoothstep(0.0, EDGE_FADE_END, uProgress);
    vec3 col = edge + packetCol * packet + glow;
    float alpha = (baseOpacity + packet * 0.55 + min(length(glow), 1.0) * 0.45) * fade;
    #ifdef RECRUIT
      alpha *= uCursorStrength;
    #endif
    gl_FragColor = vec4(col, alpha);
  }
`;

// Cheap seeded value noise — enough for the hub's composed swell/bands.
const NOISE = /* glsl */ `
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 fr = fract(p);
    fr = fr * fr * (3.0 - 2.0 * fr);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, fr.x), mix(n010, n110, fr.x), fr.y),
      mix(mix(n001, n101, fr.x), mix(n011, n111, fr.x), fr.y),
      fr.z
    );
  }
`;

const HUB_VERT = /* glsl */ `
  ${DEFINES}
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  ${NOISE}

  void main() {
    // 2-octave swell: composed surface motion, not a distort blob.
    float n = noise(position * 2.5 + vec3(uTime * 0.25)) * 0.6
      + noise(position * 5.0 - vec3(uTime * 0.15)) * 0.4;
    vec3 p = position + normal * (n - 0.5) * 0.12;
    vPos = p;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const HUB_FRAG = /* glsl */ `
  precision highp float;
  ${DEFINES}
  uniform float uTime;
  uniform float uTheme;
  uniform float uHubKick;
  uniform float uProgress;
  uniform vec3 uRimA[4];
  uniform vec3 uRimB[4];
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  ${NOISE}

  void main() {
    // Interior "thought bands": slow-rotating 3-octave FBM over deep navy.
    float a = uTime * 0.05;
    mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
    vec3 q = vPos;
    q.xz = rot * q.xz;
    float fbm = 0.0;
    float amp = 0.5;
    vec3 pp = q * 3.0;
    for (int i = 0; i < 3; i++) {
      fbm += amp * noise(pp);
      pp *= 2.0;
      amp *= 0.5;
    }
    vec3 interiorLight = COL_INK * (0.85 + fbm * 0.3);
    vec3 interiorDark = COL_INK * (0.55 + fbm * 0.5) + COL_PRIMARY * fbm * 0.25;
    vec3 interior = mix(interiorLight, interiorDark, uTheme);

    // Fresnel rim ramped sky → cyan → indigo → magenta (magenta last ~8% only).
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.5);
    float t = clamp(fres, 0.0, 1.0);
    vec3 r0 = mix(uRimA[0], uRimB[0], uTheme);
    vec3 r1 = mix(uRimA[1], uRimB[1], uTheme);
    vec3 r2 = mix(uRimA[2], uRimB[2], uTheme);
    vec3 r3 = mix(uRimA[3], uRimB[3], uTheme);
    vec3 rim;
    if (t < 0.45) {
      rim = mix(r0, r1, t / 0.45);
    } else if (t < 0.92) {
      rim = mix(r1, r2, (t - 0.45) / 0.47);
    } else {
      rim = mix(r2, r3, (t - 0.92) / 0.08);
    }
    // 4s emissive breath + call-and-response inhale on dispatch.
    float breath = 1.0 + 0.15 * sin(uTime * 1.5707963) + uHubKick * 0.9;
    float rimStrength = fres * mix(0.35, 1.0, uTheme) * breath;
    vec3 col = interior + rim * rimStrength;
    float alpha = 0.92 - uProgress * 0.75;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function makeSceneUniforms(initialDark: boolean): SceneUniforms {
  const { light, dark } = scenePalette;
  return {
    uTime: { value: constellation.stillTime },
    uTheme: { value: initialDark ? 1 : 0 },
    uCursor: { value: new Vector3(0, 0, 1000) },
    uCursorStrength: { value: 0 },
    uPulses: {
      value: Array.from({ length: pulses.max }, () => new Vector4(0, 0, 0, -1000)),
    },
    uHubKick: { value: 0 },
    uProgress: { value: 0 },
    uNodeA: { value: srgb(light.node) },
    uNodeB: { value: srgb(dark.node) },
    uEdgeA: { value: srgb(light.edge) },
    uEdgeB: { value: srgb(dark.edge) },
    uPacketA: { value: srgb(light.packet) },
    uPacketB: { value: srgb(dark.packet) },
    uOpacityA: { value: light.edgeOpacity },
    uOpacityB: { value: dark.edgeOpacity },
    uRimA: { value: light.hubRim.map(srgb) },
    uRimB: { value: dark.hubRim.map(srgb) },
  };
}

/** Additive cyan vanishes on white — blending is swapped here on theme change. */
export function edgeBlendingFor(dark: boolean): Blending {
  return dark && scenePalette.dark.additive ? AdditiveBlending : NormalBlending;
}

export function makeNodeMaterial(uniforms: SceneUniforms): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: NODE_VERT,
    fragmentShader: NODE_FRAG,
    uniforms,
    transparent: true,
  });
}

export function makeEdgeMaterial(
  uniforms: SceneUniforms,
  options: { recruit?: boolean; initialDark: boolean },
): ShaderMaterial {
  // NOTE: GL lines are 1px on ANGLE/D3D. If hairlines read too faint on
  // Windows, upgrade edges to instanced camera-facing quads (still one draw
  // call, one extra attribute).
  return new ShaderMaterial({
    vertexShader: EDGE_VERT,
    fragmentShader: EDGE_FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: edgeBlendingFor(options.initialDark),
    defines: options.recruit ? { RECRUIT: "" } : {},
  });
}

export function makeHubMaterial(uniforms: SceneUniforms): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: HUB_VERT,
    fragmentShader: HUB_FRAG,
    uniforms,
    transparent: true,
  });
}
