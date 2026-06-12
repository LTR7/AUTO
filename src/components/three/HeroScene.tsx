"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ShaderMaterial } from "three";
import { gsap } from "@/lib/gsap";
import { scenePalette, themeTweenSeconds } from "@/constants/scene";
import { AgentNetwork } from "./AgentNetwork";
import type { ConstellationScene } from "./AgentNetwork";
import {
  edgeBlendingFor,
  makeEdgeMaterial,
  makeHubMaterial,
  makeNodeMaterial,
  makeSceneUniforms,
} from "./materials";
import type { SceneUniforms } from "./materials";

function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isDarkNow(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** Camera parallax that eases toward the cursor. */
function Rig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      // Mouse only — touch scroll swipes would yank the camera toward the thumb.
      if (event.pointerType !== "mouse") return;
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame(() => {
    if (reduced) return;
    camera.position.x += (target.current.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (-target.current.y * 0.45 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Tweens uTheme on .dark class changes (not the Zustand store — the class
 * flips synchronously inside the radial view transition, so the canvas inside
 * the expanding reveal shows the new palette mid-transition for free), and
 * swaps edge blending as the tween crosses 0.5.
 */
function ThemeUniform({
  dark,
  reduced,
  uniforms,
  blendTargets,
}: {
  dark: boolean;
  reduced: boolean;
  uniforms: SceneUniforms;
  blendTargets: ShaderMaterial[];
}) {
  const invalidate = useThree((s) => s.invalidate);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const applyBlend = () => {
      const blending = edgeBlendingFor(uniforms.uTheme.value > 0.5);
      for (const material of blendTargets) material.blending = blending;
    };
    if (reduced) {
      uniforms.uTheme.value = dark ? 1 : 0;
      applyBlend();
      invalidate();
      return;
    }
    const tween = gsap.to(uniforms.uTheme, {
      value: dark ? 1 : 0,
      duration: themeTweenSeconds,
      ease: "power2.inOut",
      onUpdate: () => {
        applyBlend();
        invalidate();
      },
    });
    return () => {
      tween.kill();
    };
  }, [dark, reduced, uniforms, blendTargets, invalidate]);

  return null;
}

export default function HeroScene({ active }: { active: boolean }) {
  const reduced = prefersReduced();
  const [dark, setDark] = useState(isDarkNow);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setDark(isDarkNow()));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const scene = useMemo<ConstellationScene>(() => {
    const initialDark = isDarkNow();
    const uniforms = makeSceneUniforms(initialDark);
    const edge = makeEdgeMaterial(uniforms, { initialDark });
    const recruit = makeEdgeMaterial(uniforms, { recruit: true, initialDark });
    return {
      uniforms,
      node: makeNodeMaterial(uniforms),
      edge,
      recruit,
      hub: makeHubMaterial(uniforms),
      blendTargets: [edge, recruit],
    };
  }, []);

  useEffect(
    () => () => {
      scene.node.dispose();
      scene.edge.dispose();
      scene.recruit.dispose();
      scene.hub.dispose();
    },
    [scene],
  );

  const palette = dark ? scenePalette.dark : scenePalette.light;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !reduced ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
    >
      <AgentNetwork scene={scene} reduced={reduced} />
      <ThemeUniform
        dark={dark}
        reduced={reduced}
        uniforms={scene.uniforms}
        blendTargets={scene.blendTargets}
      />
      <Sparkles
        count={60}
        scale={7}
        size={2}
        speed={reduced ? 0 : 0.3}
        color={palette.sparkle}
        opacity={palette.sparkleOpacity}
      />
      <Rig reduced={reduced} />
    </Canvas>
  );
}
