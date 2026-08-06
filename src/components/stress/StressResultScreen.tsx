import React from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Check, X, Sparkles, ShieldCheck } from "lucide-react";
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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="w-full h-full flex flex-col justify-between p-6 select-none relative overflow-hidden bg-linear-to-br from-[#ebf3fe] via-[#f5f9ff] to-[#e1edfe] text-[#2c3e50]"
      style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
    >
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-20 w-48 h-48 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-20 w-64 h-64 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* ────────── 1. HEADER BAR ────────── */}
      <header className="flex items-center justify-between z-10 bg-white/75 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/90 shadow-sm border border-white flex items-center justify-center">
            <img src={whaleIcon} alt="Whale" className="w-6 h-4 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#1f2d4d] leading-none flex items-center gap-1.5">
              ผลการประเมินสภาวะอารมณ์ 📊
            </h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">ระบบวิเคราะห์และประเมินระดับความเครียด</p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center border border-white shadow-sm transition"
          title="ปิดหน้าต่าง"
        >
          <X size={16} />
        </button>
      </header>

      {/* ────────── 2. MAIN LANDSCAPE CONTENT (SPLIT LEFT/RIGHT) ────────── */}
      <div className="flex-1 flex gap-5 my-4 z-10 min-h-0">
        {/* LEFT PANEL: Stress Meter Gauge */}
        <div className="w-72 bg-white/85 backdrop-blur-md rounded-3xl p-4 border border-white shadow-md flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
          <div className="text-center mb-2">
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 uppercase tracking-wider">
              Stress Meter
            </span>
          </div>

          <VerticalStressMeter
            currentLevel={measuredLevel}
            stressPercentage={stressPercentage}
          />
        </div>

        {/* RIGHT PANEL: Result Details, Advice & Actions */}
        <div className="flex-1 bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white shadow-md flex flex-col justify-between min-w-0">
          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{currentConfig.emoji}</span>
              <div>
                <div
                  className="text-lg font-black tracking-tight"
                  style={{ color: currentConfig.color }}
                >
                  {currentConfig.labelTh} ({currentConfig.labelEn})
                </div>
                <div className="text-xs text-slate-400 font-semibold">
                  ระดับดรรชนีสภาวะอารมณ์: {stressPercentage}%
                </div>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-medium mb-4">
              {currentConfig.description}
            </div>

            {/* Calming Recommendation Note */}
            <div className="flex items-start gap-2.5 bg-sky-50/70 border border-sky-100 rounded-2xl p-3 text-[11px] text-sky-800">
              <ShieldCheck size={18} className="text-sky-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sky-900 mb-0.5">คำแนะนำเพื่อการผ่อนคลาย:</div>
                <span>เปิดฟังเพลงดนตรีบำบัด หรือลองขยับเมาส์เล่นเกมท่องมหาสมุทรฉลามวาฬ เพื่อให้จิตใจสงบขึ้นครับ</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save / Cancel */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition flex items-center gap-1.5"
            >
              <X size={15} />
              <span>ยกเลิก</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveWithConfetti}
              className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition flex items-center gap-1.5 border border-sky-400/40"
            >
              <Check size={15} />
              <span>บันทึกผลการประเมิน</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ────────── 3. FOOTER ────────── */}
      <footer className="text-center z-10 shrink-0 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
        <Sparkles size={12} className="text-sky-400" />
        <span>ผลการประเมินจากระบบซอฟต์แวร์จำลองเพื่อสุขภาพจิต</span>
      </footer>
    </motion.div>
  );
};
