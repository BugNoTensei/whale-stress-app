import React from "react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl w-full"
    >
      <div className="text-4xl mb-2 drop-shadow-md">{icon}</div>
      <h3 className="text-xs font-bold text-white mb-1">{title}</h3>
      <p className="text-[11px] text-white/60 max-w-xs leading-relaxed mb-3">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
