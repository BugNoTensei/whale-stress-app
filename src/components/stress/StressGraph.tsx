import React, { useMemo } from "react";

interface StressGraphProps {
  currentPercentage?: number;
  transparent?: boolean;
  className?: string;
}

export const StressGraph: React.FC<StressGraphProps> = ({
  currentPercentage = 73,
  transparent = false,
  className = "",
}) => {
  // Dynamically generate measurement timestamps ending at current time
  const historyData = useMemo(() => {
    const now = new Date();
    const times: string[] = [];
    for (let i = 6; i >= 1; i--) {
      const past = new Date(now.getTime() - i * 45 * 60 * 1000);
      const hrs = past.getHours().toString().padStart(2, "0");
      const mins = past.getMinutes().toString().padStart(2, "0");
      times.push(`${hrs}:${mins}`);
    }
    const currentHrs = now.getHours().toString().padStart(2, "0");
    const currentMins = now.getMinutes().toString().padStart(2, "0");
    times.push(`${currentHrs}:${currentMins}`);

    // Randomize organic historical stress readings leading up to currentPercentage
    const randOffset = () => Math.floor((Math.random() - 0.45) * 28);

    return [
      {
        timeLabel: times[0],
        val: Math.max(20, Math.min(85, currentPercentage - 25 + randOffset())),
      },
      {
        timeLabel: times[1],
        val: Math.max(25, Math.min(90, currentPercentage - 10 + randOffset())),
      },
      {
        timeLabel: times[2],
        val: Math.max(20, Math.min(85, currentPercentage - 20 + randOffset())),
      },
      {
        timeLabel: times[3],
        val: Math.max(30, Math.min(92, currentPercentage + 12 + randOffset())),
      },
      {
        timeLabel: times[4],
        val: Math.max(25, Math.min(88, currentPercentage - 5 + randOffset())),
      },
      {
        timeLabel: times[5],
        val: Math.max(30, Math.min(95, currentPercentage + 8 + randOffset())),
      },
      { timeLabel: `${times[6]} (ล่าสุด)`, val: currentPercentage },
    ];
  }, [currentPercentage]);

  // Wide SVG coordinates (Width: 460, Height: 170) for 100% full-width layout
  const W = 460;
  const H = 170;
  const padX = 35;
  const padY = 20;
  const graphW = W - padX * 2;
  const graphH = H - padY * 2;

  const points = historyData.map((d, i) => {
    const x = padX + (i / (historyData.length - 1)) * graphW;
    const y = H - padY - (d.val / 100) * graphH;
    return { x, y, ...d };
  });

  // Calculate smooth Bezier curve path string
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Area path string for gradient fill below curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - padY} L ${points[0].x} ${H - padY} Z`;

  // Dashed reference line position Y for current percentage
  const currentY = H - padY - (currentPercentage / 100) * graphH;

  return (
    <div
      className={`w-full h-full flex flex-col justify-between select-none rounded-3xl p-4 shadow-sm border overflow-hidden min-h-0 ${
        transparent
          ? "bg-white/75 backdrop-blur-md border-white/60 shadow-lg text-slate-800"
          : "bg-white border-slate-100"
      } ${className}`}
    >
      {/* 1. Header Pill */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
        <span className="text-[11px] font-black text-[#157a8c] bg-[#e0f4f7] px-4 py-1 rounded-full uppercase tracking-widest border border-[#b2e5ed]">
          STRESS METER GRAPH
        </span>
        <span className="text-xs font-extrabold text-slate-500">
          ประวัติการวัดความเครียดย้อนหลัง
        </span>
      </div>

      {/* 2. Main Line Chart SVG Container (100% Full Width & Height) */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1">
        {/* Chart SVG filling 100% container */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Multi-color Gradient Fill for Area under curve */}
            <linearGradient id="stressAreaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#facc15" stopOpacity="0.3" />
              <stop offset="85%" stopColor="#f87171" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.25" />
            </linearGradient>

            {/* Stroke Line Gradient */}
            <linearGradient id="stressLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="80%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Y-axis Static Grid Labels (Strictly ordered 100% -> 0%) */}
          {[
            { ratio: 0, label: "100%" },
            { ratio: 0.2, label: "80%" },
            { ratio: 0.4, label: "60%" },
            { ratio: 0.6, label: "40%" },
            { ratio: 0.8, label: "20%" },
            { ratio: 1.0, label: "0%" },
          ].map((item, idx) => {
            const gy = padY + item.ratio * graphH;
            return (
              <g key={idx}>
                <line
                  x1={padX}
                  y1={gy}
                  x2={W - padX}
                  y2={gy}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={item.ratio === 0 || item.ratio === 1.0 ? "" : "3,3"}
                />
                <text
                  x={padX - 8}
                  y={gy + 3}
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Dashed reference line for Current Percentage */}
          <line
            x1={padX}
            y1={currentY}
            x2={W - padX}
            y2={currentY}
            stroke="#991b1b"
            strokeWidth="1.5"
            strokeDasharray="5,4"
          />

          {/* Current Percentage Dynamic Y-Axis Red Badge */}
          <g transform={`translate(${padX - 8}, ${currentY})`}>
            <rect
              x="-30"
              y="-7"
              width="28"
              height="14"
              rx="4"
              fill="#ef4444"
            />
            <text
              x="-16"
              y="3"
              fill="#ffffff"
              fontSize="9"
              fontWeight="900"
              textAnchor="middle"
            >
              {currentPercentage}%
            </text>
          </g>

          {/* Area Fill */}
          <path d={areaD} fill="url(#stressAreaGrad)" />

          {/* Smooth Curve Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#stressLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => {
            const isCurrent = i === points.length - 1;
            const dotColor =
              pt.val > 70 ? "#ef4444" : pt.val > 45 ? "#eab308" : "#22c55e";

            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isCurrent ? 6.5 : 4.5}
                  fill={dotColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3. X-axis Timestamps Labels (เวลาที่วัดล่าสุด) */}
      <div className="w-full flex justify-between px-6 text-[10px] font-bold text-slate-500 mt-1">
        {historyData.map((d, i) => (
          <span
            key={i}
            className={
              i === historyData.length - 1 ? "text-rose-600 font-black" : ""
            }
          >
            {d.timeLabel}
          </span>
        ))}
      </div>

      {/* 4. Mood Levels Emojis Scale Row */}
      <div className="w-full grid grid-cols-5 gap-1 text-center mt-2.5 pt-2 border-t border-slate-100">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-400 mb-0.5">
            Very Low
          </span>
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shadow-xs border border-emerald-200">
            😊
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-400 mb-0.5">
            Low
          </span>
          <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm shadow-xs border border-green-200">
            🙂
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-400 mb-0.5">
            Medium
          </span>
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-xs border border-amber-200">
            😐
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-400 mb-0.5">
            High
          </span>
          <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm shadow-xs border border-orange-200">
            😟
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-400 mb-0.5">
            Very High
          </span>
          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm shadow-xs border border-rose-300 ring-2 ring-rose-400/40">
            😡
          </div>
        </div>
      </div>

      {/* 5. Legend */}
      <div className="flex items-center justify-center gap-5 text-[10px] font-bold text-slate-500 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-emerald-400" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-amber-400" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-rose-500" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
};
