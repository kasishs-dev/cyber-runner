import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGameState } from "@/hooks/useGameState";
import { useShallow } from "zustand/react/shallow";

interface CoinProps {
  position: [number, number, number];
}

const MAGNET_RADIUS = 10;
const MAGNET_STRENGTH = 15;

export default function Coin({ position }: CoinProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const { magnetActive, currentLane, playerY, gameSpeed } = useGameState(useShallow(state => ({
    magnetActive: state.powerups.magnet > 0,
    currentLane: state.currentLane,
    playerY: state.playerY,
    gameSpeed: state.gameSpeed
  })));

  useFrame((state, delta) => {
    // Forward movement (matching track speed)
    meshRef.current.position.z += gameSpeed * delta * 2.5;

    // Rotation animation
    meshRef.current.rotation.y += delta * 2;

    // Magnet effect
    if (magnetActive) {
      const playerX = currentLane * 4; // LANE_WIDTH
      const playerPos = new THREE.Vector3(playerX, playerY, 0);
      const coinPos = meshRef.current.position;
      
      const dist = coinPos.distanceTo(playerPos);
      if (dist < MAGNET_RADIUS) {
        const dir = playerPos.clone().sub(coinPos).normalize();
        meshRef.current.position.add(dir.multiplyScalar(MAGNET_STRENGTH * delta));
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Outer Rim */}
      <mesh castShadow>
        <torusGeometry args={[0.45, 0.05, 16, 32]} />
        <meshPhysicalMaterial 
          color="#ffca28" 
          metalness={1} 
          roughness={0.1} 
          emissive="#ffca28" 
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Coin Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshPhysicalMaterial 
          color="#ffd740" 
          metalness={1} 
          roughness={0.2}
          emissive="#ffd740"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Central Symbol (Raised Star/Diamond) */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
