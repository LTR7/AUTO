import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Group } from "three";
import { gsap } from "@/lib/gsap";
import { attractor, pulses } from "@/constants/scene";
import type { SceneUniforms } from "./materials";

type Tween = ReturnType<typeof gsap.to>;

export interface SceneInput {
  worldCursor: RefObject<Vector3>;
  active: RefObject<boolean>;
  mode: RefObject<"mouse" | "touch">;
}

/**
 * All pointer → uniform plumbing: cursor attractor (mouse hover / touch tap
 * with decay) and click-to-dispatch task pulses. No React state per frame —
 * refs and direct uniform writes only. The canvas itself stays
 * pointer-events:none; clicks are read from the #hero section, so CTAs and
 * nav never lose events. Registers nothing under reduced motion.
 */
export function useSceneInput({
  uniforms,
  homes,
  groupRef,
  reduced,
}: {
  uniforms: SceneUniforms;
  homes: Float32Array;
  groupRef: RefObject<Group | null>;
  reduced: boolean;
}): SceneInput {
  const camera = useThree((s) => s.camera);
  const clock = useThree((s) => s.clock);
  const gl = useThree((s) => s.gl);
  const worldCursor = useRef(new Vector3(0, 0, 1000));
  const active = useRef(false);
  const mode = useRef<"mouse" | "touch">("mouse");
  const slot = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const tweens: Tween[] = [];
    const tmp = new Vector3();

    // Pointer ray → the z=0 plane the constellation lives on.
    const toPlane = (clientX: number, clientY: number, out: Vector3) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      tmp.set(ndcX, ndcY, 0.5).unproject(camera);
      const dir = tmp.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      out.copy(camera.position).addScaledVector(dir, t);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mode.current = "mouse";
      active.current = true;
      gsap.killTweensOf(uniforms.uCursorStrength);
      toPlane(event.clientX, event.clientY, worldCursor.current);
    };

    const onLeave = () => {
      active.current = false;
    };

    const onDown = (event: PointerEvent) => {
      // CTAs and nav never lose clicks; no preventDefault anywhere.
      const target = event.target as Element | null;
      if (target?.closest("a, button, [role=button]")) return;

      if (event.pointerType === "touch") {
        mode.current = "touch";
        toPlane(event.clientX, event.clientY, worldCursor.current);
        uniforms.uCursorStrength.value = 1;
        tweens.push(
          gsap.to(uniforms.uCursorStrength, {
            value: 0,
            duration: attractor.touchDecaySeconds,
            ease: "power2.out",
            overwrite: true,
          }),
        );
      }

      const group = groupRef.current;
      if (!group) return;
      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < homes.length / 3; i++) {
        tmp.set(homes[i * 3], homes[i * 3 + 1], homes[i * 3 + 2]);
        group.localToWorld(tmp);
        tmp.project(camera);
        const dx = tmp.x - ndcX;
        const dy = tmp.y - ndcY;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best < 0) return;
      // Ring buffer caps spam-clicking at `pulses.max` concurrent waves.
      uniforms.uPulses.value[slot.current % pulses.max].set(
        homes[best * 3],
        homes[best * 3 + 1],
        homes[best * 3 + 2],
        clock.elapsedTime,
      );
      slot.current += 1;
      // Call-and-response: the hub inhales shortly after the dispatch.
      tweens.push(
        gsap.delayedCall(pulses.hubResponseDelay, () => {
          uniforms.uHubKick.value = 1;
          tweens.push(
            gsap.to(uniforms.uHubKick, { value: 0, duration: 0.4, ease: "power2.out" }),
          );
        }) as unknown as Tween,
      );
    };

    const heroEl = document.getElementById("hero");
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    heroEl?.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      heroEl?.removeEventListener("pointerdown", onDown);
      tweens.forEach((tween) => tween.kill());
    };
  }, [reduced, camera, clock, gl, uniforms, homes, groupRef]);

  return { worldCursor, active, mode };
}
