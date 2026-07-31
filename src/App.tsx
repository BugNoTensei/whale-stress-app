import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Activity, Menu, Settings } from "lucide-react";

import whaleIcon from "./assets/icon/whaleicon.png";
import { useUpdater } from "./hooks/useUpdater";
import { UpdateModal } from "./components/updater/UpdateModal";
import { SettingsDrawer } from "./components/updater/SettingsDrawer";
import { StressResultScreen } from "./components/stress/StressResultScreen";
import { StressLevelType } from "./components/stress/VerticalStressMeter";
import { GameSelectionScreen } from "./components/games/GameSelectionScreen";

// Helper function for display Hz-synced smooth native window morphing animation (60Hz, 120Hz, 144Hz ProMotion)
const animateWindowSize = async (
  targetWidth: number,
  targetHeight: number,
  duration = 380,
) => {
  try {
    const { getCurrentWindow, LogicalSize } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    await appWindow.setResizable(true);

    const scaleFactor = await appWindow.scaleFactor();
    const currentSize = await appWindow.innerSize();
    const startW = currentSize.width / scaleFactor;
    const startH = currentSize.height / scaleFactor;

    if (Math.abs(startW - targetWidth) < 3 && Math.abs(startH - targetHeight) < 3) {
      await appWindow.setSize(new LogicalSize(targetWidth, targetHeight));
      await appWindow.center();
      return;
    }

    const startTime = performance.now();
    let lastW = startW;
    let lastH = startH;

    return new Promise<void>((resolve) => {
      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ultra-smooth Apple Quintic Ease-Out curve for high-Hz displays
        const ease = 1 - Math.pow(1 - progress, 5);

        const currentW = Math.round(startW + (targetWidth - startW) * ease);
        const currentH = Math.round(startH + (targetHeight - startH) * ease);

        // Only emit setSize IPC if values changed (optimizes high refresh rate rendering)
        if (currentW !== lastW || currentH !== lastH) {
          appWindow.setSize(new LogicalSize(currentW, currentH));
          lastW = currentW;
          lastH = currentH;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          appWindow.setSize(new LogicalSize(targetWidth, targetHeight));
          appWindow.center();
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  } catch (err) {
    // Web browser dev mode fallback
  }
};

export default function App() {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<
    "home" | "stress_result" | "games"
  >("home");
  const [measuredLevel, setMeasuredLevel] = useState<StressLevelType>("medium");
  const [measuredPercentage, setMeasuredPercentage] = useState<number>(50);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updater = useUpdater();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEvaluating(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Smooth window morphing effect when entering/exiting landscape games screen
  useEffect(() => {
    if (currentView === "games") {
      animateWindowSize(980, 640, 380);
    } else {
      animateWindowSize(400, 720, 380);
    }
  }, [currentView]);

  const handleOpenStressResult = () => {
    const levels: StressLevelType[] = [
      "very_low",
      "low",
      "medium",
      "high",
      "very_high",
    ];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const pctMap: Record<StressLevelType, number> = {
      very_low: 15,
      low: 35,
      medium: 52,
      high: 73,
      very_high: 90,
    };
    setMeasuredLevel(randomLevel);
    setMeasuredPercentage(pctMap[randomLevel]);
    setCurrentView("stress_result");
  };

  const isLandscape = currentView === "games";

  return (
    <div className="w-screen h-screen bg-[#e8f1fc] flex items-center justify-center p-2 overflow-hidden select-none relative">
      {/* Morphing App Frame with Synchronized Liquid Cubic Motion */}
      <motion.div
        animate={{
          width: isLandscape ? 980 : 400,
          height: isLandscape ? 640 : 720,
          borderRadius: isLandscape ? 28 : 36,
        }}
        transition={{ duration: 0.38, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-[#f4f8ff] text-[#2c3e50] flex flex-col font-sans select-none overflow-hidden relative shadow-[0_20px_60px_rgba(91,139,241,0.22)] border border-white/90 p-3.5 max-w-full max-h-full"
      >
        {/* Hide default header when on games landscape screen */}
        {!isLandscape && (
          <header className="w-full flex justify-between items-center z-10 px-2 py-1 max-w-sm mx-auto shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-400 hover:text-slate-600 transition cursor-pointer relative p-1"
            >
              <Settings className="w-6 h-6 stroke-[1.5]" />
              {updater.status === "available" && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </motion.button>
          </header>
        )}

      <AnimatePresence mode="wait">
        {currentView === "stress_result" ? (
          <StressResultScreen
            key="stress_result"
            measuredLevel={measuredLevel}
            stressPercentage={measuredPercentage}
            onSave={(level) => {
              setToastMessage(
                `บันทึกระดับความเครียด (${level}) เรียบร้อยแล้ว 💙`,
              );
              setCurrentView("home");
              setTimeout(() => setToastMessage(null), 3000);
            }}
            onCancel={() => setCurrentView("home")}
          />
        ) : currentView === "games" ? (
          <motion.div
            key="games_view"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center z-10 gpu-accelerated"
          >
            <GameSelectionScreen
              onBackToHome={() => setCurrentView("home")}
              onTabChange={(tab) => {
                if (tab === "home") setCurrentView("home");
                else if (tab === "games") setCurrentView("games");
                else {
                  setToastMessage(`ระบบ "${tab}" กำลังอยู่ระหว่างการพัฒนา 🐳`);
                  setTimeout(() => setToastMessage(null), 3000);
                }
              }}
              onSelectGame={(gameId) => {
                setToastMessage(
                  `เริ่มเกม ${gameId === "bubble_pop" ? "Bubble Pop Relax" : "Whale Ocean"}! 🎮`,
                );
                setTimeout(() => setToastMessage(null), 3000);
              }}
            />
          </motion.div>
        ) : (
          <motion.main
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            className="flex-1 flex flex-col items-center justify-between z-10 max-w-sm mx-auto w-full pt-1 pb-4 gpu-accelerated"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-28 flex items-center justify-center my-1">
                <motion.img
                  src={whaleIcon}
                  alt="Whale"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="max-w-full max-h-full object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerText =
                        "🐳 (วางรูปฉลามวาฬที่นี่)";
                      e.currentTarget.parentElement.className =
                        "w-48 h-24 border-2 border-dashed border-sky-300 rounded-2xl flex items-center justify-center text-xs text-sky-500 font-medium my-1";
                    }
                  }}
                />
              </div>

              <h1 className="text-2xl font-bold text-[#2a3a5e] flex items-center gap-1.5 mt-1">
                ยินดีต้อนรับ <span className="text-[#81b2f8]">💙</span>
              </h1>

              <p className="text-[11px] text-slate-400 max-w-65 leading-relaxed mt-1 font-medium">
                ให้เราอยู่เป็นเพื่อนคุณในทุกช่วงเวลาที่เหนื่อยล้า
                <br />
                เลือกสิ่งที่คุณต้องการ เพื่อผ่อนคลายความเครียด
              </p>
            </div>

            {/* Clickable Stress Evaluation Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenStressResult}
              className="w-full bg-white/85 hover:bg-white/95 transition backdrop-blur-md rounded-4xl pt-6 pb-12 px-6 shadow-[0_10px_30px_rgba(160,190,235,0.22)] border border-white text-center my-auto relative overflow-hidden flex flex-col items-center justify-between min-h-64 cursor-pointer group"
              title="คลิกเพื่อดูหน้าประเมินระดับความเครียด"
            >
              <h2 className="text-xl font-bold text-[#1f2d4d] tracking-wide group-hover:text-sky-600 transition">
                ระดับความเครียดของคุณ 📊
              </h2>

              <div className="relative w-full my-auto py-3 flex items-center justify-center">
                <svg
                  className="absolute w-full h-16 text-[#d2e4fc] z-0 animate-wave-fluid"
                  viewBox="0 0 320 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 0 30 L 70 30 L 80 30 L 92 8 L 104 50 L 114 18 L 126 38 L 135 30 L 185 30 L 194 8 L 206 50 L 216 18 L 228 38 L 238 30 L 320 30" />
                </svg>

                <div className="w-20 h-20 bg-[#5b8bf1] group-hover:bg-[#4777dd] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(91,139,241,0.35)] z-10 relative transition">
                  <Activity className="w-10 h-10 text-white animate-pulse" />

                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#ff6879] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <Heart className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>
              </div>

              <div className="z-10 mb-1 flex flex-col items-center">
                {isEvaluating ? (
                  <p className="text-2xl font-bold text-[#1f2d4d] tracking-wider">
                    กำลังประเมิน...
                  </p>
                ) : (
                  <p className="text-xl font-bold text-[#1f2d4d] tracking-tight">
                    สภาวะอารมณ์ปกติ ผ่อนคลาย
                  </p>
                )}
              </div>

              <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none overflow-hidden rounded-b-4xl">
                <svg
                  className="absolute bottom-0 w-[120%] left-[-10%] h-12 text-[#bde0fe]/40"
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,80 C150,150 350,20 500,80 L500,150 L0,150 Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <svg
                  className="absolute bottom-0 w-[120%] left-[-5%] h-10 text-[#c8b6ff]/35"
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,100 C200,30 300,140 500,90 L500,150 L0,150 Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </motion.div>

            {/* Action Buttons: Music & Games matching Image 2 */}
            <div className="grid grid-cols-2 gap-3.5 w-full z-10">
              {/* Music Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => alert("เปิดเครื่องเล่นเพลง")}
                className="flex items-center justify-start gap-3 bg-white/95 hover:bg-white p-3.5 rounded-3xl shadow-[0_6px_20px_rgba(180,205,240,0.35)] transition border border-white cursor-pointer select-none"
              >
                <div className="w-12 h-12 bg-[#dce8f8] rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#3b66c4]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 3v10.55A3.992 3.992 0 0 0 7 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h10v6.55A3.992 3.992 0 0 0 19 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V3H9z" />
                  </svg>
                </div>
                <span className="font-bold text-[#1f2d4d] text-base">
                  ฟังเพลง
                </span>
              </motion.button>

              {/* Game Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentView("games")}
                className="flex items-center justify-start gap-3 bg-[#eef4ff] hover:bg-white p-3.5 rounded-3xl shadow-[0_6px_20px_rgba(180,205,240,0.35)] transition border border-[#d2e4fc] cursor-pointer select-none group"
              >
                <div className="w-12 h-12 bg-[#e3dbfa] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <svg
                    className="w-6 h-6 text-[#584fa8]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 6H7C4.24 6 2 8.24 2 11v4c0 1.66 1.34 3 3 3 1.25 0 2.33-.76 2.79-1.85L9 14h6l1.21 2.15C16.67 17.24 17.75 18 19 18c1.66 0 3-1.34 3-3v-4c0-2.76-2.24-5-5-5zm-9.5 6.5h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm8.5 1.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1.5-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                  </svg>
                </div>
                <span className="font-bold text-[#1f2d4d] text-base group-hover:text-[#254394]">
                  เล่นเกม
                </span>
              </motion.button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-[#8ec5fc]/60 via-[#e0c3fc]/30 to-transparent"></div>

        <div className="absolute bottom-6 left-8 w-3 h-3 border border-white/60 rounded-full bg-white/20 animate-pulse"></div>
        <div className="absolute bottom-16 left-12 w-2 h-2 border border-white/50 rounded-full bg-white/20"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 border border-white/60 rounded-full bg-white/20 animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-2.5 h-2.5 border border-white/50 rounded-full bg-white/20"></div>

        <svg
          className="absolute bottom-0 left-0 w-full h-24 text-[#7bb0f7]/40"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M 10 100 Q 20 60 12 40 Q 5 20 15 0 Q 25 20 20 50 Q 18 80 25 100 Z" />
          <path d="M 30 100 Q 40 70 35 50 Q 30 30 42 10 Q 48 35 45 65 Z" />
          <path
            d="M 360 100 Q 350 75 355 55 Q 360 35 348 15 Q 362 35 365 65 Z"
            fillOpacity="0.8"
          />
          <path d="M 380 100 Q 388 65 382 45 Q 375 25 388 5 Q 395 30 390 70 Z" />
        </svg>

        <svg
          className="absolute bottom-12 left-1/4 w-12 h-6 text-[#5b8bf1]/30"
          viewBox="0 0 50 25"
          fill="currentColor"
        >
          <path d="M 10 12 C 20 5, 35 5, 45 12 C 35 19, 20 19, 10 12 Z M 10 12 L 0 5 L 0 19 Z" />
        </svg>
        <svg
          className="absolute bottom-20 right-1/3 w-8 h-4 text-[#8a7af1]/30"
          viewBox="0 0 50 25"
          fill="currentColor"
        >
          <path d="M 10 12 C 20 5, 35 5, 45 12 C 35 19, 20 19, 10 12 Z M 10 12 L 0 5 L 0 19 Z" />
        </svg>
      </div>

      {/* Toast Notification with Soft Spring Entrance & Fade-out Exit */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#1f2d4d]/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-xl shadow-slate-900/20 text-xs font-bold flex items-center gap-2 border border-slate-700/40 pointer-events-none"
          >
            <span className="text-sm">🐳</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto Update Modal */}
      <UpdateModal
        status={updater.status}
        currentVersion={updater.currentVersion}
        updateInfo={updater.updateInfo}
        progress={updater.progress}
        downloadedBytes={updater.downloadedBytes}
        totalBytes={updater.totalBytes}
        errorMessage={updater.errorMessage}
        onStartDownload={updater.startDownloadAndInstall}
        onRelaunch={updater.applyUpdateAndRelaunch}
        onDismiss={updater.dismissUpdate}
        onRetry={() => updater.checkForUpdates(false)}
      />

      {/* Settings & Manual Check Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentVersion={updater.currentVersion}
        status={updater.status}
        onCheckUpdate={() => updater.checkForUpdates(false)}
        onTriggerMock={updater.triggerMockUpdate}
      />
      </motion.div>
    </div>
  );
}
