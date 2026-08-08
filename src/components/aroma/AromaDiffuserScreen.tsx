import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Wind,
  Zap,
  CheckCircle2,
  AlertCircle,
  Droplets,
} from "lucide-react";
import { WhaleSharkIcon } from "../ui/WhaleSharkIcon";

interface AromaProfile {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  intensity: number;
  color: string;
  accent: string;
  bg: string;
  emoji: string;
  stressReduction: number;
  duration: number;
}

const AROMA_PROFILES: AromaProfile[] = [
  {
    id: "lavender",
    name: "Lavender",
    nameTh: "ลาเวนเดอร์",
    description: "ผ่อนคลายระบบประสาท ลดความวิตกกังวล ส่งเสริมการนอนหลับ",
    intensity: 4,
    color: "#a78bfa",
    accent: "#7c3aed",
    bg: "from-[#f5f3ff] to-[#ede9fe]",
    emoji: "💜",
    stressReduction: 38,
    duration: 15,
  },
  {
    id: "peppermint",
    name: "Peppermint",
    nameTh: "เปปเปอร์มินต์",
    description: "กระตุ้นสมาธิ ลดอาการปวดหัว เพิ่มความตื่นตัวแบบผ่อนคลาย",
    intensity: 3,
    color: "#34d399",
    accent: "#059669",
    bg: "from-[#f0fdf4] to-[#dcfce7]",
    emoji: "💚",
    stressReduction: 29,
    duration: 10,
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    nameTh: "ยูคาลิปตัส",
    description: "ล้างพิษทางจิตใจ เปิดทางเดินหายใจ สดชื่นแบบธรรมชาติ",
    intensity: 5,
    color: "#38bdf8",
    accent: "#0284c7",
    bg: "from-[#f0f9ff] to-[#e0f2fe]",
    emoji: "🩵",
    stressReduction: 33,
    duration: 12,
  },
  {
    id: "bergamot",
    name: "Bergamot",
    nameTh: "เบอร์กาม็อต",
    description: "ยกระดับอารมณ์ ลดความซึมเศร้า ให้ความรู้สึกอบอุ่นสดใส",
    intensity: 3,
    color: "#fbbf24",
    accent: "#d97706",
    bg: "from-[#fffbeb] to-[#fef3c7]",
    emoji: "💛",
    stressReduction: 31,
    duration: 10,
  },
  {
    id: "cedarwood",
    name: "Cedarwood",
    nameTh: "ซีดาร์วูด",
    description: "ให้ความรู้สึกมั่นคง สงบลึก เหมาะสำหรับวันที่เครียดสูง",
    intensity: 4,
    color: "#fb923c",
    accent: "#c2410c",
    bg: "from-[#fff7ed] to-[#ffedd5]",
    emoji: "🧡",
    stressReduction: 42,
    duration: 20,
  },
  {
    id: "ylang",
    name: "Ylang Ylang",
    nameTh: "อิลัง อิลัง",
    description: "สดชื่นหรูหรา ลดความดันโลหิต ผ่อนคลายกล้ามเนื้อตึงเครียด",
    intensity: 3,
    color: "#f472b6",
    accent: "#be185d",
    bg: "from-[#fdf2f8] to-[#fce7f3]",
    emoji: "🩷",
    stressReduction: 35,
    duration: 12,
  },
];

type DiffuserStatus = "idle" | "activating" | "active" | "error";

interface AromaDiffuserScreenProps {
  onBackToHome: () => void;
}

