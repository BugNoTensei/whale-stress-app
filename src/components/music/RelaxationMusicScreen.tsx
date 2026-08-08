import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  Settings as SettingsIcon,
  Wind,
  Sparkles,
  Waves,
  Trees,
  CloudRain,
  Mountain,
} from "lucide-react";
import { musicAudio } from "../../utils/musicAudioEngine";
import { preferenceManager } from "../../utils/preferenceManager";
import { MusicSettingsModal } from "./MusicSettingsModal";
import { ToastNotification, ToastItem } from "../ui/ToastNotification";
import { StressFloatingWidget } from "../ui/StressFloatingWidget";
import { WhaleSharkIcon } from "../ui/WhaleSharkIcon";

// ─────────────── TYPES ───────────────
export type MusicCategory =
  | "ocean"
  | "forest"
  | "rain"
  | "mountain"
  | "waterfall";

export interface MusicTrack {
  id: string;
  title: string;
  subtitle: string;
  category: MusicCategory;
  duration: number; // seconds
  color: string; // accent color
}

// ─────────────── DATA ───────────────
export const TRACKS: MusicTrack[] = [
  {
    id: "peaceful_piano",
    title: "Peaceful Piano",
    subtitle: "Soft Piano Instrumental",
    category: "mountain",
    duration: 900,
    color: "#5b8bf1",
  },
  {
    id: "forest_walk",
    title: "Forest Walk",
    subtitle: "Nature Sound",
    category: "forest",
    duration: 1200,
    color: "#48bb78",
  },
  {
    id: "ocean_waves",
    title: "Ocean Waves",
    subtitle: "Nature Sound",
    category: "ocean",
    duration: 1110,
    color: "#38bdf8",
  },
  {
    id: "rainy_day",
    title: "Rainy Day",
    subtitle: "Rain Sound",
    category: "rain",
    duration: 1800,
    color: "#7c86ab",
  },
  {
    id: "morning_mist",
    title: "Morning Mist",
    subtitle: "Piano",
    category: "mountain",
    duration: 1005,
    color: "#a78bfa",
  },
  {
    id: "waterfall",
    title: "Waterfall",
    subtitle: "Nature Sound",
    category: "waterfall",
    duration: 1500,
    color: "#34d399",
  },
  {
    id: "deep_forest",
    title: "Deep Forest",
    subtitle: "Nature Sound",
    category: "forest",
    duration: 960,
    color: "#86efac",
  },
  {
    id: "gentle_rain",
    title: "Gentle Rain",
    subtitle: "Rain Sound",
    category: "rain",
    duration: 2100,
    color: "#94a3b8",
  },
  {
    id: "ocean_breeze",
    title: "Ocean Breeze",
    subtitle: "Nature Sound",
    category: "ocean",
    duration: 1380,
    color: "#22d3ee",
  },
];

const CATEGORY_FILTER: { id: "all" | MusicCategory; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "ทั้งหมด", icon: <Music size={13} /> },
  { id: "ocean", label: "คลื่นทะเล", icon: <Waves size={13} /> },
  { id: "forest", label: "ป่าไม้", icon: <Trees size={13} /> },
  { id: "rain", label: "สายฝน", icon: <CloudRain size={13} /> },
  { id: "mountain", label: "ภูเขา", icon: <Mountain size={13} /> },
  { id: "waterfall", label: "น้ำตก", icon: <Sparkles size={13} /> },
];

const SCENE_GRADIENTS: Record<
  MusicCategory,
  { bg: string; sky: string; accent: string }
