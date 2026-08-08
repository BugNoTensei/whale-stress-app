import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Wind,
  Eye,
  Smile,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Heart,
  Activity,
  Layers,
} from "lucide-react";
import { WhaleSharkIcon } from "../ui/WhaleSharkIcon";

interface SelfRelaxationScreenProps {
  onBackToHome: () => void;
}

type TabType = "breathing" | "grounding" | "body_scan" | "affirmations";

// Affirmations database
const AFFIRMATIONS = [
  {
    id: 1,
    text: "วันนี้คุณทำเต็มที่แล้ว พักผ่อนใจได้นะ",
    emoji: "🌿",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: 2,
    text: "ความเครียดเป็นเรื่องชั่วคราว เดี๋ยวก็ผ่านไป",
    emoji: "🌊",
    color: "from-sky-400 to-blue-500",
  },
  {
    id: 3,
    text: "ใจเย็นๆ และหายใจเข้าลึกๆ ให้ตัวเองได้พักบ้าง",
    emoji: "🕊️",
    color: "from-indigo-400 to-purple-500",
  },
  {
    id: 4,
    text: "คุณไม่จำเป็นต้องแบกทุกอย่างไว้คนเดียวในตอนนี้",
    emoji: "💙",
    color: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    id: 5,
    text: "อนุญาตให้ตัวเองหยุดคิดสักครู่หนึ่งนะ",
    emoji: "🌸",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 6,
    text: "ทุกลมหายใจเข้า คือการเติมพลังและความสงบให้ชีวิต",
    emoji: "✨",
    color: "from-amber-400 to-orange-500",
  },
];

// Grounding steps
const GROUNDING_STEPS = [
  {
    count: 5,
    icon: Eye,
    title: "สิ่งรอบตัว 5 อย่างที่มองเห็น",
    hint: "สังเกตสิ่งของ สี หรือแสงรอบๆ ตัวคุณ 5 ชิ้น",
  },
  {
    count: 4,
    icon: Activity,
    title: "สัมผัส 4 อย่างที่รู้สึกได้",
    hint: "รู้สึกถึงเท้าที่แตะพื้น เก้าอี้ที่นั่ง หรือเสื้อผ้าที่สวมใส่",
  },
  {
    count: 3,
    icon: Wind,
    title: "เสียง 3 อย่างที่ได้ยิน",
    hint: "ฟังเสียงลม เสียงแอร์ เสียงนก หรือเสียงรอบข้าง",
  },
  {
    count: 2,
    icon: Sparkles,
    title: "กลิ่น 2 อย่างที่รับรู้",
    hint: "สูดกลิ่นอากาศ กลิ่นกาแฟ หรือกลิ่นอโรมาเบาๆ",
  },
  {
    count: 1,
    icon: Heart,
    title: "รสชาติ 1 อย่างที่สัมผัสได้",
    hint: "รับรู้รสชาติในปาก หรือลิ้มรสจิบน้ำเปล่าเย็นๆ",
  },
];

// Body Scan steps
const BODY_SCAN_STEPS = [
  {
    area: "ศีรษะและใบหน้า",
    instruction: "ผ่อนคลายคิ้วที่ขมวดอยู่ ปล่อยกรามให้สบาย ไม่เกร็งฟัน",
    duration: 10,
  },
  {
    area: "คอและไหล่",
    instruction:
      "ยักไหล่ขึ้นเบาๆ แล้วปล่อยไหล่ตกลงมาสบายๆ ทิ้งความหนักอึ้งออกไป",
    duration: 12,
  },
  {
    area: "แขนและมือ",
    instruction: "คลายกำมือ ปล่อยให้นิ้วมือและแขนทอดวางสบายๆ บนตักหรือโต๊ะ",
    duration: 10,
  },
  {
    area: "หน้าอกและท้อง",
    instruction: "สังเกตท้องที่พองขึ้นและยุบลงตามลมหายใจ หายใจเข้าสบายๆ",
    duration: 12,
  },
  {
    area: "ขาและเท้า",
    instruction:
      "ผ่อนคลายกล้ามเนื้อต้นขา น่อง และปล่อยให้นิ้วเท้าผ่อนคลายเต็มที่",
    duration: 10,
  },
];

