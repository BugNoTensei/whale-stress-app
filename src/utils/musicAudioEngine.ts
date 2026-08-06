import { MusicCategory } from "../components/music/RelaxationMusicScreen";

export interface MusicTrackInfo {
  id: string;
  category: MusicCategory;
}

interface TrackAudioProfile {
  chords: number[][];
  instrument: "piano" | "marimba" | "pad" | "rain_bell" | "glass" | "cascade" | "lofi_rhodes" | "kalimba" | "flute";
  intervalMs: number;
  noteDelayMs: number;
  attackSec: number;
  decaySec: number;
}

const TRACK_PROFILES: Record<string, TrackAudioProfile> = {
  // 1. Peaceful Piano (C Major Pentatonic / Soft Piano)
  peaceful_piano: {
    chords: [
      [261.63, 329.63, 392.0, 493.88],  // Cmaj7 (C4, E4, G4, B4)
      [220.0, 261.63, 329.63, 392.0],   // Am9 (A3, C4, E4, G4)
      [174.61, 220.0, 261.63, 329.63],  // Fmaj7 (F3, A3, C4, E4)
      [196.0, 246.94, 293.66, 392.0],   // G6 (G3, B3, D4, G4)
    ],
    instrument: "piano",
    intervalMs: 4200,
    noteDelayMs: 180,
    attackSec: 0.08,
    decaySec: 3.5,
  },

  // 2. Forest Walk (A Minor / Percussive Marimba)
  forest_walk: {
    chords: [
      [440.0, 523.25, 659.25, 880.0],   // Am (A4, C5, E5, A5)
      [293.66, 349.23, 440.0, 587.33],  // Dm (D4, F4, A4, D5)
      [329.63, 392.0, 493.88, 659.25],  // Em (E4, G4, B4, E5)
      [220.0, 329.63, 440.0, 523.25],   // Am/E (A3, E4, A4, C5)
    ],
    instrument: "marimba",
    intervalMs: 2800,
    noteDelayMs: 120,
    attackSec: 0.015,
    decaySec: 1.8,
  },

  // 3. Ocean Waves (G Major / Slow Ambient Pad Swells)
  ocean_waves: {
    chords: [
      [196.0, 293.66, 369.99, 440.0],   // Gmaj9 (G3, D4, F#4, A4)
      [261.63, 329.63, 392.0, 587.33],  // Cmaj9 (C4, E4, G4, D5)
      [164.81, 246.94, 329.63, 392.0],  // Em7 (E3, B3, E4, G4)
      [146.83, 220.0, 293.66, 440.0],   // Dsus4 (D3, A3, D4, A4)
    ],
    instrument: "pad",
    intervalMs: 5200,
    noteDelayMs: 250,
    attackSec: 1.2,
    decaySec: 4.5,
  },

  // 4. Rainy Day (D Minor / Melancholic Rain Bells)
  rainy_day: {
    chords: [
      [293.66, 349.23, 440.0, 523.25],  // Dm7 (D4, F4, A4, C5)
      [233.08, 293.66, 349.23, 440.0],  // Bbmaj7 (Bb3, D4, F4, A4)
      [196.0, 233.08, 293.66, 349.23],  // Gm7 (G3, Bb3, D4, F4)
      [220.0, 277.18, 329.63, 440.0],   // A7 (A3, C#4, E4, A4)
    ],
    instrument: "rain_bell",
    intervalMs: 3600,
    noteDelayMs: 160,
    attackSec: 0.04,
    decaySec: 2.8,
  },

  // 5. Morning Mist (E Major / High Crystalline Glass Piano)
  morning_mist: {
    chords: [
      [329.63, 415.3, 493.88, 622.25],   // Emaj7 (E4, G#4, B4, D#5)
      [277.18, 329.63, 415.3, 493.88],   // C#m7 (C#4, E4, G#4, B4)
      [370.0, 440.0, 554.37, 739.99],    // F#m7 (F#4, A4, C#5, F#5)
      [246.94, 370.0, 493.88, 587.33],   // B7 (B3, F#4, B4, D5)
    ],
    instrument: "glass",
    intervalMs: 3900,
    noteDelayMs: 200,
    attackSec: 0.12,
    decaySec: 3.8,
  },

  // 6. Waterfall (F Major / Cascading Bright Harp)
  waterfall: {
    chords: [
      [174.61, 261.63, 329.63, 392.0, 523.25, 659.25], // Fmaj9
      [146.83, 220.0, 293.66, 349.23, 440.0, 587.33],  // Dm9
      [116.54, 174.61, 233.08, 293.66, 349.23, 466.16], // Bbmaj7
      [130.81, 196.0, 261.63, 349.23, 392.0, 523.25],  // Csus4
    ],
    instrument: "cascade",
    intervalMs: 2600,
    noteDelayMs: 90,
    attackSec: 0.01,
    decaySec: 2.2,
  },

  // 7. Deep Forest (F# Minor / Chill Lo-Fi Detuned Rhodes)
  deep_forest: {
    chords: [
      [185.0, 277.18, 370.0, 440.0, 554.37],  // F#m9 (F#3, C#4, F#4, A4, C#5)
      [123.47, 246.94, 293.66, 370.0, 440.0],  // Bm7 (B2, B3, D4, F#4, A4)
      [138.59, 277.18, 329.63, 415.3, 493.88], // C#m7 (C#3, C#4, E4, G#4, B4)
      [185.0, 220.0, 277.18, 370.0, 440.0],   // F#m7 (F#3, A3, C#4, F#4, A4)
    ],
    instrument: "lofi_rhodes",
    intervalMs: 4400,
    noteDelayMs: 210,
    attackSec: 0.09,
    decaySec: 3.6,
  },

  // 8. Gentle Rain (Bb Major / Soft Plucked Kalimba)
  gentle_rain: {
    chords: [
      [233.08, 349.23, 440.0, 587.33],  // Bbmaj7 (Bb3, F4, A4, D5)
      [196.0, 293.66, 349.23, 440.0],   // Gm7 (G3, D4, F4, A4)
      [155.56, 233.08, 311.13, 392.0],  // Ebmaj7 (Eb3, Bb3, Eb4, G4)
      [174.61, 261.63, 349.23, 440.0],  // F7 (F3, C4, F4, A4)
    ],
    instrument: "kalimba",
    intervalMs: 3300,
    noteDelayMs: 140,
    attackSec: 0.02,
    decaySec: 2.5,
  },

  // 9. Ocean Breeze (D Major / Breezy Coastal Sine Flute)
  ocean_breeze: {
    chords: [
      [293.66, 369.99, 440.0, 554.37, 739.99], // Dmaj9 (D4, F#4, A4, C#5, F#5)
      [246.94, 293.66, 370.0, 440.0, 587.33],  // Bm7 (B3, D4, F#4, A4, D5)
      [196.0, 293.66, 369.99, 440.0, 554.37],  // Gmaj7 (G3, D4, F#4, A4, C#5)
      [220.0, 277.18, 370.0, 440.0, 493.88],   // A6 (A3, C#4, F#4, A4, B4)
    ],
    instrument: "flute",
    intervalMs: 4600,
    noteDelayMs: 220,
    attackSec: 0.2,
    decaySec: 4.0,
  },
};