> = {
  ocean: {
    bg: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 35%, #164e63 70%, #0f3460 100%)",
    sky: "#0ea5e9",
    accent: "#38bdf8",
  },
  forest: {
    bg: "linear-gradient(180deg, #4ade80 0%, #16a34a 30%, #14532d 70%, #052e16 100%)",
    sky: "#4ade80",
    accent: "#86efac",
  },
  rain: {
    bg: "linear-gradient(180deg, #64748b 0%, #334155 35%, #1e293b 70%, #0f172a 100%)",
    sky: "#64748b",
    accent: "#cbd5e1",
  },
  mountain: {
    bg: "linear-gradient(180deg, #818cf8 0%, #4f46e5 35%, #312e81 70%, #1e1b4b 100%)",
    sky: "#818cf8",
    accent: "#a5b4fc",
  },
  waterfall: {
    bg: "linear-gradient(180deg, #2dd4bf 0%, #0d9488 35%, #115e59 70%, #042f2e 100%)",
    sky: "#2dd4bf",
    accent: "#5eead4",
  },
};

interface RelaxationMusicScreenProps {
  onBackToHome: () => void;
}

export default function RelaxationMusicScreen({
  onBackToHome,
}: RelaxationMusicScreenProps) {
  // Player state
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(() => {
    const lastId = localStorage.getItem("last_track_id");
    const found = TRACKS.find((t) => t.id === lastId);
    return found || TRACKS[0];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("fav_tracks");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [categoryFilter, setCategoryFilter] = useState<"all" | MusicCategory>("all");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, icon?: string) => {
    const id = "toast_" + Math.random();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Stop music audio engine when leaving / unmounting RelaxationMusicScreen
  useEffect(() => {
    return () => {
      musicAudio.pauseMusic();
    };
  }, []);

  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [particleDensity, setParticleDensity] = useState(() => preferenceManager.getPreferences().particleDensity);

  // Subscribe to Preference Changes
  useEffect(() => {
    const unsub = preferenceManager.subscribe((prefs) => {
      setParticleDensity(prefs.particleDensity);
    });
    return unsub;
  }, []);

  // Ambient Particles Canvas Loop (Driven dynamically by particleDensity setting)
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const count = particleDensity === "low" ? 15 : particleDensity === "medium" ? 40 : 85;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * (window.innerWidth || 800),
      y: Math.random() * (window.innerHeight || 600),
      r: Math.random() * 3 + 1,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [particleDensity]);

  // Timer for track progress elapsed calculation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= currentTrack.duration) {
            if (isRepeat) {
              return 0;
            } else {
              handleNextTrack();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack.duration, isRepeat, isShuffle]);

  const handleSelectTrack = (track: MusicTrack) => {
    musicAudio.playUiClick();
    setCurrentTrack(track);
    setElapsed(0);
    setIsPlaying(true);
    musicAudio.playMusicTrack(track.id, track.category);
  };

  const handleTogglePlay = () => {
    musicAudio.playUiClick();
    if (isPlaying) {
      musicAudio.pauseMusic();
      setIsPlaying(false);
    } else {
      musicAudio.playMusicTrack(currentTrack.id, currentTrack.category);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    musicAudio.playUiClick();
    const filtered = categoryFilter === "all" ? TRACKS : TRACKS.filter((t) => t.category === categoryFilter);
    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * filtered.length);
      handleSelectTrack(filtered[randIdx]);
    } else {
      const idx = filtered.findIndex((t) => t.id === currentTrack.id);
      const nextIdx = (idx + 1) % filtered.length;
      handleSelectTrack(filtered[nextIdx]);
    }
  };

  const handlePrevTrack = () => {
    musicAudio.playUiClick();
    const filtered = categoryFilter === "all" ? TRACKS : TRACKS.filter((t) => t.category === categoryFilter);
    const idx = filtered.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + filtered.length) % filtered.length;
    handleSelectTrack(filtered[prevIdx]);
  };

  const toggleFavorite = (trackId: string) => {
    musicAudio.playUiClick();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        addToast("ลบออกจากรายการโปรดแล้ว");
      } else {
        next.add(trackId);
        addToast("เพิ่มเข้าคลังรายการโปรดเรียบร้อย");
      }
      localStorage.setItem("fav_tracks", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sceneGrad = SCENE_GRADIENTS[currentTrack.category];
  const filteredTracks = categoryFilter === "all" ? TRACKS : TRACKS.filter((t) => t.category === categoryFilter);
  const progressRatio = Math.min(1, elapsed / currentTrack.duration);

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none flex flex-col justify-between p-4"
      style={{
        background: sceneGrad.bg,
        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
      }}
    >
      <ToastNotification toasts={toasts} onDismiss={() => {}} />

      {/* Dynamic Ambient Particle Background (Driven by particleDensity setting) */}
      <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* ────────── 1. CLEAN DECLUTTERED TOP BAR ────────── */}
      <header className="flex items-center justify-between z-20 shrink-0 mb-3 px-2">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              musicAudio.playUiClick();
              musicAudio.pauseMusic();
              setIsPlaying(false);
              onBackToHome();
            }}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition text-xs font-bold cursor-pointer shadow-xs"
          >
            <ChevronLeft size={16} />
            <span>กลับหน้าหลัก</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-white leading-none tracking-wide">
              Relaxation Music Therapy
            </h1>
            <WhaleSharkIcon className="w-5 h-3.5 inline-block opacity-90" />
          </div>
        </div>

        {/* Top Right: Single Clean Settings Button */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              musicAudio.playUiClick();
              setShowSettingsModal(true);
            }}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition cursor-pointer shadow-xs"
            title="การตั้งค่าเสียงและธีม"
          >
            <SettingsIcon size={15} />
          </motion.button>
        </div>
      </header>

      {/* ────────── 2. MAIN LANDSCAPE CONTENT (2-COLUMN SPLIT) ────────── */}
      <div className="flex-1 flex gap-4 min-h-0 z-10 px-2">
        {/* ── LEFT COLUMN: HERO MUSIC PLAYER (Spacious Padding & Clean Layout) ── */}
        <div className="flex-1 bg-black/25 backdrop-blur-xl border border-white/15 rounded-3xl px-6 py-5 flex flex-col justify-between min-w-0 shadow-2xl relative overflow-hidden">
          {/* Top Artwork & Track Info (Properly Space-Padded) */}
          <div className="flex flex-col items-center justify-center relative my-auto py-1">
            {/* Glowing Disk Halo (Rhythm Synced & Comfortably Padded) */}
            <motion.div
              animate={{
                rotate: isPlaying ? 360 : 0,
                scale: isPlaying ? [1, 1.05, 1] : 1,
              }}
              transition={{
                rotate: { duration: 35, repeat: Infinity, ease: "linear" },
                scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-white/30 p-2 flex items-center justify-center relative shadow-[0_0_35px_rgba(255,255,255,0.2)] shrink-0 my-1"
              style={{
                background: `radial-gradient(circle, ${sceneGrad.accent}44 0%, transparent 70%)`,
              }}
            >
              <div className="w-full h-full rounded-full bg-slate-900/70 border border-white/20 flex items-center justify-center p-3 shadow-inner">
                <Music size={30} className="text-white/90" />
              </div>
            </motion.div>

            {/* Track Info */}
            <div className="text-center mt-2">
              <h2 className="text-base md:text-lg font-black text-white tracking-tight drop-shadow-sm">
                {currentTrack.title}
              </h2>
              <p className="text-xs text-white/70 font-medium mt-0.5">
                {currentTrack.subtitle}
              </p>
            </div>
          </div>

          {/* Player Progress Seekbar & Controls */}
          <div className="w-full space-y-3 pt-2 border-t border-white/10">
            {/* Progress Slider Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/60 font-semibold font-mono">
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Main Playback Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRepeat((r) => !r)}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isRepeat ? "text-sky-300 bg-white/20" : "text-white/50 hover:text-white"
                  }`}
                  title="เล่นซ้ำ"
                >
                  <Repeat size={16} />
                </button>
                <button
                  onClick={() => setIsShuffle((s) => !s)}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isShuffle ? "text-sky-300 bg-white/20" : "text-white/50 hover:text-white"
                  }`}
                  title="สุ่มเพลง"
                >
                  <Shuffle size={16} />
                </button>
              </div>

              {/* Prev / Play / Next */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevTrack}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <SkipBack size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleTogglePlay}
                  className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  {isPlaying ? <Pause size={22} className="fill-slate-900" /> : <Play size={22} className="fill-slate-900 ml-0.5" />}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextTrack}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <SkipForward size={18} />
                </motion.button>
              </div>

              {/* Mute & Favorite */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (!isMuted) {
                      musicAudio.setMusicVolume(0);
                    } else {
                      musicAudio.setMusicVolume(0.5);
                    }
                  }}
                  className="p-2 rounded-full text-white/70 hover:text-white transition cursor-pointer"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className="p-2 rounded-full text-white/70 hover:text-pink-400 transition cursor-pointer"
                >
                  <Heart
                    size={16}
                    className={favorites.has(currentTrack.id) ? "fill-pink-400 text-pink-400" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Draggable Stress Floating Widget */}
            <StressFloatingWidget statusText="กำลังลดลง" storageKey="widget-pos-music" />
          </div>
        </div>

        {/* ── RIGHT COLUMN: SOUNDSCAPE LIBRARY LIST ── */}
        <div className="w-80 bg-black/25 backdrop-blur-xl border border-white/15 rounded-3xl p-4 flex flex-col shrink-0 min-h-0 shadow-2xl">
          <div className="text-xs font-extrabold text-white/90 uppercase tracking-wider mb-2.5 px-1 flex items-center justify-between">
            <span>คลังเสียงผ่อนคลาย (Soundscapes)</span>
            <span className="text-[10px] text-white/60 font-medium">{filteredTracks.length} เสียง</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
            {CATEGORY_FILTER.map((cat) => {
              const active = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    musicAudio.playUiClick();
                    setCategoryFilter(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer border ${
                    active
                      ? "bg-white text-slate-900 border-white shadow-xs"
                      : "bg-white/10 hover:bg-white/20 text-white/80 border-white/15"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Track Cards List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredTracks.map((track) => {
              const isSelected = currentTrack.id === track.id;
              return (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectTrack(track)}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-white/25 border-white/40 shadow-md text-white"
                      : "bg-white/5 hover:bg-white/15 border-white/10 text-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs border border-white/20"
                      style={{ backgroundColor: track.color + "55" }}
                    >
                      {isSelected && isPlaying ? (
                        <Volume2 size={16} className="text-white animate-pulse" />
                      ) : (
                        <Music size={16} />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>{track.title}</span>
                        {isSelected && isPlaying && (
                          <span className="text-[9px] font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                            PLAYING
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/60 font-medium mt-0.5">
                        {track.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-white/60 font-bold">
                    {formatTime(track.duration)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ────────── 3. BOTTOM FOOTER HINT ────────── */}
      <footer className="flex items-center justify-between px-3 pt-2.5 z-20 shrink-0 border-t border-white/10 text-[11px] text-white/70 font-medium">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-300 animate-pulse" />
          <span>ฝึกหายใจเข้า-ออกลึกๆ เพื่อผ่อนคลายระดับลึกและปรับคลื่นสมอง Alpha Wave</span>
        </div>

        <button
          onClick={() => {
            musicAudio.playUiClick();
            setShowBreathing((v) => !v);
          }}
          className={`px-3 py-1 rounded-full border transition flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
            showBreathing
              ? "bg-white text-slate-900 border-white"
              : "bg-white/15 hover:bg-white/25 border-white/20 text-white"
          }`}
        >
          <Wind size={13} />
          <span>{showBreathing ? "ปิดคำแนะนำหายใจ" : "ฝึกหายใจ 4-7-8"}</span>
        </button>
      </footer>

      {/* Settings Modal */}
      <MusicSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onToast={addToast}
      />
    </div>
  );
}
