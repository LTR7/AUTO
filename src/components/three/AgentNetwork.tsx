"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  Matrix4,
  Vector3,
} from "three";
import type { Group, InstancedMesh, LineSegments } from "three";
import { attractor, constellation, responsiveScale } from "@/constants/scene";
import type { SceneUniforms } from "./materials";
import { heroProgress } from "./sceneState";
import { useSceneInput } from "./useSceneInput";
import type { ShaderMaterial } from "three";

export interface ConstellationScene {
  uniforms: SceneUniforms;
  node: ShaderMaterial;
  edge: ShaderMaterial;
  recruit: ShaderMaterial;
  hub: ShaderMaterial;
  blendTargets: ShaderMaterial[];
}

/** Deterministic PRNG — the graph must not reshuffle across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Generated {
  homes: Float32Array;
  seeds: Float32Array;
  scales: Float32Array;
  edgePositions: Float32Array;
  edgeLineU: Float32Array;
  edgePhase: Float32Array;
}

/** Fibonacci-sphere agents, kNN mesh edges, hub links to the busiest nodes. */
function generate(): Generated {
  const rand = mulberry32(constellation.seed);
  const n = constellation.nodeCount;
  const homes = new Float32Array(n * 3);
  const seeds = new Float32Array(n);
  const scales = new Float32Array(n);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    homes[i * 3] =
      Math.cos(theta) * r * constellation.shellRadius + (rand() * 2 - 1) * constellation.jitter;
    homes[i * 3 + 1] =
      y * constellation.shellRadius + (rand() * 2 - 1) * constellation.jitter;
    homes[i * 3 + 2] =
      Math.sin(theta) * r * constellation.shellRadius + (rand() * 2 - 1) * constellation.jitter;
    seeds[i] = rand();
    scales[i] = constellation.nodeBaseScale * (0.7 + 0.6 * rand());
  }

  const edgeSet = new Set<string>();
  const degree = new Uint16Array(n);
  for (let i = 0; i < n; i++) {
    const dists: Array<[number, number]> = [];
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = homes[i * 3] - homes[j * 3];
      const dy = homes[i * 3 + 1] - homes[j * 3 + 1];
      const dz = homes[i * 3 + 2] - homes[j * 3 + 2];
      dists.push([dx * dx + dy * dy + dz * dz, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < constellation.neighborsPerNode; k++) {
      const j = dists[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        degree[i] += 1;
        degree[j] += 1;
      }
    }
  }

  const leads = Array.from({ length: n }, (_, i) => i)
    .sort((a, b) => degree[b] - degree[a] || a - b)
    .slice(0, constellation.hubLinkCount);

  const segCount = edgeSet.size + leads.length;
  const edgePositions = new Float32Array(segCount * 6);
  const edgeLineU = new Float32Array(segCount * 2);
  const edgePhase = new Float32Array(segCount * 2);
  let seg = 0;
  const pushSeg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
    edgePositions.set([ax, ay, az, bx, by, bz], seg * 6);
    edgeLineU[seg * 2] = 0;
    edgeLineU[seg * 2 + 1] = 1;
    const phase = rand();
    edgePhase[seg * 2] = phase;
    edgePhase[seg * 2 + 1] = phase;
    seg += 1;
  };
  for (const key of edgeSet) {
    const [i, j] = key.split("-").map(Number);
    pushSeg(
      homes[i * 3], homes[i * 3 + 1], homes[i * 3 + 2],
      homes[j * 3], homes[j * 3 + 1], homes[j * 3 + 2],
    );
  }
  for (const j of leads) {
    pushSeg(0, 0, 0, homes[j * 3], homes[j * 3 + 1], homes[j * 3 + 2]);
  }

  return { homes, seeds, scales, edgePositions, edgeLineU, edgePhase };
}

