import React, { useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Play,
  Home,
  Music,
  Gamepad2,
  Wind,
  BarChart2,
  Smile,
  Heart,
  Volume2,
  Waves,
  MousePointer,
} from "lucide-react";
import gameBg1 from "../../assets/game_bg_1.png";
import gameBg2 from "../../assets/game_bg_2.png";
import whaleIcon from "../../assets/icon/whaleicon.png";

interface GameSelectionScreenProps {
  onBackToHome: () => void;
  onSelectGame?: (gameId: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const GameSelectionScreen: React.FC<GameSelectionScreenProps> = ({
  onBackToHome,
  onSelectGame,
  activeTab = "games",
  onTabChange,
}) => {
  // Auto switch landscape mode on mount if Tauri API is present
  useEffect(() => {
    const setLandscape = async () => {
      try {
        const { getCurrentWindow, LogicalSize } = await import("@tauri-apps/api/window");
        const appWindow = getCurrentWindow();
        await appWindow.setSize(new LogicalSize(980, 640));
        await appWindow.center();
      } catch (err) {
        // Fallback for normal browser dev mode
      }
    };
    setLandscape();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-x-auto p-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-240 max-w-full min-w-3xl h-full flex flex-col justify-between p-3 select-none gpu-accelerated z-10 mx-auto"
      >
      {/* Top Header Section */}
      <header className="relative w-full flex items-center justify-between pt-1 pb-2 px-1">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToHome}
          className="flex items-center gap-1 px-4 py-2 bg-white/90 hover:bg-white text-slate-600 font-bold rounded-full border border-sky-100 shadow-xs text-xs transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
          <span>กลับหน้าหลัก</span>
        </motion.button>

        {/* Center Title */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#1f2d4d] tracking-tight">
              เกมคลายเครียด
            </h1>
            <span className="text-2xl">🎮</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            เลือกเกมที่คุณชอบ เพื่อผ่อนคลายและลดความเครียด
          </p>
        </div>

        {/* Right Floating Whale Mascot */}
        <div className="w-24 h-12 flex items-center justify-end pr-2">
          <img
            src={whaleIcon}
            alt="Whale Mascot"
            className="w-16 h-12 object-contain animate-float-whale drop-shadow-md"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </header>

      {/* Main Content: 2 Game Cards Grid */}
      <main className="grid grid-cols-2 gap-5 w-full my-auto py-2">
        {/* Card 1: Bubble Pop Relax */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-100/70 p-5 flex flex-col justify-between h-97.5 group cursor-pointer"
          onClick={() => onSelectGame?.("bubble_pop")}
        >
          {/* Background Image & Overlay Gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${gameBg1})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#16274e]/95 via-[#1b3469]/55 to-transparent pointer-events-none" />

          {/* Top Content */}
          <div className="relative z-10">
            <span className="px-3.5 py-1 bg-[#254394] text-white font-bold text-xs rounded-full shadow-md inline-block">
              เกม 1
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2.5 drop-shadow-sm flex items-center gap-1.5">
              <span>Bubble Pop Relax</span>
              <span className="text-xl">🫧</span>
            </h2>
            <div className="text-xs text-sky-100/90 font-medium leading-relaxed mt-1.5 space-y-0.5 drop-shadow-xs">
              <p>คลิกฟองอากาศให้แตก</p>
              <p>เพลิดเพลินไปกับเสียงป๊อบเบาๆ</p>
              <p>และภาพสีสันสดใส</p>
            </div>
          </div>

          {/* Floating Bubble Pointer Hint */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2 z-10 pointer-events-none">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 bg-pink-400/30 rounded-full animate-ping" />
              <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full border-2 border-white/80 flex items-center justify-center shadow-lg">
                <MousePointer className="w-5 h-5 text-white drop-shadow-md animate-bounce" />
              </div>
            </div>
          </div>

          {/* Bottom Content: Glass Badges & Play Button */}
          <div className="relative z-10 flex items-end justify-between gap-2 mt-auto pt-4">
            {/* Left Glass Tags */}
            <div className="flex flex-col gap-1.5">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-2 shadow-xs">
                <Smile className="w-3.5 h-3.5 text-sky-200" />
                <span>เล่นง่าย ผ่อนคลาย</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-2 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-pink-200" />
                <span>ไม่มีแพ้ชนะ ไม่มีเวลา</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-2 shadow-xs">
                <Volume2 className="w-3.5 h-3.5 text-purple-200" />
                <span>เสียงป๊อบเบาๆ สบายใจ</span>
              </div>
            </div>

            {/* Right Play Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGame?.("bubble_pop");
              }}
              className="px-6 py-2.5 bg-[#254394] hover:bg-[#1e3678] text-white font-extrabold rounded-full shadow-lg shadow-[#16274e]/50 flex items-center gap-2 text-sm transition cursor-pointer shrink-0 border border-sky-300/40"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>เริ่มเล่น</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Card 2: Whale Ocean */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-100/70 p-5 flex flex-col justify-between h-97.5 group cursor-pointer"
          onClick={() => onSelectGame?.("whale_ocean")}
        >
          {/* Background Image & Overlay Gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${gameBg2})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0d2a4a]/95 via-[#133b66]/55 to-transparent pointer-events-none" />

          {/* Top Content */}
          <div className="relative z-10">
            <span className="px-3.5 py-1 bg-[#254394] text-white font-bold text-xs rounded-full shadow-md inline-block">
              เกม 2
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2.5 drop-shadow-sm flex items-center gap-1.5">
              <span>Whale Ocean</span>
              <span className="text-xl">🪸</span>
            </h2>
            <div className="text-xs text-sky-100/90 font-medium leading-relaxed mt-1.5 space-y-0.5 drop-shadow-xs">
              <p>พาลามวาฬว่ายเล่นในทะเล</p>
              <p>พบเจอเพื่อนใหม่ใต้ท้องทะเล</p>
              <p>เพลิดเพลินไปกับโลกที่สงบสุข</p>
            </div>
          </div>

          {/* Floating Ripple Pointer Hint */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 z-10 pointer-events-none">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 bg-sky-300/30 rounded-full animate-ping" />
              <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full border-2 border-white/80 flex items-center justify-center shadow-lg">
                <MousePointer className="w-5 h-5 text-white drop-shadow-md animate-bounce" />
              </div>
            </div>
          </div>

          {/* Bottom Content: Glass Badges & Play Button */}
          <div className="relative z-10 flex items-end justify-between gap-2 mt-auto pt-4">
            {/* Left Glass Tags */}
            <div className="flex flex-col gap-1.5">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-2 shadow-xs">
                <span className="text-xs">🐳</span>
                <span>ควบคุมง่าย แค่ขยับเมาส์</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-2 shadow-xs">
                <Waves className="w-3.5 h-3.5 text-cyan-200" />
                <span>ดนตรีทะเล ช่วยให้ใจสงบ</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-2 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-pink-200" />
                <span>ไม่มีคะแนน ไม่มีความกดดัน</span>
              </div>
            </div>

            {/* Right Play Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectGame?.("whale_ocean");
              }}
              className="px-6 py-2.5 bg-[#254394] hover:bg-[#1e3678] text-white font-extrabold rounded-full shadow-lg shadow-[#0d2a4a]/50 flex items-center gap-2 text-sm transition cursor-pointer shrink-0 border border-sky-300/40"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>เริ่มเล่น</span>
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation Bar (100% Matching Image Spec) */}
      <nav className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-sky-100/90 px-6 py-3 flex items-center justify-around z-30 my-1">
        {/* Item 1: Home */}
        <button
          onClick={onBackToHome}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === "home"
              ? "text-[#254394] font-extrabold bg-sky-50"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-xs">หน้าหลัก</span>
        </button>

        {/* Item 2: Music */}
        <button
          onClick={() => onTabChange?.("music")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === "music"
              ? "text-[#254394] font-extrabold bg-sky-50"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="text-xs">ฟังเพลง</span>
        </button>

        {/* Item 3: Games (Active) */}
        <button
          onClick={() => onTabChange?.("games")}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[#254394] font-extrabold bg-sky-50 border border-sky-200/60 shadow-xs cursor-pointer"
        >
          <Gamepad2 className="w-4.5 h-4.5 text-[#254394]" />
          <span className="text-xs">เกมคลายเครียด</span>
        </button>

        {/* Item 4: Breathing */}
        <button
          onClick={() => onTabChange?.("breathing")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === "breathing"
              ? "text-[#254394] font-extrabold bg-sky-50"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Wind className="w-4 h-4" />
          <span className="text-xs">ฝึกหายใจ</span>
        </button>

        {/* Item 5: Analytics */}
        <button
          onClick={() => onTabChange?.("analytics")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition cursor-pointer ${
            activeTab === "analytics"
              ? "text-[#254394] font-extrabold bg-sky-50"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span className="text-xs">สถิติความเครียด</span>
        </button>
      </nav>
    </motion.div>
  </div>
  );
};
