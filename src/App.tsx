import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Settings } from "lucide-react";
import { useUpdater } from "./hooks/useUpdater";
import { UpdateModal } from "./components/updater/UpdateModal";
import { SettingsDrawer } from "./components/updater/SettingsDrawer";
import { StressResultScreen } from "./components/stress/StressResultScreen";
import { StressLevelType } from "./components/stress/VerticalStressMeter";
import { GameSelectionScreen } from "./components/games/GameSelectionScreen";
import { BubblePopGameScreen } from "./components/games/BubblePopGameScreen";
import WhaleOceanGameScreen from "./components/games/WhaleOceanGameScreen";
import RelaxationMusicScreen from "./components/music/RelaxationMusicScreen";
import { StressAlertModal } from "./components/stress/StressAlertModal";
import { useMouseStressDetector } from "./hooks/useMouseStressDetector";
import AromaDiffuserScreen from "./components/aroma/AromaDiffuserScreen";
import SelfRelaxationScreen from "./components/relaxation/SelfRelaxationScreen";

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

import { SplashScreen } from "./components/ui/SplashScreen";
import { HomeScreen } from "./components/home/HomeScreen";

export default function App() {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<
    "home" | "stress_result" | "games" | "bubble_pop_game" | "whale_ocean_game" | "music" | "aroma" | "self_relaxation"
  >("home");
  const [measuredLevel, setMeasuredLevel] = useState<StressLevelType>("medium");
  const [measuredPercentage, setMeasuredPercentage] = useState<number>(50);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mouseDetector = useMouseStressDetector(15000);
  const updater = useUpdater();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEvaluating(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isLandscape = true;

  // Smooth window morphing effect for landscape screens
  useEffect(() => {
    if (currentView === "music") {
      animateWindowSize(1100, 680, 380);
    } else {
      animateWindowSize(1000, 640, 380);
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

  return (
    <div className="w-screen h-screen bg-[#e8f1fc] flex items-center justify-center p-2 overflow-hidden select-none relative">
      {/* Animated Launch Splash Screen */}
      <AnimatePresence>
        {isEvaluating && <SplashScreen onComplete={() => setIsEvaluating(false)} />}
      </AnimatePresence>
      {/* Morphing App Frame with Synchronized Liquid Cubic Motion */}
      <motion.div
        animate={{
          width: currentView === "music" ? 1100 : 1000,
          height: currentView === "music" ? 680 : 640,
          borderRadius: 28,
        }}
        transition={{ duration: 0.38, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-[#f4f8ff] text-[#2c3e50] flex flex-col font-sans select-none overflow-hidden relative shadow-[0_20px_60px_rgba(91,139,241,0.22)] border border-white/90 p-3.5 max-w-full max-h-full"
      >
        {/* Hide default header when on landscape screens */}
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
          {currentView === "self_relaxation" ? (
            <motion.div
              key="self_relaxation_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full z-10 gpu-accelerated"
            >
              <SelfRelaxationScreen onBackToHome={() => setCurrentView("home")} />
            </motion.div>
          ) : currentView === "aroma" ? (
            <motion.div
              key="aroma_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full z-10 gpu-accelerated"
            >
              <AromaDiffuserScreen onBackToHome={() => setCurrentView("home")} />
            </motion.div>
          ) : currentView === "music" ? (
            <motion.div
              key="music_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full z-10 gpu-accelerated"
            >
              <RelaxationMusicScreen onBackToHome={() => setCurrentView("home")} />
            </motion.div>
          ) : currentView === "stress_result" ? (
            <motion.div
              key="stress_result_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full z-10 gpu-accelerated"
            >
              <StressResultScreen
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
            </motion.div>
          ) : currentView === "whale_ocean_game" ? (
            <motion.div
              key="whale_ocean_game_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center z-10 gpu-accelerated"
            >
              <WhaleOceanGameScreen
                onBackToHome={() => setCurrentView("games")}
              />
            </motion.div>
          ) : currentView === "bubble_pop_game" ? (
            <motion.div
              key="bubble_pop_game_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center z-10 gpu-accelerated"
            >
              <BubblePopGameScreen
                onBackToHome={() => setCurrentView("games")}
              />
            </motion.div>
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
                onSelectGame={(gameId) => {
                  if (gameId === "bubble_pop") {
                    setCurrentView("bubble_pop_game");
                  } else if (gameId === "whale_ocean") {
                    setCurrentView("whale_ocean_game");
                  } else {
                    setToastMessage(`เกมนี้กำลังอยู่ระหว่างการพัฒนา 🐳`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home_landscape_view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full z-10 gpu-accelerated"
            >
              <HomeScreen
                onNavigate={(view) => {
                  if (view === "stress_result") {
                    handleOpenStressResult();
                  } else {
                    setCurrentView(view as typeof currentView);
                  }
                }}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onTriggerStressAlert={mouseDetector.triggerTestAlert}
                isEvaluating={isEvaluating}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Mouse Stress Alert Popup Mockup Modal */}
        <StressAlertModal
          isOpen={mouseDetector.isStressDetected}
          stressPercentage={mouseDetector.detectedStressPct}
          onClose={mouseDetector.dismissAlert}
          onSelectOption={(action) => {
            mouseDetector.dismissAlert();
            if (action === "aroma") {
              setCurrentView("aroma");
            } else {
              setCurrentView(action);
            }
          }}
        />

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
