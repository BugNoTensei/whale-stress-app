import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, X, Shield, Cpu, HeartHandshake } from "lucide-react";
import whaleIcon from "../../assets/icon/whaleicon.png";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
                <Info className="text-sky-400 w-5 h-5" />
                <h2 className="text-base font-bold">เกี่ยวกับนวัตกรรม (About Innovation)</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-115 text-xs text-white/80 leading-relaxed" style={{ scrollbarWidth: "none" }}>
              {/* Mascot Hero */}
              <div className="flex flex-col items-center text-center bg-black/25 p-4 rounded-2xl border border-white/10">
                <img src={whaleIcon} alt="Whale Shark" className="w-20 h-14 object-contain mb-2 drop-shadow-md animate-bounce" />
                <h3 className="text-sm font-bold text-sky-300">Stress Relief Application & Whale Mouse Concept</h3>
                <p className="text-[11px] text-white/60 mt-1">นวัตกรรมเมาส์สุขภาพรูปทรงฉลามวาฬ และแอปพลิเคชันเพื่อการผ่อนคลายจิตใจ</p>
              </div>

              {/* Purpose */}
              <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="font-bold text-sky-300 flex items-center gap-1.5 text-xs">
                  <HeartHandshake size={14} /> วัตถุประสงค์โครงการ (Project Purpose)
                </div>
                <p className="text-[11px]">
                  ออกแบบเพื่อช่วยเหลือผู้ใช้งานคอมพิวเตอร์เป็นเวลานาน ผ่อนคลายความเครียดจากการทำงาน ด้วยดนตรีบำบัดคลื่นสมอง และเกมผ่อนคลายอารมณ์ไร้การแข่งขัน (Zero Pressure Gaming)
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                  <Cpu size={14} /> เทคโนโลยีที่ใช้ (Technology Used)
                </div>
                <p className="text-[11px]">
                  Tauri Framework, React 19, TypeScript, Web Audio API procedural sound synthesis, Canvas 2D 60FPS fluid rendering Engine.
                </p>
              </div>

              {/* Hardware Vision */}
              <div className="space-y-1 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="font-bold text-pink-300 flex items-center gap-1.5 text-xs">
                  <Shield size={14} /> วิสัยทัศน์การต่อยอดในอนาคต (Future Hardware Vision)
                </div>
                <p className="text-[11px]">
                  รองรับการเชื่อมต่อกับเมาส์อัจฉริยะรูปฉลามวาฬ เพื่อตรวจวัดอัตราการเต้นของหัวใจ และตอบสนองด้วยการปรับบรรยากาศดนตรีบำบัดโดยอัตโนมัติ
                </p>
              </div>

              {/* Clean Modern Card Footer */}
              <div className="bg-black/30 p-4 rounded-2xl border border-white/12 space-y-2 mt-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-sky-300">
                  <span>Relaxation Music Therapy System</span>
                  <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full text-[9px] border border-sky-400/30">Prototype Release</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {["React 19", "TypeScript", "Canvas 2D", "Web Audio API", "Framer Motion", "Tauri"].map(tech => (
                    <span key={tech} className="bg-white/10 text-white/80 px-2 py-0.5 rounded-md text-[9px] font-medium border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="text-center pt-2 text-[9.5px] text-white/40 border-t border-white/10">
                  © 2026 Whale Stress Relief Innovation Team. All rights reserved.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
