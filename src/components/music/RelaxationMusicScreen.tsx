import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Timer,
  Music2,
  HelpCircle,
  ListMusic,
  Library,
  Settings as SettingsIcon,
  BarChart2,
  Info,
} from "lucide-react";
import { musicAudio } from "../../utils/musicAudioEngine";
import { MusicLibraryModal } from "./MusicLibraryModal";
import { MusicSettingsModal } from "./MusicSettingsModal";
import { AboutModal } from "../info/AboutModal";
import { HelpModal } from "../info/HelpModal";
import { StatsModal } from "../stats/StatsModal";
import { ToastNotification, ToastItem } from "../ui/ToastNotification";
import { StressFloatingWidget } from "../ui/StressFloatingWidget";

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

const CATEGORY_FILTER: { id: "all" | MusicCategory; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "ocean", label: "คลื่นทะเล" },
  { id: "forest", label: "ป่าไม้" },
  { id: "rain", label: "ฝน" },
  { id: "mountain", label: "ภูเขา" },
  { id: "waterfall", label: "น้ำตก" },
];

const RELAXATION_STATUSES = [
  { icon: "😊", text: "กำลังผ่อนคลาย" },
  { icon: "🌿", text: "พักผ่อนอย่างสงบ" },
  { icon: "🌊", text: "เพลิดเพลินกับธรรมชาติ" },
  { icon: "💙", text: "สงบและสบายใจ" },
  { icon: "🍃", text: "พักผ่อนจิตใจ" },
  { icon: "☁️", text: "ผ่อนคลายกับดนตรี" },
];

const PEACE_MESSAGES = [
  "🌿 หายใจเข้าลึกๆ แล้วปล่อยออกช้าๆ",
  "🌊 คลายไหล่ของคุณลง",
  "🍃 เพลิดเพลินกับช่วงเวลาแห่งความสงบ",
  "💙 ให้ใจของคุณได้พักผ่อน",
  "☁️ ชะลอลง และหายใจ",
  "✨ ทุกช่วงเวลาแห่งความสงบ มีความหมาย",
  "🌟 คุณกำลังดูแลตัวเองอย่างดี",
];

const DAILY_QUOTES = [
  '"ธรรมชาติรักษาจิตใจ"',
  '"หายใจทีละครั้ง ไปทีละก้าว"',
  '"ช่วงเวลาสงบเล็กๆ สร้างความแตกต่างอันยิ่งใหญ่"',
  '"มหาสมุทรสอนให้เราชะลอลง"',
  '"ความสงบอยู่ภายในตัวคุณเสมอ"',
  '"ปล่อยให้เสียงธรรมชาติพาใจคุณกลับบ้าน"',
];

const SLEEP_TIMER_OPTIONS = [
  { label: "10 นาที", minutes: 10 },
  { label: "20 นาที", minutes: 20 },
  { label: "30 นาที", minutes: 30 },
  { label: "45 นาที", minutes: 45 },
  { label: "60 นาที", minutes: 60 },
];

// ─────────────── BACKGROUND SCENE GRADIENTS ───────────────
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
    bg: "linear-gradient(180deg, #475569 0%, #334155 35%, #1e293b 70%, #0f172a 100%)",
    sky: "#64748b",
    accent: "#94a3b8",
  },
  mountain: {
    bg: "linear-gradient(180deg, #7dd3fc 0%, #38bdf8 25%, #1e40af 60%, #1e3a5f 100%)",
    sky: "#7dd3fc",
    accent: "#5b8bf1",
  },
  waterfall: {
    bg: "linear-gradient(180deg, #6ee7b7 0%, #10b981 30%, #065f46 70%, #022c22 100%)",
    sky: "#6ee7b7",
    accent: "#34d399",
  },
};

