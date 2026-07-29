import React from "react";
import { Sparkles, Download, RefreshCw, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { UpdateStatus, UpdateInfo } from "../../hooks/useUpdater";

interface UpdateModalProps {
  status: UpdateStatus;
  currentVersion: string;
  updateInfo: UpdateInfo | null;
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  errorMessage: string | null;
  onStartDownload: () => void;
  onRelaunch: () => void;
  onDismiss: () => void;
  onRetry: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  status,
  currentVersion,
  updateInfo,
  progress,
  downloadedBytes,
  totalBytes,
  errorMessage,
  onStartDownload,
  onRelaunch,
  onDismiss,
  onRetry,
}) => {
  if (status === "idle" || status === "checking" || status === "up-to-date") {
    return null;
  }

  const formatMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(91,139,241,0.25)] border border-sky-100 overflow-hidden flex flex-col p-6 text-slate-700 animate-scaleUp">
        {/* Close button (only available before downloading) */}
        {status === "available" && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100/80 transition cursor-pointer"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mt-1">
          <div className="w-14 h-14 bg-linear-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-400/30 mb-3 text-white">
            {status === "ready" ? (
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            ) : status === "error" ? (
              <AlertCircle className="w-8 h-8 text-rose-200" />
            ) : (
              <Sparkles className="w-7 h-7 animate-pulse" />
            )}
          </div>

          <h3 className="text-xl font-bold text-[#1f2d4d]">
            {status === "ready"
              ? "พร้อมติดตั้งอัปเดตแล้ว! 🐳"
              : status === "downloading"
              ? "กำลังดาวน์โหลดอัปเดต..."
              : status === "error"
              ? "เกิดข้อผิดพลาดในการอัปเดต"
              : "พบเวอร์ชันใหม่พร้อมอัปเดต! ✨"}
          </h3>

          {/* Version tags */}
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-sky-50 border border-sky-200/60 rounded-full text-xs font-semibold text-sky-700">
            <span>v{currentVersion}</span>
            <span>➔</span>
            <span className="text-indigo-600 font-bold">
              v{updateInfo?.version || "ใหม่"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="my-4">
          {status === "available" && (
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 max-h-36 overflow-y-auto text-xs leading-relaxed text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">มีอะไรใหม่ในเวอร์ชันนี้:</p>
              <div className="whitespace-pre-line text-slate-500 font-medium">
                {updateInfo?.body || "อัปเดตความเสถียรและปรับปรุงประสิทธิภาพทั่วไป"}
              </div>
            </div>
          )}

          {status === "downloading" && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 px-1">
                <span>ดาวน์โหลดไปแล้ว</span>
                <span className="text-sky-600 font-bold">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-linear-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {totalBytes > 0 && (
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  {formatMB(downloadedBytes)} MB / {formatMB(totalBytes)} MB
                </p>
              )}
            </div>
          )}

          {status === "ready" && (
            <p className="text-xs text-center text-slate-500 leading-relaxed py-1 font-medium">
              การดาวน์โหลดเสร็จสมบูรณ์ คลิกปุ่มด้านล่างเพื่อทำการรีสตาร์ทแอปและเริ่มใช้งานเวอร์ชันใหม่ได้ทันที
            </p>
          )}

          {status === "error" && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-3 text-xs text-center font-medium">
              {errorMessage || "ไม่สามารถอัปเดตได้ในขณะนี้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-1">
          {status === "available" && (
            <>
              <button
                onClick={onStartDownload}
                className="w-full py-3 px-4 bg-linear-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>อัปเดตทันที</span>
              </button>
              <button
                onClick={onDismiss}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold rounded-2xl active:scale-[0.98] transition cursor-pointer text-xs"
              >
                ไว้ทีหลัง
              </button>
            </>
          )}

          {status === "ready" && (
            <button
              onClick={onRelaunch}
              className="w-full py-3 px-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>รีสตาร์ทแอปทันที</span>
            </button>
          )}

          {status === "error" && (
            <div className="flex gap-2">
              <button
                onClick={onRetry}
                className="flex-1 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-md transition cursor-pointer text-xs"
              >
                ลองใหม่อีกครั้ง
              </button>
              <button
                onClick={onDismiss}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl transition cursor-pointer text-xs"
              >
                ปิด
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
