import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X, Music, EyeOff, Wind, Timer, Keyboard } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 select-none"
        >
          <motion.div
            initial={{ scale: 0.92, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="bg-[#182238]/95 border border-white/20 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden text-white relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-sky-400 w-5 h-5" />
                <h2 className="text-base font-bold">คู่มือการใช้งาน (Help & How to Use)</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Help Cards List */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-115 text-xs" style={{ scrollbarWidth: "none" }}>
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 shrink-0"><Music size={18} /></div>
                <div>
                  <div className="font-bold text-white text-xs mb-0.5">1. วิธีการฟังเพลงผ่อนคลาย</div>
                  <div className="text-white/60 text-[11px]">เลือกหมวดหมู่เพลงหรือเสียงธรรมชาติ ปรับระดับเสียงดนตรีและบรรยากาศแยกอิสระได้ตามต้องการ</div>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0"><EyeOff size={18} /></div>
                <div>
                  <div className="font-bold text-white text-xs mb-0.5">2. โหมดพักสายตา (Focus Mode)</div>
                  <div className="text-white/60 text-[11px]">เมื่อไม่มีการเคลื่อนไหวเมาส์ครบ 2 นาที หน้าจอจะซ่อนเมนูเพื่อความผ่อนคลายเต็มรูปแบบ เพียงขยับเมาส์เพื่อดึงเมนูกลับมา</div>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0"><Wind size={18} /></div>
                <div>
                  <div className="font-bold text-white text-xs mb-0.5">3. วงกลมฝึกหายใจ (Breathing Guide)</div>
                  <div className="text-white/60 text-[11px]">กดปุ่ม 🫁 ฝึกหายใจ เพื่อแสดงวงกลมนำทาง หายใจเข้า 3 วินาที กลั้นหายใจ 1 วินาที และหายใจออก 4 วินาที</div>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 shrink-0"><Timer size={18} /></div>
                <div>
                  <div className="font-bold text-white text-xs mb-0.5">4. ตั้งเวลาปิดเพลง (Sleep Timer)</div>
                  <div className="text-white/60 text-[11px]">กดไอคอนนาฬิกา เพื่อเลือกเวลาหยุดเพลงอัตโนมัติ (10, 20, 30, 45 หรือ 60 นาที)</div>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0"><Keyboard size={18} /></div>
                <div>
                  <div className="font-bold text-white text-xs mb-0.5">5. คีย์ลัดคีย์บอร์ด (Shortcuts)</div>
                  <div className="text-white/60 text-[11px]">Space = เล่น/หยุด | ← / → = สลับเพลง | ↑ / ↓ = ปรับเสียง | M = ปิดเสียง | Esc = กลับ</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