// ─────────────── CANVAS SCENE RENDERER ───────────────
function drawScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  category: MusicCategory,
  t: number,
  particles: any[],
) {
  ctx.clearRect(0, 0, W, H);

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  switch (category) {
    case "ocean":
      skyGrad.addColorStop(0, "#0f4c81");
      skyGrad.addColorStop(0.4, "#1a6fb3");
      skyGrad.addColorStop(0.65, "#1e8bc3");
      skyGrad.addColorStop(1, "#0a2540");
      break;
    case "forest":
      skyGrad.addColorStop(0, "#1a5c2e");
      skyGrad.addColorStop(0.3, "#2d7a40");
      skyGrad.addColorStop(0.6, "#1e4d28");
      skyGrad.addColorStop(1, "#0a1f10");
      break;
    case "rain":
      skyGrad.addColorStop(0, "#1e293b");
      skyGrad.addColorStop(0.5, "#334155");
      skyGrad.addColorStop(1, "#0f172a");
      break;
    case "mountain":
      skyGrad.addColorStop(0, "#0c2a54");
      skyGrad.addColorStop(0.3, "#1a4a8a");
      skyGrad.addColorStop(0.6, "#6fa8dc");
      skyGrad.addColorStop(1, "#2c5f8a");
      break;
    case "waterfall":
      skyGrad.addColorStop(0, "#064e3b");
      skyGrad.addColorStop(0.4, "#0f766e");
      skyGrad.addColorStop(1, "#022c22");
      break;
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Scene-specific elements ──
  if (category === "ocean") {
    drawOceanScene(ctx, W, H, t, particles);
  } else if (category === "forest") {
    drawForestScene(ctx, W, H, t, particles);
  } else if (category === "rain") {
    drawRainScene(ctx, W, H, t, particles);
  } else if (category === "mountain") {
    drawMountainScene(ctx, W, H, t, particles);
  } else if (category === "waterfall") {
    drawWaterfallScene(ctx, W, H, t, particles);
  }
}

function drawOceanScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  particles: any[],
) {
  // Sun rays
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const rx = W * 0.62 + Math.sin(t * 0.2 + i) * 15;
    const alpha = Math.sin(t * 0.3 + i * 1.3) * 0.03 + 0.07;
    const rg = ctx.createLinearGradient(rx, 0, rx + 60, H * 0.6);
    rg.addColorStop(0, `rgba(255,220,100,${alpha * 2})`);
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.moveTo(rx - 20, 0);
    ctx.lineTo(rx + 40, 0);
    ctx.lineTo(rx + 120, H * 0.6);
    ctx.lineTo(rx + 60, H * 0.6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Horizon glow
  const horizGrad = ctx.createLinearGradient(0, H * 0.38, 0, H * 0.55);
  horizGrad.addColorStop(0, "rgba(255,220,100,0.18)");
  horizGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = horizGrad;
  ctx.fillRect(0, H * 0.38, W, H * 0.17);

  // Ocean water
  const waterY = H * 0.52;
  const waterGrad = ctx.createLinearGradient(0, waterY, 0, H);
  waterGrad.addColorStop(0, "#0369a1");
  waterGrad.addColorStop(0.3, "#0284c7");
  waterGrad.addColorStop(1, "#0a2540");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterY, W, H - waterY);

  // Waves
  for (let w = 0; w < 5; w++) {
    const wy = waterY + (w * (H - waterY)) / 5;
    const alpha = 0.18 - w * 0.025;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) {
      const y =
        wy +
        Math.sin((x / W) * Math.PI * 4 + t * (0.6 + w * 0.1)) * (3 + w * 0.6);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Floating bubbles
  particles
    .filter((p) => p.type === "bubble")
    .forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      const bg = ctx.createRadialGradient(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        0.5,
        p.x,
        p.y,
        p.r,
      );
      bg.addColorStop(0, "rgba(255,255,255,0.8)");
      bg.addColorStop(1, "rgba(180,220,255,0.15)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.restore();
    });

  // Small fish
  particles
    .filter((p) => p.type === "fish")
    .forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.alpha;
      const dir = p.vx >= 0 ? 1 : -1;
      ctx.scale(dir, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      const tw = Math.sin(t * 3 + p.phase) * 2.5;
      ctx.beginPath();
      ctx.moveTo(-p.r * 0.7, 0);
      ctx.lineTo(-p.r * 1.5, -p.r * 0.4 + tw);
      ctx.lineTo(-p.r * 1.5, p.r * 0.4 + tw);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
}

function drawForestScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  particles: any[],
) {
  // Ground
  const groundGrad = ctx.createLinearGradient(0, H * 0.55, 0, H);
  groundGrad.addColorStop(0, "#1a472a");
  groundGrad.addColorStop(1, "#0a1f10");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);

  // Trees (layered silhouettes)
  const treeLayers = [
    { y: H * 0.6, color: "rgba(5,46,22,0.9)", scale: 1 },
    { y: H * 0.52, color: "rgba(20,83,45,0.8)", scale: 0.85 },
    { y: H * 0.46, color: "rgba(22,101,52,0.7)", scale: 0.7 },
  ];
  treeLayers.forEach((layer) => {
    const sway = Math.sin(t * 0.5 + layer.scale * 2) * (layer.scale * 4);
    for (let i = 0; i < 7; i++) {
      const tx = (i / 7) * W + Math.sin(i * 1.7) * 25;
      const th = (H - layer.y) * 0.8 * layer.scale;
      const tw = th * 0.55;
      ctx.save();
      ctx.translate(tx + sway, layer.y);
      ctx.globalAlpha = 1;
      ctx.fillStyle = layer.color;
      ctx.beginPath();
      ctx.moveTo(0, -th);
      ctx.lineTo(tw / 2, 0);
      ctx.lineTo(-tw / 2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  });

  // Floating dust/pollen
  particles
    .filter((p) => p.type === "dust")
    .forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = "rgba(255,250,220,0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

  // Butterflies
  particles
    .filter((p) => p.type === "butterfly")
    .forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.alpha;
      const flap = Math.sin(t * 4 + p.phase);
      ctx.fillStyle = p.color;
      [
        [1, -1],
        [-1, -1],
      ].forEach(([sx, sy]) => {
        ctx.save();
        ctx.scale(sx, sy);
        ctx.beginPath();
        ctx.ellipse(
          p.r * 0.8,
          0,
          p.r * 0.9,
          p.r * 0.55 * (0.5 + Math.abs(flap) * 0.5),
          Math.PI / 4,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
    });
}

function drawRainScene(
  ctx: CanvasRenderingContext2D,
  _W: number,
  _H: number,
  _t: number,
  particles: any[],
) {
  // Raindrops
  particles
    .filter((p) => p.type === "raindrop")
    .forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 0.4, p.y + p.vy * 0.4);
      ctx.stroke();
      ctx.restore();
    });

  // Puddle ripples
  particles
    .filter((p) => p.type === "ripple")
    .forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = "#bfdbfe";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
}

function drawMountainScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  _t: number,
  particles: any[],
) {
  // Moving clouds
  particles
    .filter((p) => p.type === "cloud")
    .forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.6})`;
      const cr = p.r;
      ctx.beginPath();
      ctx.arc(0, 0, cr * 0.7, 0, Math.PI * 2);
      ctx.arc(cr * 0.7, -cr * 0.2, cr * 0.5, 0, Math.PI * 2);
      ctx.arc(-cr * 0.7, -cr * 0.1, cr * 0.45, 0, Math.PI * 2);
      ctx.arc(0, -cr * 0.45, cr * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

  // Mountain silhouettes
  const mtColors = [
    "rgba(10,25,60,0.9)",
    "rgba(20,40,80,0.75)",
    "rgba(30,55,100,0.6)",
  ];
  [
    [0, 1],
    [0.2, 0.85],
    [-0.1, 0.9],
  ].forEach(([ox, peak], i) => {
    ctx.fillStyle = mtColors[i];
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(W * 0.2 + ox * W, H * peak);
    ctx.lineTo(W * 0.5 + ox * W, H);
    ctx.closePath();
    ctx.fill();
  });
}

function drawWaterfallScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  _t: number,
  particles: any[],
) {
  // Waterfall streams
  for (let s = 0; s < 4; s++) {
    const sx = W * 0.3 + s * W * 0.12;
    const wg = ctx.createLinearGradient(sx, 0, sx, H * 0.7);
    wg.addColorStop(0, "rgba(147,220,255,0.4)");
    wg.addColorStop(1, "rgba(100,200,255,0.1)");
    ctx.fillStyle = wg;
    ctx.fillRect(sx - 4, 0, 8, H * 0.65);
  }

  // Mist particles
  particles
    .filter((p) => p.type === "mist")
    .forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      const mg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      mg.addColorStop(0, "rgba(200,240,255,0.45)");
      mg.addColorStop(1, "rgba(200,240,255,0)");
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
}

// ─────────────── PARTICLE SYSTEM ───────────────
function initParticles(category: MusicCategory, W: number, H: number): any[] {
  const ps: any[] = [];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  if (category === "ocean") {
    for (let i = 0; i < 15; i++)
      ps.push({
        type: "bubble",
        x: rand(0, W),
        y: rand(H * 0.55, H),
        r: rand(2.5, 7),
        vy: rand(0.25, 0.55),
        phase: rand(0, 6),
        alpha: rand(0.3, 0.6),
        id: i,
      });
    for (let i = 0; i < 8; i++)
      ps.push({
        type: "fish",
        x: rand(0, W),
        y: rand(H * 0.55, H * 0.88),
        r: rand(6, 12),
        vx: (Math.random() > 0.5 ? 1 : -1) * rand(0.35, 0.7),
        vy: 0,
        phase: rand(0, 6),
        alpha: rand(0.55, 0.8),
        color: ["#fbbf24", "#38bdf8", "#f472b6", "#4ade80"][i % 4],
        id: i,
      });
  } else if (category === "forest") {
    for (let i = 0; i < 25; i++)
      ps.push({
        type: "dust",
        x: rand(0, W),
        y: rand(0, H * 0.7),
        r: rand(0.8, 2.2),
        vx: rand(-0.08, 0.08),
        vy: rand(-0.12, -0.04),
        phase: rand(0, 6),
        alpha: rand(0.15, 0.4),
        id: i,
      });
    for (let i = 0; i < 4; i++)
      ps.push({
        type: "butterfly",
        x: rand(W * 0.1, W * 0.9),
        y: rand(H * 0.2, H * 0.7),
        r: rand(7, 12),
        vx: rand(0.18, 0.4),
        vy: rand(-0.08, 0.08),
        phase: rand(0, 6),
        alpha: rand(0.5, 0.8),
        color: ["#f472b6", "#fb923c", "#a78bfa", "#4ade80"][i],
        id: i,
      });
  } else if (category === "rain") {
    for (let i = 0; i < 80; i++)
      ps.push({
        type: "raindrop",
        x: rand(0, W),
        y: rand(-H * 0.2, H),
        vx: rand(-0.5, -0.2),
        vy: rand(5, 9),
        alpha: rand(0.3, 0.6),
        r: rand(5, 15),
        id: i,
      });
    for (let i = 0; i < 10; i++)
      ps.push({
        type: "ripple",
        x: rand(W * 0.05, W * 0.95),
        y: rand(H * 0.55, H * 0.88),
        r: rand(2, 5),
        maxR: rand(18, 35),
        alpha: rand(0.3, 0.6),
        id: i,
      });
  } else if (category === "mountain") {
    for (let i = 0; i < 5; i++)
      ps.push({
        type: "cloud",
        x: rand(-80, W + 80),
        y: rand(H * 0.06, H * 0.35),
        r: rand(35, 65),
        vx: rand(0.08, 0.22),
        phase: rand(0, 6),
        alpha: rand(0.3, 0.6),
        id: i,
      });
  } else if (category === "waterfall") {
    for (let i = 0; i < 25; i++)
      ps.push({
        type: "mist",
        x: rand(W * 0.15, W * 0.85),
        y: rand(H * 0.55, H * 0.85),
        r: rand(15, 40),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.25, -0.08),
        phase: rand(0, 6),
        alpha: rand(0.06, 0.22),
        id: i,
      });
  }
  return ps;
}

function updateParticles(ps: any[], W: number, H: number, t: number): any[] {
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  return ps.map((p) => {
    const np = { ...p };
    if (p.type === "bubble") {
      np.y -= p.vy;
      np.x += Math.sin(t * 0.8 + p.phase) * 0.22;
      if (np.y < H * 0.48) {
        np.y = H + 10;
        np.x = rand(0, W);
      }
    } else if (p.type === "fish") {
      np.x += p.vx;
      if (np.x > W + 60) np.x = -60;
      else if (np.x < -60) np.x = W + 60;
    } else if (p.type === "dust") {
      np.x += p.vx;
      np.y += p.vy;
      if (np.y < -5) np.y = H * 0.7;
    } else if (p.type === "raindrop") {
      np.x += p.vx * 0.5;
      np.y += p.vy;
      if (np.y > H + 10) np.y = rand(-H * 0.1, -5);
    } else if (p.type === "ripple") {
      np.r += 0.4;
      np.alpha -= 0.014;
      if (np.alpha <= 0) {
        np.r = rand(2, 5);
        np.alpha = rand(0.4, 0.7);
        np.x = rand(W * 0.05, W * 0.95);
        np.y = rand(H * 0.55, H * 0.88);
      }
    } else if (p.type === "cloud") {
      np.x += p.vx;
      if (np.x > W + 100) np.x = -100;
    } else if (p.type === "mist") {
      np.y += p.vy;
      if (np.y < H * 0.4) np.y = rand(H * 0.75, H * 0.9);
    }
    return np;
  });
}

// ─────────────── MAIN COMPONENT ───────────────
interface RelaxationMusicScreenProps {
  onBackToHome: () => void;
}

export default function RelaxationMusicScreen({
  onBackToHome,
}: RelaxationMusicScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animIdRef = useRef<number>(0);
  const visualizerAnimIdRef = useRef<number>(0);

  // Player state
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(() => {
    const lastId = localStorage.getItem("last_track_id");
    const found = TRACKS.find((t) => t.id === lastId);
    return found || TRACKS[0];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVol, setMusicVol] = useState(() => musicAudio.getMusicVolume());
  const [ambientVol, setAmbientVol] = useState(() =>
    musicAudio.getAmbientVolume(),
  );
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("fav_tracks");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"all" | MusicCategory>(
    "all",
  );
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, icon?: string) => {
    const id = "toast_" + Math.random();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Ambient & Status
  const [_relaxStatus, setRelaxStatus] = useState(RELAXATION_STATUSES[0]);
  const [peaceMsg, setPeaceMsg] = useState<string | null>(null);
  const [dailyQuote, setDailyQuote] = useState<string | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [sceneAlpha, setSceneAlpha] = useState(1);

  // Timers & refs
  const playTimerRef = useRef<any>(null);
  const idleTimerRef = useRef<any>(null);
  const uiFadeTimerRef = useRef<any>(null);
  const prevCategoryRef = useRef<MusicCategory>(currentTrack.category);
  const lastInteractionRef = useRef(Date.now());

  // Window Title Sync & Session Welcome Banner
  useEffect(() => {
    document.title = `Now Playing • ${currentTrack.title} | Relaxation Music Therapy`;
  }, [currentTrack]);

  useEffect(() => {
    addToast("🌿 ยินดีต้อนรับกลับมา ขอให้เป็นช่วงเวลาที่ผ่อนคลายนะครับ", "🌊");
  }, [addToast]);

  // ── Filtered tracks ──
  const filteredTracks =
    categoryFilter === "all"
      ? TRACKS
      : TRACKS.filter((t) => t.category === categoryFilter);

  // ── Keyboard Shortcuts (Space, ←, →, ↑, ↓, M, Esc) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        musicAudio.playUiClick();
        if (isPlaying) {
          musicAudio.pauseMusic();
          setIsPlaying(false);
        } else {
          musicAudio.playMusicTrack(currentTrack.id, currentTrack.category);
          setIsPlaying(true);
        }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        musicAudio.playUiClick();
        handlePrev();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        musicAudio.playUiClick();
        handleNext();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        const n = Math.min(1, musicVol + 0.1);
        setMusicVol(n);
        musicAudio.setMusicVolume(n);
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        const n = Math.max(0, musicVol - 0.1);
        setMusicVol(n);
        musicAudio.setMusicVolume(n);
      } else if (e.code === "KeyM") {
        e.preventDefault();
        musicAudio.playUiClick();
        setIsMuted((v) => {
          const next = !v;
          musicAudio.setMusicVolume(next ? 0 : musicVol);
          return next;
        });
      } else if (e.code === "Escape") {
        e.preventDefault();
        musicAudio.playUiClick();
        onBackToHome();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentTrack, musicVol, onBackToHome]);

  // ── Play Timer Loop ──
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setElapsed((s) => {
          const next = s + 1;
          setProgress(next / currentTrack.duration);
          if (next >= currentTrack.duration) {
            if (isRepeat) {
              setElapsed(0);
              setProgress(0);
            } else {
              handleNext();
            }
          }
          return next >= currentTrack.duration ? 0 : next;
        });
      }, 1000);
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, currentTrack, isRepeat]);

  // ── Relaxation status cycle (30-60s) ──
  useEffect(() => {
    const interval = setInterval(() => {
      setRelaxStatus(
        RELAXATION_STATUSES[
          Math.floor(Math.random() * RELAXATION_STATUSES.length)
        ],
      );
    }, 40000);
    return () => clearInterval(interval);
  }, []);

  // ── Peace messages (every 30s) ──
  useEffect(() => {
    const interval = setInterval(() => {
      const msg =
        PEACE_MESSAGES[Math.floor(Math.random() * PEACE_MESSAGES.length)];
      setPeaceMsg(msg);
      setTimeout(() => setPeaceMsg(null), 4000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Daily quote (every 60s) ──
  useEffect(() => {
    const interval = setInterval(() => {
      const q = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
      setDailyQuote(q);
      setTimeout(() => setDailyQuote(null), 5000);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Focus mode (2 min idle) ──
  const resetIdle = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (focusMode) {
      setUiVisible(true);
      clearTimeout(uiFadeTimerRef.current);
      uiFadeTimerRef.current = setTimeout(() => setUiVisible(false), 3500);
    }
  }, [focusMode]);

  useEffect(() => {
    idleTimerRef.current = setInterval(() => {
      if (Date.now() - lastInteractionRef.current > 120000) {
        setFocusMode(true);
        setUiVisible(false);
      }
    }, 10000);
    return () => clearInterval(idleTimerRef.current);
  }, []);

  useEffect(() => {
    if (!focusMode) setUiVisible(true);
  }, [focusMode]);

  // ── Scene crossfade on category change ──
  useEffect(() => {
    if (prevCategoryRef.current !== currentTrack.category) {
      setSceneAlpha(0);
      setTimeout(() => setSceneAlpha(1), 200);
      prevCategoryRef.current = currentTrack.category;
    }
  }, [currentTrack.category]);

  // ── Background Canvas animation (60fps) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = initParticles(
      currentTrack.category,
      canvas.width,
      canvas.height,
    );

    const frame = () => {
      const t = performance.now() * 0.001;
      particlesRef.current = updateParticles(
        particlesRef.current,
        canvas.width,
        canvas.height,
        t,
      );
      drawScene(
        ctx,
        canvas.width,
        canvas.height,
        currentTrack.category,
        t,
        particlesRef.current,
      );
      animIdRef.current = requestAnimationFrame(frame);
    };
    animIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [currentTrack.category]);

  // ── Audio Visualizer Loop ──
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const renderVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 16;
      const barWidth = canvas.width / bars - 2;

      let freqData = new Uint8Array(bars);
      if (musicAudio.analyserNode && isPlaying) {
        musicAudio.analyserNode.getByteFrequencyData(freqData);
      }

      for (let i = 0; i < bars; i++) {
        const value = isPlaying
          ? freqData[i] ||
            Math.sin(performance.now() * 0.005 + i * 0.4) * 20 + 25
          : 4;
        const barHeight = Math.max(4, (value / 255) * canvas.height);

        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, "#38bdf8");
        grad.addColorStop(1, "#ffffff");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        visualizerAnimIdRef.current = requestAnimationFrame(renderVisualizer);
      }
    };

    renderVisualizer();
    return () => cancelAnimationFrame(visualizerAnimIdRef.current);
  }, [isPlaying]);

  // ── Handlers ──
  const handleSelectTrack = useCallback((track: MusicTrack) => {
    musicAudio.playUiClick();
    setCurrentTrack(track);
    setElapsed(0);
    setProgress(0);
    setIsPlaying(true);
    musicAudio.playMusicTrack(track.id, track.category);

    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((id) => id !== track.id);
      return [track.id, ...filtered].slice(0, 5);
    });

    lastInteractionRef.current = Date.now();
  }, []);

  const handleTogglePlay = useCallback(() => {
    musicAudio.playUiClick();
    if (isPlaying) {
      musicAudio.pauseMusic();
      setIsPlaying(false);
    } else {
      musicAudio.playMusicTrack(currentTrack.id, currentTrack.category);
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack.category]);

  const handleNext = useCallback(() => {
    musicAudio.playUiClick();
    const pool = isShuffle ? [...TRACKS] : TRACKS;
    const idx = pool.findIndex((t) => t.id === currentTrack.id);
    const next = isShuffle
      ? pool[Math.floor(Math.random() * pool.length)]
      : pool[(idx + 1) % pool.length];
    handleSelectTrack(next);
  }, [currentTrack, isShuffle, handleSelectTrack]);

  const handlePrev = useCallback(() => {
    musicAudio.playUiClick();
    if (elapsed > 5) {
      setElapsed(0);
      setProgress(0);
      return;
    }
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prev = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    handleSelectTrack(prev);
  }, [currentTrack, elapsed, handleSelectTrack]);

  const toggleFavorite = useCallback((id: string) => {
    musicAudio.playUiClick();
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      localStorage.setItem("fav_tracks", JSON.stringify([...n]));
      return n;
    });
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const sceneGrad = SCENE_GRADIENTS[currentTrack.category];

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-[inherit] select-none flex flex-col"
      onMouseMove={resetIdle}
      onClick={resetIdle}
      style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
    >
      {/* ── Animated Background Canvas ── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: sceneAlpha }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-black/35 pointer-events-none" />

      {/* ── FOCUS MODE: Minimal UI ── */}
      {focusMode && !uiVisible && (
        <motion.button
          className="absolute top-3 left-3 z-50 flex items-center gap-1 bg-black/40 backdrop-blur border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          onClick={() => {
            setFocusMode(false);
            setUiVisible(true);
            lastInteractionRef.current = Date.now();
          }}
        >
          <ChevronLeft size={14} /> กลับ
        </motion.button>
      )}

      {/* ── MAIN UI FRAME ── */}
      <motion.div
        className="relative z-10 flex flex-col h-full"
        animate={{ opacity: focusMode ? (uiVisible ? 1 : 0) : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* ─────────── TOP BAR ─────────── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-md"
            onClick={() => {
              musicAudio.playUiClick();
              onBackToHome();
            }}
            id="music-back-btn"
          >
            <ChevronLeft size={16} /> กลับหน้าหลัก
          </motion.button>

          <div className="flex flex-col items-center">
            <h1 className="text-white font-bold text-base leading-none drop-shadow-md">
              เมนูเพลงผ่อนคลาย 🎵
            </h1>
            <p className="text-white/70 text-[10px] mt-0.5">
              เลือกฟังเพลงและเสียงธรรมชาติ
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Library Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                musicAudio.playUiClick();
                setShowLibraryModal(true);
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
              title="คลังเพลง (Library)"
            >
              <Library size={15} />
            </motion.button>

            {/* Stats Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                musicAudio.playUiClick();
                setShowStatsModal(true);
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
              title="สถิติการผ่อนคลาย (Stats)"
            >
              <BarChart2 size={15} />
            </motion.button>

            {/* Settings Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                musicAudio.playUiClick();
                setShowSettingsModal(true);
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
              title="การตั้งค่า (Settings)"
            >
              <SettingsIcon size={15} />
            </motion.button>

            {/* Help Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                musicAudio.playUiClick();
                setShowHelpModal(true);
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
              title="คู่มือการใช้งาน (Help)"
            >
              <HelpCircle size={15} />
            </motion.button>

            {/* About Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                musicAudio.playUiClick();
                setShowAboutModal(true);
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
              title="เกี่ยวกับนวัตกรรม (About)"
            >
              <Info size={15} />
            </motion.button>

            {/* Whale Mascot */}
            <WhaleSharkMascot />
          </div>
        </div>

        {/* ─────────── MAIN CONTENT ─────────── */}
        <div className="flex flex-1 gap-3 px-3 pb-2 min-h-0">
          {/* ── LEFT PANEL: Player & Controls ── */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Scene Overlay Card with Album Art & Visualizer */}
            <div className="flex-1 relative rounded-2xl overflow-hidden min-h-0 bg-black/15 border border-white/12 backdrop-blur-sm p-4 flex flex-col justify-between">
              {/* Quote / Peace Message */}
              <div className="z-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  {dailyQuote ? (
                    <motion.div
                      key={dailyQuote}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="text-white/90 text-xs font-semibold italic drop-shadow text-left bg-black/25 backdrop-blur-sm rounded-xl px-3 py-2 max-w-[70%] border border-white/10"
                    >
                      {dailyQuote}
                    </motion.div>
                  ) : peaceMsg ? (
                    <motion.div
                      key={peaceMsg}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="text-white text-xs font-medium drop-shadow text-left bg-black/25 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10"
                    >
                      {peaceMsg}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Album Artwork Animation (Rotating Disc) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                <motion.div
                  className="w-24 h-24 rounded-full border-4 border-white/30 shadow-2xl flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: sceneGrad.accent + "44" }}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                    <Music2 size={16} className="text-white" />
                  </div>
                </motion.div>

                {/* Animated Waveform Visualizer */}
                <canvas
                  ref={visualizerCanvasRef}
                  width={120}
                  height={20}
                  className="rounded"
                />
              </div>

              {/* Relaxation Floating Stress Widget */}
              <div className="z-10 flex justify-between items-end">
                <StressFloatingWidget statusText="กำลังลดลง" />

                <button
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className="text-white/70 hover:text-pink-400 transition p-1"
                >
                  <Heart
                    size={18}
                    className={
                      favorites.has(currentTrack.id)
                        ? "fill-pink-400 text-pink-400"
                        : ""
                    }
                  />
                </button>
              </div>
            </div>

            {/* ── PLAYER CONTROLS ── */}
            <div className="bg-black/40 backdrop-blur border border-white/15 rounded-2xl px-4 py-2.5">
              {/* Track title & subtitle */}
              <div className="text-center mb-1.5">
                <div className="text-white font-bold text-sm leading-tight">
                  {currentTrack.title}
                </div>
                <div className="text-white/60 text-[10px]">
                  {currentTrack.subtitle}
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/60 text-[9px] tabular-nums w-8 text-right">
                  {formatTime(elapsed)}
                </span>
                <div
                  className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const p = (e.clientX - rect.left) / rect.width;
                    setProgress(p);
                    setElapsed(Math.round(p * currentTrack.duration));
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: sceneGrad.accent,
                      width: `${progress * 100}%`,
                    }}
                  />
                </div>
                <span className="text-white/60 text-[9px] tabular-nums w-8">
                  {formatTime(currentTrack.duration)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    className={`text-white/60 hover:text-white transition ${isShuffle ? "text-sky-400" : ""}`}
                    onClick={() => {
                      musicAudio.playUiClick();
                      setIsShuffle((v) => !v);
                    }}
                  >
                    <Shuffle size={14} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    className={`text-white/60 hover:text-white transition ${isRepeat ? "text-sky-400" : ""}`}
                    onClick={() => {
                      musicAudio.playUiClick();
                      setIsRepeat((v) => !v);
                    }}
                  >
                    <Repeat size={14} />
                  </motion.button>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    className="text-white/80 hover:text-white"
                    onClick={handlePrev}
                  >
                    <SkipBack size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: sceneGrad.accent }}
                    onClick={handleTogglePlay}
                  >
                    {isPlaying ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} className="ml-0.5" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    className="text-white/80 hover:text-white"
                    onClick={handleNext}
                  >
                    <SkipForward size={18} />
                  </motion.button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Up Next Queue Modal Trigger */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    className="text-white/60 hover:text-white transition"
                    onClick={() => {
                      musicAudio.playUiClick();
                      setShowLibraryModal(true);
                    }}
                  >
                    <ListMusic size={15} />
                  </motion.button>

                  {/* Sleep Timer */}
                  <div className="relative">
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      className="text-white/60 hover:text-white transition"
                      onClick={() => {
                        musicAudio.playUiClick();
                        setShowSleepTimer((v) => !v);
                      }}
                    >
                      <Timer size={15} />
                    </motion.button>
                    <AnimatePresence>
                      {showSleepTimer && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.9 }}
                          className="absolute bottom-8 right-0 bg-gray-900/95 backdrop-blur border border-white/15 rounded-xl p-2 z-50 min-w-32 shadow-xl"
                        >
                          <div className="text-white/60 text-[9px] font-semibold px-2 pb-1">
                            ⏱ ตั้งเวลาหยุด
                          </div>
                          {SLEEP_TIMER_OPTIONS.map((o) => (
                            <button
                              key={o.minutes}
                              onClick={() => {
                                musicAudio.playUiClick();
                                setSleepMinutes(o.minutes);
                                setShowSleepTimer(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-white/10 transition ${sleepMinutes === o.minutes ? "text-white font-bold" : "text-white/70"}`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* ── DUAL INDEPENDENT AUDIO CHANNELS (Music & Ambient Sliders) ── */}
            <div className="bg-black/30 backdrop-blur border border-white/12 rounded-2xl px-3 py-2 flex items-center justify-between gap-4">
              {/* Music Channel Slider */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] text-white/70 font-semibold shrink-0">
                  🎹 เพลง
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : musicVol}
                  onChange={(e) => {
                    const v = +e.target.value;
                    setMusicVol(v);
                    musicAudio.setMusicVolume(v);
                    setIsMuted(false);
                  }}
                  className="w-full accent-sky-400 h-1 cursor-pointer"
                />
              </div>

              {/* Ambient Channel Slider */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] text-white/70 font-semibold shrink-0">
                  🌊 บรรยากาศ
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={ambientVol}
                  onChange={(e) => {
                    const v = +e.target.value;
                    setAmbientVol(v);
                    musicAudio.setAmbientVolume(v);
                  }}
                  className="w-full accent-emerald-400 h-1 cursor-pointer"
                />
              </div>

              {/* Mute button */}
              <button
                onClick={() => {
                  musicAudio.playUiClick();
                  setIsMuted((v) => {
                    const next = !v;
                    musicAudio.setMusicVolume(next ? 0 : musicVol);
                    return next;
                  });
                }}
                className="text-white/70 hover:text-white transition"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL: Track Selection & Categories ── */}
          <div className="w-60 flex flex-col gap-2 shrink-0">
            <div className="bg-black/35 backdrop-blur border border-white/12 rounded-2xl p-3 flex flex-col gap-2 h-full">
              <div className="text-white/90 text-xs font-bold mb-0.5">
                หมวดหมู่เสียงผ่อนคลาย
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1">
                {CATEGORY_FILTER.map((cf) => (
                  <motion.button
                    key={cf.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      musicAudio.playUiClick();
                      setCategoryFilter(cf.id as any);
                    }}
                    className={`text-[9px] font-semibold px-2 py-1 rounded-full transition border ${categoryFilter === cf.id ? "bg-white/25 border-white/40 text-white" : "bg-white/8 border-white/12 text-white/60 hover:bg-white/15"}`}
                  >
                    {cf.label}
                  </motion.button>
                ))}
              </div>

              {/* Track list */}
              <div
                className="flex-1 overflow-y-auto space-y-1 pr-0.5"
                style={{ scrollbarWidth: "none" }}
              >
                {filteredTracks.map((track) => {
                  const isActive = track.id === currentTrack.id;
                  return (
                    <motion.div
                      key={track.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectTrack(track)}
                      className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 cursor-pointer transition border ${isActive ? "bg-white/20 border-white/30" : "border-transparent hover:bg-white/10"}`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: track.color + "44" }}
                      >
                        <Music2 size={13} style={{ color: track.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-[11px] font-semibold truncate ${isActive ? "text-white" : "text-white/85"}`}
                        >
                          {track.title}
                        </div>
                        <div className="text-white/50 text-[8.5px]">
                          {track.subtitle}
                        </div>
                      </div>
                      {isActive && isPlaying && (
                        <div className="flex gap-0.5 items-end h-3 shrink-0">
                          {[0, 1, 2].map((b) => (
                            <motion.div
                              key={b}
                              className="w-0.5 bg-sky-400 rounded-full"
                              animate={{ height: ["30%", "100%", "40%"] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: b * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Recently Played */}
              {recentlyPlayed.length > 0 && (
                <div className="border-t border-white/10 pt-1.5 mt-1">
                  <div className="text-white/50 text-[9px] font-semibold mb-1">
                    เพิ่งเล่นล่าสุด
                  </div>
                  <div className="flex gap-1 overflow-x-auto">
                    {recentlyPlayed.map((id) => {
                      const t = TRACKS.find((tr) => tr.id === id);
                      if (!t) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => handleSelectTrack(t)}
                          className="text-[8px] text-white/70 bg-white/10 rounded px-1.5 py-0.5 truncate max-w-20 hover:bg-white/20"
                        >
                          {t.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR: Breathing Guide Toggle ── */}
        <div className="flex items-center justify-between px-5 pb-2.5 shrink-0">
          <div className="text-white/50 text-[9px]">
            กด <span className="font-bold text-white/70">Space</span>{" "}
            เพื่อเล่น/หยุด |{" "}
            <span className="font-bold text-white/70">Esc</span> กลับ
          </div>
          <button
            onClick={() => {
              musicAudio.playUiClick();
              setShowBreathing((v) => !v);
            }}
            className={`text-[10px] font-semibold px-3.5 py-1 rounded-full border transition ${showBreathing ? "bg-white/20 border-white/40 text-white" : "bg-white/8 border-white/15 text-white/60 hover:bg-white/15"}`}
          >
            🫁 ฝึกหายใจ
          </button>
        </div>
      </motion.div>

      {/* ── BREATHING GUIDE OVERLAY ── */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingGuideOverlay
            onClose={() => setShowBreathing(false)}
            accentColor={sceneGrad.accent}
          />
        )}
      </AnimatePresence>

      {/* ── KEYBOARD SHORTCUTS MODAL ── */}
      <AnimatePresence>
        {showShortcutsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 border border-white/20 rounded-2xl p-5 max-w-xs w-full text-white"
            >
              <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
                ⌨️ คีย์ลัด (Keyboard Shortcuts)
              </h3>
              <div className="space-y-2 text-xs text-white/80">
                <div className="flex justify-between">
                  <span>Space</span>
                  <span className="font-bold text-sky-400">
                    เล่น / หยุดเพลง
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>← / →</span>
                  <span className="font-bold text-sky-400">
                    เพลงก่อนหน้า / ถัดไป
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>↑ / ↓</span>
                  <span className="font-bold text-sky-400">
                    เพิ่ม / ลด เสียง
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>M</span>
                  <span className="font-bold text-sky-400">
                    ปิดเสียง (Mute)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Esc</span>
                  <span className="font-bold text-sky-400">กลับหน้าหลัก</span>
                </div>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="w-full mt-4 bg-white/15 hover:bg-white/25 py-1.5 rounded-xl text-xs font-semibold"
              >
                ปิด
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST NOTIFICATIONS ── */}
      <ToastNotification
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* ── PRODUCTION MODALS ── */}
      <MusicLibraryModal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
        onSelectTrack={handleSelectTrack}
        currentTrackId={currentTrack.id}
        onToast={addToast}
      />

      <MusicSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onToast={addToast}
      />

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />
    </div>
  );
}

// ─────────────── WHALE SHARK MASCOT ───────────────
function WhaleSharkMascot() {
  const [blinking, setBlinking] = useState(false);
  const [bubblesActive, setBubblesActive] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 130);
      },
      3500 + Math.random() * 2000,
    );

    const bubbleInterval = setInterval(() => {
      setBubblesActive(true);
      setTimeout(() => setBubblesActive(false), 1200);
    }, 6000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(bubbleInterval);
    };
  }, []);

  return (
    <motion.div
      className="relative w-14 h-12 shrink-0"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 64 50" className="w-full h-full drop-shadow-md">
        <ellipse cx="32" cy="28" rx="22" ry="13" fill="#1d4ed8" />
        <ellipse cx="34" cy="31" rx="16" ry="8" fill="rgba(255,255,255,0.28)" />
        {[
          [18, 22],
          [26, 19],
          [38, 20],
          [44, 24],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="rgba(255,255,255,0.45)" />
        ))}
        <motion.g
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "10px 28px" }}
        >
          <path d="M10 28 L2 20 L2 36 Z" fill="#1d4ed8" />
        </motion.g>
        <path d="M28 15 L36 10 L40 17 Z" fill="#1e40af" />
        <ellipse cx="46" cy="24" rx="4" ry="4" fill="white" />
        {blinking ? (
          <line
            x1="43"
            y1="24"
            x2="49"
            y2="24"
            stroke="#1a1a2e"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : (
          <>
            <circle cx="47" cy="24" r="2.5" fill="#1a1a2e" />
            <circle cx="48" cy="22.5" r="0.9" fill="white" />
          </>
        )}
        <path
          d="M38 32 Q41 35 44 32"
          stroke="#1a1a2e"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <AnimatePresence>
        {bubblesActive &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.7, y: 0, x: -8 + i * 5, scale: 0.5 }}
              animate={{ opacity: 0, y: -20, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.18, ease: "easeOut" }}
              className="absolute top-2 right-1 w-2 h-2 rounded-full border border-blue-200/70 bg-blue-100/30"
            />
          ))}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────── BREATHING GUIDE OVERLAY ───────────────
