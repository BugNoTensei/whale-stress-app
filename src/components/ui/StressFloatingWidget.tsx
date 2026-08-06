import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Smile } from "lucide-react";

interface StressFloatingWidgetProps {
  statusText?: string;
  statusIcon?: string;
  className?: string;
}

export const StressFloatingWidget: React.FC<StressFloatingWidgetProps> = ({
  statusText = "กำลังลดลง",
  className = "",
}) => {
  const [phase, setPhase] = useState(0);

  // Animate the sine wave smoothly
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setPhase((prev) => (prev + 0.04) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate smooth sine wave SVG path (Width: 200, Height: 40)
  const W = 200;
  const H = 40;
  const numPoints = 50;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * W;
    // Multi-frequency organic wave harmonics (Dynamic & non-repetitive)
    const y =
      H / 2 +
      Math.sin(i * 0.22 + phase * 0.8) * 5 +
      Math.cos(i * 0.38 - phase * 1.2) * 3 +
      Math.sin(i * 0.1 + phase * 1.5) * 2;
    points.push({ x, y });
  }

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const lastPoint = points[points.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-[#0f172a]/35 hover:bg-[#0f172a]/55 backdrop-blur-md border border-white/20 rounded-3xl p-3.5 shadow-lg text-white w-60 select-none transition-all ${className}`}
    >
      {/* Title */}
      <div className="text-xs font-bold text-white/90 tracking-wide mb-2">
        ระดับความเครียดของคุณ
      </div>

      {/* Animated Waveform SVG */}
      <div className="relative w-full h-10 flex items-center justify-center my-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
          <defs>
            <filter id="blueDotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Smooth Sine Wave Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Glowing Blue Leading Dot at the end of the wave */}
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={5}
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1.5"
            filter="url(#blueDotGlow)"
          />
        </svg>
      </div>

      {/* Separator Divider */}
      <div className="border-t border-white/12 my-2.5" />

      {/* Status Footer Row matching reference image */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#4ade80] text-slate-900 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <Smile size={18} className="stroke-[2.5]" />
        </div>
        <span className="text-xs font-extrabold text-[#4ade80] tracking-wide">
          {statusText}
        </span>
      </div>
    </motion.div>
  );
};
