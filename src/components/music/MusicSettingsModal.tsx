import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  X,
  Volume2,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { preferenceManager, ThemeMode, ParticleDensity } from "../../utils/preferenceManager";
import { musicAudio } from "../../utils/musicAudioEngine";

interface MusicSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, icon?: string) => void;
}

export const MusicSettingsModal: React.FC<MusicSettingsModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [prefs, setPrefs] = useState(() => preferenceManager.getPreferences());

  const handleThemeChange = (mode: ThemeMode) => {
    preferenceManager.updatePreferences({ theme: mode });
    setPrefs(preferenceManager.getPreferences());
    onToast(`เปลี่ยนธีมเป็น ${mode === "dark" ? "มืด (Dark)" : mode === "light" ? "สว่าง (Light)" : "ระบบ (System)"}`, "🎨");
  };

  const handleParticleDensity = (density: ParticleDensity) => {
    preferenceManager.updatePreferences({ particleDensity: density });
    setPrefs(preferenceManager.getPreferences());
    onToast(`ปรับระดับความละเอียด Particle เป็น ${density}`, "✨");
  };

  const handleRestoreDefaults = () => {
    const res = preferenceManager.restoreDefaults();
    setPrefs(res);
    musicAudio.setMusicVolume(res.musicVolume);
    musicAudio.setAmbientVolume(res.ambientVolume);
    onToast("คืนค่าเริ่มต้นเรียบร้อยแล้ว", "🔄");
  };

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
                <Settings className="text-sky-400 w-5 h-5" />
                <h2 className="text-base font-bold">การตั้งค่าระบบ (Settings)</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-110" style={{ scrollbarWidth: "none" }}>
              {/* Theme Settings */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                  <Moon size={14} className="text-sky-400" /> ธีมหน้าจอ (Theme Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${prefs.theme === "light" ? "bg-sky-500 border-sky-400 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15"}`}
                  >
                    <Sun size={14} /> สว่าง
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${prefs.theme === "dark" ? "bg-sky-500 border-sky-400 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15"}`}
                  >
                    <Moon size={14} /> มืด
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${prefs.theme === "system" ? "bg-sky-500 border-sky-400 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15"}`}
                  >
                    <Monitor size={14} /> ตามระบบ
                  </button>
                </div>
              </div>

              {/* Particle Density Performance Settings */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-400" /> ความละเอียดอนุมูลเอฟเฟกต์ (Particle Density)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleParticleDensity("low")}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${prefs.particleDensity === "low" ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15"}`}
                  >
                    ประหยัด (Low)
                  </button>
                  <button
                    onClick={() => handleParticleDensity("medium")}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${prefs.particleDensity === "medium" ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15"}`}
                  >
                    สมดุล (Medium)
                  </button>
                  <button
                    onClick={() => handleParticleDensity("high")}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${prefs.particleDensity === "high" ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15"}`}
                  >
                    สูงสุด (High)
                  </button>
                </div>
              </div>

              {/* Volumes */}
              <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-white/90 flex items-center gap-1.5">
                  <Volume2 size={14} className="text-sky-400" /> ระดับเสียงสองช่องทาง (Independent Channels)
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-white/70">
                    <span>เสียงดนตรีหลัก (Music Channel):</span>
                    <span>{Math.round(prefs.musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={prefs.musicVolume}
                    onChange={(e) => {
                      const v = +e.target.value;
                      musicAudio.setMusicVolume(v);
                      preferenceManager.updatePreferences({ musicVolume: v });
                      setPrefs(preferenceManager.getPreferences());
                    }}
                    className="w-full accent-sky-400 h-1 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-white/70">
                    <span>เสียงบรรยากาศธรรมชาติ (Ambient Channel):</span>
                    <span>{Math.round(prefs.ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={prefs.ambientVolume}
                    onChange={(e) => {
                      const v = +e.target.value;
                      musicAudio.setAmbientVolume(v);
                      preferenceManager.updatePreferences({ ambientVolume: v });
                      setPrefs(preferenceManager.getPreferences());
                    }}
                    className="w-full accent-emerald-400 h-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 bg-black/20 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs text-white/80 font-semibold">
                  <span>สลับเพลงถัดไปอัตโนมัติ (Auto Play Next)</span>
                  <input
                    type="checkbox"
                    checked={prefs.autoPlayNext}
                    onChange={(e) => {
                      preferenceManager.updatePreferences({ autoPlayNext: e.target.checked });
                      setPrefs(preferenceManager.getPreferences());
                    }}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Restore Defaults */}
              <div className="pt-2 flex justify-between items-center">
                <span className="text-[10px] text-white/40">* ระบบบันทึกการตั้งค่าทั้งหมดอัตโนมัติ</span>
                <button
                  onClick={handleRestoreDefaults}
                  className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-500/30 transition"
                >
                  <RotateCcw size={14} /> คืนค่าเริ่มต้น
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
