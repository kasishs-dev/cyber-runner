"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 50,
        color: ["#00f2ff", "#ff007f", "#9d00ff", "#f0ff00"][Math.floor(Math.random() * 4)],
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0 }}
            animate={{ 
              y: "110vh",
              rotate: 360,
              x: `${p.x + (Math.random() - 0.5) * 20}vw`
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 + Math.random() * 2, ease: "linear" }}
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              borderRadius: "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