/**
 * Professional Web Audio Engine for Relaxation Music Therapy
 * Supports dual independent channels (Music & Ambient), 2s crossfading,
 * distinct procedural synthesis for each track, random ambient event system, and UI SFX.
 */
export class MusicAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  public analyserNode: AnalyserNode | null = null;

  private musicVolume = 0.75;
  private ambientVolume = 0.5;

  private currentTrackId = "peaceful_piano";
  private currentTrackCategory: MusicCategory = "mountain";
  private isPlayingMusic = false;

  private musicTimer: any = null;
  private ambientTimer: any = null;
  private noiseNode: AudioNode | null = null;

  private lastAmbientIndex = -1;
  private chordIndex = 0;

  constructor() {
    // Load persisted settings
    const savedMusicVol = localStorage.getItem("music_vol");
    const savedAmbientVol = localStorage.getItem("ambient_vol");
    if (savedMusicVol !== null) this.musicVolume = parseFloat(savedMusicVol);
    if (savedAmbientVol !== null) this.ambientVolume = parseFloat(savedAmbientVol);
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Channels
        this.musicGain = this.ctx.createGain();
        this.ambientGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        // Analyser for visualizer
        this.analyserNode = this.ctx.createAnalyser();
        this.analyserNode.fftSize = 64;

        // Set initial volumes
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        // Routing
        this.musicGain.connect(this.analyserNode);
        this.analyserNode.connect(this.ctx.destination);

        this.ambientGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // ===== VOLUMES =====

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem("music_vol", this.musicVolume.toString());
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, this.ctx.currentTime + 0.1);
    }
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem("ambient_vol", this.ambientVolume.toString());
    if (this.ctx && this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(this.ambientVolume, this.ctx.currentTime + 0.1);
    }
  }

  public getMusicVolume() {
    return this.musicVolume;
  }

  public getAmbientVolume() {
    return this.ambientVolume;
  }

  // ===== UI SFX (Gentle Wooden Click / Water Drop) =====

  public playUiClick() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // ===== MUSIC PLAYER ENGINE =====

  public playMusicTrack(trackId: string, category: MusicCategory) {
    this.init();
    if (!this.ctx || !this.musicGain) return;

    this.currentTrackId = trackId;
    this.currentTrackCategory = category;
    this.isPlayingMusic = true;
    this.chordIndex = 0;

    // Crossfade: Fade out old synth if any, start new
    this.stopMusic(2.0);

    setTimeout(() => {
      if (!this.isPlayingMusic) return;
      this.startProceduralBGM(trackId, category);
      this.startAmbientChannel(category);
    }, 200);
  }

  public pauseMusic() {
    this.isPlayingMusic = false;
    this.stopMusic(1.5);
    this.stopAmbientChannel();
  }

  public resumeMusic() {
    if (!this.isPlayingMusic) {
      this.playMusicTrack(this.currentTrackId, this.currentTrackCategory);
    }
  }

  private stopMusic(fadeDuration = 2.0) {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    // Fade out current active nodes smoothly
    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        if (this.musicGain && this.ctx && this.isPlayingMusic) {
          this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, this.ctx.currentTime + 1.0);
        }
      }, fadeDuration * 1000);
    }
  }

  private startProceduralBGM(trackId: string, _category: MusicCategory) {
    if (!this.ctx || !this.musicGain) return;

    const profile = TRACK_PROFILES[trackId] || TRACK_PROFILES.peaceful_piano;
    this.chordIndex = 0;

    const playChord = () => {
      if (!this.isPlayingMusic || !this.ctx || !this.musicGain) return;
      try {
        // Sequential chord progression for musical harmony
        const chord = profile.chords[this.chordIndex % profile.chords.length];
        this.chordIndex++;

        chord.forEach((freq, i) => {
          setTimeout(() => {
            if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;
            try {
              const osc = this.ctx.createOscillator();
              const noteGain = this.ctx.createGain();
              const now = this.ctx.currentTime;

              // Instrument timbre selection
              if (profile.instrument === "marimba" || profile.instrument === "kalimba") {
                osc.type = "triangle";
              } else if (profile.instrument === "lofi_rhodes") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq * 0.997, now); // subtle warm lo-fi detune
              } else if (profile.instrument === "flute" || profile.instrument === "glass") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now);
              } else if (profile.instrument === "pad") {
                osc.type = "sine";
                // Add sub-oscillator harmonic for deep oceanic swell
                const subOsc = this.ctx.createOscillator();
                subOsc.type = "triangle";
                subOsc.frequency.setValueAtTime(freq * 0.5, now);
                subOsc.connect(noteGain);
                subOsc.start(now);
                subOsc.stop(now + profile.decaySec + 0.5);
              } else {
                osc.type = "sine";
              }

              osc.frequency.setValueAtTime(freq, now);

              // Envelope Attack & Decay custom per track
              noteGain.gain.setValueAtTime(0.0001, now);
              noteGain.gain.linearRampToValueAtTime(0.04, now + profile.attackSec);
              noteGain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decaySec);

              osc.connect(noteGain);
              noteGain.connect(this.musicGain);

              osc.start(now);
              osc.stop(now + profile.decaySec + 0.2);
            } catch (e) {}
          }, i * profile.noteDelayMs);
        });
      } catch (e) {}
    };

    playChord();
    this.musicTimer = setInterval(playChord, profile.intervalMs);
  }

  // ===== DYNAMIC AMBIENT AUDIO SYSTEM (Independent Channel) =====

  public startAmbientChannel(category: MusicCategory) {
    this.stopAmbientChannel();
    if (!this.ctx || !this.ambientGain) return;

    this.currentTrackCategory = category;

    // Background continuous noise (e.g. ocean waves, rain rumble, waterfall flow)
    this.playContinuousAmbientNoise(category);

    // Random discrete ambient event system every 20-40s
    this.scheduleNextRandomAmbientEvent(category);
  }

  public stopAmbientChannel() {
    if (this.noiseNode) {
      try { (this.noiseNode as any).stop(); } catch (e) {}
      this.noiseNode = null;
    }
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  private playContinuousAmbientNoise(category: MusicCategory) {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";

      const freqMap: Record<MusicCategory, number> = {
        ocean: 260,
        rain: 450,
        waterfall: 550,
        forest: 320,
        mountain: 200,
      };

      filter.frequency.setValueAtTime(freqMap[category] || 300, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      // Smooth 2s Fade In for ambient background
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.018, this.ctx.currentTime + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      noise.start();
      this.noiseNode = noise;
    } catch (e) {}
  }

  private scheduleNextRandomAmbientEvent(category: MusicCategory) {
    const delay = 20000 + Math.random() * 20000; // 20s to 40s
    this.ambientTimer = setTimeout(() => {
      if (this.isPlayingMusic) {
        this.triggerRandomAmbientSound(category);
      }
      this.scheduleNextRandomAmbientEvent(category);
    }, delay);
  }

  private triggerRandomAmbientSound(category: MusicCategory) {
    if (!this.ctx || !this.ambientGain) return;

    // Pick random index avoiding direct repeat
    let soundIdx = Math.floor(Math.random() * 3);
    if (soundIdx === this.lastAmbientIndex) {
      soundIdx = (soundIdx + 1) % 3;
    }
    this.lastAmbientIndex = soundIdx;

    try {
      const now = this.ctx.currentTime;
      if (category === "ocean") {
        if (soundIdx === 0) {
          // Soft Seagull call
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.linearRampToValueAtTime(1100, now + 0.3);
          g.gain.setValueAtTime(0.015, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          osc.connect(g); g.connect(this.ambientGain);
          osc.start(now); osc.stop(now + 0.4);
        } else if (soundIdx === 1) {
          // Tiny Bubbles
          for (let b = 0; b < 3; b++) {
            setTimeout(() => {
              if (!this.ctx || !this.ambientGain) return;
              const osc = this.ctx.createOscillator();
              const g = this.ctx.createGain();
              const t = this.ctx.currentTime;
              osc.type = "sine";
              osc.frequency.setValueAtTime(500 + b * 150, t);
              osc.frequency.exponentialRampToValueAtTime(950 + b * 100, t + 0.08);
              g.gain.setValueAtTime(0.02, t);
              g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
              osc.connect(g); g.connect(this.ambientGain);
              osc.start(t); osc.stop(t + 0.1);
            }, b * 90);
          }
        } else {
          // Soft Whale Call
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(240, now + 1.2);
          osc.frequency.linearRampToValueAtTime(110, now + 2.5);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.035, now + 0.5);
          g.gain.linearRampToValueAtTime(0.0001, now + 2.8);
          osc.connect(g); g.connect(this.ambientGain);
          osc.start(now); osc.stop(now + 3.0);
        }
      } else if (category === "forest") {
        // Soft Bird Songs / Leaves
        const birdNotes = [880, 1046.5, 1318.5, 1567.98];
        birdNotes.forEach((f, i) => {
          setTimeout(() => {
            if (!this.ctx || !this.ambientGain) return;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            const t = this.ctx.currentTime;
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.015, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
            osc.connect(g); g.connect(this.ambientGain);
            osc.start(t); osc.stop(t + 0.3);
          }, i * 110);
        });
      } else if (category === "rain") {
        // Soft Water Drips
        for (let d = 0; d < 4; d++) {
          setTimeout(() => {
            if (!this.ctx || !this.ambientGain) return;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            const t = this.ctx.currentTime;
            osc.type = "sine";
            osc.frequency.setValueAtTime(1200 + Math.random() * 400, t);
            g.gain.setValueAtTime(0.018, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
            osc.connect(g); g.connect(this.ambientGain);
            osc.start(t); osc.stop(t + 0.09);
          }, d * 150);
        }
      } else {
        // Soft Wind Gust / Distant Chime
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.02, now + 0.4);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(g); g.connect(this.ambientGain);
        osc.start(now); osc.stop(now + 2.0);
      }
    } catch (e) {}
  }
}

export const musicAudio = new MusicAudioEngine();
