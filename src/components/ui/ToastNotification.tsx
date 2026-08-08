import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { WhaleSharkIcon } from "./WhaleSharkIcon";

export interface ToastItem {
  id: string;
  message: string;
  icon?: string;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts }) => {
  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="bg-[#1f2d4d]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-xl shadow-slate-900/20 text-xs font-bold flex items-center gap-2 border border-white/20 pointer-events-none"
          >
            {toast.icon ? (
              <span className="text-sm">{toast.icon}</span>
            ) : (
              <WhaleSharkIcon className="w-5 h-3.5 inline-block" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