export function AgentNetwork({
  scene,
  reduced,
}: {
  scene: ConstellationScene;
  reduced: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const recruitRef = useRef<LineSegments>(null);
  const { uniforms } = scene;

  const gen = useMemo(generate, []);

  const nodeGeometry = useMemo(() => {
    const geo = new IcosahedronGeometry(1, 1);
    geo.setAttribute("aSeed", new InstancedBufferAttribute(gen.seeds, 1));
    return geo;
  }, [gen]);

  const edgeGeometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(gen.edgePositions, 3));
    geo.setAttribute("aLineU", new BufferAttribute(gen.edgeLineU, 1));
    geo.setAttribute("aPhase", new BufferAttribute(gen.edgePhase, 1));
    return geo;
  }, [gen]);

  const recruitGeometry = useMemo(() => {
    const count = attractor.recruitLineCount;
    const geo = new BufferGeometry();
    const pos = new BufferAttribute(new Float32Array(count * 6), 3);
    pos.setUsage(DynamicDrawUsage);
    geo.setAttribute("position", pos);
    const u = new Float32Array(count * 2);
    const phase = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      u[i * 2] = 0; // node end
      u[i * 2 + 1] = 1; // cursor end — packets flow toward the visitor
      const p = (i * 0.37) % 1;
      phase[i * 2] = p;
      phase[i * 2 + 1] = p;
    }
    geo.setAttribute("aLineU", new BufferAttribute(u, 1));
    geo.setAttribute("aPhase", new BufferAttribute(phase, 1));
    return geo;
  }, []);

  const hubGeometry = useMemo(() => new IcosahedronGeometry(0.85, 8), []);

  useEffect(
    () => () => {
      nodeGeometry.dispose();
      edgeGeometry.dispose();
      recruitGeometry.dispose();
      hubGeometry.dispose();
    },
    [nodeGeometry, edgeGeometry, recruitGeometry, hubGeometry],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new Matrix4();
    for (let i = 0; i < constellation.nodeCount; i++) {
      m.makeScale(gen.scales[i], gen.scales[i], gen.scales[i]);
      m.setPosition(gen.homes[i * 3], gen.homes[i * 3 + 1], gen.homes[i * 3 + 2]);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [gen]);

  const canvasSize = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const scale = Math.min(
      1,
      Math.max(responsiveScale.min, canvasSize.width / responsiveScale.fullWidth),
    );
    groupRef.current?.scale.setScalar(scale);
    invalidate();
  }, [canvasSize, invalidate]);

  const input = useSceneInput({ uniforms, homes: gen.homes, groupRef, reduced });
  const localCursor = useMemo(() => new Vector3(), []);
  const bestDist = useMemo(() => new Float64Array(attractor.recruitLineCount), []);
  const bestIdx = useMemo(() => new Int32Array(attractor.recruitLineCount), []);

  function updateRecruit(): void {
    const lines = recruitRef.current;
    if (!lines) return;
    const strength = uniforms.uCursorStrength.value * (1 - uniforms.uProgress.value);
    if (strength < 0.02) {
      lines.visible = false;
      return;
    }
    lines.visible = true;
    const cursor = uniforms.uCursor.value;
    const k = attractor.recruitLineCount;
    bestDist.fill(Infinity);
    bestIdx.fill(-1);
    for (let i = 0; i < constellation.nodeCount; i++) {
      const dx = gen.homes[i * 3] - cursor.x;
      const dy = gen.homes[i * 3 + 1] - cursor.y;
      const dz = gen.homes[i * 3 + 2] - cursor.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestDist[k - 1]) {
        let p = k - 1;
        while (p > 0 && bestDist[p - 1] > d) {
          bestDist[p] = bestDist[p - 1];
          bestIdx[p] = bestIdx[p - 1];
          p -= 1;
        }
        bestDist[p] = d;
        bestIdx[p] = i;
      }
    }
    const pos = recruitGeometry.getAttribute("position") as BufferAttribute;
    for (let s = 0; s < k; s++) {
      const i = bestIdx[s];
      const hx = gen.homes[i * 3];
      const hy = gen.homes[i * 3 + 1];
      const hz = gen.homes[i * 3 + 2];
      const dx = cursor.x - hx;
      const dy = cursor.y - hy;
      const dz = cursor.z - hz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      let px = hx;
      let py = hy;
      let pz = hz;
      if (dist > 1e-4) {
        // CPU replica of the vertex pull so lines anchor to displaced nodes.
        const t = Math.min(Math.max(dist / attractor.radius, 0), 1);
        const falloff = 1 - t * t * (3 - 2 * t);
        const pull =
          (falloff * attractor.maxPull * uniforms.uCursorStrength.value *
            (1 - uniforms.uProgress.value)) / dist;
        px += dx * pull;
        py += dy * pull;
        pz += dz * pull;
      }
      pos.setXYZ(s * 2, px, py, pz);
      pos.setXYZ(s * 2 + 1, cursor.x, cursor.y, cursor.z);
    }
    pos.needsUpdate = true;
  }

  useFrame((state, delta) => {
    if (reduced) return;
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * constellation.rotationSpeed;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value += (heroProgress.value - uniforms.uProgress.value) * 0.15;
    if (input.mode.current === "mouse") {
      const target = input.active.current ? 1 : 0;
      uniforms.uCursorStrength.value += (target - uniforms.uCursorStrength.value) * 0.06;
    }
    localCursor.copy(input.worldCursor.current);
    group.worldToLocal(localCursor);
    uniforms.uCursor.value.copy(localCursor);
    updateRecruit();
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[nodeGeometry, scene.node, constellation.nodeCount]}
        frustumCulled={false}
      />
      <lineSegments geometry={edgeGeometry} material={scene.edge} frustumCulled={false} />
      <lineSegments
        ref={recruitRef}
        geometry={recruitGeometry}
        material={scene.recruit}
        frustumCulled={false}
        visible={false}
      />
      <mesh geometry={hubGeometry} material={scene.hub} />
    </group>
  );
}
