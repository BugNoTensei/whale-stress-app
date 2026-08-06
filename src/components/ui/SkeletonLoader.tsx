import React from "react";

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 animate-pulse"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="h-3 bg-white/15 rounded w-3/4" />
            <div className="h-2.5 bg-white/10 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