function BreathingGuideOverlay({
  onClose,
  accentColor,
}: {
  onClose: () => void;
  accentColor: string;
}) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [label, setLabel] = useState("หายใจเข้า");
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const cycle = () => {
      setPhase("in");
      setLabel("หายใจเข้า");
      setScale(1);
      setTimeout(() => {
        setPhase("hold");
        setLabel("กลั้นหายใจ");
      }, 3000);
      setTimeout(() => {
        setPhase("out");
        setLabel("หายใจออก");
        setScale(0.55);
      }, 4000);
    };
    cycle();
    const id = setInterval(cycle, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-auto"
    >
      <motion.div
        className="flex items-center justify-center rounded-full border-2"
        style={{
          width: 84,
          height: 84,
          borderColor: accentColor + "99",
          backgroundColor: accentColor + "22",
          backdropFilter: "blur(8px)",
          boxShadow: `0 0 28px ${accentColor}40`,
        }}
        animate={{ scale }}
        transition={{
          duration: phase === "in" ? 3 : phase === "hold" ? 0.1 : 4,
          ease: phase === "hold" ? "linear" : "easeInOut",
        }}
      >
        <span className="text-white text-[10px] font-bold text-center leading-tight">
          {label}
        </span>
      </motion.div>
      <button
        onClick={onClose}
        className="text-white/50 hover:text-white/80 text-[10px] transition"
      >
        ✕ ปิด
      </button>
    </motion.div>
  );
}
