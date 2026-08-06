import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import whaleIcon from "../../assets/icon/whaleicon.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white select-none"
      >
        {/* Ambient Glow */}
        <div className="absolute w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Mascot Logo */}
          <motion.div
            initial={{ scale: 0.7, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-4"
          >
            <img
              src={whaleIcon}
              alt="Whale Shark Logo"
              className="w-28 h-20 object-contain drop-shadow-[0_10px_25px_rgba(56,189,248,0.4)] animate-float"
            />
          </motion.div>

          {/* App Titles */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl font-black tracking-tight text-white mb-1"
          >
            Relaxation Music Therapy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs font-semibold text-sky-200/80 mb-6"
          >
            Stress Relief Application • Version 1.0 (Production Release)
          </motion.p>

          {/* Animated Loading Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 180 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="h-1.5 bg-white/10 rounded-full overflow-hidden relative border border-white/15"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, delay: 0.8, ease: "easeInOut" }}
              className="h-full bg-linear-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-full shadow-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-[10px] font-semibold text-white/50 mt-3 tracking-wider uppercase"
          >
            กำลังโหลดระบบดนตรีบำบัด...
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
