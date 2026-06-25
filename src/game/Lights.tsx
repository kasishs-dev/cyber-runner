"use client";

import { useRef } from "react";
import * as THREE from "three";

export default function Lights() {
  const directionalRef = useRef<THREE.DirectionalLight>(null!);
  
  // Optional: useHelper(directionalRef, THREE.DirectionalLightHelper, 1);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalRef}
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#00f2ff" />
      <pointLight position={[10, 5, -10]} intensity={1} color="#ff007f" />
    </>
  );
}
