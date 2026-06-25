"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Trophy, Zap, Star, Edit3, Check, X } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { CoinIcon } from "./CoinIcon";
import { useState } from "react";

export default function ProfileScreen() {
  const { setView, user, totalCoins, setUsername } = useGameState();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.username || "");

  const handleSave = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
      setIsEditing(false);
    }
  };

  const stats = [
    { label: "High Score", value: user?.highScore?.toLocaleString() || "0", icon: <Trophy size={18} />, color: "neon-yellow" },
    { label: "Total Coins", value: totalCoins.toLocaleString(), icon: <CoinIcon className="w-5 h-5" />, color: "neon-cyan" },
    { label: "Skins", value: user?.skins?.length || 1, icon: <Star size={18} />, color: "neon-pink" },
    { label: "Boards", value: user?.boards?.length || 1, icon: <Zap size={18} />, color: "neon-purple" },
  ];

  return (
    <div className="fixed inset-0 md:absolute md:inset-0 bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 z-[60]">
      <div className="w-full max-w-md md:max-w-xl">
        {/* Back Button */}
        <button
          onClick={() => setView("home")}
          className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all group flex items-center gap-2"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-b border-white/5 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
              <User size={40} />
            </div>
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div 
                    key="edit"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleSave()}
                      className="bg-white/10 border-2 border-neon-cyan/50 rounded-lg px-3 py-1.5 text-lg font-bold text-white outline-none w-full shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                      maxLength={15}
                    />
                    <button onClick={handleSave} className="p-2.5 bg-neon-cyan text-black rounded-lg hover:bg-white transition-colors">
                      <Check size={20} strokeWidth={3} />
                    </button>
                    <button onClick={() => { setIsEditing(false); setTempName(user?.username || ""); }} className="p-2.5 bg-white/10 text-white/50 rounded-lg hover:bg-white/20">
                      <X size={20} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="display"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase truncate max-w-[150px] sm:max-w-none">
                        {user?.username || "Local Runner"}
                      </h2>
                      <button 
                        onClick={() => {
                          setTempName(user?.username || "");
                          setIsEditing(true);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all group self-start sm:self-auto"
                      >
                        <Edit3 size={12} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Change Name</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] mt-1.5">Cyber Athlete</p>
              <div className="mt-2 px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 inline-flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-[8px] font-bold text-neon-cyan uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 p-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`p-4 rounded-2xl bg-white/5 border border-${stat.color}/10 hover:border-${stat.color}/30 transition-all`}
              >
                <div className={`text-${stat.color} mb-2`}>{stat.icon}</div>
                <div className={`text-2xl font-black italic tracking-tighter text-${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Inventory */}
          <div className="px-6 pb-6">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Inventory</p>
            <div className="flex flex-wrap gap-2">
              {(user?.skins || ["default"]).map((skin) => (
                <span key={skin} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${skin === user?.activeSkin ? "bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan" : "bg-white/5 border-white/10 text-white/40"}`}>
                  {skin}
                </span>
              ))}
              {(user?.boards || ["surf_basic"]).map((board) => (
                <span key={board} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${board === user?.activeBoard ? "bg-neon-pink/20 border-neon-pink/50 text-neon-pink" : "bg-white/5 border-white/10 text-white/40"}`}>
                  🛹 {board}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
