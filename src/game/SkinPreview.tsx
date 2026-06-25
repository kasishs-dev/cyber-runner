import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface SkinPreviewProps {
  skinId: string;
  type: "character" | "board";
}

function SkinModel({ skinId, type }: SkinPreviewProps) {
  const meshRef = useRef<THREE.Group>(null!);
  
  // Map skin IDs to colors/shapes for now
  const colors: Record<string, string> = {
    default: "#00f2ff",
    phantom: "#ff007f",
    volt: "#f0ff00",
    void: "#8a2be2",
    surf_basic: "#00f2ff",
    surf_lava: "#ff4d00",
    surf_ice: "#00d4ff",
  };

  const color = colors[skinId] || "#ffffff";

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Smooth idle animation
    if (type === "character") {
      meshRef.current.position.y = Math.sin(t * 2) * 0.1;
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    } else {
      meshRef.current.rotation.z = Math.sin(t * 3) * 0.1;
      meshRef.current.position.y = Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {type === "character" ? (
        <group>
          {/* Head */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
          {/* Body */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.6, 0.8, 0.3]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.45, 0.6, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color={color} opacity={0.8} transparent />
          </mesh>
          <mesh position={[0.45, 0.6, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color={color} opacity={0.8} transparent />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.2, -0.1, 0]} castShadow>
            <boxGeometry args={[0.25, 0.6, 0.25]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0.2, -0.1, 0]} castShadow>
            <boxGeometry args={[0.25, 0.6, 0.25]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Vizor/Face */}
          <mesh position={[0, 1.15, 0.16]}>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
          </mesh>
        </group>
      ) : (
        <group>
          {/* Board Main Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.1, 0.7]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={0.5} 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Fins/Engines */}
          <mesh position={[0.5, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 16]}  />
            <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} />
          </mesh>
          <mesh position={[-0.5, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 16]}  />
            <meshStandardMaterial color="white" emissive={color} emissiveIntensity={2} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function SkinPreview({ skinId, type }: SkinPreviewProps) {
  return (
    <div className="w-full h-full min-h-[300px] bg-gradient-to-b from-transparent to-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">3D Preview Mode</span>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={false}>
             <SkinModel skinId={skinId} type={type} />
          </Stage>
          <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={10} blur={24} far={1} />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {/* Visual background elements */}
      <div className="absolute inset-0 pointer-events-none border-t border-white/5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
    </div>
  );
}
