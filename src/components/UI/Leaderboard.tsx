"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Shield, Medal, Globe, ArrowLeft } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";

interface LeaderboardEntry {
  username: string;
  highScore: number;
  image?: string;
}

export default function Leaderboard() {
  const { setView } = useGameState();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/leaderboard?t=${Date.now()}`);
        const data = await res.json();
        if (data && !data.error) {
          // If it's an array, it's successful data
          if (Array.isArray(data)) {
            setEntries(data);
          } else if (data.entries) {
            setEntries(data.entries);
          }
        } else if (data.error) {
          setError(data.error);
          setErrorDetails(data.details);
        }
      } catch (e) {
        console.error("Failed to load leaderboard");
        setError("Network Error");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 md:absolute md:inset-0 bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 z-[60]">
      <div className="w-full max-w-2xl md:max-w-3xl bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Back Button */}
        <button 
          onClick={() => setView("home")}
          aria-label="Back to home"
          className="absolute top-8 left-8 p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all z-20 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-neon-pink/10 to-transparent flex items-center justify-between pl-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neon-pink/20 flex items-center justify-center text-neon-pink">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Global Elite</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Real-time Rankings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
             <Globe size={12} className="text-neon-cyan animate-pulse" />
             <span className="text-[10px] font-bold text-neon-cyan">LIVE</span>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4 opacity-20">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Accessing Neural Net...</span>
            </div>
          ) : error ? (
            <div className="py-20 text-center px-10">
              <span className="text-neon-pink text-xs font-bold uppercase tracking-widest block mb-2">{error}</span>
              {errorDetails && (
                <span className="text-white/20 text-[8px] font-mono block mb-4 break-all bg-white/5 p-2 rounded-lg leading-relaxed">
                  {errorDetails}
                </span>
              )}
              <p className="text-[10px] text-white/40 uppercase leading-relaxed">
                Connect to your neural link (Vercel Database) to sync real-time rankings.<br/>
                Check MONGODB_URI environment variable in Vercel settings.
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-20 text-center opacity-20">
              <span className="text-[10px] font-bold uppercase tracking-widest">No Data Found</span>
            </div>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                  index === 0 
                    ? 'bg-neon-yellow/10 border-neon-yellow/20' 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic ${
                    index === 0 ? 'bg-neon-yellow text-black' :
                    index === 1 ? 'bg-slate-300 text-black' :
                    index === 2 ? 'bg-amber-600 text-black' :
                    'text-white/20'
                  }`}>
                    {index + 1}
                  </div>
                  {entry.image ? (
                     <img src={entry.image} alt={entry.username} className="w-10 h-10 rounded-xl border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                      <Shield size={20} />
                    </div>
                  )}
                  <span className={`font-bold uppercase tracking-tight ${index === 0 ? 'text-neon-yellow' : 'text-white'}`}>
                    {entry.username}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black italic tracking-tighter text-white">
                    {entry.highScore.toLocaleString()}
                  </span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">High Score</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
