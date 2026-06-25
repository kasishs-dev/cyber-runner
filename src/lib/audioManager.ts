"use client";

class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private bgm: HTMLAudioElement | null = null;
  private runSound: HTMLAudioElement | null = null;
  private windSound: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.5;

  private constructor() {
    if (typeof window !== "undefined") {
      this.loadSounds();
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadSounds() {
    console.log("AudioManager: Loading sounds...");
    // Using rse/soundfx - a stable collection of open source sound effects
    const baseUrl = "https://raw.githubusercontent.com/rse/soundfx/master/soundfx.d/";
    const soundFiles = {
      jump: `${baseUrl}fanfare1.mp3`,
      coin: `${baseUrl}bling5.mp3`,
      crash: `${baseUrl}error1.mp3`,
      click: `${baseUrl}click1.mp3`,
      powerup: `${baseUrl}fanfare2.mp3`,
      slide: `${baseUrl}cannon2.mp3`, // Lower pitch impact for slide
    };

    Object.entries(soundFiles).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.onerror = () => {
        console.error(`AudioManager: Failed to load sound: ${name} from ${url}`);
        // Fallback to a tiny beep data URI if external fails
        if (name === "click") {
          audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD//w==";
        }
      };
      this.sounds.set(name, audio);
    });

    // BGM - Stable MDN Example
    this.bgm = new Audio("https://raw.githubusercontent.com/mdn/webaudio-examples/master/audio-analyser/viper.mp3");
    this.bgm.loop = true;
    this.bgm.volume = this.masterVolume * 0.3;
    this.bgm.onerror = () => console.error("AudioManager: Failed to load BGM from GitHub Raw");

    // Atmospheric Loops
    this.runSound = new Audio("https://raw.githubusercontent.com/mdn/webaudio-examples/master/multi-track/sounds/drums.mp3"); // Using rhythmic drums at low volume as run placeholder
    this.runSound.loop = true;
    this.runSound.volume = 0;

    this.windSound = new Audio("https://raw.githubusercontent.com/mdn/webaudio-examples/master/audio-analyser/viper.mp3"); // Filtered wind placeholder
    this.windSound.loop = true;
    this.windSound.volume = 0;
  }

  play(name: string, volumeScale: number = 1) {
    if (this.isMuted) return;
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = this.masterVolume * volumeScale;
      sound.play().catch((e) => {
        // If it was a loading error, try one more time or ignore
        console.warn(`AudioManager: Playback failed for ${name}:`, e);
      });
    }
  }

  startBGM() {
    console.log("AudioManager: Starting BGM...");
    if (!this.bgm || this.isMuted) return;
    this.bgm.play().catch((e) => console.warn("AudioManager: BGM play failed:", e));
    this.runSound?.play().catch(() => {});
    this.windSound?.play().catch(() => {});
  }

  stopBGM() {
    console.log("AudioManager: Stopping BGM...");
    this.bgm?.pause();
    this.runSound?.pause();
    this.windSound?.pause();
    if (this.bgm) this.bgm.currentTime = 0;
  }

  updateSpeedEffect(speed: number) {
    if (this.isMuted || !this.runSound || !this.windSound) return;

    const playbackRate = Math.min(2, 0.8 + (speed - 10) / 30);
    if (this.runSound) {
      this.runSound.playbackRate = playbackRate;
      this.runSound.volume = this.masterVolume * 0.1; // Keep it subtle
    }

    const windVol = Math.min(0.3, (speed - 10) / 100);
    if (this.windSound) {
      this.windSound.volume = this.masterVolume * windVol;
    }
  }

  updateSettings(isMuted: boolean, masterVolume: number) {
    this.isMuted = isMuted;
    this.masterVolume = masterVolume;
    
    if (this.bgm) this.bgm.volume = masterVolume * 0.3;
    if (this.runSound) this.runSound.volume = isMuted ? 0 : masterVolume * 0.1;
    if (this.windSound) this.windSound.volume = isMuted ? 0 : masterVolume * 0.2;

    if (isMuted) {
      this.bgm?.pause();
      this.runSound?.pause();
      this.windSound?.pause();
    }
  }
}

export const audioManager = typeof window !== "undefined" ? AudioManager.getInstance() : null;
