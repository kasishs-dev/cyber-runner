import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGameState } from "@/hooks/useGameState";

interface ObstacleProps {
  position: [number, number, number];
}

export default function Obstacle({ position }: ObstacleProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const gameSpeed = useGameState(state => state.gameSpeed);

  useFrame((_state, delta) => {
    meshRef.current.position.z += gameSpeed * delta * 2.5;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[3, 1.5, 1]} />
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
    </mesh>
  );
}
