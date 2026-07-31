import React from "react";
import { motion } from "motion/react";
import whaleIcon from "../../assets/icon/whaleicon.png";

export type StressLevelType = "very_low" | "low" | "medium" | "high" | "very_high";

export interface StressLevelConfig {
  key: StressLevelType;
  labelEn: string;
  labelTh: string;
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
}

export const STRESS_LEVELS: Record<StressLevelType, StressLevelConfig> = {
  very_low: {
    key: "very_low",
    labelEn: "Very Low",
    labelTh: "ผ่อนคลายมากที่สุด",
    emoji: "😄",
    color: "#4ade80",
    bgGradient: "from-emerald-300 to-teal-300",
    description: "สภาวะอารมณ์สดใส ผ่อนคลายสูงสุด ร่างกายอยู่ในสภาวะสมดุลยอดเยี่ยม 🌿",
  },
  low: {
    key: "low",
    labelEn: "Low",
    labelTh: "ผ่อนคลายปกติ",
    emoji: "🙂",
    color: "#facc15",
    bgGradient: "from-teal-300 to-amber-300",
    description: "สภาวะอารมณ์ปกติ สบายใจ ไม่มีเรื่องวิตกกังวล ให้รักษารอยยิ้มแบบนี้ไว้นะ 💙",
  },
  medium: {
    key: "medium",
    labelEn: "Medium",
    labelTh: "ปานกลาง",
    emoji: "🙁",
    color: "#fb923c",
    bgGradient: "from-amber-300 to-orange-300",
    description: "เริ่มมีความเครียดเล็กน้อย ลองพักสายตา ฟังเพลงสบายๆ หรือยืดเส้นยืดสายดูนะ 🎵",
  },
  high: {
    key: "high",
    labelEn: "High",
    labelTh: "เครียดสูง",
    emoji: "😟",
    color: "#f87171",
    bgGradient: "from-orange-300 to-rose-400",
    description: "มีความวิตกกังวลสูงกว่าปกติ หายใจเข้าลึกๆ ดื่มน้ำเย็น และพักจากงานสักครู่ 🌊",
  },
  very_high: {
    key: "very_high",
    labelEn: "Very High",
    labelTh: "เครียดสูงมาก",
    emoji: "😫",
    color: "#ef4444",
    bgGradient: "from-rose-400 to-red-500",
    description: "ระดับความเครียดสูงสะสม ควรหยุดพักทันที ลองคุยกับใครสักคนหรือทำกิจกรรมผ่อนคลาย ❤️‍🩹",
  },
};

interface VerticalStressMeterProps {
  currentLevel: StressLevelType;
  stressPercentage?: number;
}

// Emoji Badge Configurations matching Image 2
const EMOJI_BADGE_CONFIG: Record<
  StressLevelType,
  { badgeBg: string; activeGlow: string }
> = {
  very_low: {
    badgeBg: "bg-[#9be1a7]",
    activeGlow: "shadow-[0_0_20px_rgba(155,225,167,0.8)] ring-4 ring-[#9be1a7]/40",
  },
  low: {
    badgeBg: "bg-[#fce789]",
    activeGlow: "shadow-[0_0_20px_rgba(252,231,137,0.8)] ring-4 ring-[#fce789]/40",
  },
  medium: {
    badgeBg: "bg-[#fcb97d]",
    activeGlow: "shadow-[0_0_20px_rgba(252,185,125,0.8)] ring-4 ring-[#fcb97d]/40",
  },
  high: {
    badgeBg: "bg-[#f99b93]",
    activeGlow: "shadow-[0_0_20px_rgba(249,155,147,0.8)] ring-4 ring-[#f99b93]/40",
  },
  very_high: {
    badgeBg: "bg-[#ea6e75]",
    activeGlow: "shadow-[0_0_20px_rgba(234,110,117,0.8)] ring-4 ring-[#ea6e75]/40",
  },
};

