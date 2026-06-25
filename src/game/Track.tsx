"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGameState } from "@/hooks/useGameState";

const PLANE_SIZE = 1000;
const LANE_WIDTH = 4;

export default function Track() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { gameSpeed, isGameOver, isPaused } = useGameState();

  useFrame((state, delta) => {
    if (isGameOver || isPaused) return;

    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      if (meshRef.current.material.map) {
        meshRef.current.material.map.offset.y += (gameSpeed * delta) / 100;
      }
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, -PLANE_SIZE / 4]}
        receiveShadow
      >
        <planeGeometry args={[LANE_WIDTH * 3, PLANE_SIZE]} />
        <meshStandardMaterial color="#0b0b12" roughness={0.1} metalness={0.5} />
      </mesh>

      <LaneLines />
      <CityWalls />
    </group>
  );
}

function LaneLines() {
  return (
    <group>
      <mesh position={[-LANE_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[0.1, 0.05, 1000]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[LANE_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[0.1, 0.05, 1000]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function CityWalls() {
  const { gameSpeed, isGameOver, isPaused } = useGameState();
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (isGameOver || isPaused) return;
    groupRef.current.position.z += gameSpeed * delta;
    if (groupRef.current.position.z > 12) {
      groupRef.current.position.z -= 12;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(15)].map((_, i) => (
        <group key={i} position={[0, 0, -i * 12]}>
           <mesh position={[-10, 8, 0]}>
              <boxGeometry args={[1, 16, 10]} />
              <meshStandardMaterial color="#09090f" />
              <mesh position={[0.51, 0, 0]}>
                <boxGeometry args={[0.01, 14, 8]} />
                <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.2} transparent opacity={0.3} />
              </mesh>
           </mesh>
           <mesh position={[10, 8, 0]}>
              <boxGeometry args={[1, 16, 10]} />
              <meshStandardMaterial color="#09090f" />
              <mesh position={[-0.51, 0, 0]}>
                <boxGeometry args={[0.01, 14, 8]} />
                <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.2} transparent opacity={0.3} />
              </mesh>
           </mesh>
        </group>
      ))}
    </group>
  );
}
