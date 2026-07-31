import React from "react";
import { X, RefreshCw, Info, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { UpdateStatus } from "../../hooks/useUpdater";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
  status: UpdateStatus;
  onCheckUpdate: () => void;
  onTriggerMock: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  currentVersion,
  status,
  onCheckUpdate,
  onTriggerMock,
}) => {
  const handleManualCheck = async () => {
    onCheckUpdate();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end select-none transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Container with Pure CSS 120 FPS GPU Compositing */}
      <div
        style={{
          willChange: "transform",
          transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative w-full max-w-xs h-full bg-white shadow-2xl border-l border-sky-100 p-6 flex flex-col justify-between text-slate-700 z-10"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-lg text-[#1f2d4d]">
              <Info className="w-5 h-5 text-sky-500" />
              <span>การตั้งค่า & ข้อมูล</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* App Info Card */}
          <div className="my-6 bg-linear-to-br from-sky-50 to-indigo-50/50 rounded-2xl p-4 border border-sky-100 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-2">
              🐳
            </div>
            <h4 className="font-bold text-[#1f2d4d] text-base">whale-stress-app</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              เวอร์ชันปัจจุบัน: <span className="font-bold text-sky-600">v{currentVersion}</span>
            </p>

            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ระบบอัปเดตความปลอดภัยพร้อมใช้งาน</span>
            </div>
          </div>

          {/* Settings Actions */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              ซอฟต์แวร์อัปเดต
            </label>

            <button
              onClick={handleManualCheck}
              disabled={status === "checking"}
              className="w-full p-3 bg-white hover:bg-sky-50/60 border border-slate-200/80 rounded-2xl shadow-xs flex items-center justify-between transition cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition">
                  <RefreshCw className={`w-4 h-4 ${status === "checking" ? "animate-spin" : ""}`} />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {status === "checking" ? "กำลังตรวจสอบ..." : "ตรวจสอบการอัปเดต"}
                </span>
              </div>
              {status === "up-to-date" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </button>

            {status === "up-to-date" && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>คุณกำลังใช้งานเวอร์ชันล่าสุดแล้ว 🐳</span>
              </div>
            )}

            {/* Dev Mode UI Test button */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider px-1 block mb-2">
                ผู้พัฒนา (Dev Testing)
              </label>
              <button
                onClick={() => {
                  onTriggerMock();
                  onClose();
                }}
                className="w-full p-2.5 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/60 text-indigo-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>ทดสอบ UI ป๊อบอัปอัปเดต (Mock UI)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            Whale Stress Reliever © 2026
          </p>
        </div>
      </div>
    </div>
  );
};