export const VerticalStressMeter: React.FC<VerticalStressMeterProps> = ({
  currentLevel,
  stressPercentage,
}) => {
  // Map level key to position percentage (Top = Very Low / 10%, Bottom = Very High / 90%)
  const getMarkerTopPercentage = (): number => {
    if (stressPercentage !== undefined) {
      return Math.min(90, Math.max(10, stressPercentage));
    }
    switch (currentLevel) {
      case "very_low":
        return 10;
      case "low":
        return 30;
      case "medium":
        return 50;
      case "high":
        return 70;
      case "very_high":
        return 90;
    }
  };

  const markerTopPct = getMarkerTopPercentage();

  // Top to Bottom list matching Image 2
  const levelsList: StressLevelConfig[] = [
    STRESS_LEVELS.very_low,
    STRESS_LEVELS.low,
    STRESS_LEVELS.medium,
    STRESS_LEVELS.high,
    STRESS_LEVELS.very_high,
  ];

  return (
    <div className="relative flex items-center justify-between w-full max-w-64 h-64 px-2 py-1 my-0.5 select-none">
      {/* Left Labels (Top = Very Low -> Bottom = Very High) */}
      <div className="flex flex-col justify-between h-full py-2 text-right pr-2 font-bold text-[#2a3a5e] text-xs space-y-4">
        {levelsList.map((lvl) => (
          <motion.span
            key={lvl.key}
            animate={{
              scale: currentLevel === lvl.key ? 1.15 : 1,
              color: currentLevel === lvl.key ? "#0284c7" : "#94a3b8",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`transition-all ${
              currentLevel === lvl.key ? "font-extrabold" : "font-semibold"
            }`}
          >
            {lvl.labelEn}
          </motion.span>
        ))}
      </div>

      {/* Center Thermometer Bar Container (Top = Green -> Bottom = Red) */}
      <div className="relative w-11 h-full bg-slate-100/90 rounded-full border-4 border-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col justify-between p-1">
        {/* 5 Layered Gradients Top (Green) to Bottom (Red) */}
        <div className="w-full h-1/5 bg-linear-to-b from-[#8cd499] to-[#c2eb9e] rounded-t-full opacity-90" />
        <div className="w-full h-1/5 bg-linear-to-b from-[#c2eb9e] to-[#f5e07b] opacity-90" />
        <div className="w-full h-1/5 bg-linear-to-b from-[#f5e07b] to-[#f6a563] opacity-90" />
        <div className="w-full h-1/5 bg-linear-to-b from-[#f6a563] to-[#ef7270] opacity-90" />
        <div className="w-full h-1/5 bg-linear-to-b from-[#ef7270] to-[#d64750] rounded-b-full opacity-90" />

        {/* Dynamic Inner Glow */}
        <div className="absolute inset-0 bg-white/20 pointer-events-none rounded-full" />
      </div>

      {/* Animated Whale Marker with Spring Physics */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        initial={{ top: `calc(50% - 18px)` }}
        animate={{ top: `calc(${markerTopPct}% - 18px)` }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring around whale */}
          <div className="absolute w-12 h-12 bg-sky-400/30 rounded-full animate-ping pointer-events-none" />

          {/* Whale Icon Bubble Badge */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_15px_rgba(91,139,241,0.4)] border-2 border-sky-300 flex items-center justify-center transition"
          >
            <img
              src={whaleIcon}
              alt="Whale Indicator"
              className="w-8 h-8 object-contain drop-shadow-xs"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerText = "🐳";
                }
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Emoji Colored Circles Matching Image 2 */}
      <div className="flex flex-col justify-between h-full py-1 text-left pl-2 space-y-3">
        {levelsList.map((lvl) => {
          const isActive = currentLevel === lvl.key;
          const badgeStyle = EMOJI_BADGE_CONFIG[lvl.key];
          return (
            <motion.div
              key={lvl.key}
              animate={{
                scale: isActive ? 1.28 : 0.92,
                opacity: isActive ? 1 : 0.75,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                badgeStyle.badgeBg
              } ${isActive ? badgeStyle.activeGlow + " z-10" : "border border-white/60"}`}
            >
              <span className="text-lg leading-none filter drop-shadow-xs">
                {lvl.emoji}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
