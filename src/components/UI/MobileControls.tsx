"use client";

import { useGameState } from "@/hooks/useGameState";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Zap } from "lucide-react";
import { useRef } from "react";

export default function MobileControls() {
  const {
    isGameOver, isPaused,
    powerups,
  } = useGameState();

  const dispatch = (action: "left" | "right" | "jump" | "slide" | "board") => {
    if (isGameOver || isPaused) return;
    window.dispatchEvent(new CustomEvent("game-control", { detail: action }));
  };

  return (
    <div className="absolute inset-x-0 bottom-0 pb-6 px-4 flex items-end justify-between pointer-events-none z-50 sm:hidden">
      {/* Left Side: Left + Right */}
      <div className="flex gap-3 pointer-events-auto">
        <ControlBtn
          icon={<ArrowLeft size={22} />}
          color="neon-cyan"
          onPress={() => dispatch("left")}
          label="Left"
        />
        <ControlBtn
          icon={<ArrowRight size={22} />}
          color="neon-cyan"
          onPress={() => dispatch("right")}
          label="Right"
        />
      </div>

      {/* Center: Hoverboard */}
      <div className="pointer-events-auto">
        <ControlBtn
          icon={<Zap size={22} />}
          color="neon-pink"
          onPress={() => dispatch("board")}
          label="Board"
          large
          disabled={powerups.hoverboard > 0}
        />
      </div>

      {/* Right Side: Jump + Slide */}
      <div className="flex gap-3 pointer-events-auto">
        <ControlBtn
          icon={<ArrowDown size={22} />}
          color="neon-yellow"
          onPress={() => dispatch("slide")}
          label="Slide"
        />
        <ControlBtn
          icon={<ArrowUp size={22} />}
          color="neon-green"
          onPress={() => dispatch("jump")}
          label="Jump"
        />
      </div>
    </div>
  );
}

function ControlBtn({
  icon, color, onPress, label, large, disabled
}: {
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
  label: string;
  large?: boolean;
  disabled?: boolean;
}) {
  const size = large ? "w-16 h-16" : "w-14 h-14";
  const colorMap: Record<string, string> = {
    "neon-cyan": "border-[#00f2ff]/40 text-[#00f2ff] active:bg-[#00f2ff]/20",
    "neon-pink": "border-[#ff007f]/40 text-[#ff007f] active:bg-[#ff007f]/20",
    "neon-yellow": "border-[#f0ff00]/40 text-[#f0ff00] active:bg-[#f0ff00]/20",
    "neon-green": "border-[#00ff9f]/40 text-[#00ff9f] active:bg-[#00ff9f]/20",
  };

  return (
    <button
      onTouchStart={(e) => { e.preventDefault(); if (!disabled) onPress(); }}
      onClick={() => { if (!disabled) onPress(); }}
      onMouseDown={(e) => { e.stopPropagation(); }} // Prevent swipe from triggering
      aria-label={label}
      className={`${size} rounded-2xl flex items-center justify-center
        bg-black/60 backdrop-blur-xl border-2
        ${colorMap[color] || "border-white/40 text-white"}
        active:scale-95 transition-all duration-75 select-none
        ${disabled ? "opacity-30" : "opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.5)]"}`}
    >
      {icon}
    </button>
  );
}
