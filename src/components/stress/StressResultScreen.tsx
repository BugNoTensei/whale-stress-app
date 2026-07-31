import React from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Check, X, Sparkles } from "lucide-react";
import whaleIcon from "../../assets/icon/whaleicon.png";
import {
  VerticalStressMeter,
  StressLevelType,
  STRESS_LEVELS,
} from "./VerticalStressMeter";

interface StressResultScreenProps {
  measuredLevel?: StressLevelType;
  stressPercentage?: number;
  onSave?: (level: StressLevelType) => void;
  onCancel?: () => void;
}

export const StressResultScreen: React.FC<StressResultScreenProps> = ({
  measuredLevel = "medium",
  stressPercentage = 50,
  onSave,
  onCancel,
}) => {
  const currentConfig = STRESS_LEVELS[measuredLevel] || STRESS_LEVELS.medium;

  const handleSaveWithConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.75 },
      colors: ["#3b72d9", "#9b87f5", "#a7f3d0", "#fef08a", "#81b2f8"],
    });

    setTimeout(() => {
      onSave?.(measuredLevel);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
      className="w-full h-full flex flex-col items-center justify-between z-10 max-w-sm mx-auto pt-1 pb-4 select-none"
    >
      {/* Header Section with Whale */}
      <div className="flex flex-col items-center text-center mt-1">
        {/* Floating Whale Illustration */}
        <div className="relative w-36 h-20 flex items-center justify-center mb-1">
          <div className="absolute inset-0 bg-sky-200/40 rounded-full blur-xl animate-pulse" />
          <img
            src={whaleIcon}
            alt="Whale Header"
            className="w-28 h-20 object-contain drop-shadow-md relative z-10 animate-bounce-slow"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.innerText = "🐳";
                e.currentTarget.parentElement.className = "text-4xl my-2";
              }
            }}
          />
          {/* Cute bubbles */}
          <div className="absolute top-1 right-3 w-2.5 h-2.5 bg-sky-300/60 rounded-full animate-ping" />
          <div className="absolute bottom-2 left-4 w-2 h-2 bg-sky-200/70 rounded-full" />
        </div>

        <h1 className="text-xl font-extrabold text-[#1f2d4d] tracking-tight">
          ผลการประเมินระดับความเครียด
        </h1>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5 max-w-64 leading-relaxed">
          ผลลัพธ์ที่ได้จากการวัดสภาวะอารมณ์ของคุณในขณะนี้
        </p>
      </div>

      {/* Center White Card with Thermometer Gauge */}
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-4xl p-4 shadow-[0_10px_30px_rgba(160,190,235,0.22)] border border-white flex flex-col items-center text-center my-auto relative overflow-hidden">
        {/* Vertical Meter Component */}
        <VerticalStressMeter
          currentLevel={measuredLevel}
          stressPercentage={stressPercentage}
        />

        {/* Level Result Tag & Advice Box */}
        <div className="w-full mt-2 bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 text-center transition-all">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white rounded-full shadow-xs border border-sky-100 mb-1">
            <span className="text-sm">{currentConfig.emoji}</span>
            <span
              className="text-xs font-bold"
              style={{ color: currentConfig.color }}
            >
              {currentConfig.labelEn} ({currentConfig.labelTh})
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-1">
            {currentConfig.description}
          </p>
        </div>

        <p className="text-[11px] text-slate-400 font-semibold mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>ผลการวัดจากระบบประเมินอารมณ์</span>
        </p>
      </div>

      {/* Action Buttons Section (Save / Cancel matching screenshot) */}
      <div className="w-full flex items-center justify-between gap-3 pt-1 pb-1 z-20 px-1">
        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleSaveWithConfetti}
          className="flex-1 py-2.5 px-4 bg-linear-to-r from-[#4f80e1] to-[#3b72d9] hover:from-[#4373d4] hover:to-[#3164c4] text-white font-bold rounded-full shadow-[0_6px_18px_rgba(59,114,217,0.35)] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <span>บันทึก</span>
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        </motion.button>

        {/* Cancel Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 bg-linear-to-r from-[#9b87f5] to-[#7e69ab] hover:from-[#8e78eb] hover:to-[#705b9c] text-white font-bold rounded-full shadow-[0_6px_18px_rgba(155,135,245,0.35)] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <span>ยกเลิก</span>
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <X className="w-3.5 h-3.5 text-white" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
