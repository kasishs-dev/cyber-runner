"use client";

import { create } from "zustand";

interface UserProfile {
  username: string;
  coins: number;
  highScore: number;
  totalDistance: number;
  skins: string[];
  boards: string[];
  activeSkin: string;
  activeBoard: string;
}

interface GameState {
  view: "home" | "playing" | "shop" | "leaderboard" | "profile";
  score: number;
  coins: number; // Coins in current run
  totalCoins: number; // Coins in bank
  distance: number;
  isGameOver: boolean;
  isPaused: boolean;
  gameSpeed: number;
  currentLane: number; // -1: Left, 0: Center, 1: Right
  playerY: number;
  playerIsSliding: boolean;
  user: UserProfile | null;
  isMuted: boolean;
  masterVolume: number;
  
  // Power-up States
  powerups: {
    magnet: number; // Remaining duration in ms
    shield: boolean;
    boost: number; // Remaining duration in ms
    hoverboard: number; // Remaining duration in ms
  };
  
  setView: (view: "home" | "playing" | "shop" | "leaderboard" | "profile") => void;
  incrementScore: (amount: number) => void;
  addCoin: () => void;
  subtractCoins: (amount: number) => boolean;
  updateDistance: (delta: number) => void;
  setGameOver: (status: boolean) => void;
  togglePause: () => void;
  setLane: (lane: number) => void;
  setPlayerY: (y: number) => void;
  setPlayerSliding: (sliding: boolean) => void;
  activatePowerup: (type: "magnet" | "shield" | "boost" | "hoverboard", duration?: number) => void;
  updatePowerups: (delta: number) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  unlockSkin: (skinId: string) => void;
  setSkin: (skinId: string, type: "character" | "board") => void;
  getGuestId: () => string;
  syncWithBackend: () => Promise<void>;
  saveToBackend: () => Promise<void>;
  resetGame: () => void;
}