export default function AromaDiffuserScreen({ onBackToHome }: AromaDiffuserScreenProps) {
  const [selectedProfile, setSelectedProfile] = useState<AromaProfile>(AROMA_PROFILES[0]);
  const [status, setStatus] = useState<DiffuserStatus>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [deviceConnected] = useState(true);
  const [moistureLevel] = useState(74);

  useEffect(() => {
    if (status !== "active") return;
    if (timeLeft <= 0) {
      setStatus("idle");
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [status, timeLeft]);

  const handleActivate = () => {
    if (status === "active") {
      setStatus("idle");
      setTimeLeft(0);
      return;
    }
    setStatus("activating");
    setTimeout(() => {
      setStatus("active");
      setTimeLeft(selectedProfile.duration * 60);
    }, 1800);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isActive = status === "active";
  const isActivating = status === "activating";

  return (
    <div
      className={`w-full h-full flex flex-col select-none relative overflow-hidden bg-gradient-to-br ${selectedProfile.bg} transition-all duration-700`}
      style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
    >
      {/* Ambient Background Orbs */}
      <motion.div
        animate={isActive ? { scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: selectedProfile.color + "40" }}
      />
      <motion.div
        animate={isActive ? { scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] } : { scale: 1, opacity: 0.15 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: selectedProfile.color + "30" }}
      />

      {/* Floating Scent Particles */}
      <AnimatePresence>
        {isActive && [0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: -200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
            className="absolute bottom-44 rounded-full pointer-events-none"
            style={{
              left: `calc(28% + ${(i - 2.5) * 18}px)`,
              width: 10,
              height: 10,
              background: selectedProfile.color + "90",
              filter: "blur(2px)",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3 z-10 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToHome}
          className="flex items-center gap-1.5 bg-white/60 hover:bg-white/80 backdrop-blur-sm text-slate-700 px-3.5 py-1.5 rounded-full border border-white/50 transition text-xs font-bold cursor-pointer shadow-sm"
        >
          <ChevronLeft size={15} />
          <span>กลับหน้าหลัก</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm font-black text-slate-800">Mouse Aroma Diffuser</h1>
          <WhaleSharkIcon className="w-5 h-3.5" />
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${deviceConnected ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-red-100 border-red-300 text-red-700"}`}>
          {deviceConnected
            ? <><CheckCircle2 size={11} /> เชื่อมต่อแล้ว</>
            : <><AlertCircle size={11} /> ไม่พบอุปกรณ์</>}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex gap-4 px-5 pb-4 z-10 overflow-hidden">
        {/* LEFT: Diffuser Visualizer */}
        <div className="flex flex-col items-center justify-center gap-4 w-72 shrink-0">
          <div className="relative flex items-center justify-center">
            {isActive && [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.65, ease: "easeOut" }}
                className="absolute rounded-full border-2"
                style={{
                  width: 140 + i * 20,
                  height: 140 + i * 20,
                  borderColor: selectedProfile.color + "80",
                }}
              />
            ))}

            <motion.div
              animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer relative overflow-hidden border-4 border-white/50"
              style={{ background: `linear-gradient(135deg, ${selectedProfile.color}55, ${selectedProfile.accent}33)` }}
              onClick={handleActivate}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `radial-gradient(circle at 35% 35%, white 0%, ${selectedProfile.color}22 60%, transparent 100%)` }}
              />
              <span className="text-4xl mb-1 z-10">{selectedProfile.emoji}</span>
              <span className="text-xs font-extrabold z-10" style={{ color: selectedProfile.accent }}>
                {isActivating ? "กำลังเปิด..." : isActive ? "กำลังปล่อยกลิ่น" : "กดเพื่อเปิด"}
              </span>
              {isActive && (
                <span className="text-[11px] font-bold z-10 mt-0.5" style={{ color: selectedProfile.accent }}>
                  {formatTime(timeLeft)}
                </span>
              )}
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleActivate}
            className="px-8 py-2.5 rounded-2xl text-sm font-black shadow-md transition cursor-pointer flex items-center gap-2 text-white"
            style={{
              background: isActive ? "#ef4444" : `linear-gradient(135deg, ${selectedProfile.color}, ${selectedProfile.accent})`,
            }}
          >
            {isActivating ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Wind size={16} /></motion.div> กำลังเปิด...</>
            ) : isActive ? (
              <><Zap size={16} /> หยุดปล่อยกลิ่น</>
            ) : (
              <><Wind size={16} /> ปล่อยกลิ่น</>
            )}
          </motion.button>

          <div className="w-full bg-white/50 backdrop-blur-sm rounded-2xl p-3 border border-white/60 space-y-2">
            <div className="flex justify-between text-[11px] text-slate-600 font-bold">
              <span className="flex items-center gap-1"><Droplets size={11} className="text-sky-500" /> น้ำมันหอมระเหยคงเหลือ</span>
              <span style={{ color: moistureLevel > 30 ? "#059669" : "#dc2626" }}>{moistureLevel}%</span>
            </div>
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden border border-white/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${moistureLevel}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${selectedProfile.color}, ${selectedProfile.accent})` }}
              />
            </div>
            {isActive && (
              <div className="flex justify-between text-[11px] text-slate-600 font-semibold mt-1">
                <span>ลดความเครียดโดยประมาณ</span>
                <span className="font-extrabold text-emerald-600">-{selectedProfile.stressReduction}%</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Profile List */}
        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="text-xs font-extrabold text-slate-600 mb-1 uppercase tracking-wider">เลือกกลิ่นบำบัด (Aroma Profile)</div>

          {AROMA_PROFILES.map((profile) => {
            const isSelected = profile.id === selectedProfile.id;
            return (
              <motion.button
                key={profile.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (status === "active") {
                    setStatus("idle");
                    setTimeLeft(0);
                  }
                  setSelectedProfile(profile);
                }}
                className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition cursor-pointer ${
                  isSelected ? "bg-white/80 shadow-md" : "bg-white/40 border-white/50 hover:bg-white/60"
                }`}
                style={isSelected ? { borderColor: profile.color } : {}}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border-2 border-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${profile.color}44, ${profile.accent}22)` }}
                >
                  {profile.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold text-slate-800">
                      {profile.nameTh} <span className="text-slate-400 font-normal">({profile.name})</span>
                    </div>
                    {isSelected && <CheckCircle2 size={14} style={{ color: profile.color }} />}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-2">{profile.description}</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className="w-2 h-2 rounded-full"
                        style={{ background: lvl <= profile.intensity ? profile.color : "#e2e8f0" }}
                      />
                    ))}
                    <span className="text-[9px] text-slate-400 ml-1">ความเข้มกลิ่น</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
