import { useState, useEffect, useCallback } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { getVersion } from "@tauri-apps/api/app";

export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "up-to-date"
  | "downloading"
  | "ready"
  | "error";

export interface UpdateInfo {
  version: string;
  body?: string;
  date?: string;
}

export function useUpdater() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [currentVersion, setCurrentVersion] = useState<string>("0.1.0");
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [activeUpdateObj, setActiveUpdateObj] = useState<Update | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch current app version
  useEffect(() => {
    async function loadVersion() {
      try {
        const ver = await getVersion();
        setCurrentVersion(ver);
      } catch {
        // Fallback for browser dev mode
        setCurrentVersion("0.1.0");
      }
    }
    loadVersion();
  }, []);

  // Main check function
  const checkForUpdates = useCallback(
    async (silent = true) => {
      setStatus("checking");
      setErrorMessage(null);

      try {
        const update = await check();

        if (update) {
          setActiveUpdateObj(update);
          setUpdateInfo({
            version: update.version,
            body: update.body || "มีการปรับปรุงประสิทธิภาพและแก้ไขบั๊กต่างๆ",
            date: update.date,
          });
          setStatus("available");
        } else {
          setActiveUpdateObj(null);
          setUpdateInfo(null);
          setStatus(silent ? "idle" : "up-to-date");
        }
      } catch (err: unknown) {
        console.warn("Update check warning:", err);
        if (!silent) {
          setErrorMessage(
            err instanceof Error ? err.message : "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปเดตได้"
          );
          setStatus("error");
        } else {
          setStatus("idle");
        }
      }
    },
    []
  );

  // Auto check on app startup
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdates(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [checkForUpdates]);

  // Download and install update
  const startDownloadAndInstall = async () => {
    if (!activeUpdateObj) {
      // Mock fallback for Dev mode UI test
      if (status === "available") {
        setStatus("downloading");
        let p = 0;
        const interval = setInterval(() => {
          p += 10;
          setProgress(p);
          setDownloadedBytes(p * 1024 * 1024);
          setTotalBytes(100 * 1024 * 1024);
          if (p >= 100) {
            clearInterval(interval);
            setStatus("ready");
          }
        }, 300);
      }
      return;
    }

    try {
      setStatus("downloading");
      setProgress(0);
      let downloaded = 0;
      let total = 0;

      await activeUpdateObj.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            total = event.data.contentLength || 0;
            setTotalBytes(total);
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            setDownloadedBytes(downloaded);
            if (total > 0) {
              const pct = Math.min(
                100,
                Math.round((downloaded / total) * 100)
              );
              setProgress(pct);
            }
            break;
          case "Finished":
            setProgress(100);
            setStatus("ready");
            break;
        }
      });

      setStatus("ready");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดาวน์โหลดอัปเดต"
      );
      setStatus("error");
    }
  };

  // Relaunch app
  const applyUpdateAndRelaunch = async () => {
    try {
      await relaunch();
    } catch (err) {
      console.error("Failed to relaunch:", err);
      // Fallback window reload if process plugin fails in dev
      window.location.reload();
    }
  };

  // Dismiss modal
  const dismissUpdate = () => {
    setStatus("idle");
  };

  // Trigger Mock update for UI testing
  const triggerMockUpdate = () => {
    setUpdateInfo({
      version: "0.1.1-beta",
      body: "🐳 อัปเดตทดสอบ UI สวยงาม!\n• เพิ่มเสียงวาฬบรรเลงคลายเครียดใหม่\n• ปรับแต่งกราฟแสดงผลสภาวะอารมณ์ให้นุ่มนวลขึ้น\n• รองรับระบบ Auto Update เต็มรูปแบบ",
      date: new Date().toLocaleDateString("th-TH"),
    });
    setStatus("available");
  };

  return {
    status,
    currentVersion,
    updateInfo,
    progress,
    downloadedBytes,
    totalBytes,
    errorMessage,
    checkForUpdates,
    startDownloadAndInstall,
    applyUpdateAndRelaunch,
    dismissUpdate,
    triggerMockUpdate,
  };
}
