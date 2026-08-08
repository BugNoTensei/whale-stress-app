import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { Smile, GripVertical } from "lucide-react";

interface StressFloatingWidgetProps {
  statusText?: string;
  statusIcon?: string;
  className?: string;
  storageKey?: string;
  onClick?: () => void;
}

export const StressFloatingWidget: React.FC<StressFloatingWidgetProps> = ({
  statusText = "กำลังลดลง",
  className = "",
  storageKey = "widget-pos",
  onClick,
}) => {
  const [phase, setPhase] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Restore saved position from localStorage on mount (per screen key)
  const getSavedPos = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : { x: 16, y: 300 };
    } catch {
      return { x: 16, y: 300 };
    }
  };
  const saved = getSavedPos();

  // useMotionValue retains position across renders without re-initializing
  const motionX = useMotionValue(saved.x);
  const motionY = useMotionValue(saved.y);

  // Animate the realistic biological pulse slowly (Realistic medical speed)
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setPhase((prev) => (prev + 0.007) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate realistic medical biometric pulse waveform with crisp sharp R-peaks (แหลมคม + เหมือนจริง)
  const W = 200;
  const H = 40;
  const numPoints = 80;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * W;
    const t = (i * 0.2 + phase) % (Math.PI * 2);

    // Realistic medical biometric pulse (Sharp crisp R-peaks + smooth biological recovery)
    let y = H / 2;
    const sinT = Math.sin(t);
    if (sinT > 0.45) {
      // Crisp sharp R-peak (แหลมๆคมๆ)
      y -= Math.pow((sinT - 0.45) / 0.55, 2.2) * 11;
    } else if (sinT < -0.6) {
      // Subtle S-dip
      y += Math.pow((-sinT - 0.6) / 0.4, 1.8) * 4;
    } else {
      // Natural baseline organic wave
      y += Math.sin(t * 0.5) * 2;
    }

    points.push({ x, y });
  }

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const lastPoint = points[points.length - 1];

  return (
    // Full screen overlay as drag boundary (invisible, pointer-events-none)
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          x: motionX,
          y: motionY,
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          touchAction: "none",
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          // Read the exact final position from Framer Motion's internal value
          try {
            localStorage.setItem(
              storageKey,
              JSON.stringify({ x: motionX.get(), y: motionY.get() })
            );
          } catch {}
        }}
        onClick={(e) => {
          // Only fire onClick if we didn't drag
          if (!isDragging && onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        className={`pointer-events-auto bg-[#0f172a]/35 hover:bg-[#0f172a]/55 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg text-white w-60 select-none transition-[background] cursor-grab active:cursor-grabbing ${
          onClick ? "hover:scale-[1.02]" : ""
        } ${className}`}
      >
        {/* Drag handle bar at top */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-1">
          <div className="text-xs font-bold text-white/90 tracking-wide">
            ระดับความเครียดของคุณ
          </div>
          <div
            className="text-white/40 hover:text-white/70 transition"
            title="ลากเพื่อย้ายตำแหน่ง"
          >
            <GripVertical size={14} />
          </div>
        </div>

      {/* Realistic & Crisp Sharp Medical Biometric Waveform SVG (คมๆ + เหมือนจริง) */}
      <div className="relative w-full h-10 flex items-center justify-center my-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full overflow-visible"
          style={{ shapeRendering: "geometricPrecision" }}
        >
          <defs>
            <filter id="blueDotGlowSharpReal" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="sharpRealCyanGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Razor-Sharp High-Definition Realistic Pulse Line (คมๆ + เสมือนจริง) */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#sharpRealCyanGrad)"
            strokeWidth="2.4"
            strokeLinecap="square"
            strokeLinejoin="miter"
            opacity="0.95"
          />

          {/* Glowing Blue Leading Dot at the end of the wave */}
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={5}
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1.5"
            filter="url(#blueDotGlowSharpReal)"
          />
        </svg>
      </div>

      {/* Separator Divider */}
      <div className="border-t border-white/12 my-2.5" />

        {/* Status Footer Row */}
        <div className="flex items-center gap-2.5 px-3.5 pb-3.5">
          <div className="w-7 h-7 rounded-full bg-[#4ade80] text-slate-900 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Smile size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-extrabold text-[#4ade80] tracking-wide">
            {statusText}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
