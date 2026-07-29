import { useState, useEffect } from "react";
import { Menu, Settings, Music, Gamepad2, Heart } from "lucide-react";

import whaleIcon from "./assets/icon/whaleicon.png";
import { useUpdater } from "./hooks/useUpdater";
import { UpdateModal } from "./components/updater/UpdateModal";
import { SettingsDrawer } from "./components/updater/SettingsDrawer";

export default function App() {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const updater = useUpdater();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEvaluating(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-[#f4f8ff] text-[#2c3e50] flex flex-col font-sans select-none overflow-hidden relative p-4">
      <header className="w-full flex justify-between items-center z-10 px-2 py-1">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <Menu className="w-6 h-6 stroke-[1.5]" />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-slate-400 hover:text-slate-600 transition cursor-pointer relative"
        >
          <Settings className="w-6 h-6 stroke-[1.5]" />
          {updater.status === "available" && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-between z-10 max-w-sm mx-auto w-full pt-1 pb-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-48 h-28 flex items-center justify-center my-1">
            <img
              src={whaleIcon}
              alt="Whale"
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

        <div className="w-full bg-white/85 backdrop-blur-md rounded-4xl pt-6 pb-12 px-6 shadow-[0_10px_30px_rgba(160,190,235,0.22)] border border-white text-center my-auto relative overflow-hidden flex flex-col items-center justify-between min-h-64">
          <h2 className="text-xl font-bold text-[#1f2d4d] tracking-wide">
            ระดับความเครียดของคุณ
          </h2>

          <div className="relative w-full my-auto py-3 flex items-center justify-center">
            <svg
              className="absolute w-full h-16 text-[#d2e4fc] z-0"
              viewBox="0 0 320 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 0 30 L 70 30 L 80 30 L 92 8 L 104 50 L 114 18 L 126 38 L 135 30 L 185 30 L 194 8 L 206 50 L 216 18 L 228 38 L 238 30 L 320 30" />
            </svg>

            <div className="w-20 h-20 bg-[#5b8bf1] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(91,139,241,0.35)] z-10 relative">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 2 12 L 6 12 L 9 5 L 12 19 L 15 9 L 18 14 L 22 12" />
              </svg>

              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#ff6879] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            </div>
          </div>

          <div className="z-10 mb-1">
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
        </div>

        <div className="grid grid-cols-2 gap-3.5 w-full z-10">
          <button
            onClick={() => alert("เปิดเครื่องเล่นเพลง")}
            className="flex items-center justify-start gap-3 bg-white/80 hover:bg-white p-3.5 rounded-3xl shadow-[0_4px_15px_rgba(180,205,240,0.3)] transition border border-white active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <div className="w-11 h-11 bg-linear-to-br from-[#cbe0ff] to-[#a0c8ff] text-[#3b72d9] rounded-full flex items-center justify-center shrink-0 shadow-inner">
              <Music className="w-5 h-5 fill-[#3b72d9]" />
            </div>
            <span className="font-bold text-[#2a3a5e] text-base">ฟังเพลง</span>
          </button>

          <button
            onClick={() => alert("เปิดศูนย์รวมเกม")}
            className="flex items-center justify-start gap-3 bg-white/80 hover:bg-white p-3.5 rounded-3xl shadow-[0_4px_15px_rgba(180,205,240,0.3)] transition border border-white active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <div className="w-11 h-11 bg-linear-to-br from-[#d9d5ff] to-[#b8b0ff] text-[#6355d9] rounded-full flex items-center justify-center shrink-0 shadow-inner">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="font-bold text-[#2a3a5e] text-base">เล่นเกม</span>
          </button>
        </div>
      </main>

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
    </div>
  );
}
