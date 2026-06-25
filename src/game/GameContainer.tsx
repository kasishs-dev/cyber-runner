"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import Player from "@/game/Player";
import Track from "@/game/Track";
import ObstacleManager from "@/game/ObstacleManager";
import Lights from "@/game/Lights";
import { useGameState } from "@/hooks/useGameState";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { audioManager } from "@/lib/audioManager";

import { useShallow } from "zustand/react/shallow";

function ResponsiveCamera() {
  const { viewport } = useThree();
  const boostActive = useGameState(state => state.powerups.boost > 0);
  
  // Base FOV for horizontal (landscape) is 60
  // For vertical (portrait), we increase FOV to keep lanes in view
  const aspect = viewport.width / viewport.height;
  const baseFov = aspect < 1 ? 75 : 60;
  const targetFov = boostActive ? baseFov + 20 : baseFov;

  return (
    <PerspectiveCamera 
      makeDefault 
      position={[0, 5, 12]} 
      fov={targetFov} 
    />
  );
}

export default function GameContainer() {
  const { view, isMuted, masterVolume, gameSpeed } = useGameState(useShallow(state => ({
    view: state.view,
    isMuted: state.isMuted,
    masterVolume: state.masterVolume,
    gameSpeed: state.gameSpeed
  })));

  // Audio Sync & BGM Management
  useEffect(() => {
    if (audioManager) {
      audioManager.updateSettings(isMuted, masterVolume);
    }
  }, [isMuted, masterVolume]);

  useEffect(() => {
    if (!audioManager) return;
    if (view === "playing") {
      audioManager.startBGM();
    } else {
      audioManager.stopBGM();
    }
  }, [view]);

  useEffect(() => {
    if (audioManager && view === "playing") {
      audioManager.updateSpeedEffect(gameSpeed);
    }
  }, [gameSpeed, view]);

  return (
    <div className="h-full w-full bg-black">
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ResponsiveCamera />
          
          <Lights />
          
          {/* Cyber Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="city" />
          
          <Track />
          
          <Player />
          
          <ObstacleManager />

          {/* Post Processing */}
          <EffectComposer>
            <Bloom 
              intensity={1.0} 
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.9} 
              height={200} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
