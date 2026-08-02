import { BGMTrack } from "../types/game";

/**
 * Web Audio Synthesizer for procedural ambient soundscapes and low-latency relaxation sound effects.
 * Extracted into a single centralized manager for clean code architecture and reuse across all screens.
 */
export class AudioSynthManager {
  private ctx: AudioContext | null = null;
  public enabled = true;
  public currentTrack: BGMTrack = "piano";

  private bgTimer: any = null;
  private noiseNode: AudioNode | null = null;
  private ambientTimer: any = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // ===== SOUND EFFECTS =====

  playPop(pitchShift = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      const freq = 420 * pitchShift;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 2.4, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playBubblePop(vol = 0.12) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(480 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 200, now + 0.06);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playRainbowChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [1046.5, 1318.5, 1567.98, 1975.5, 2093.0];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.enabled) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
        } catch (e) {}
      }, idx * 45);
    });
  }

  playHeartWarmBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [349.23, 440.0].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      });
    } catch (e) {}
  }

  playStarMagicSparkle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1318.5, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {}
  }

  playWaterRipple() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playJellyfish() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [880, 1046.5, 1318.5].forEach((f, i) => {
      setTimeout(() => {
        if (!this.ctx || !this.enabled) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.65);
        } catch (e) {}
      }, i * 80);
    });
  }

  playFishNearby() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(380, now + 0.2);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playWhaleCall() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(220, now + 1.2);
      osc.frequency.linearRampToValueAtTime(100, now + 2.4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.055, now + 2.0);
      gain.gain.linearRampToValueAtTime(0, now + 2.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 3.0);
    } catch (e) {}
  }

  // ===== AMBIENT BGM =====

  startAmbientBGM(track: BGMTrack = this.currentTrack) {
    this.currentTrack = track;
    this.stopAmbientBGM();
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (track === "ocean" || track === "rain_piano") {
      this.playOceanNoise();
    }
    if (track !== "ocean") {
      this.playMelodicBGM(track);
    }
  }

  private playOceanNoise() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();

      this.noiseNode = whiteNoise;
    } catch (e) {}
  }

  private playMelodicBGM(track: BGMTrack) {
    const notesets: Record<string, number[]> = {
      piano: [261.63, 329.63, 392.0, 440.0, 523.25, 659.25],
      lofi_piano: [220.0, 261.63, 329.63, 392.0, 493.88],
      nature: [587.33, 659.25, 783.99, 880.0, 987.77],
      rain_piano: [261.63, 329.63, 392.0, 523.25],
    };
    const notes = notesets[track] || notesets.piano;
    const interval = track === "nature" ? 2600 : 4200;

    const playChord = () => {
      if (!this.enabled || !this.ctx) return;
      try {
        const rootIndex = Math.floor(Math.random() * (notes.length - 2));
        const chord = [notes[rootIndex], notes[rootIndex + 1], notes[rootIndex + 2]];
        chord.forEach((freq, i) => {
          setTimeout(() => {
            if (!this.ctx || !this.enabled) return;
            try {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              const now = this.ctx.currentTime;
              osc.type = track === "lofi_piano" ? "triangle" : "sine";
              osc.frequency.setValueAtTime(freq, now);
              gain.gain.setValueAtTime(0.02, now);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(now);
              osc.stop(now + 3.3);
            } catch (e) {}
          }, i * 200);
        });
      } catch (e) {}
    };

    playChord();
    this.bgTimer = setInterval(playChord, interval);
  }

  startAmbientEvents() {
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 20000;
      this.ambientTimer = setTimeout(() => {
        if (this.enabled) this.playWhaleCall();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }

  stopAmbientBGM() {
    if (this.bgTimer) {
      clearInterval(this.bgTimer);
      this.bgTimer = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
      } catch (e) {}
      this.noiseNode = null;
    }
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }
}

// Single global instance shared across application
export const soundManager = new AudioSynthManager();
