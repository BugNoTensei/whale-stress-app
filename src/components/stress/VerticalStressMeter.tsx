import React from "react";
import { motion } from "motion/react";
import { Smile, Meh, Frown, AlertOctagon } from "lucide-react";
import whaleIcon from "../../assets/icon/whaleicon.png";

export type StressLevelType = "very_low" | "low" | "medium" | "high" | "very_high";

export interface StressLevelConfig {
  key: StressLevelType;
  labelEn: string;
  labelTh: string;
  emoji: React.ReactNode;
  color: string;
  bgGradient: string;
  description: string;
}

export const STRESS_LEVELS: Record<StressLevelType, StressLevelConfig> = {
  very_low: {
    key: "very_low",
    labelEn: "Very Low",
    labelTh: "ผ่อนคลายมากที่สุด",
    emoji: <Smile className="w-5 h-5 text-emerald-950" />,
    color: "#4ade80",
    bgGradient: "from-emerald-300 to-teal-300",
    description: "สภาวะอารมณ์สดใส ผ่อนคลายสูงสุด ร่างกายอยู่ในสภาวะสมดุลยอดเยี่ยม",
  },
  low: {
    key: "low",
    labelEn: "Low",
    labelTh: "ผ่อนคลายปกติ",
    emoji: <Smile className="w-5 h-5 text-amber-950" />,
    color: "#facc15",
    bgGradient: "from-teal-300 to-amber-300",
    description: "สภาวะอารมณ์ปกติ สบายใจ ไม่มีเรื่องวิตกกังวล ให้รักษารอยยิ้มแบบนี้ไว้นะ",
  },
  medium: {
    key: "medium",
    labelEn: "Medium",
    labelTh: "ปานกลาง",
    emoji: <Meh className="w-5 h-5 text-orange-950" />,
    color: "#fb923c",
    bgGradient: "from-amber-300 to-orange-300",
    description: "เริ่มมีความเครียดเล็กน้อย ลองพักสายตา ฟังเพลงสบายๆ หรือยืดเส้นยืดสายดูนะ",
  },
  high: {
    key: "high",
    labelEn: "High",
    labelTh: "เครียดสูง",
    emoji: <Frown className="w-5 h-5 text-rose-950" />,
    color: "#f87171",
    bgGradient: "from-orange-300 to-rose-400",
    description: "มีความวิตกกังวลสูงกว่าปกติ หายใจเข้าลึกๆ ดื่มน้ำเย็น และพักจากงานสักครู่",
  },
  very_high: {
    key: "very_high",
    labelEn: "Very High",
    labelTh: "เครียดสูงมาก",
    emoji: <AlertOctagon className="w-5 h-5 text-red-950" />,
    color: "#ef4444",
    bgGradient: "from-rose-400 to-red-500",
    description: "ระดับความเครียดสูงสะสม ควรหยุดพักทันที ลองคุยกับใครสักคนหรือทำกิจกรรมผ่อนคลาย",
  },
};

interface VerticalStressMeterProps {
  currentLevel: StressLevelType;
  currentPercentage?: number;
  onSelectLevel?: (level: StressLevelType) => void;
}

const EMOJI_BADGE_CONFIG: Record<StressLevelType, { badgeBg: string; activeGlow: string }> = {
  very_low: {
    badgeBg: "bg-emerald-300 text-slate-900 border-2 border-emerald-400",
    activeGlow: "shadow-[0_0_15px_rgba(74,222,128,0.8)] border-white scale-125 ring-2 ring-emerald-300",
  },
  low: {
    badgeBg: "bg-amber-300 text-slate-900 border-2 border-amber-400",
    activeGlow: "shadow-[0_0_15px_rgba(250,204,21,0.8)] border-white scale-125 ring-2 ring-amber-300",
  },
  medium: {
    badgeBg: "bg-orange-300 text-slate-900 border-2 border-orange-400",
    activeGlow: "shadow-[0_0_15px_rgba(251,146,60,0.8)] border-white scale-125 ring-2 ring-orange-300",
  },
  high: {
    badgeBg: "bg-rose-400 text-white border-2 border-rose-500",
    activeGlow: "shadow-[0_0_15px_rgba(248,113,113,0.8)] border-white scale-125 ring-2 ring-rose-400",
  },
  very_high: {
    badgeBg: "bg-red-500 text-white border-2 border-red-600",
    activeGlow: "shadow-[0_0_15px_rgba(239,68,68,0.8)] border-white scale-125 ring-2 ring-red-500",
  },
};

export const VerticalStressMeter: React.FC<VerticalStressMeterProps> = ({
  currentLevel,
  currentPercentage = 50,
}) => {
  const levelsList: StressLevelConfig[] = [
    STRESS_LEVELS.very_high,
    STRESS_LEVELS.high,
    STRESS_LEVELS.medium,
    STRESS_LEVELS.low,
    STRESS_LEVELS.very_low,
  ];

  return (
    <div className="relative h-64 w-28 flex items-center justify-between select-none py-1">
      {/* Left Track (Background Line) */}
      <div className="relative h-full w-4 bg-slate-200/80 rounded-full overflow-hidden shadow-inner border border-slate-300/40">
        {/* Dynamic Gradient Bar from bottom */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${currentPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 w-full bg-linear-to-t from-emerald-400 via-amber-400 to-red-500 rounded-full"
        />
      </div>

      {/* Moving Whale Marker Indicator */}
      <motion.div
        className="absolute -left-1.5 z-20 pointer-events-none"
        animate={{
          bottom: `${Math.max(8, Math.min(92, currentPercentage))}%`,
        }}
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
              {lvl.emoji}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
