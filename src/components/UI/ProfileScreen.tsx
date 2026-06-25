"use client";

import { motion } from "framer-motion";
import { ArrowLeft, User, Trophy, Zap, Star } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { CoinIcon } from "./CoinIcon";

export default function ProfileScreen() {
  const { setView, user, totalCoins } = useGameState();

  const stats = [
    { label: "High Score", value: user?.highScore?.toLocaleString() || "0", icon: <Trophy size={18} />, color: "neon-yellow" },
    { label: "Total Coins", value: totalCoins.toLocaleString(), icon: <CoinIcon className="w-5 h-5" />, color: "neon-cyan" },
    { label: "Skins", value: user?.skins?.length || 1, icon: <Star size={18} />, color: "neon-pink" },
    { label: "Boards", value: user?.boards?.length || 1, icon: <Zap size={18} />, color: "neon-purple" },
  ];

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 z-[60]">
      <div className="w-full max-w-md">
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
            <div className="w-20 h-20 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                {user?.username || "Local Runner"}
              </h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-1">Cyber Athlete</p>
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
