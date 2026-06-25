"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HUD from "@/components/UI/HUD";
import HomeScreen from "@/components/UI/HomeScreen";
import ShopScreen from "@/components/UI/ShopScreen";
import Leaderboard from "@/components/UI/Leaderboard";
import ProfileScreen from "@/components/UI/ProfileScreen";
import { useGameState } from "@/hooks/useGameState";

// Lazy load the GameContainer to avoid SSR issues with Three.js
const GameContainer = dynamic(() => import("@/game/GameContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-neon-cyan">
      <div className="text-2xl font-bold animate-pulse uppercase tracking-widest">
        Initializing Cyber Runner...
      </div>
    </div>
  ),
});

export default function GamePage() {
  const { view } = useGameState();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* 3D Game Layer - Always present but interactions controlled by view */}
      <Suspense fallback={null}>
        <GameContainer />
      </Suspense>
      
      {/* UI Layers */}
      {view === "home" && <HomeScreen />}
      {view === "playing" && <HUD />}
      {view === "shop" && <ShopScreen />}
      {view === "leaderboard" && <Leaderboard />}
      {view === "profile" && <ProfileScreen />}
    </main>
  );
}
