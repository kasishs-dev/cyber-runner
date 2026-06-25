"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface FloatingTextProps {
  text: string;
  position: [number, number, number];
  color?: string;
  onComplete: () => void;
}

export default function FloatingText({ text, position, color = "#00f2ff", onComplete }: FloatingTextProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const startTime = useRef(Date.now());

  useFrame((state, delta) => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    if (elapsed > 1) {
      // Don't call onComplete inside useFrame if it causes issues
      return;
    }

    meshRef.current.position.y += delta * 2;
  });

  // Use useEffect for completion to be safer
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={meshRef} position={position}>
      <Text
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}
