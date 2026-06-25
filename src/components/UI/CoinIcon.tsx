"use client";

export const CoinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center shrink-0`}>
    {/* Glow */}
    <div className="absolute inset-0 bg-neon-yellow/40 rounded-full blur-[4px] animate-pulse" />
    
    {/* Coin Body */}
    <div className="w-full h-full rounded-full bg-gradient-to-br from-neon-yellow via-yellow-400 to-yellow-600 border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_10px_rgba(240,255,0,0.5)] flex items-center justify-center relative">
      {/* Inner Detail */}
      <div className="w-[65%] h-[65%] rounded-full border border-black/10 flex items-center justify-center bg-black/5">
        <span className="text-[10px] font-black text-black/40 leading-none select-none">$</span>
      </div>
    </div>
  </div>
);
