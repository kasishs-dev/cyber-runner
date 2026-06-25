"use client";

import { useGameState } from "@/hooks/useGameState";
import { Pause, Play, RotateCcw, Home, Volume2, VolumeX } from "lucide-react";
import { audioManager } from "@/lib/audioManager";
import Confetti from "@/components/Effects/Confetti";
import { useState, useRef, useEffect } from "react";
import MobileControls from "@/components/UI/MobileControls";
import { CoinIcon } from "@/components/UI/CoinIcon";

export default function HUD() {
  const { score, coins, distance, isGameOver, isPaused, togglePause, resetGame, setView, user, powerups, totalCoins, isMuted, toggleMute } = useGameState();

  const handleAction = (cb: () => void) => {
    audioManager?.play("click");
    cb();
  };
  const [popups, setPopups] = useState<{ id: number; x: number; y: number }[]>([]);

  const lastCoins = useRef(coins);
  useEffect(() => {
    if (coins > lastCoins.current) {
      const id = Date.now();
      setPopups(prev => [...prev, { id, x: Math.random() * 40 + 30, y: Math.random() * 40 + 30 }]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== id));
      }, 1000);
    }
    lastCoins.current = coins;
  }, [coins]);

  const highScore = user?.highScore || 0;
  const distanceM = Math.floor(distance);
  const isNewHigh = score > highScore;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col font-sans overflow-hidden">
      <Confetti active={isGameOver && isNewHigh} />

      {/* === TOP BAR === */}
      <div className="flex justify-between items-start p-3 sm:p-5 pointer-events-auto">
        {/* Distance & Score (Left) */}
        <div className="flex flex-col">
          <div className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] leading-none tabular-nums">
            {distanceM}<span className="text-lg sm:text-2xl font-bold text-white/50 ml-1">m</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {isNewHigh ? (
              <span className="text-[10px] sm:text-xs font-black text-neon-yellow uppercase tracking-widest animate-pulse">🏆 New Best!</span>
            ) : (
              <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-widest">
                Best: {highScore.toLocaleString()}m
              </span>
            )}
          </div>
        </div>

        {/* Audio + Coins + Pause (Right) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleMute}
            className="p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors pointer-events-auto"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-neon-yellow/30 backdrop-blur-md">
            <CoinIcon className="w-5 h-5" />
            <span className="text-sm sm:text-lg font-black text-neon-yellow tabular-nums">{coins}</span>
          </div>
          <button
            onClick={() => handleAction(togglePause)}
            className="p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors pointer-events-auto"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>

      {/* === SCORE TICKER (Center Top) === */}
      <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <div className="text-sm sm:text-lg font-black text-neon-cyan drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] tabular-nums">
          {score.toLocaleString()}
        </div>
        <div className="text-[8px] sm:text-[10px] font-bold text-white/20 uppercase tracking-widest">Score</div>
      </div>

      {/* === POWER-UP TIMERS (Bottom Left) === */}
      {!isGameOver && !isPaused && (
        <div className="absolute bottom-4 left-3 sm:bottom-10 sm:left-6 flex flex-col gap-2 sm:gap-4 pointer-events-none">
          {powerups.magnet > 0 && (
            <PowerupBar label="Magnet" value={powerups.magnet} max={10000} color="neon-cyan" />
          )}
          {powerups.boost > 0 && (
            <PowerupBar label="Boost" value={powerups.boost} max={10000} color="neon-yellow" />
          )}
          {powerups.hoverboard > 0 && (
            <PowerupBar label="Board" value={powerups.hoverboard} max={20000} color="neon-pink" />
          )}
          {powerups.shield && (
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Shield Active</span>
            </div>
          )}
        </div>
      )}

      {/* === COIN POPUPS === */}
      {popups.map(p => (
        <div
          key={p.id}
          className="absolute flex items-center gap-1 text-xl sm:text-3xl font-black text-neon-yellow pointer-events-none drop-shadow-[0_0_15px_rgba(240,255,0,0.8)] animate-coin-collect"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="italic">+1</span>
          <CoinIcon className="w-6 h-6" />
        </div>
      ))}

      {/* === PAUSE OVERLAY === */}
      {isPaused && !isGameOver && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto gap-6">
          <div className="text-4xl sm:text-7xl font-black text-white italic tracking-tighter opacity-60 uppercase">PAUSED</div>
          <div className="flex gap-4">
            <button
              onClick={() => handleAction(togglePause)}
              className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 border border-neon-cyan/50 rounded-xl text-neon-cyan font-bold uppercase tracking-widest text-sm hover:bg-neon-cyan/30 transition-all"
            >
              <Play size={16} /> Resume
            </button>
            <button
              onClick={() => handleAction(() => setView("home"))}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white/60 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
            >
              <Home size={16} /> Menu
            </button>
          </div>
        </div>
      )}

      {/* === GAME OVER OVERLAY === */}
      {isGameOver && (
        <div className="absolute inset-0 pointer-events-auto bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 gap-5">
          <div className="text-center">
            <h2 className="text-4xl sm:text-7xl font-black text-neon-pink mb-1 tracking-tighter italic">CRASHED!</h2>
            {isNewHigh && (
              <div className="text-neon-yellow font-black text-sm sm:text-base uppercase tracking-widest animate-bounce">
                🏆 New High Score!
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-sm px-2">
            <StatCard label="Distance" value={`${distanceM}m`} color="text-neon-cyan" />
            <StatCard label="Score" value={score.toLocaleString()} color="text-neon-pink" />
            <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5">
                <CoinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <div className="text-lg sm:text-2xl font-black text-neon-yellow">{coins}</div>
              </div>
              <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Coins</div>
            </div>
          </div>

          <div className="text-xs text-white/30 uppercase tracking-widest">
            Best: {Math.max(highScore, score).toLocaleString()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={() => handleAction(resetGame)}
              className="flex-1 group relative flex flex-col items-center justify-center py-5 glass-card border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all overflow-hidden rounded-2xl"
            >
              <RotateCcw size={28} className="text-neon-cyan mb-1.5 group-hover:rotate-[-180deg] transition-transform duration-500" />
              <span className="text-xs font-bold text-neon-cyan uppercase tracking-widest">Retry</span>
            </button>
            <button
              onClick={() => handleAction(() => setView("home"))}
              className="flex-1 group flex flex-col items-center justify-center py-5 glass-card border-white/20 hover:border-white/50 transition-all rounded-2xl"
            >
              <Home size={28} className="text-white/60 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Menu</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Controls Overlay */}
      {!isGameOver && !isPaused && <MobileControls />}
    </div>
  );
}

function PowerupBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex flex-col gap-1 w-28 sm:w-48">
      <div className="flex justify-between items-end">
        <span className={`text-${color} text-[9px] sm:text-xs font-black uppercase tracking-tighter`}>{label}</span>
        <span className={`text-${color} text-[9px] sm:text-[10px] font-mono`}>{(value / 1000).toFixed(1)}s</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color} shadow-[0_0_10px_currentColor] transition-all`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
      <div className={`text-lg sm:text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}
