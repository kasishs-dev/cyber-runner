"use client";

import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import Obstacle from "./Obstacle";
import Coin from "./Coin";
import Powerup from "./Powerup";
import { useGameState } from "@/hooks/useGameState";
import { audioManager } from "@/lib/audioManager";

const SPAWN_INTERVAL = 0.8; // Seconds
const LANE_WIDTH = 4;
const SPAWN_Z = -40; // Closer for testing

type ItemType = "obstacle" | "coin" | "magnet" | "shield" | "boost" | "hoverboard";
type ValidPowerup = "magnet" | "shield" | "boost" | "hoverboard";

interface GameItem {
  id: number;
  type: ItemType;
  lane: number;
  z: number;
}

export default function ObstacleManager() {
  const [items, setItems] = useState<GameItem[]>([]);
  const itemsRef = useRef<GameItem[]>([]);
  
  const { gameSpeed, isGameOver, isPaused, currentLane, playerY, powerups, setGameOver, addCoin, activatePowerup, updatePowerups } = useGameState();
  const nextId = useRef(0);
  const timeSinceLastSpawn = useRef(0);

  // Clear obstacles on reset
  useEffect(() => {
    if (!isGameOver) {
      itemsRef.current = [];
      setItems([]);
      timeSinceLastSpawn.current = 0;
    }
  }, [isGameOver]);

  useFrame((_state, delta) => {
    if (isGameOver || isPaused) return;

    // 1. Update timers
    timeSinceLastSpawn.current += delta;
    updatePowerups(delta);

    // 2. Physics & Logic Pass (Internal Ref)
    const currentItems = itemsRef.current;
    
    // 2a. Spawning
    if (timeSinceLastSpawn.current >= SPAWN_INTERVAL) {
      timeSinceLastSpawn.current = 0;
      const lane = Math.floor(Math.random() * 3) - 1;
      const rand = Math.random();
      let type: ItemType = "obstacle";
      if (rand < 0.1) {
        const pRand = Math.random();
        type = pRand < 0.33 ? "magnet" : pRand < 0.66 ? "shield" : "boost";
      } else if (rand < 0.4) {
        type = "coin";
      }
      currentItems.push({ id: nextId.current++, type, lane, z: SPAWN_Z });
    }

    // 2b. Movement & Collision
    let hitFound = false;
    let coinsCaptured = 0;
    let pickedUpPowerup: ItemType | null = null;

    itemsRef.current = currentItems.map(item => ({
      ...item,
      z: item.z + gameSpeed * delta * 2.5
    })).filter(item => {
      if (item.z > 5) return false;

      const px = currentLane * LANE_WIDTH;
      const ix = item.lane * LANE_WIDTH;
      const dz = Math.abs(item.z - 0);
      const dx = Math.abs(ix - px);

      if (dz < 1.2 && dx < 2.0) {
        if (item.type === "obstacle") {
          if (playerY > 1.2) return true;
          if (powerups.shield || powerups.hoverboard > 0) {
            pickedUpPowerup = powerups.shield ? "shield" : "hoverboard";
            return false;
          }
          if (powerups.boost > 0) return false;
          hitFound = true;
          return true;
        } else if (item.type === "coin") {
          coinsCaptured++;
          return false;
        } else {
          pickedUpPowerup = item.type;
          return false;
        }
      }
      return true;
    });

    // 3. Side Effects (Immediate Trigger)
    if (coinsCaptured > 0) { 
      audioManager?.play("coin", 0.6);
      for (let i = 0; i < coinsCaptured; i++) {
        addCoin(); 
      }
    }

    if (pickedUpPowerup && pickedUpPowerup !== "obstacle" && pickedUpPowerup !== "coin") {
      audioManager?.play("powerup");
      const pUp = pickedUpPowerup as ValidPowerup;
      const isUsage = (pUp === "shield" && powerups.shield) || (pUp === "hoverboard" && powerups.hoverboard > 0);
      activatePowerup(pUp, isUsage ? 0 : undefined);
    }

    if (hitFound) {
      audioManager?.play("crash");
      setGameOver(true);
    }

    // 4. Sync State for Rendering
    setItems([...itemsRef.current]);
  });

  return (
    <group>
      {items.map((item) => {
        const pos: [number, number, number] = [item.lane * LANE_WIDTH, 0.5, item.z];
        if (item.type === "obstacle") return <Obstacle key={item.id} position={pos} />;
        if (item.type === "coin") return <Coin key={item.id} position={pos} />;
        if (item.type === "magnet" || item.type === "shield" || item.type === "boost") {
          return <Powerup key={item.id} type={item.type} position={pos} />;
        }
        return null;
      })}
    </group>
  );
}
