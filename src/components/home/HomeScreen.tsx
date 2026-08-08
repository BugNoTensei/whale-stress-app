import React from "react";
import { motion } from "motion/react";
import {
  Music,
  Gamepad2,
  Activity,
  Settings,
  ChevronRight,
  Heart,
  Sparkles,
  Droplets,
} from "lucide-react";
import { WhaleSharkIcon } from "../ui/WhaleSharkIcon";

interface HomeScreenProps {
  onNavigate: (view: "music" | "games" | "bubble_pop_game" | "whale_ocean_game" | "stress_result" | "aroma" | "self_relaxation") => void;
  onOpenSettings: () => void;
  onTriggerStressAlert?: () => void;
  isEvaluating: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenSettings,
  onTriggerStressAlert: _onTriggerStressAlert,
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
          <div className="w-9 h-9 rounded-2xl bg-white/90 shadow-xs border border-white flex items-center justify-center p-1">
            <WhaleSharkIcon className="w-7 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#1f2d4d] leading-none flex items-center gap-1.5">
              <span>Whale Stress Relief</span>
              <WhaleSharkIcon className="w-5 h-3.5 inline-block" />
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
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#1f2d4d] px-3.5 py-1.5 rounded-full border border-white shadow-xs transition text-xs font-bold cursor-pointer"
          >
            <Activity size={14} className="text-sky-500 animate-pulse" />
            <span className="flex items-center gap-1">
              {isEvaluating ? "กำลังประเมิน..." : "สภาวะอารมณ์: ผ่อนคลาย"}
              {!isEvaluating && <Heart size={13} className="fill-sky-500 text-sky-500 inline-block" />}
            </span>
          </motion.button>

          {/* Hidden temporarily for clean screenshot */}
          {/* {onTriggerStressAlert && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTriggerStressAlert}
              className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 px-3 py-1.5 rounded-full border border-amber-300 text-xs font-black cursor-pointer transition shadow-xs"
              title="สบัดเมาส์รวดเร็ว หรือกดปุ่มนี้เพื่อทดสอบตรวจจับความเครียด"
            >
              <Activity size={14} className="text-amber-600" />
              <span>ทดสอบเตือนความเครียด</span>
            </motion.button>
          )} */}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-500 flex items-center justify-center border border-white shadow-xs transition cursor-pointer"
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
            <WhaleSharkIcon className="w-56 h-36 drop-shadow-xl" />
          </motion.div>

          <h2 className="text-xl font-bold text-[#1f2d4d] tracking-tight flex items-center gap-1.5 justify-center">
            <span>ยินดีต้อนรับครับ</span>
            <Heart size={18} className="fill-sky-500 text-sky-500" />
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            พักสายตา แล้วเลือกเมนูที่คุณต้องการได้เลยครับ
          </p>
        </div>

        {/* RIGHT: 4 Action Buttons Grid/List */}
        <div className="flex flex-col gap-2.5 w-96">
          {/* BUTTON 1: MUSIC THERAPY */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("music")}
            className="bg-white/90 hover:bg-white p-3.5 rounded-2xl border border-white shadow-[0_4px_15px_rgba(160,190,235,0.2)] flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#dce8f8] text-[#3b66c4] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <Music size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#1f2d4d] group-hover:text-sky-600 transition flex items-center gap-1.5">
                  <span>ฟังเพลงผ่อนคลาย</span>
                  <Music size={14} className="text-sky-500" />
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  เพลงเปียโน &amp; เสียงธรรมชาติ
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition">
              <ChevronRight size={15} />
            </div>
          </motion.button>

          {/* BUTTON 2: RELAXATION GAMES */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("games")}
            className="bg-[#f0f5ff] hover:bg-white p-3.5 rounded-2xl border border-[#d8e5fc] shadow-[0_4px_15px_rgba(160,190,235,0.2)] flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#e3dbfa] text-[#584fa8] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <Gamepad2 size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#1f2d4d] group-hover:text-purple-600 transition flex items-center gap-1.5">
                  <span>เล่นเกมผ่อนคลาย</span>
                  <Gamepad2 size={14} className="text-purple-500" />
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  ท่องมหาสมุทร &amp; เป่าฟองอากาศ
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition">
              <ChevronRight size={15} />
            </div>
          </motion.button>

          {/* BUTTON 3: SELF RELAXATION */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("self_relaxation")}
            className="bg-[#f0fdf4] hover:bg-white p-3.5 rounded-2xl border border-[#bbf7d0] shadow-[0_4px_15px_rgba(52,211,153,0.2)] flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <Sparkles size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#1f2d4d] group-hover:text-emerald-600 transition flex items-center gap-1.5">
                  <span>กิจกรรมผ่อนคลายด้วยตนเอง</span>
                  <Sparkles size={14} className="text-emerald-500" />
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  หายใจ 4-7-8, Grounding &amp; สแกนกล้ามเนื้อ
                </div>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
              <ChevronRight size={15} />
            </div>
          </motion.button>

          {/* BUTTON 4: AROMA DIFFUSER */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("aroma")}
            className="bg-[#f5f0ff] hover:bg-white p-3.5 rounded-2xl border border-[#ddd0fa] shadow-[0_4px_15px_rgba(167,139,250,0.2)] flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#ede3fa] text-[#7c3aed] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <Droplets size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#1f2d4d] group-hover:text-violet-600 transition">
                  ปล่อยกลิ่นลดความเครียด
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  อโรมาบำบัด &amp; กลิ่นจากเมาส์
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        </div>
      </div>

      {/* ────────── FOOTER: Single Calm Quote ────────── */}
      <footer className="text-center z-10 shrink-0">
        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <span>"ให้เราอยู่เป็นเพื่อนคุณ ในทุกช่วงเวลาที่เหนื่อยล้า"</span>
          <Sparkles size={14} className="text-amber-400 inline-block animate-pulse" />
        </p>
      </footer>
    </div>
  );
};
