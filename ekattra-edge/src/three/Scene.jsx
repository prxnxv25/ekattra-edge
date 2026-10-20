import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FRAGMENT, VERTEX } from "./shaders.js";
import { SHAPE, buildShapes } from "./shapes.js";
import { prefersReducedMotion, readStage, sceneState } from "./store.js";

const SHAPE_OF = [SHAPE.SPHERE, SHAPE.FIELD, SHAPE.TRIAD, SHAPE.ORBITS, SHAPE.KNOT, SHAPE.SPHERE];
const LAYOUT = [
  { x: 2.55, y: 0.05, s: 1, a: 1, w: 1 },
  { x: 2.75, y: -0.1, s: 0.95, a: 0.85, w: 0.45 },
  { x: 2.6, y: 0, s: 1, a: 1, w: 0.25 },
  { x: 2.55, y: 0, s: 1.05, a: 0.95, w: 1 },
  { x: 2.6, y: 0, s: 1, a: 1, w: 1 },
  { x: 0, y: 0.2, s: 1.75, a: 0.55, w: 1 },
];
const lerp = (a, b, t) => a + (b - a) * t;

function Field({ still }) {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0, wx: 99, wy: 99 });
  const seg = useRef(-1);
  const smooth = useRef({ stage: 0, act: new THREE.Vector3(), theme: 0 });
  const count = typeof window !== "undefined" && window.innerWidth < 900 ? 5200 : 9000;
  const data = useMemo(() => buildShapes(count), [count]);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const from = new THREE.BufferAttribute(data.shapes[SHAPE_OF[0]].slice(), 3);
    const to = new THREE.BufferAttribute(data.shapes[SHAPE_OF[1]].slice(), 3);
    from.setUsage(THREE.DynamicDrawUsage); to.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", new THREE.BufferAttribute(data.shapes[SHAPE.SPHERE], 3));
    g.setAttribute("aFrom", from);
    g.setAttribute("aTo", to);
    g.setAttribute("aScatter", new THREE.BufferAttribute(data.shapes[SHAPE.SCATTER], 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(data.rnd, 1));
    g.setAttribute("aCluster", new THREE.BufferAttribute(data.cluster, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uMix: { value: 0 }, uIntro: { value: still ? 1 : 0 }, uPx: { value: 1 },
        uTheme: { value: 0 }, uAlpha: { value: 1 }, uMouse: { value: new THREE.Vector2(99, 99) },
        uAct: { value: new THREE.Vector3() },
      },
      vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthWrite: false,
    });
    return { geometry: g, material: m };
  }, [data, still]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!still) {
      const onMove = (e) => {
        pointer.current.x = e.clientX / window.innerWidth - 0.5;
        pointer.current.y = e.clientY / window.innerHeight - 0.5;
      };
      const onLeave = () => { pointer.current.x = 99; };
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onLeave);
      return () => { window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); };
    }
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [still, invalidate]);

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    const u = material.uniforms;
    const sm = smooth.current;
    const k = still ? 1 : 1 - Math.exp(-dt * 4.5);

    sm.stage = lerp(sm.stage, readStage(), k);
    const s = Math.min(sm.stage, SHAPE_OF.length - 1 - 1e-4);
    const i = Math.floor(s);
    const f = s - i;
    if (i !== seg.current) {
      seg.current = i;
      geometry.attributes.aFrom.array.set(data.shapes[SHAPE_OF[i]]);
      geometry.attributes.aTo.array.set(data.shapes[SHAPE_OF[i + 1]]);
      geometry.attributes.aFrom.needsUpdate = true;
      geometry.attributes.aTo.needsUpdate = true;
    }
    u.uMix.value = f;
    u.uTime.value = still ? 0 : t;
    u.uPx.value = state.gl.getPixelRatio();
    if (!still) u.uIntro.value = Math.min(1, Math.max(0, (t - 0.2) / 2.6));

    const a = sceneState.active;
    sm.act.lerp(new THREE.Vector3(a === 0 ? 1 : 0, a === 1 ? 1 : 0, a === 2 ? 1 : 0), k * 0.8);
    u.uAct.value.copy(sm.act);
    sm.theme = lerp(sm.theme, sceneState.dark ? 1 : 0, k * 0.7);
    u.uTheme.value = sm.theme;

    const A = LAYOUT[i], B = LAYOUT[i + 1], e = f * f * (3 - 2 * f);
    const mobile = state.size.width < 900;
    const g = group.current;
    g.position.x = mobile ? 0 : lerp(A.x, B.x, e);
    g.position.y = mobile ? 1.55 : lerp(A.y, B.y, e);
    g.scale.setScalar(lerp(A.s, B.s, e) * (mobile ? 0.68 : 1));
    u.uAlpha.value = lerp(A.a, B.a, e) * (mobile ? 0.34 : 1);

    const p = pointer.current;
    const hasPointer = p.x < 50 && !still;
    const sway = lerp(A.w, B.w, e);
    g.rotation.y = lerp(g.rotation.y, (still ? 0.5 : Math.sin(t * 0.22) * 0.55 * sway) + (hasPointer ? p.x * 0.35 : 0), k);
    g.rotation.x = lerp(g.rotation.x, 0.1 + (hasPointer ? p.y * 0.2 : 0), k);
    g.rotation.z = still ? 0 : t * 0.04;

    const halfH = Math.tan(THREE.MathUtils.degToRad(18)) * 9, halfW = halfH * (state.size.width / state.size.height);
    const tx = hasPointer ? p.x * 2 * halfW : 99, ty = hasPointer ? -p.y * 2 * halfH : 99;
    p.wx = Math.abs(p.wx - tx) > 20 ? tx : lerp(p.wx, tx, 0.18);
    p.wy = Math.abs(p.wy - ty) > 20 ? ty : lerp(p.wy, ty, 0.18);
    u.uMouse.value.set(p.wx, p.wy);
  });

  return <group ref={group}><points geometry={geometry} material={material} /></group>;
}

export default function Scene() {
  const [still] = useState(prefersReducedMotion);
  return (
    <Canvas
      className="gl"
      camera={{ fov: 36, near: 0.1, far: 100, position: [0, 0, 9] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      frameloop={still ? "demand" : "always"}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Field still={still} />
    </Canvas>
  );
}