export default function SelfRelaxationScreen({
  onBackToHome,
}: SelfRelaxationScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("breathing");

  // Breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<
    "inhale" | "hold" | "exhale" | "rest"
  >("inhale");
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Grounding state
  const [completedGrounding, setCompletedGrounding] = useState<number[]>([]);

  // Body Scan state
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanTimer, setScanTimer] = useState(BODY_SCAN_STEPS[0].duration);
  const [isScanActive, setIsScanActive] = useState(false);

  // Affirmation state
  const [currentAffirmationIdx, setCurrentAffirmationIdx] = useState(0);

  // Guided Breathing Timer Engine (4-7-8 Pattern)
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev > 1) return prev - 1;

        // Phase Transition
        if (breathingPhase === "inhale") {
          setBreathingPhase("hold");
          return 7;
        } else if (breathingPhase === "hold") {
          setBreathingPhase("exhale");
          return 8;
        } else if (breathingPhase === "exhale") {
          setBreathingPhase("rest");
          return 2;
        } else {
          setBreathingPhase("inhale");
          setCompletedCycles((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  // Body Scan Timer Engine
  useEffect(() => {
    if (!isScanActive) return;
    const interval = setInterval(() => {
      setScanTimer((prev) => {
        if (prev > 1) return prev - 1;
        if (scanStepIndex < BODY_SCAN_STEPS.length - 1) {
          const nextIndex = scanStepIndex + 1;
          setScanStepIndex(nextIndex);
          return BODY_SCAN_STEPS[nextIndex].duration;
        } else {
          setIsScanActive(false);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isScanActive, scanStepIndex]);

  const toggleGroundingStep = (index: number) => {
    if (completedGrounding.includes(index)) {
      setCompletedGrounding(completedGrounding.filter((i) => i !== index));
    } else {
      setCompletedGrounding([...completedGrounding, index]);
    }
  };

  const getPhaseText = () => {
    switch (breathingPhase) {
      case "inhale":
        return "หายใจเข้าลึกๆ...";
      case "hold":
        return "กลั้นลมหายใจไว้...";
      case "exhale":
        return "ค่อยๆ ผ่อนลมหายใจออก...";
      case "rest":
        return "พักสักครู่...";
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case "inhale":
        return "#38bdf8";
      case "hold":
        return "#818cf8";
      case "exhale":
        return "#34d399";
      case "rest":
        return "#fbbf24";
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col select-none relative overflow-hidden bg-linear-to-br from-[#edf4fe] via-[#f7fafe] to-[#e4effd] text-[#2c3e50]"
      style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
    >
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3 z-10 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToHome}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 px-3.5 py-1.5 rounded-full border border-white transition text-xs font-bold cursor-pointer shadow-xs"
        >
          <ChevronLeft size={15} />
          <span>กลับหน้าหลัก</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm font-black text-[#1f2d4d] flex items-center gap-2">
            <span>ศูนย์กิจกรรมผ่อนคลายด้วยตนเอง</span>
            <WhaleSharkIcon className="w-5 h-3.5" />
          </h1>
        </div>

        <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-300/40 text-sky-700 px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles size={13} className="text-sky-500" />
          <span>Self-Relaxation</span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-6 pb-2 z-10 shrink-0">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-xs">
          <button
            onClick={() => setActiveTab("breathing")}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "breathing"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wind size={14} />
            <span>1. ฝึกหายใจ 4-7-8</span>
          </button>

          <button
            onClick={() => setActiveTab("grounding")}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "grounding"
                ? "bg-indigo-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Eye size={14} />
            <span>2. เรียกสติ 5-4-3-2-1</span>
          </button>

          <button
            onClick={() => setActiveTab("body_scan")}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "body_scan"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={14} />
            <span>3. ผ่อนคลายกล้ามเนื้อ</span>
          </button>

          <button
            onClick={() => setActiveTab("affirmations")}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "affirmations"
                ? "bg-pink-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smile size={14} />
            <span>4. ข้อความพลังบวก</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-5 z-10 overflow-hidden flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* TAB 1: GUIDED BREATHING */}
          {activeTab === "breathing" && (
            <motion.div
              key="tab_breathing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-between max-w-lg mx-auto py-2"
            >
              <div className="text-center">
                <h2 className="text-base font-extrabold text-[#1f2d4d]">
                  การฝึกลมหายใจแบบ 4-7-8 ช่วยลดความตื่นตระหนก
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  สูดลมหายใจตามจังหวะวงกลมเพื่อปรับอัตราการเต้นของหัวใจให้สงบลง
                </p>
              </div>

              {/* Breathing Circle Visualizer */}
              <div className="relative flex items-center justify-center my-2">
                {/* Pulsing ring */}
                <motion.div
                  animate={{
                    scale:
                      breathingPhase === "inhale"
                        ? [1, 1.45]
                        : breathingPhase === "exhale"
                          ? [1.45, 1]
                          : breathingPhase === "hold"
                            ? 1.45
                            : 1,
                  }}
                  transition={{ duration: breathingTimer, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-full border-4 opacity-30 absolute"
                  style={{ borderColor: getPhaseColor() }}
                />

                <motion.div
                  animate={{
                    scale:
                      breathingPhase === "inhale"
                        ? [1, 1.35]
                        : breathingPhase === "exhale"
                          ? [1.35, 1]
                          : breathingPhase === "hold"
                            ? 1.35
                            : 1,
                  }}
                  transition={{ duration: breathingTimer, ease: "easeInOut" }}
                  className="w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white/80 relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle, white 0%, ${getPhaseColor()}33 100%)`,
                  }}
                >
                  <span className="text-4xl font-black text-slate-800 z-10">
                    {breathingTimer}
                  </span>
                  <span
                    className="text-xs font-bold mt-1 z-10"
                    style={{ color: getPhaseColor() }}
                  >
                    {isBreathingActive ? getPhaseText() : "พร้อมเริ่มฝึก"}
                  </span>
                </motion.div>
              </div>

              {/* Controls & Cycle counter */}
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isBreathingActive) {
                        setIsBreathingActive(true);
                        setBreathingPhase("inhale");
                        setBreathingTimer(4);
                      } else {
                        setIsBreathingActive(false);
                      }
                    }}
                    className="px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md cursor-pointer flex items-center gap-2"
                    style={{
                      background: isBreathingActive ? "#ef4444" : "#3b82f6",
                    }}
                  >
                    {isBreathingActive ? (
                      <>
                        <Pause size={15} /> พักการหายใจ
                      </>
                    ) : (
                      <>
                        <Play size={15} /> เริ่มฝึกลมหายใจ
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsBreathingActive(false);
                      setBreathingPhase("inhale");
                      setBreathingTimer(4);
                      setCompletedCycles(0);
                    }}
                    className="p-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-600 border border-slate-200 cursor-pointer shadow-xs"
                    title="เริ่มใหม่"
                  >
                    <RotateCcw size={15} />
                  </motion.button>
                </div>

                <div className="text-xs font-bold text-slate-500 bg-white/60 px-4 py-1.5 rounded-full border border-white/80 shadow-2xs">
                  จำนวนรอบที่ฝึกสำเร็จ:{" "}
                  <span className="text-sky-600 font-extrabold">
                    {completedCycles} รอบ
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: 5-4-3-2-1 GROUNDING */}
          {activeTab === "grounding" && (
            <motion.div
              key="tab_grounding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col max-w-xl mx-auto overflow-hidden"
            >
              <div className="text-center mb-3">
                <h2 className="text-base font-extrabold text-[#1f2d4d]">
                  เทคนิค Grounding 5-4-3-2-1 ดึงจิตใจกลับสู่ปัจจุบัน
                </h2>
                <p className="text-xs text-slate-500">
                  กดติ๊กเมื่อคุณได้สังเกตสิ่งต่างๆ ตามประสาทสัมผัสเรียบร้อยแล้ว
                </p>
              </div>

              <div
                className="flex-1 space-y-2 overflow-y-auto pr-1"
                style={{ scrollbarWidth: "none" }}
              >
                {GROUNDING_STEPS.map((step, idx) => {
                  const isDone = completedGrounding.includes(idx);
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => toggleGroundingStep(idx)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isDone
                          ? "bg-emerald-50/80 border-emerald-300 shadow-xs"
                          : "bg-white/80 border-white shadow-2xs hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                            isDone
                              ? "bg-emerald-500 text-white"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {step.count}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold ${isDone ? "text-emerald-800 line-through" : "text-slate-800"}`}
                          >
                            {step.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {step.hint}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                          isDone
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-300 text-transparent"
                        }`}
                      >
                        <Check size={13} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                  ทำเสร็จแล้ว {completedGrounding.length} /{" "}
                  {GROUNDING_STEPS.length} ข้อ
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BODY SCAN */}
          {activeTab === "body_scan" && (
            <motion.div
              key="tab_body_scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-between max-w-lg mx-auto py-2"
            >
              <div className="text-center">
                <h2 className="text-base font-extrabold text-[#1f2d4d]">
                  สแกนและผ่อนคลายกล้ามเนื้อทีละส่วน (Body Scan)
                </h2>
                <p className="text-xs text-slate-500">
                  ปลดปล่อยความเกร็งตึงในแต่ละจุดของร่างกายอย่างมีสติ
                </p>
              </div>

              {/* Step Card */}
              <div className="w-full bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-lg text-center relative overflow-hidden my-2">
                <div className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200 mb-2">
                  ขั้นตอนที่ {scanStepIndex + 1} จาก {BODY_SCAN_STEPS.length}:{" "}
                  {BODY_SCAN_STEPS[scanStepIndex].area}
                </div>

                <p className="text-sm font-extrabold text-slate-700 leading-relaxed my-3 px-2">
                  "{BODY_SCAN_STEPS[scanStepIndex].instruction}"
                </p>

                <div className="text-3xl font-black text-emerald-600 mt-2">
                  {scanTimer}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    วินาที
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsScanActive(!isScanActive)}
                  className="px-6 py-2.5 rounded-2xl text-xs font-black text-white shadow-md cursor-pointer flex items-center gap-2"
                  style={{ background: isScanActive ? "#ef4444" : "#10b981" }}
                >
                  {isScanActive ? (
                    <>
                      <Pause size={15} /> หยุดชั่วคราว
                    </>
                  ) : (
                    <>
                      <Play size={15} /> เริ่มผ่อนคลายกล้ามเนื้อ
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsScanActive(false);
                    setScanStepIndex(0);
                    setScanTimer(BODY_SCAN_STEPS[0].duration);
                  }}
                  className="p-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-600 border border-slate-200 cursor-pointer shadow-xs"
                >
                  <RotateCcw size={15} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* TAB 4: AFFIRMATIONS */}
          {activeTab === "affirmations" && (
            <motion.div
              key="tab_affirmations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-between max-w-lg mx-auto py-2"
            >
              <div className="text-center">
                <h2 className="text-base font-extrabold text-[#1f2d4d]">
                  การ์ดข้อความเติมพลังใจและความสงบ
                </h2>
                <p className="text-xs text-slate-500">
                  กดสุ่มหรือเปลี่ยนการ์ดเพื่ออ่านข้อคิดดีๆ สำหรับวันนี้
                </p>
              </div>

              {/* Big Affirmation Card */}
              <motion.div
                key={currentAffirmationIdx}
                initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`w-full p-8 rounded-3xl bg-linear-to-br ${AFFIRMATIONS[currentAffirmationIdx].color} text-white shadow-xl text-center flex flex-col items-center justify-center my-3 relative overflow-hidden`}
              >
                <span className="text-5xl mb-4 drop-shadow-md">
                  {AFFIRMATIONS[currentAffirmationIdx].emoji}
                </span>
                <p className="text-lg font-black leading-relaxed drop-shadow-sm px-4">
                  "{AFFIRMATIONS[currentAffirmationIdx].text}"
                </p>
              </motion.div>

              {/* Next Card Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentAffirmationIdx(
                    (prev) => (prev + 1) % AFFIRMATIONS.length,
                  )
                }
                className="px-8 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>การ์ดถัดไป</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
