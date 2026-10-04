/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
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
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { cssColor } from "@/lib/css-color";
import { PARTNERS } from "@/lib/site";

extend({ MeshLineGeometry, MeshLineMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

// Badge-only colors (scoped to this component, per the brand spec for partner badges).
const BADGE_NAVY = "#0b1a47";
const BADGE_LIGHT = "#ffffff";
const BADGE_CYAN = "#02aeea";
const BADGE_BLUE = "#0b7bd2";

// Geometry
const R = 0.72; // medallion radius
const MED_Y = 0.5;
const PLATE_W = 1.3;
const PLATE_H = 0.86;
const PLATE_Y = -0.56;

function Badge({ initials, name }: { initials: string; name: string }) {
  const label = name.replace(/\s+Private Limited$/i, "");
  return (
    <group>
      {/* Plate border (behind) */}
      <mesh position={[0, PLATE_Y, -0.012]} renderOrder={1}>
        <boxGeometry args={[PLATE_W + 0.06, PLATE_H + 0.06, 0.03]} />
        <meshStandardMaterial color={BADGE_BLUE} roughness={0.5} />
      </mesh>
      {/* Light nameplate */}
      <mesh position={[0, PLATE_Y, 0]} renderOrder={2}>
        <boxGeometry args={[PLATE_W, PLATE_H, 0.04]} />
        <meshStandardMaterial color={BADGE_LIGHT} roughness={0.6} />
      </mesh>
      {/* Medallion border ring */}
      <mesh position={[0, MED_Y, 0.004]} rotation-x={Math.PI / 2} renderOrder={3}>
        <cylinderGeometry args={[R + 0.04, R + 0.04, 0.05, 64]} />
        <meshStandardMaterial color={BADGE_BLUE} roughness={0.4} />
      </mesh>
      {/* Dark medallion */}
      <mesh position={[0, MED_Y, 0.01]} rotation-x={Math.PI / 2} renderOrder={4}>
        <cylinderGeometry args={[R, R, 0.06, 64]} />
        <meshPhysicalMaterial color={BADGE_NAVY} clearcoat={1} clearcoatRoughness={0.25} roughness={0.45} />
      </mesh>
      {/* Inner cyan ring + initials */}
      <mesh position={[0, MED_Y, 0.042]} renderOrder={5}>
        <ringGeometry args={[R * 0.72, R * 0.76, 64]} />
        <meshBasicMaterial color={BADGE_CYAN} />
      </mesh>
      <Text position={[0, MED_Y, 0.046]} fontSize={0.34} color={BADGE_LIGHT} anchorX="center" anchorY="middle" renderOrder={6}>
        {initials}
      </Text>
      {/* Name on nameplate */}
      <Text
        position={[0, PLATE_Y - 0.1, 0.024]}
        fontSize={0.15}
        maxWidth={PLATE_W - 0.12}
        textAlign="center"
        color={BADGE_NAVY}
        anchorX="center"
        anchorY="middle"
        lineHeight={1.15}
        renderOrder={6}
      >
        {`${label}\nPrivate Limited`}
      </Text>
      {/* Clip */}
      <mesh position={[0, MED_Y + R + 0.08, 0]}>
        <boxGeometry args={[0.26, 0.18, 0.07]} />
        <meshStandardMaterial color="#9aa3b5" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Band({ x, initials, name, strap }: { x: number; initials: string; name: string; strap: string }) {
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
  useSphericalJoint(j3, card, [[0, 0, 0], [0, MED_Y + R + 0.15, 0]]);

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
          <CuboidCollider args={[R, 1.15, 0.03]} restitution={0} />
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
            <Badge initials={initials} name={name} />
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
  return (
    <>
      {PARTNERS.map((p, i) => (
        <Band key={p.name} x={(i - 1) * spacing} initials={p.initials} name={p.name} strap={strap} />
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
        <Scene strap={strap} />
      </Physics>
    </Canvas>
  );
}
