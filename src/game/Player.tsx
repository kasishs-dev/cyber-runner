"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useGameState } from "@/hooks/useGameState";
import { audioManager } from "@/lib/audioManager";

import { useShallow } from "zustand/react/shallow";

const LANE_WIDTH = 4;
const GRAVITY = 30;

export default function Player() {
  const meshRef = useRef<THREE.Group>(null!);
  const shieldRef = useRef<THREE.Mesh>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);

  const { 
    currentLane, setLane, isGameOver, isPaused, updateDistance, setPlayerY, 
    setPlayerSliding, powerups, activatePowerup, user, gameSpeed 
  } = useGameState(useShallow(state => ({
    currentLane: state.currentLane,
    setLane: state.setLane,
    isGameOver: state.isGameOver,
    isPaused: state.isPaused,
    updateDistance: state.updateDistance,
    setPlayerY: state.setPlayerY,
    setPlayerSliding: state.setPlayerSliding,
    powerups: state.powerups,
    activatePowerup: state.activatePowerup,
    user: state.user,
    gameSpeed: state.gameSpeed
  })));
  
  const activeSkin = user?.activeSkin || "default";
  const activeBoard = user?.activeBoard || "surf_basic";
  
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const runnerColors: Record<string, string> = {
    default: "#00f2ff", phantom: "#ff007f", volt: "#f0ff00", void: "#8a2be2"
  };
  const boardColors: Record<string, string> = {
    surf_basic: "#00f2ff", surf_lava: "#ff4d00", surf_ice: "#00d4ff"
  };

  const skinColor = runnerColors[activeSkin] || "#00f2ff";
  const boardColor = boardColors[activeBoard] || "#00f2ff";

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isPaused) return;
      if (e.key === "ArrowLeft") {
        if (currentLane > -1) {
          setLane(currentLane - 1);
          audioManager?.play("click", 0.3);
        }
      } else if (e.key === "ArrowRight") {
        if (currentLane < 1) {
          setLane(currentLane + 1);
          audioManager?.play("click", 0.3);
        }
      } else if (e.key === "ArrowUp" && !isJumping) {
        setIsJumping(true);
        setJumpVelocity(15);
        audioManager?.play("jump");
      } else if (e.key === "ArrowDown" && !isSliding) {
        setIsSliding(true);
        setPlayerSliding(true);
        audioManager?.play("slide", 0.5);
        setTimeout(() => { setIsSliding(false); setPlayerSliding(false); }, 800);
      } else if (e.key === " " && !isGameOver && !isPaused) {
        if (powerups.hoverboard <= 0 && user?.activeBoard) {
          activatePowerup("hoverboard", 20000);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLane, isJumping, isSliding, isGameOver, isPaused, setLane, setPlayerSliding, powerups.hoverboard, activatePowerup, user?.activeBoard]);

  // Desktop and Mobile Gesture Controls (Swipe)
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    const MIN_SWIPE = 30;

    const onStart = (x: number, y: number) => {
      startX = x;
      startY = y;
      isDragging = true;
    };

    const onEnd = (x: number, y: number) => {
      if (!isDragging || isGameOver || isPaused) return;
      isDragging = false;

      const dx = x - startX;
      const dy = y - startY;

      if (Math.abs(dx) < MIN_SWIPE && Math.abs(dy) < MIN_SWIPE) {
        // Tap/Click = activate hoverboard on double tap logic could be here, 
        // but for now let's just use it as board activation if not sliding/jumping
        if (powerups.hoverboard <= 0 && user?.activeBoard && !isJumping && !isSliding) {
          activatePowerup("hoverboard", 20000);
        }
        return;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > MIN_SWIPE && currentLane < 1) setLane(currentLane + 1);
        else if (dx < -MIN_SWIPE && currentLane > -1) setLane(currentLane - 1);
      } else {
        // Vertical swipe
        if (dy < -MIN_SWIPE && !isJumping) {
          setIsJumping(true);
          setJumpVelocity(15);
        } else if (dy > MIN_SWIPE && !isSliding) {
          setIsSliding(true);
          setPlayerSliding(true);
          setTimeout(() => { setIsSliding(false); setPlayerSliding(false); }, 800);
        }
      }
    };

    const onMove = (x: number, y: number) => {
      if (!isDragging || isGameOver || isPaused) return;

      const dx = x - startX;
      const dy = y - startY;

      if (Math.abs(dx) > MIN_SWIPE || Math.abs(dy) > MIN_SWIPE) {
        isDragging = false; // Trigger only once per gesture
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > MIN_SWIPE && currentLane < 1) setLane(currentLane + 1);
          else if (dx < -MIN_SWIPE && currentLane > -1) setLane(currentLane - 1);
          audioManager?.play("click", 0.3);
        } else {
          if (dy < -MIN_SWIPE && !isJumping) {
            setIsJumping(true);
            setJumpVelocity(15);
            audioManager?.play("jump");
          } else if (dy > MIN_SWIPE && !isSliding) {
            setIsSliding(true);
            setPlayerSliding(true);
            audioManager?.play("slide", 0.5);
            setTimeout(() => { setIsSliding(false); setPlayerSliding(false); }, 800);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchEnd = () => { isDragging = false; };
    
    const handleMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => { isDragging = false; };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentLane, isJumping, isSliding, isGameOver, isPaused, setLane, setPlayerSliding, powerups.hoverboard, user?.activeBoard, activatePowerup]);

  // On-screen button controls (custom events from MobileControls)
  useEffect(() => {
    const handleControl = (e: Event) => {
      if (isGameOver || isPaused) return;
      const action = (e as CustomEvent).detail;

      if (action === "left" && currentLane > -1) setLane(currentLane - 1);
      else if (action === "right" && currentLane < 1) setLane(currentLane + 1);
      else if (action === "jump" && !isJumping) {
        setIsJumping(true);
        setJumpVelocity(15);
      } else if (action === "slide" && !isSliding) {
        setIsSliding(true);
        setPlayerSliding(true);
        setTimeout(() => { setIsSliding(false); setPlayerSliding(false); }, 800);
      } else if (action === "board" && powerups.hoverboard <= 0 && user?.activeBoard) {
        activatePowerup("hoverboard", 20000);
      }
    };

    window.addEventListener("game-control", handleControl);
    return () => window.removeEventListener("game-control", handleControl);
  }, [currentLane, isJumping, isSliding, isGameOver, isPaused, setLane, setPlayerSliding, powerups.hoverboard, activatePowerup, user?.activeBoard]);

  useFrame((state, delta) => {
    if (isGameOver || isPaused) return;

    // Lane switching interpolation
    const newTargetX = currentLane * LANE_WIDTH;
    const lerpFactor = 1 - Math.exp(-15 * delta);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, newTargetX, lerpFactor);

    // Jump logic
    if (isJumping) {
      meshRef.current.position.y += jumpVelocity * delta;
      setJumpVelocity((v) => v - GRAVITY * delta);

      if (meshRef.current.position.y <= 0.5) {
        meshRef.current.position.y = 0.5;
        setIsJumping(false);
        setJumpVelocity(0);
      }
    }

    // Slide logic (scaling)
    if (isSliding) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0.5, 0.2);
    } else {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.2);
    }

    // Limb animation (Running)
    const runTime = state.clock.getElapsedTime() * gameSpeed * 0.8;
    if (!isJumping && !isSliding) {
      leftArmRef.current.rotation.x = Math.sin(runTime) * 0.8;
      rightArmRef.current.rotation.x = -Math.sin(runTime) * 0.8;
      leftLegRef.current.rotation.x = -Math.sin(runTime) * 0.8;
      rightLegRef.current.rotation.x = Math.sin(runTime) * 0.8;
      meshRef.current.rotation.y = Math.sin(runTime * 0.5) * 0.1;
    } else if (isJumping) {
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, Math.PI / 2, 0.1);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -Math.PI / 2, 0.1);
    }

    // Lane switching tilt
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, (meshRef.current.position.x - newTargetX) * 0.15, 0.3);

    updateDistance(delta * 10 * (powerups.boost > 0 ? 2 : 1));
    
    if (shieldRef.current) {
      shieldRef.current.rotation.y += delta * 5;
    }

    setPlayerY(meshRef.current.position.y);
  });

  return (
    <group>
      <group ref={meshRef} position={[0, 0.5, 0]}>
        <group scale={[0.8, 0.8, 0.8]}>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color={skinColor} emissive={skinColor} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.3]} />
            <meshStandardMaterial color={skinColor} metalness={0.8} />
          </mesh>
          
          <group position={[-0.45, 0.7, 0]} ref={leftArmRef}>
             <mesh position={[0, -0.3, 0]}>
               <boxGeometry args={[0.15, 0.6, 0.15]} />
               <meshStandardMaterial color={skinColor} opacity={0.8} transparent />
             </mesh>
          </group>
          <group position={[0.45, 0.7, 0]} ref={rightArmRef}>
             <mesh position={[0, -0.3, 0]}>
               <boxGeometry args={[0.15, 0.6, 0.15]} />
               <meshStandardMaterial color={skinColor} opacity={0.8} transparent />
             </mesh>
          </group>
          <group position={[-0.2, 0.2, 0]} ref={leftLegRef}>
             <mesh position={[0, -0.3, 0]}>
               <boxGeometry args={[0.2, 0.6, 0.2]} />
               <meshStandardMaterial color={skinColor} />
             </mesh>
          </group>
          <group position={[0.2, 0.2, 0]} ref={rightLegRef}>
             <mesh position={[0, -0.3, 0]}>
               <boxGeometry args={[0.2, 0.6, 0.2]} />
               <meshStandardMaterial color={skinColor} />
             </mesh>
          </group>

          <mesh position={[0, 1.15, 0.16]}>
            <boxGeometry args={[0.3, 0.1, 0.05]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
          </mesh>
          {/* Hoverboard - Realtime Detail */}
          {powerups.hoverboard > 0 && (
            <group position={[0, -0.6, 0]}>
              <mesh>
                <boxGeometry args={[1.5, 0.1, 0.7]} />
                <meshStandardMaterial color={boardColor} emissive={boardColor} emissiveIntensity={0.5} />
              </mesh>
              <mesh position={[0.5, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
                <meshStandardMaterial color={boardColor} emissive="white" emissiveIntensity={2} />
              </mesh>
              <mesh position={[-0.5, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
                <meshStandardMaterial color={boardColor} emissive="white" emissiveIntensity={2} />
              </mesh>
            </group>
          )}
        </group>

        {powerups.shield && (
          <mesh ref={shieldRef}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshStandardMaterial color="#9d00ff" emissive="#9d00ff" emissiveIntensity={2} transparent opacity={0.1} wireframe />
          </mesh>
        )}
      </group>
    </group>
  );
}
