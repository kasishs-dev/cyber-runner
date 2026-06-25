"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface PowerupProps {
  type: "magnet" | "shield" | "boost";
  position: [number, number, number];
}

const COLORS = {
  magnet: "#00f2ff",
  shield: "#9d00ff",
  boost: "#f0ff00",
};

export default function Powerup({ type, position }: PowerupProps) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 3;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.2;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Outer Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 16, 32]} />
        <meshStandardMaterial color={COLORS[type]} emissive={COLORS[type]} emissiveIntensity={2} transparent opacity={0.5} />
      </mesh>

      {/* Inner Icon Placeholder */}
      <mesh>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color={COLORS[type]} emissive={COLORS[type]} emissiveIntensity={1} />
      </mesh>
      
      {/* Point Light for effect */}
      <pointLight color={COLORS[type]} intensity={0.5} distance={3} />
    </group>
  );
}
