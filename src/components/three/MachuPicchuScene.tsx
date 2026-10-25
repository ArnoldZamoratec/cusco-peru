"use client";
// ============================================================
// LOW-POLY MACHU PICCHU (React Three Fiber)
// Procedural terrain (saddle ridge + Huayna Picchu + gorge),
// stone ruins, terraces and drifting clouds. The camera flies a
// spline driven by scroll progress, the model rotates slowly and
// leans toward the mouse for parallax.
// ============================================================
import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------- Terrain height field ----------
const gauss = (x: number, z: number, cx: number, cz: number, s: number) =>
  Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (2 * s * s));
const hash = (x: number, z: number) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
function height(x: number, z: number) {
  const r = Math.hypot(x, z);
  let h = -7; // Urubamba gorge floor
  // Narrow saddle ridge carrying the citadel
  h += 15 * Math.exp(-(x * x) / (2 * 6.5 * 6.5)) * (z > -14 && z < 22 ? 1 : 0.6);
  h += 24 * gauss(x, z, 0, -19, 4.2); // Huayna Picchu — the iconic sharp peak
  h += 30 * gauss(x, z, 3, 30, 9); // Machu Picchu mountain behind
  h += 12 * gauss(x, z, -9, -26, 4); // Huchuy Picchu shoulder
  // Ring of distant Andes
  if (r > 38) h += Math.min(34, (r - 38) * 1.2) * (0.6 + 0.4 * Math.sin(Math.atan2(z, x) * 5));
  h += (hash(Math.round(x * 2), Math.round(z * 2)) - 0.5) * 1.4; // facet jitter
  return h;
}

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(150, 150, 90, 90);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
    const flat = g.toNonIndexed(); // non-indexed => true faceted low-poly look
    const p = flat.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(p.count * 3);
    const c = new THREE.Color();
    const low = new THREE.Color("#2f4a33"), mid = new THREE.Color("#4f6b45"), rock = new THREE.Color("#7a6a58"), snow = new THREE.Color("#efe7d6");
    for (let i = 0; i < p.count; i += 3) {
      const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
      if (y > 26) c.copy(snow);
      else if (y > 14) c.copy(rock).lerp(mid, hash(i, 1) * 0.3);
      else if (y > 2) c.copy(mid).lerp(low, hash(i, 2) * 0.5);
      else c.copy(low).lerp(rock, 0.15 + hash(i, 3) * 0.2);
      for (let k = 0; k < 3; k++) c.toArray(colors, (i + k) * 3);
    }
    flat.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    flat.computeVertexNormals();
    return flat;
  }, []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} />
    </mesh>
  );
}

// ---------- Citadel: stone buildings, plaza, terraces ----------
function Ruins() {
  const { walls, roofs, terraces } = useMemo(() => {
    const walls: { p: [number, number, number]; s: [number, number, number]; r: number }[] = [];
    const roofs: [number, number, number][] = [];
    for (let i = 0; i < 46; i++) {
      const z = -9 + (i % 12) * 1.6 + (hash(i, 7) - 0.5) * 0.6;
      const side = i < 24 ? -1 : 1;
      const x = side * (1.6 + hash(i, 9) * 2.6);
      if (Math.abs(x) < 1.4) continue; // keep the central plaza open
      const sx = 0.8 + hash(i, 11) * 1.1, sz = 0.7 + hash(i, 13) * 0.9, sy = 0.55 + hash(i, 17) * 0.4;
      const y = height(x, z);
      walls.push({ p: [x, y + sy / 2, z], s: [sx, sy, sz], r: (hash(i, 19) - 0.5) * 0.3 });
      if (hash(i, 23) > 0.82) roofs.push([x, y + sy + 0.35, z]);
    }
    const terraces: { p: [number, number, number]; w: number }[] = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const x = side * (5 + i * 0.9);
        terraces.push({ p: [x, height(x, 0) + 0.15, 0], w: 18 - i * 1.2 });
      }
    }
    return { walls, roofs, terraces };
  }, []);

  return (
    <group>
      {walls.map((w, i) => (
        <mesh key={i} position={w.p} rotation={[0, w.r, 0]} castShadow>
          <boxGeometry args={w.s} />
          <meshStandardMaterial color={i % 3 ? "#b9ad9a" : "#a49784"} flatShading roughness={1} />
        </mesh>
      ))}
      {roofs.map((p, i) => (
        <mesh key={i} position={p} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.85, 0.7, 4]} />
          <meshStandardMaterial color="#D4A24C" flatShading />
        </mesh>
      ))}
      {/* Main plaza */}
      <mesh position={[0, height(0, 0) + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.6, 15]} />
        <meshStandardMaterial color="#6e8f52" flatShading />
      </mesh>
      {terraces.map((t, i) => (
        <mesh key={i} position={t.p} castShadow receiveShadow>
          <boxGeometry args={[0.85, 0.5, t.w]} />
          <meshStandardMaterial color={i % 2 ? "#5c7a48" : "#66864f"} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Clouds drifting through the gorge ----------
function Clouds() {
  const group = useRef<THREE.Group>(null);
  const puffs = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({
      x: (hash(i, 31) - 0.5) * 90, y: 2 + hash(i, 37) * 10, z: (hash(i, 41) - 0.5) * 80,
      s: 2 + hash(i, 43) * 4, speed: 0.4 + hash(i, 47) * 0.8,
    })),
    []
  );
  useFrame((_, dt) => {
    group.current?.children.forEach((m, i) => {
      m.position.x += puffs[i].speed * dt;
      if (m.position.x > 50) m.position.x = -50;
    });
  });
  return (
    <group ref={group}>
      {puffs.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.s * 1.8, c.s * 0.6, c.s]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#f5f1e8" transparent opacity={0.55} flatShading depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Camera rig: scroll spline + mouse parallax ----------
const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(46, 30, 52),
  new THREE.Vector3(16, 13, 12),
  new THREE.Vector3(3, 12, 17),
  new THREE.Vector3(-32, 40, -18),
]);
const LOOK = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 6, 0),
  new THREE.Vector3(0, 7, -2),
  new THREE.Vector3(0, 13, -18),
  new THREE.Vector3(0, 4, 2),
]);

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const world = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, progress.current, 3.2, dt);
    const t = smooth.current;
    PATH.getPoint(t, camera.position);
    camera.position.x += pointer.x * 3;
    camera.position.y += pointer.y * 1.6;
    LOOK.getPoint(t, look);
    camera.lookAt(look);
    // Slow idle rotation of the whole world
    if (world.current) world.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
  });
  return (
    <group ref={world}>
      <Terrain />
      <Ruins />
      <Clouds />
    </group>
  );
}

export default function MachuPicchuScene({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 42, near: 0.5, far: 400, position: [46, 30, 52] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label="Modelo 3D interactivo de Machu Picchu"
      role="img"
    >
      <fog attach="fog" args={["#5a3424", 60, 190]} />
      <hemisphereLight args={["#ffd9a8", "#2a1d17", 0.65]} />
      {/* Dawn sun from the east, low and warm */}
      <directionalLight
        position={[60, 40, 20]}
        intensity={2.2}
        color="#ffc98a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <Rig progress={progress} />
    </Canvas>
  );
}
