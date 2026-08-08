import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertOctagon, Music, Gamepad2, Wind, X, ArrowRight, HeartPulse, Droplets, Sparkles } from "lucide-react";
import { WhaleSharkIcon } from "../ui/WhaleSharkIcon";

interface StressAlertModalProps {
  isOpen: boolean;
  stressPercentage?: number;
  onClose: () => void;
  onSelectOption: (action: "music" | "whale_ocean_game" | "bubble_pop_game" | "aroma" | "self_relaxation") => void;
}

export const StressAlertModal: React.FC<StressAlertModalProps> = ({
  isOpen,
  stressPercentage = 85,
  onClose,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/70 backdrop-blur-md select-none">
        {/* Soft Pastel Rose Ambient Glow */}
        <div className="absolute w-96 h-96 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[#241720]/95 backdrop-blur-xl border border-rose-300/30 rounded-3xl p-5 shadow-xl text-white overflow-hidden max-h-[88vh] flex flex-col"
          style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
        >
          {/* Top Soft Pastel Rose Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-300 via-pink-300 to-rose-300" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer z-20"
            title="ปิดการแจ้งเตือน"
          >
            <X size={15} />
          </button>

          {/* 1. Header Soft Pastel Badge */}
          <div className="flex items-center justify-between gap-2 mb-3 pt-0.5">
            <span className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-300/40 text-rose-200 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
              <HeartPulse size={14} className="text-rose-300 animate-pulse" />
              <span>ตรวจพบสภาวะความเครียด (Mouse Agitation)</span>
            </span>
          </div>

          {/* 2. Soft Pastel Stress Gauge Bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-3.5">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-rose-100 flex items-center gap-1.5">
                <AlertOctagon size={14} className="text-rose-300" />
                ระดับการขยับเมาส์อย่างตึงเครียด:
              </span>
              <span className="text-rose-300 font-extrabold text-sm">
                {stressPercentage}% (ค่อนข้างสูง)
              </span>
            </div>

            {/* Soft Pastel Progress Bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stressPercentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-rose-400 via-rose-300 to-pink-300 rounded-full"
              />
            </div>
          </div>

          {/* 3. Mascot Care Box */}
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-300/25 rounded-2xl p-3 mb-3.5">
            <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl border border-white/15 flex items-center justify-center p-1">
              <WhaleSharkIcon className="w-8 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-200 mb-0.5">น้องฉลามวาฬเป็นห่วงนะ 🐋</div>
              <p className="text-[11px] text-rose-100/90 leading-snug">
                "เราสังเกตเห็นการขยับเมาส์อย่างตึงเครียด พักสายตาแล้วเลือกผ่อนคลายกับเราสักแป๊บไหมครับ"
              </p>
            </div>
          </div>

          {/* 4. Soft Quick Action Items */}
          <div className="space-y-2 mb-4">
            {/* Option A: Music */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption("music")}
              className="w-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-300/40 p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-300/30 shrink-0">
                  <Music size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-200 transition">
                    ฟังเพลงดนตรีผ่อนคลาย (Relaxation Music)
                  </div>
                  <div className="text-[10px] text-white/60">ฟังคลื่นเสียงธรรมชาติปรับคลื่นสมอง</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-rose-300 group-hover:translate-x-1 transition" />
            </motion.button>

            {/* Option B: Whale Ocean Game */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption("whale_ocean_game")}
              className="w-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-300/40 p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-300/30 shrink-0">
                  <Gamepad2 size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-200 transition">
                    ท่องมหาสมุทรฉลามวาฬ (Whale Ocean)
                  </div>
                  <div className="text-[10px] text-white/60">ว่ายน้ำคลายความเหนื่อยล้า</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-emerald-300 group-hover:translate-x-1 transition" />
            </motion.button>

            {/* Option C: Bubble Pop */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption("bubble_pop_game")}
              className="w-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-300/40 p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-300/30 shrink-0">
                  <Wind size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-200 transition">
                    เกมเป่าฟองระบายอารมณ์ (Bubble Pop)
                  </div>
                  <div className="text-[10px] text-white/60">จิ้มฟองผ่อนคลายความเครียด</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-purple-300 group-hover:translate-x-1 transition" />
            </motion.button>

            {/* Option D: Self Relaxation */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption("self_relaxation")}
              className="w-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-300/40 p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-300/30 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-200 transition">
                    กิจกรรมผ่อนคลายด้วยตนเอง (Self-Relaxation)
                  </div>
                  <div className="text-[10px] text-white/60">หายใจ 4-7-8, Grounding 5-4-3-2-1 &amp; สแกนกล้ามเนื้อ</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-emerald-300 group-hover:translate-x-1 transition" />
            </motion.button>

            {/* Option E: Aroma Diffuser */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption("aroma")}
              className="w-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-300/40 p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-300/30 shrink-0">
                  <Droplets size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-rose-200 transition">
                    ปล่อยกลิ่นลดความเครียด
                  </div>
                  <div className="text-[10px] text-white/60">ปล่อยกลิ่นอโรมาบำบัดจากเมาส์</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-violet-300 group-hover:translate-x-1 transition" />
            </motion.button>
          </div>

          {/* 5. Footer Buttons */}
          <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition cursor-pointer"
            >
              ข้ามไปก่อน
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectOption("music")}
              className="px-4 py-1.5 rounded-xl bg-rose-400 hover:bg-rose-500 text-slate-950 text-xs font-extrabold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>ผ่อนคลายทันที</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
