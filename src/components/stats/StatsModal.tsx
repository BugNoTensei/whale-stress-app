import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart2, X, Clock, Music, Heart, Sparkles, Award } from "lucide-react";
import { preferenceManager } from "../../utils/preferenceManager";
import { TRACKS } from "../music/RelaxationMusicScreen";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const prefs = preferenceManager.getPreferences();
  const sessionSec = preferenceManager.getSessionDurationSeconds();
  const totalListeningSec = prefs.listeningTimeTodaySeconds + sessionSec;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs} ชม. ${mins % 60} นาที`;
    return `${mins} นาที ${sec % 60} วินาที`;
  };

  const lastTrack = TRACKS.find(t => t.id === prefs.lastPlayedTrackId) || TRACKS[0];

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
            className="bg-[#182238]/95 border border-white/20 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden text-white relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <BarChart2 className="text-sky-400 w-5 h-5" />
                <h2 className="text-base font-bold">สถิติการผ่อนคลาย (Relaxation Stats)</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
                  <div className="text-sky-400 mb-2"><Clock size={20} /></div>
                  <div>
                    <div className="text-[10px] text-white/60 font-semibold">เวลาพักผ่อนรวมวันนี้</div>
                    <div className="text-sm font-bold text-white mt-0.5">{formatDuration(totalListeningSec)}</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
                  <div className="text-emerald-400 mb-2"><Music size={20} /></div>
                  <div>
                    <div className="text-[10px] text-white/60 font-semibold">จำนวนเพลงที่ฟังแล้ว</div>
                    <div className="text-sm font-bold text-white mt-0.5">{prefs.songsPlayedCount} เพลง</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
                  <div className="text-pink-400 mb-2"><Heart size={20} /></div>
                  <div>
                    <div className="text-[10px] text-white/60 font-semibold">รายการเพลงโปรด</div>
                    <div className="text-sm font-bold text-white mt-0.5">{prefs.favorites.length} เพลง</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
                  <div className="text-amber-400 mb-2"><Sparkles size={20} /></div>
                  <div>
                    <div className="text-[10px] text-white/60 font-semibold">Session ปัจจุบัน</div>
                    <div className="text-sm font-bold text-white mt-0.5">{formatDuration(sessionSec)}</div>
                  </div>
                </div>
              </div>

              {/* Most played song card */}
              <div className="bg-sky-500/15 border border-sky-400/30 p-3.5 rounded-2xl flex items-center gap-3 mt-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/30 flex items-center justify-center text-sky-300 font-bold shrink-0">
                  <Award size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-sky-200/80 font-semibold">เพลงผ่อนคลายล่าสุด</div>
                  <div className="text-xs font-bold text-white truncate">{lastTrack.title}</div>
                  <div className="text-[9px] text-white/60 truncate">{lastTrack.subtitle}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
