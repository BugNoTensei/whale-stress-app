import React from "react";
import { motion } from "motion/react";
import {
  Music,
  Gamepad2,
  Activity,
  Settings,
  ChevronRight,
} from "lucide-react";
import whaleIcon from "../../assets/icon/whaleicon.png";

interface HomeScreenProps {
  onNavigate: (view: "music" | "games" | "bubble_pop_game" | "whale_ocean_game" | "stress_result") => void;
  onOpenSettings: () => void;
  isEvaluating: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenSettings,
  isEvaluating,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none relative overflow-hidden bg-linear-to-br from-[#edf4fe] via-[#f7fafe] to-[#e4effd] text-[#2c3e50]" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* ────────── TOP BAR: Minimal Header ────────── */}
      <header className="flex items-center justify-between z-10 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/90 shadow-sm border border-white flex items-center justify-center">
            <img src={whaleIcon} alt="Whale Logo" className="w-6 h-4 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#1f2d4d] leading-none">
              Whale Stress Relief 🐋
            </h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">พื้นที่ผ่อนคลายจิตใจ</p>
          </div>
        </div>

        {/* Clickable Mood Pill & Settings */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("stress_result")}
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#1f2d4d] px-3.5 py-1.5 rounded-full border border-white shadow-sm transition text-xs font-bold"
          >
            <Activity size={14} className="text-sky-500 animate-pulse" />
            <span>{isEvaluating ? "กำลังประเมิน..." : "สภาวะอารมณ์: ผ่อนคลาย 💙"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-500 flex items-center justify-center border border-white shadow-sm transition"
            title="การตั้งค่า"
          >
            <Settings size={16} />
          </motion.button>
        </div>
      </header>

      {/* ────────── MAIN CONTENT: Spacious & Super Easy to Use ────────── */}
      <div className="flex-1 flex items-center justify-between px-8 z-10">
        {/* LEFT: Cute Floating Whale Mascot */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-40 flex items-center justify-center mb-2"
          >
            <img
              src={whaleIcon}
              alt="Whale Shark Mascot"
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />
          </motion.div>

          <h2 className="text-xl font-bold text-[#1f2d4d] tracking-tight">
            ยินดีต้อนรับครับ 💙
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            พักสายตา แล้วเลือกเมนูที่คุณต้องการได้เลยครับ
          </p>
        </div>

        {/* RIGHT: 2 Big Clean Action Buttons Only */}
        <div className="flex flex-col gap-4 w-96">
          {/* BUTTON 1: MUSIC THERAPY */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("music")}
            className="bg-white/90 hover:bg-white p-5 rounded-3xl border border-white shadow-[0_10px_25px_rgba(160,190,235,0.25)] flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#dce8f8] text-[#3b66c4] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition">
                <Music size={28} />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-[#1f2d4d] group-hover:text-sky-600 transition">
                  ฟังเพลงผ่อนคลาย 🎵
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  เพลงเปียโน & เสียงธรรมชาติ
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition">
              <ChevronRight size={18} />
            </div>
          </motion.button>

          {/* BUTTON 2: RELAXATION GAMES */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("games")}
            className="bg-[#f0f5ff] hover:bg-white p-5 rounded-3xl border border-[#d8e5fc] shadow-[0_10px_25px_rgba(160,190,235,0.25)] flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#e3dbfa] text-[#584fa8] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition">
                <Gamepad2 size={28} />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-[#1f2d4d] group-hover:text-purple-600 transition">
                  เล่นเกมผ่อนคลาย 🎮
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  ท่องมหาสมุทร & เป่าฟองอากาศ
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        </div>
      </div>

      {/* ────────── FOOTER: Single Calm Quote ────────── */}
      <footer className="text-center z-10 shrink-0">
        <p className="text-xs text-slate-400 font-medium">
          "ให้เราอยู่เป็นเพื่อนคุณ ในทุกช่วงเวลาที่เหนื่อยล้า ✨"
        </p>
      </footer>
    </div>
  );
};