export const useGameState = create<GameState>((set, get) => ({
  view: "home",
  score: 0,
  coins: 0,
  totalCoins: 100,
  distance: 0,
  isGameOver: false,
  isPaused: false,
  gameSpeed: 10,
  currentLane: 0,
  playerY: 0.5,
  playerIsSliding: false,
  user: {
    username: "Local Runner",
    coins: 100,
    highScore: 0,
    totalDistance: 0,
    skins: ["default"],
    boards: ["surf_basic"],
    activeSkin: "default",
    activeBoard: "surf_basic",
  },
  isMuted: false,
  masterVolume: 0.5,
  powerups: {
    magnet: 0,
    shield: false,
    boost: 0,
    hoverboard: 0,
  },

  setView: (view) => set({ view }),
  incrementScore: (amount) => set((state) => ({
    score: state.score + amount,
  })),
  
  addCoin: () => set((state) => {
    const newCoinsInRun = state.coins + 1;
    const newTotalCoins = state.totalCoins + 1;
    return { 
      coins: newCoinsInRun, 
      totalCoins: newTotalCoins,
      score: state.score + 50,
      user: state.user ? { ...state.user, coins: newTotalCoins } : state.user
    };
  }),

  subtractCoins: (amount) => {
    let success = false;
    set((state) => {
      if (state.totalCoins >= amount) {
        success = true;
        const newTotal = state.totalCoins - amount;
        return { 
          totalCoins: newTotal,
          user: state.user ? { ...state.user, coins: newTotal } : state.user
        };
      }
      return state;
    });
    return success;
  },
  updateDistance: (delta) => set((state) => {
    const newDist = state.distance + delta;
    // Subway Surfers style: score = distance, speed ramps every 100m
    const newScore = Math.floor(newDist) + state.coins * 50;
    const newSpeed = Math.min(40, 10 + Math.floor(newDist / 100) * 1.5);
    return { distance: newDist, score: newScore, gameSpeed: newSpeed };
  }),
  setGameOver: (status) => {
    set((state) => {
      if (status) {
        // Check for new high score
        const isNewHighScore = state.score > (state.user?.highScore || 0);
        const updatedUser = state.user ? {
          ...state.user,
          highScore: isNewHighScore ? state.score : state.user.highScore,
          coins: state.totalCoins
        } : null;

        if (updatedUser) {
          // Trigger save
          setTimeout(() => get().saveToBackend(), 100);
          return { isGameOver: status, user: updatedUser };
        }
      }
      return { isGameOver: status };
    });
  },
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setLane: (lane) => set({ currentLane: lane }),
  setPlayerY: (y) => set({ playerY: y }),
  setPlayerSliding: (sliding) => set({ playerIsSliding: sliding }),
  
  activatePowerup: (type, duration = 10000) => set((state) => ({
    powerups: {
      ...state.powerups,
      [type]: type === "shield" ? (duration > 0) : duration,
    }
  })),

  updatePowerups: (delta) => set((state) => ({
    powerups: {
      ...state.powerups,
      magnet: Math.max(0, state.powerups.magnet - delta * 1000),
      boost: Math.max(0, state.powerups.boost - delta * 1000),
      hoverboard: Math.max(0, state.powerups.hoverboard - delta * 1000),
    }
  })),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVolume: (volume) => set({ masterVolume: volume }),

  getGuestId: () => {
    if (typeof window === 'undefined') return "local";
    let id = localStorage.getItem('cyber_runner_guest_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 9);
      localStorage.setItem('cyber_runner_guest_id', id);
    }
    return id;
  },

  unlockSkin: (skinId) => {
    set((state) => {
      if (!state.user) return state;
      const isBoard = skinId.startsWith('surf_');
      const newUser = {
        ...state.user,
        skins: isBoard ? state.user.skins : [...state.user.skins, skinId],
        boards: isBoard ? [...state.user.boards, skinId] : state.user.boards
      };
      
      // Sync to backend
      fetch("/api/user/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-guest-id": get().getGuestId() 
        },
        body: JSON.stringify(newUser)
      });
      return { user: newUser };
    });
  },

  setSkin: (skinId, type) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = {
        ...state.user,
        activeSkin: type === "character" ? skinId : state.user.activeSkin,
        activeBoard: type === "board" ? skinId : state.user.activeBoard,
      };
      
      fetch("/api/user/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-guest-id": get().getGuestId() 
        },
        body: JSON.stringify(newUser)
      });

      return { user: newUser };
    });
  },

  syncWithBackend: async () => {
    const guestId = get().getGuestId();
    try {
      const res = await fetch("/api/user/profile", {
        headers: { "x-guest-id": guestId }
      });
      const data = await res.json();
      if (data && !data.error) {
        set({ 
          user: data, 
          totalCoins: data.coins
        });
        return;
      }
    } catch (e) {
      console.warn("Backend sync failed:", e);
    }

    // LocalStorage Fallback
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cyber_runner_profile');
      if (saved) {
        const data = JSON.parse(saved);
        set({
          user: data,
          totalCoins: data.coins
        });
      }
    }
  },

  saveToBackend: async () => {
    const { user, totalCoins } = get();
    if (!user) return;

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-guest-id": get().getGuestId() 
        },
        body: JSON.stringify({
          ...user,
          coins: totalCoins,
        })
      });
      if (res.ok) return;
    } catch (e) {
      console.warn("Backend save failed:", e);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('cyber_runner_profile', JSON.stringify({
        ...user,
        coins: totalCoins
      }));
    }
  },

  resetGame: () => set(() => ({
    score: 0,
    coins: 0,
    distance: 0,
    isGameOver: false,
    isPaused: false,
    gameSpeed: 10,
    currentLane: 0,
    playerY: 0.5,
    playerIsSliding: false,
    view: "playing",
    powerups: {
      magnet: 0,
      shield: false,
      boost: 0,
      hoverboard: 0,
    },
  })),
}));

if (typeof window !== 'undefined') {
  useGameState.getState().syncWithBackend();
}
