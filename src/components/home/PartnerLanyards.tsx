/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { cssColor } from "@/lib/css-color";
import { PARTNERS } from "@/lib/site";
import logoAsset from "@/assets/ismart-logo-icon.png";

extend({ MeshLineGeometry, MeshLineMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

// Badge-only colors (scoped to this component, per the brand spec for partner badges).
// Local font so drei <Text> never fetches one from a CDN.
const BADGE_FONT = "/fonts/poppins-latin-500-normal.woff";
const BADGE_NAVY = "#0b1a47";
const BADGE_LIGHT = "#ffffff";
const BADGE_CYAN = "#02aeea";
const BADGE_BLUE = "#0b7bd2";

// Geometry — vertical ID card
const CW = 1.6;
const CH = 2.3;
const HW = CW / 2;
const HH = CH / 2;
const CLIP_Y = HH + 0.08;

function poly(pts: [number, number][]) {
  const s = new THREE.Shape();
  s.moveTo(pts[0]![0], pts[0]![1]);
  pts.slice(1).forEach(([x, y]) => s.lineTo(x, y));
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const R_CORNER = 0.12;
const ins = 0.035; // keep diagonals inside rounded corners

function Badge({ name, logo }: { name: string; logo: THREE.Texture }) {
  const label = name.replace(/\s+Private Limited$/i, "");
  const geo = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(roundedRect(CW, CH, R_CORNER), {
      depth: 0.04,
      bevelEnabled: false,
      curveSegments: 12,
    });
    body.translate(0, 0, -0.04);
    return {
      body,
      // Angular header blocks
      navy: poly([[-HW, HH - R_CORNER], [-HW + R_CORNER, HH], [HW - R_CORNER, HH], [HW, HH - R_CORNER], [HW, 0.62], [-HW, 0.28]]),
      blue: poly([[-HW, 0.5], [HW * 0.15, 0.36], [-HW, 0.06]]),
      cyan: poly([[HW, 0.82], [HW, 0.4], [HW * 0.05, 0.52]]),
      bar: poly([[-HW, -HH + 0.24], [HW, -HH + 0.24], [HW, -HH + R_CORNER], [HW - R_CORNER + ins, -HH + ins], [-HW + R_CORNER - ins, -HH + ins], [-HW, -HH + R_CORNER]]),
    };
  }, []);
  return (
    <group>
      <mesh geometry={geo.body}>
        <meshPhysicalMaterial color={BADGE_LIGHT} roughness={0.55} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh geometry={geo.blue} position-z={0.002}>
        <meshBasicMaterial color={BADGE_BLUE} />
      </mesh>
      <mesh geometry={geo.navy} position-z={0.004}>
        <meshBasicMaterial color={BADGE_NAVY} />
      </mesh>
      <mesh geometry={geo.cyan} position-z={0.006}>
        <meshBasicMaterial color={BADGE_CYAN} />
      </mesh>

      {/* Header: logo + company + tagline */}
      <mesh position={[-HW + 0.3, HH - 0.3, 0.01]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      <Text font={BADGE_FONT} position={[-HW + 0.5, HH - 0.25, 0.012]} fontSize={0.072} color={BADGE_LIGHT} anchorX="left" anchorY="middle">
        iSmart Infotech Solutions
      </Text>
      <Text font={BADGE_FONT} position={[-HW + 0.5, HH - 0.37, 0.012]} fontSize={0.06} letterSpacing={0.08} color={BADGE_CYAN} anchorX="left" anchorY="middle">
        CODE · CREATE · CONNECT
      </Text>

      {/* Partner name (hero element) */}
      <Text font={BADGE_FONT}
        position={[0, -0.18, 0.012]}
        fontSize={0.19}
        maxWidth={CW * 2}
        textAlign="center"
        color={BADGE_NAVY}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor={BADGE_NAVY}
      >
        {label}
      </Text>
      <Text font={BADGE_FONT} position={[0, -0.42, 0.012]} fontSize={0.105} color={BADGE_NAVY} anchorX="center" anchorY="middle">
        Private Limited
      </Text>
      <mesh position={[0, -0.56, 0.01]}>
        <planeGeometry args={[0.5, 0.012]} />
        <meshBasicMaterial color={BADGE_CYAN} />
      </mesh>
      <Text font={BADGE_FONT} position={[0, -0.7, 0.012]} fontSize={0.075} letterSpacing={0.12} color={BADGE_BLUE} anchorX="center" anchorY="middle">
        COLLABORATION PARTNER
      </Text>

      {/* Bottom bar */}
      <mesh geometry={geo.bar} position-z={0.006}>
        <meshBasicMaterial color={BADGE_BLUE} />
      </mesh>
      <Text font={BADGE_FONT} position={[0, -HH + 0.13, 0.012]} fontSize={0.06} letterSpacing={0.1} color={BADGE_LIGHT} anchorX="center" anchorY="middle">
        CODE · CREATE · CONNECT
      </Text>

      {/* Clip */}
      <mesh position={[0, CLIP_Y, 0]}>
        <boxGeometry args={[0.26, 0.18, 0.07]} />
        <meshStandardMaterial color="#9aa3b5" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Band({ x, name, strap, logo }: { x: number; name: string; strap: string; logo: THREE.Texture }) {
  const band = useRef<any>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const tmp = useMemo(
    () => ({ vec: new THREE.Vector3(), ang: new THREE.Vector3(), rot: new THREE.Vector3(), dir: new THREE.Vector3() }),
    [],
  );
  const { size } = useThree();
  const seg = useMemo(
    () => ({ type: "dynamic" as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 }),
    [],
  );
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  }, []);
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CLIP_Y + 0.07, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { vec, ang, rot, dir } = tmp;
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && band.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((r) => {
        if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation());
        const d = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
        r.current.lerped.lerp(r.current.translation(), Math.min(1, delta * (10 + d * 40)));
      });
      curve.points[0]!.copy(j3.current.translation() as THREE.Vector3);
      curve.points[1]!.copy(j2.current.lerped);
      curve.points[2]!.copy(j1.current.lerped);
      curve.points[3]!.copy(fixed.current.translation() as THREE.Vector3);
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel() as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <>
      <group position={[x, 4, 0]}>
        <RigidBody ref={fixed} {...seg} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...seg}>
          <BallCollider args={[0.1]} restitution={0} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...seg}>
          <BallCollider args={[0.1]} restitution={0} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...seg}>
          <BallCollider args={[0.1]} restitution={0} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...seg} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[HW, HH, 0.03]} restitution={0} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(tmp.vec.copy(card.current.translation() as THREE.Vector3)));
            }}
          >
            <Badge name={name} logo={logo} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} renderOrder={0}>
        <meshLineGeometry />
        <meshLineMaterial color={strap} resolution={[size.width, size.height]} lineWidth={1} />
      </mesh>
    </>
  );
}

function Scene({ strap }: { strap: string }) {
  const { viewport } = useThree();
  const spacing = Math.min(3.6, viewport.width / 3.1);
  const logo = useTexture(logoAsset);
  logo.colorSpace = THREE.SRGBColorSpace;
  logo.anisotropy = 8;
  return (
    <>
      {PARTNERS.map((p, i) => (
        <Band key={p.name} x={(i - 1) * spacing} name={p.name} strap={strap} logo={logo} />
      ))}
    </>
  );
}

export default function PartnerLanyards() {
  const [strap, setStrap] = useState<string | null>(null);
  const [z, setZ] = useState(13);
  useEffect(() => {
    setStrap(cssColor("--primary"));
    setZ(window.innerWidth < 640 ? 24 : window.innerWidth < 1024 ? 17 : 13);
  }, []);
  if (!strap) return null;
  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 0, z], fov: 25 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={Math.PI * 0.8} />
      <directionalLight position={[3, 5, 8]} intensity={1.5} />
      <Physics gravity={[0, -30, 0]} timeStep={1 / 60}>
        <Suspense fallback={null}>
          <Scene strap={strap} />
        </Suspense>
      </Physics>
    </Canvas>
  );
}
