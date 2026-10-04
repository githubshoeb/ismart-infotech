/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
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

type Palette = { navy: string; primary: string; cyan: string };

function cardTexture(name: string, initials: string, p: Palette) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 720;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 512, 720);
  g.addColorStop(0, p.navy);
  g.addColorStop(1, p.primary);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 720);
  ctx.fillStyle = p.cyan;
  ctx.fillRect(0, 0, 512, 10);
  // slot
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.roundRect(206, 40, 100, 18, 9);
  ctx.fill();
  // initials mark
  ctx.strokeStyle = p.cyan;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 280, 110, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "600 96px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, 256, 285);
  // name
  const [first, ...rest] = name.split(" ");
  ctx.font = "600 42px Poppins, sans-serif";
  ctx.fillText(first ?? "", 256, 480);
  ctx.font = "400 26px Poppins, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText(rest.join(" "), 256, 530);
  ctx.fillStyle = p.cyan;
  ctx.font = "500 20px Poppins, sans-serif";
  ctx.fillText("PARTNER", 256, 650);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function Band({
  x,
  texture,
  strap,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  x: number;
  texture: THREE.Texture;
  strap: string;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const band = useRef<any>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const { size } = useThree();
  const seg = { type: "dynamic" as const, canSleep: true, colliders: false as const, angularDamping: 2, linearDamping: 2 };
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && band.current) {
      [j1, j2].forEach((r) => {
        if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation());
        const d = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
        r.current.lerped.lerp(r.current.translation(), delta * (minSpeed + d * (maxSpeed - minSpeed)));
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
  curve.curveType = "chordal";

  return (
    <>
      <group position={[x, 4, 0]}>
        <RigidBody ref={fixed} {...seg} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...seg} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation() as THREE.Vector3)));
            }}
          >
            <mesh>
              <boxGeometry args={[1.6, 2.25, 0.03]} />
              <meshPhysicalMaterial attach="material-0" color={strap} />
              <meshPhysicalMaterial attach="material-1" color={strap} />
              <meshPhysicalMaterial attach="material-2" color={strap} />
              <meshPhysicalMaterial attach="material-3" color={strap} />
              <meshPhysicalMaterial attach="material-4" map={texture} clearcoat={1} clearcoatRoughness={0.2} roughness={0.5} />
              <meshPhysicalMaterial attach="material-5" map={texture} clearcoat={1} clearcoatRoughness={0.2} roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[0.28, 0.2, 0.06]} />
              <meshStandardMaterial color="#9aa3b5" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color={strap} depthTest={false} resolution={[size.width, size.height]} lineWidth={1} />
      </mesh>
    </>
  );
}

function Scene({ palette }: { palette: Palette }) {
  const { viewport } = useThree();
  const spacing = Math.min(3.6, viewport.width / 3.1);
  const textures = useMemo(
    () => PARTNERS.map((p) => cardTexture(p.name, p.initials, palette)),
    [palette],
  );
  return (
    <>
      {PARTNERS.map((p, i) => (
        <Band key={p.name} x={(i - 1) * spacing} texture={textures[i]!} strap={i === 1 ? palette.cyan : palette.primary} />
      ))}
    </>
  );
}

export default function PartnerLanyards() {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [z, setZ] = useState(13);
  useEffect(() => {
    setPalette({ navy: cssColor("--brand-navy"), primary: cssColor("--primary"), cyan: cssColor("--highlight") });
    setZ(window.innerWidth < 640 ? 24 : window.innerWidth < 1024 ? 17 : 13);
  }, []);
  if (!palette) return null;
  return (
    <Canvas camera={{ position: [0, 0, z], fov: 25 }} dpr={[1, 1.75]} gl={{ alpha: true }} style={{ touchAction: "pan-y" }}>
      <ambientLight intensity={Math.PI} />
      <directionalLight position={[3, 5, 8]} intensity={1.5} />
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Scene palette={palette} />
      </Physics>
    </Canvas>
  );
}
