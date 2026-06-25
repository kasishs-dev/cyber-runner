"use client";

import { useGameState } from "@/hooks/useGameState";
import { ArrowLeft, Check, User as UserIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import SkinPreview from "@/game/SkinPreview";
import { CoinIcon } from "./CoinIcon";

const CATEGORIES = [
  { id: "characters", name: "Runners", icon: UserIcon },
  { id: "boards", name: "Hoverboards", icon: Zap },
];

interface ShopItem {
  id: string;
  name: string;
  price: number;
  color: string;
  desc: string;
}

const ITEMS: Record<string, ShopItem[]> = {
  characters: [
    { id: "default", name: "Neon Stride", price: 0, color: "#00f2ff", desc: "Balance & Precision" },
    { id: "phantom", name: "Phantom Pulse", price: 500, color: "#ff007f", desc: "Agile & Silent" },
    { id: "volt", name: "Volt Runner", price: 1000, color: "#f0ff00", desc: "Energy Overload" },
    { id: "void", name: "Void Walker", price: 2500, color: "#8a2be2", desc: "Reality Bender" },
  ],
  boards: [
    { id: "surf_basic", name: "Cyber Plank", price: 300, color: "#00f2ff", desc: "Entry Level Tech" },
    { id: "surf_lava", name: "Magma Glide", price: 800, color: "#ff4d00", desc: "Heat Resistant" },
    { id: "surf_ice", name: "Frost Flow", price: 1500, color: "#00d4ff", desc: "Sub-Zero Friction" },
  ]
};

export default function ShopScreen() {
  const { setView, user, totalCoins, unlockSkin, setSkin, subtractCoins } = useGameState();
  const [activeTab, setActiveTab] = useState("characters");
  const [selectedId, setSelectedId] = useState("default");

  const currentItems = ITEMS[activeTab];
  const selectedItem = ITEMS.characters.concat(ITEMS.boards).find(i => i.id === selectedId) || ITEMS.characters[0];

  const handleAction = (item: ShopItem) => {
    const isOwned = item.price === 0 || user?.skins.includes(item.id);
    
    if (isOwned) {
      setSkin(item.id, activeTab === "characters" ? "character" : "board");
    } else {
      const success = subtractCoins(item.price);
      if (success) {
        unlockSkin(item.id);
        setSkin(item.id, activeTab === "characters" ? "character" : "board");
      }
    }
  };

  return (
    <div className="fixed inset-0 md:absolute md:inset-0 md:flex md:items-center md:justify-center md:p-6 bg-black/95 backdrop-blur-2xl z-50 animate-in fade-in duration-700 flex flex-col">
      {/* Shop Container - Card on Desktop */}
      <div className="flex-1 flex flex-col md:flex-row md:max-w-5xl md:h-auto md:bg-black/40 md:backdrop-blur-xl md:border md:border-white/5 md:rounded-3xl md:shadow-2xl md:overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-24 md:border-r md:flex-col md:py-10 border-b md:border-b-0 border-white/10 flex items-center py-4 md:py-10 gap-4 md:gap-8 bg-black/40 md:bg-transparent md:rounded-l-3xl">
        <button
          onClick={() => setView("home")}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all mb-0 md:mb-4"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex flex-row md:flex-col gap-4 md:gap-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setSelectedId(ITEMS[cat.id][0].id);
              }}
              className={`p-4 rounded-2xl transition-all relative group ${
                activeTab === cat.id ? 'bg-neon-pink text-black' : 'text-white/20 hover:text-white/60'
              }`}
            >
              <cat.icon size={28} />
              <div className={`absolute left-full md:left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20`}>
                {cat.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Item List */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 mb-2">Marketplace</h2>
              <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
                {activeTab === 'characters' ? 'Active ' : 'Board '}
                <span className="text-neon-pink">Skins</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Promotional/Free Coins Button (Simulating Subway Surfers Ad Reward) */}
              <button 
                onClick={() => {
                  for(let i=0; i<100; i++) useGameState.getState().addCoin();
                }} 
                className="px-4 py-2 bg-neon-yellow text-black font-black text-[10px] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(240,255,0,0.3)] flex items-center gap-2"
              >
                <CoinIcon className="w-4 h-4" /> GET 5000 CREDITS
              </button>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                <CoinIcon className="w-6 h-6" />
                <span className="font-mono text-xl font-bold text-white tracking-tight">{totalCoins}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
               <UserIcon size={20} />
            </div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
              Tip: Select an item from the grid then use the <span className="text-white font-black">Buy Button</span> on the far right to unlock it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentItems.map((item, idx) => {
              const isOwned = item.price === 0 || user?.skins.includes(item.id);
              const isActive = selectedId === item.id;
              const isEquipped = activeTab === "characters" 
                ? user?.activeSkin === item.id 
                : user?.activeBoard === item.id;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedId(item.id)}
                  className={`relative p-5 rounded-3xl border text-left transition-all group overflow-hidden ${
                    isActive 
                      ? `border-white/40 bg-white/10 brightness-125` 
                      : `border-white/5 bg-white/2`
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Model</span>
                      <span className="text-lg font-black uppercase italic tracking-tighter text-white">{item.name}</span>
                    </div>
                    {isEquipped && <Check size={18} className="text-neon-cyan" />}
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-white/40 font-mono tracking-tighter flex items-center gap-1">
                      {isOwned ? "OWNED" : <>{item.price} <CoinIcon className="w-3 h-3" /></>}
                    </span>
                    <div className="w-10 h-1 rounded-full bg-white/10 overflow-hidden">
                       <div className="h-full bg-white/40 w-1/3" />
                    </div>
                  </div>

                  {isActive && (
                    <motion.div 
                      layoutId="active-bg"
                      className="absolute inset-0 border-2 border-neon-pink rounded-3xl pointer-events-none"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Preview */}
        <div 
          className="w-full md:w-80 lg:w-96 md:border-l md:border-white/5 flex flex-col p-6 md:p-10 relative transition-colors duration-500 overflow-hidden"
          style={{ background: `radial-gradient(circle at center, ${selectedItem.color}15 0%, transparent 70%)` }}
        >
          <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
            <div className="aspect-[3/4] relative">
               {/* Ambient Glow behind model */}
               <div className="absolute inset-0 blur-[100px] opacity-20 transition-colors duration-1000" style={{ backgroundColor: selectedItem.color }} />
               <SkinPreview key={selectedItem.id} skinId={selectedItem.id} type={activeTab === 'characters' ? 'character' : 'board'} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {selectedItem.name}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed uppercase font-bold tracking-[0.2em]">{selectedItem.desc}</p>
            </div>

            <button
              onClick={() => handleAction(selectedItem)}
              disabled={(activeTab === 'characters' ? user?.activeSkin : user?.activeBoard) === selectedId}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs overflow-hidden relative group transition-all transform active:scale-95
                ${user?.skins.includes(selectedId) || selectedItem.price === 0
                  ? ((activeTab === 'characters' ? user?.activeSkin : user?.activeBoard) === selectedId ? 'bg-white/5 text-white/20' : 'bg-white text-black hover:bg-neon-cyan')
                  : (totalCoins >= selectedItem.price ? 'bg-neon-pink text-black hover:brightness-125' : 'bg-white/5 text-white/10 cursor-not-allowed')
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {user?.skins.includes(selectedId) || selectedItem.price === 0
                  ? ((activeTab === 'characters' ? user?.activeSkin : user?.activeBoard) === selectedId ? "Active Component" : "Deploy Skin")
                  : (totalCoins >= selectedItem.price ? `Purchase [${selectedItem.price} CR]` : "Insufficient Credits")
                }
              </span>
              <motion.div 
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                whileTap={{ opacity: 0.4 }}
              />
            </button>
          </div>
          
          <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-white/10" />
          <div className="absolute top-6 right-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">Security Cleared</div>
        </div>
      </div>
      </div>
    </div>
  );
}
