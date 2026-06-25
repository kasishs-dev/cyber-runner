"use client";

import { useGameState } from "@/hooks/useGameState";
import { Play, ShoppingBag, Trophy, User, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { audioManager } from "@/lib/audioManager";

export default function HomeScreen() {
  const { setView, resetGame, isMuted, toggleMute } = useGameState();

  const handleAction = (cb: () => void) => {
    audioManager?.play("click");
    cb();
  };

  const menuItems = [
    { icon: <Play size={32} />, label: "Run", onClick: () => handleAction(resetGame), color: "neon-cyan" },
    { icon: <ShoppingBag size={32} />, label: "Shop", onClick: () => handleAction(() => setView("shop")), color: "neon-pink" },
    { icon: <Trophy size={32} />, label: "Leaderboard", onClick: () => handleAction(() => setView("leaderboard")), color: "neon-yellow" },
    { icon: <User size={32} />, label: "Profile", onClick: () => handleAction(() => setView("profile")), color: "neon-purple" },
  ];

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50">
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 sm:mb-16 text-center"
      >
        <h1 className="text-5xl sm:text-8xl font-black italic tracking-tighter text-white uppercase leading-none skew-x-[-10deg]" aria-label="Cyber Runner">
          Cyber<br />
          <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]">Runner</span>
        </h1>
        <p className="mt-2 sm:mt-4 text-white/40 tracking-[0.5em] uppercase text-[10px] sm:text-sm font-bold">Neon Protocol Active</p>
      </motion.div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-md">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={item.onClick}
            className={`group relative flex flex-col items-center justify-center py-4 px-6 sm:p-8 glass-card border-${item.color}/30 hover:border-${item.color} transition-all duration-300 overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-${item.color}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className={`text-${item.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <span className={`text-sm font-black uppercase tracking-widest text-${item.color}`}>
              {item.label}
            </span>
            
            {/* Corner Accents */}
            <div className={`absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-${item.color}/30`} />
            <div className={`absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-${item.color}/30`} />
          </motion.button>
        ))}
      </div>

      {/* Footer / Stats Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex items-center gap-8 text-white/40 text-xs font-bold uppercase tracking-widest"
      >
        <button 
          onClick={toggleMute}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {isMuted ? "Audio Off" : "Audio On"}
        </button>
        <div>v1.0.4 - Phase 2</div>
        <div>Sector 7G-Neon</div>
      </motion.div>
    </div>
  );
}
