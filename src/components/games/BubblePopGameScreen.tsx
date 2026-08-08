import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Volume2, VolumeX, Pause, Play, Music, BarChart2, Smile } from "lucide-react";
import gameBg1 from "../../assets/game_bg_1.png";
import whaleIcon from "../../assets/icon/whaleicon.png";
import { BGMTrack, Particle, RippleEffect as Ripple, FloatingText } from "../../types/game";
import { BGM_OPTIONS, AFFIRMATION_MESSAGES } from "../../constants/game";
import { soundManager as sounds } from "../../utils/audioSynth";
import { StressFloatingWidget } from "../ui/StressFloatingWidget";
import { StressGraph } from "../stress/StressGraph";

export type { BGMTrack };

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobblePhase: number;
  type: "normal" | "rainbow" | "heart" | "star" | "giant";
  hue: number;
  alpha: number;
}

interface Fish {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  tailPhase: number;
  direction: number; // 1 = right, -1 = left
}

interface MicroBubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  alpha: number;
}

interface BubblePopGameScreenProps {
  onBackToHome: () => void;
}

export const BubblePopGameScreen: React.FC<BubblePopGameScreenProps> = ({
  onBackToHome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [secondsPlayed, setSecondsPlayed] = useState<number>(0);
  const [showGraphModal, setShowGraphModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<BGMTrack>("piano");
  const [isBgmMenuOpen, setIsBgmMenuOpen] = useState<boolean>(false);
  const [currentAffirmation, setCurrentAffirmation] = useState<string>(
    AFFIRMATION_MESSAGES[0]
  );

  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const fishesRef = useRef<Fish[]>([]);
  const microBubblesRef = useRef<MicroBubble[]>([]);
  const whaleSharkRef = useRef<{
    x: number;
    y: number;
    speed: number;
    direction: number; // 1 = right, -1 = left
    wiggle: number;
    happyTimer: number;
    blowTimer: number;
  }>({
    x: -100,
    y: 200,
    speed: 0.7,
    direction: 1,
    wiggle: 0,
    happyTimer: 0,
    blowTimer: 0,
  });

  const comboTrackerRef = useRef<{
    count: number;
    lastTime: number;
  }>({
    count: 0,
    lastTime: 0,
  });

  // Sound mute sync & Soft BGM Controller
  useEffect(() => {
    sounds.enabled = !isMuted;
    if (!isMuted && !isPaused) {
      sounds.startAmbientBGM(selectedTrack);
    } else {
      sounds.stopAmbientBGM();
    }
    return () => {
      sounds.stopAmbientBGM();
    };
  }, [isMuted, isPaused, selectedTrack]);

  // Timer counter effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsPlayed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Affirmation message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const nextMsg =
        AFFIRMATION_MESSAGES[
          Math.floor(Math.random() * AFFIRMATION_MESSAGES.length)
        ];
      setCurrentAffirmation(nextMsg);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Main Canvas 60 FPS Game Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial Bubbles Spawn
    const createBubble = (forceType?: Bubble["type"]): Bubble => {
      const types: Bubble["type"][] = [
        "normal",
        "normal",
        "normal",
        "rainbow",
        "heart",
        "star",
      ];
      const selectedType =
        forceType || types[Math.floor(Math.random() * types.length)];

      let radius = Math.random() * 20 + 25; // Medium default
      if (selectedType === "giant") radius = Math.random() * 25 + 65;
      if (selectedType === "heart") radius = Math.random() * 15 + 28;

      return {
        id: Math.random(),
        x: Math.random() * (canvas.width - radius * 2) + radius,
        y: canvas.height + radius + Math.random() * 60,
        radius,
        speedY: Math.random() * 0.8 + 0.6,
        wobbleSpeed: Math.random() * 0.02 + 0.015,
        wobbleAmp: Math.random() * 2 + 1,
        wobblePhase: Math.random() * Math.PI * 2,
        type: selectedType,
        hue: Math.floor(Math.random() * 360),
        alpha: Math.random() * 0.2 + 0.65,
      };
    };

    // Populate initial bubbles
    if (bubblesRef.current.length === 0) {
      for (let i = 0; i < 22; i++) {
        const b = createBubble();
        b.y = Math.random() * canvas.height;
        bubblesRef.current.push(b);
      }
    }

    // Populate initial fishes (ปลาเล็กว่ายไปมา)
    if (fishesRef.current.length === 0) {
      const colors = ["#ffc048", "#ff793f", "#70a1ff", "#55efc4", "#a29bfe"];
      for (let f = 0; f < 6; f++) {
        fishesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.5) + canvas.height * 0.2,
          speed: Math.random() * 0.4 + 0.3,
          size: Math.random() * 5 + 7,
          color: colors[f % colors.length],
          tailPhase: Math.random() * Math.PI * 2,
          direction: Math.random() > 0.5 ? 1 : -1,
        });
      }
    }

    // Populate initial micro-bubbles (ฟองอากาศเล็กๆ ลอยขึ้น)
    if (microBubblesRef.current.length === 0) {
      for (let mb = 0; mb < 24; mb++) {
        microBubblesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          speedY: Math.random() * 0.4 + 0.2,
          alpha: Math.random() * 0.35 + 0.15,
        });
      }
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPaused) {
        // 1. Update Whale Shark Position & Happy Reaction
        const ws = whaleSharkRef.current;
        ws.x += ws.speed * ws.direction;
        ws.wiggle += 0.03;
        ws.y += Math.sin(ws.wiggle) * 0.4;

        if (ws.happyTimer > 0) {
          ws.happyTimer--;
          ws.y += Math.sin(ws.happyTimer * 0.25) * 1.5; // Happy bounce
        }

        // Periodic blowing bubbles from blowhole
        ws.blowTimer++;
        if (ws.blowTimer > 360) { // Every 6 seconds
          ws.blowTimer = 0;
          bubblesRef.current.push({
            id: Math.random(),
            x: ws.x + 20 * ws.direction,
            y: ws.y - 15,
            radius: 18,
            speedY: 0.8,
            wobbleSpeed: 0.02,
            wobbleAmp: 2,
            wobblePhase: 0,
            type: "rainbow",
            hue: 200,
            alpha: 0.8,
          });
        }

        if (ws.direction === 1 && ws.x > canvas.width + 120) {
          ws.direction = -1;
          ws.y = Math.random() * (canvas.height * 0.5) + 100;
        } else if (ws.direction === -1 && ws.x < -120) {
          ws.direction = 1;
          ws.y = Math.random() * (canvas.height * 0.5) + 100;
        }

        // Update Micro Bubbles
        microBubblesRef.current.forEach((mb) => {
          mb.y -= mb.speedY;
          if (mb.y < -10) {
            mb.y = canvas.height + 10;
            mb.x = Math.random() * canvas.width;
          }
        });

        // Update Fish Positions
        fishesRef.current.forEach((f) => {
          f.x += f.speed * f.direction;
          f.tailPhase += 0.08;
          if (f.direction === 1 && f.x > canvas.width + 40) {
            f.direction = -1;
            f.y = Math.random() * (canvas.height * 0.5) + canvas.height * 0.2;
          } else if (f.direction === -1 && f.x < -40) {
            f.direction = 1;
            f.y = Math.random() * (canvas.height * 0.5) + canvas.height * 0.2;
          }
        });

        // Maintain bubble count (25-30)
        while (bubblesRef.current.length < 26) {
          bubblesRef.current.push(createBubble());
        }

        // Update Bubbles
        bubblesRef.current.forEach((b) => {
          b.y -= b.speedY;
          b.wobblePhase += b.wobbleSpeed;
          b.x += Math.sin(b.wobblePhase) * 0.5;

          // Wrap around if floated off top
          if (b.y < -b.radius * 2) {
            b.y = canvas.height + b.radius + 10;
            b.x = Math.random() * (canvas.width - b.radius * 2) + b.radius;
          }
        });

        // Update Particles
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
        });
        particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

        // Update Ripples
        ripplesRef.current.forEach((r) => {
          r.radius += 1.8;
          r.alpha -= 0.025;
        });
        ripplesRef.current = ripplesRef.current.filter((r) => r.alpha > 0);

        // Update Floating Texts
        floatingTextsRef.current.forEach((ft) => {
          ft.y -= 0.8;
          ft.alpha -= 0.015;
        });
        floatingTextsRef.current = floatingTextsRef.current.filter(
          (ft) => ft.alpha > 0
        );
      }

      // --- RENDER DYNAMIC ENVIRONMENT ---
      const nowSec = performance.now() * 0.001;

      // 1. Draw Moving Sunlight Rays (แสงอาทิตย์เคลื่อนไหว)
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const rayX = (canvas.width / 4) * i + Math.sin(nowSec * 0.4 + i) * 25;
        const opacity = Math.sin(nowSec * 0.5 + i) * 0.04 + 0.07;
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 120, canvas.height);
        rayGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 1.6})`);
        rayGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX + 90, 0);
        ctx.lineTo(rayX + 200, canvas.height);
        ctx.lineTo(rayX + 110, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2. Draw Swaying Seaweed (สาหร่ายแกว่งตามกระแสน้ำ)
      ctx.save();
      ctx.strokeStyle = "rgba(72, 187, 120, 0.4)";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      [40, 80, canvas.width - 90, canvas.width - 50].forEach((x, idx) => {
        const height = 110 + (idx % 2) * 35;
        const sway = Math.sin(nowSec * 1.3 + idx) * 14;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.quadraticCurveTo(
          x + sway,
          canvas.height - height / 2,
          x + sway * 1.4,
          canvas.height - height
        );
        ctx.stroke();
      });
      ctx.restore();

      // 3. Draw Micro Bubbles (ฟองอากาศเล็ก ๆ ลอยขึ้น)
      microBubblesRef.current.forEach((mb) => {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.globalAlpha = mb.alpha;
        ctx.beginPath();
        ctx.arc(mb.x, mb.y, mb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 4. Draw Swimming Tiny Fish (ปลาเล็กว่ายไปมา)
      fishesRef.current.forEach((f) => {
        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.direction === -1) ctx.scale(-1, 1);
        ctx.fillStyle = f.color;
        ctx.globalAlpha = 0.75;
        // Fish Body
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size, f.size * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tail Fin Wiggle
        const tailWiggle = Math.sin(nowSec * 7 + f.tailPhase) * 3.5;
        ctx.beginPath();
        ctx.moveTo(-f.size * 0.8, 0);
        ctx.lineTo(-f.size * 1.5, -f.size * 0.45 + tailWiggle);
        ctx.lineTo(-f.size * 1.5, f.size * 0.45 + tailWiggle);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // A. Draw Whale Shark Mascot
      const ws = whaleSharkRef.current;
      ctx.save();
      ctx.translate(ws.x, ws.y);
      if (ws.direction === -1) {
        ctx.scale(-1, 1);
      }
      ctx.globalAlpha = 0.45;
      // Soft glow aura
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 45);
      grad.addColorStop(0, "rgba(180, 220, 255, 0.4)");
      grad.addColorStop(1, "rgba(180, 220, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // B. Draw Ripples
      ripplesRef.current.forEach((r) => {
        ctx.save();
        ctx.strokeStyle = r.color || "#ffffff";
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // C. Draw Particles
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // D. Draw Bubbles
      bubblesRef.current.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);

        // Bubble Body Gradient
        const bGrad = ctx.createRadialGradient(
          -b.radius * 0.3,
          -b.radius * 0.3,
          b.radius * 0.1,
          0,
          0,
          b.radius
        );

        if (b.type === "normal") {
          bGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
          bGrad.addColorStop(0.4, "rgba(160, 210, 255, 0.55)");
          bGrad.addColorStop(0.85, "rgba(110, 170, 255, 0.35)");
          bGrad.addColorStop(1, "rgba(255, 255, 255, 0.7)");
        } else if (b.type === "rainbow") {
          bGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          bGrad.addColorStop(0.3, "rgba(255, 180, 220, 0.6)");
          bGrad.addColorStop(0.6, "rgba(180, 230, 255, 0.6)");
          bGrad.addColorStop(1, "rgba(255, 230, 180, 0.7)");
        } else if (b.type === "heart") {
          bGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          bGrad.addColorStop(0.5, "rgba(255, 160, 195, 0.6)");
          bGrad.addColorStop(1, "rgba(240, 130, 170, 0.7)");
        } else if (b.type === "star") {
          bGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          bGrad.addColorStop(0.5, "rgba(150, 230, 255, 0.65)");
          bGrad.addColorStop(1, "rgba(100, 190, 255, 0.75)");
        } else if (b.type === "giant") {
          bGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
          bGrad.addColorStop(0.5, "rgba(180, 190, 255, 0.45)");
          bGrad.addColorStop(1, "rgba(140, 170, 255, 0.65)");
        }

        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Outer Highlight Edge Ring
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glossy Reflection Highlight Crescent
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.ellipse(
          -b.radius * 0.35,
          -b.radius * 0.35,
          b.radius * 0.28,
          b.radius * 0.16,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Inner Type Icon (Vector Shape Drawing)
        if (b.type === "heart") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          const r = b.radius * 0.45;
          ctx.arc(-r / 2, -r / 4, r / 2, Math.PI, 0, false);
          ctx.arc(r / 2, -r / 4, r / 2, Math.PI, 0, false);
          ctx.lineTo(0, r / 1.2);
          ctx.closePath();
          ctx.fill();
        } else if (b.type === "star") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          const r = b.radius * 0.45;
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * r, -Math.sin(((18 + s * 72) * Math.PI) / 180) * r);
            ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (r * 0.5), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (r * 0.5));
          }
          ctx.closePath();
          ctx.fill();
        } else if (b.type === "rainbow") {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, b.radius * 0.4, Math.PI, 0);
          ctx.stroke();
        }

        ctx.restore();
      });

      // E. Draw Floating Pop Text
      floatingTextsRef.current.forEach((ft) => {
        ctx.save();
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(91, 139, 241, 0.8)";
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPaused]);

  // Click & Pop Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check collision from top-most bubble (reverse loop)
    for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
      const b = bubblesRef.current[i];
      const dist = Math.hypot(clickX - b.x, clickY - b.y);

      if (dist <= b.radius * 1.1) {
        // Trigger unique sound effect per bubble type
        if (b.type === "rainbow") sounds.playRainbowChime();
        else if (b.type === "heart") sounds.playHeartWarmBell();
        else if (b.type === "star") sounds.playStarMagicSparkle();
        else sounds.playPop(1 + (50 - b.radius) / 100);

        // Water Ripple sound
        sounds.playWaterRipple();

        // Combo pop tracker & Whale Shark happy reaction
        const now = performance.now();
        if (now - comboTrackerRef.current.lastTime < 1400) {
          comboTrackerRef.current.count += 1;
        } else {
          comboTrackerRef.current.count = 1;
        }
        comboTrackerRef.current.lastTime = now;

        if (comboTrackerRef.current.count >= 3) {
          whaleSharkRef.current.happyTimer = 90; // Trigger happy wiggle dance animation
          for (let cb = 0; cb < 3; cb++) {
            bubblesRef.current.push({
              id: Math.random(),
              x: whaleSharkRef.current.x + (Math.random() - 0.5) * 50,
              y: whaleSharkRef.current.y - 20,
              radius: Math.random() * 14 + 18,
              speedY: Math.random() * 0.9 + 0.6,
              wobbleSpeed: 0.02,
              wobbleAmp: 2,
              wobblePhase: Math.random() * Math.PI,
              type: cb % 2 === 0 ? "rainbow" : "heart",
              hue: 200,
              alpha: 0.85,
            });
          }
          floatingTextsRef.current.push({
            id: Math.random(),
            x: whaleSharkRef.current.x,
            y: whaleSharkRef.current.y - 30,
            text: "🐋✨ Happy Whale! 💖",
            alpha: 1,
          });
        }

        // Spawn particles
        const particleColor =
          b.type === "heart"
            ? "#ff85a2"
            : b.type === "rainbow"
            ? "#fce38a"
            : b.type === "star"
            ? "#a8edf0"
            : "#a3cfff";

        for (let p = 0; p < 12; p++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          particlesRef.current.push({
            x: b.x,
            y: b.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 3 + 2,
            color: particleColor,
            alpha: 1,
            decay: Math.random() * 0.03 + 0.02,
          });
        }

        // Spawn Ripple
        ripplesRef.current.push({
          x: b.x,
          y: b.y,
          radius: b.radius * 0.5,
          maxRadius: b.radius * 1.8,
          alpha: 0.8,
          color: particleColor,
        });

        // Floating Pop Text
        floatingTextsRef.current.push({
          id: Math.random(),
          x: b.x,
          y: b.y - 10,
          text: b.type === "rainbow" ? "Splendid! 🌈" : "Pop!",
          alpha: 1,
        });

        // If Giant Bubble, split into 3 smaller bubbles
        if (b.type === "giant") {
          for (let g = 0; g < 3; g++) {
            bubblesRef.current.push({
              id: Math.random(),
              x: b.x + (Math.random() - 0.5) * 30,
              y: b.y + (Math.random() - 0.5) * 30,
              radius: 25,
              speedY: Math.random() * 0.8 + 0.6,
              wobbleSpeed: 0.02,
              wobbleAmp: 2,
              wobblePhase: Math.random() * Math.PI,
              type: "normal",
              hue: 200,
              alpha: 0.7,
            });
          }
        }

        // Remove popped bubble
        bubblesRef.current.splice(i, 1);
        setPoppedCount((prev) => prev + 1);

        // Whale wiggles on pop
        whaleSharkRef.current.wiggle += 0.5;
        break;
      }
    }
  };

  // Format time MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-5xl h-full flex flex-col justify-between overflow-hidden select-none rounded-3xl shadow-2xl border border-sky-100/80 mx-auto z-10 gpu-accelerated"
      style={{
        backgroundImage: `url(${gameBg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Soft Blue Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#76a5eb]/40 via-transparent to-[#102b5c]/70 pointer-events-none z-0" />

      {/* Main Canvas Layer */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full cursor-pointer z-10"
      />

      {/* TOP HEADER OVERLAY UI (100% Matching Image Spec) */}
      <header className="relative z-20 w-full flex items-start justify-between p-4 pointer-events-none">
        {/* Left Side: Back Button & Stats Cards */}
        <div className="flex items-start gap-3 pointer-events-auto">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="flex items-center gap-1 px-4 py-2 bg-white/90 hover:bg-white text-slate-700 font-bold rounded-full border border-sky-100 shadow-md text-xs transition cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>กลับหน้าหลัก</span>
          </motion.button>

          {/* Stats Glass Cards (Matching Mockup Image) */}
          <div className="flex flex-col gap-2">
            {/* Time Played Glass Card */}
            <div className="bg-[#386bbd]/60 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 text-center text-white shadow-lg min-w-28">
              <p className="text-[10px] font-semibold text-sky-100 opacity-90">
                เวลาที่เล่น
              </p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 font-mono drop-shadow-xs">
                {formatTime(secondsPlayed)}
              </p>
              <p className="text-[9px] text-sky-200 font-medium">นาที</p>
            </div>

            {/* Popped Bubbles Glass Card */}
            <div className="bg-[#386bbd]/60 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 text-center text-white shadow-lg min-w-28">
              <p className="text-[10px] font-semibold text-sky-100 opacity-90">
                ฟองที่แตก
              </p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 font-mono drop-shadow-xs">
                {poppedCount}
              </p>
              <p className="text-[9px] text-sky-200 font-medium">ฟอง</p>
            </div>
          </div>
        </div>

        {/* Center Title Badge with Track Selector Trigger */}
        <div className="relative pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsBgmMenuOpen(!isBgmMenuOpen)}
            className="bg-white/90 hover:bg-white backdrop-blur-md border border-sky-100/80 rounded-full px-5 py-1.5 shadow-md flex flex-col items-center text-center cursor-pointer transition"
          >
            <div className="flex items-center gap-1.5 font-black text-[#1f2d4d] text-sm">
              <Music className="w-4 h-4 text-sky-500" />
              <span>Bubble Pop Relax</span>
            </div>
            <span className="text-[10px] text-sky-600 font-bold tracking-wide flex items-center gap-1">
              <span>เพลง: {BGM_OPTIONS.find((t) => t.id === selectedTrack)?.icon} {BGM_OPTIONS.find((t) => t.id === selectedTrack)?.name}</span>
              <span className="text-[8px]">▼</span>
            </span>
          </motion.button>

          {/* Floating BGM Selector Dropdown Menu */}
          <AnimatePresence>
            {isBgmMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-1"
              >
                <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center border-b border-slate-100">
                  เลือกเพลงพื้นหลัง (BGM)
                </div>
                {BGM_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedTrack(opt.id);
                      setIsMuted(false);
                      setIsBgmMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedTrack === opt.id
                        ? "bg-[#254394] text-white shadow-sm"
                        : "text-slate-700 hover:bg-sky-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{opt.icon}</span>
                      <span>{opt.name}</span>
                    </span>
                    {selectedTrack === opt.id && <span>✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Control Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Stress Meter Graph Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGraphModal(!showGraphModal)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-md border border-sky-100 flex items-center justify-center cursor-pointer transition backdrop-blur-md"
            title="ดูดีไซน์กราฟวัดความเครียด"
          >
            <BarChart2 className="w-5 h-5 text-sky-600" />
          </motion.button>

          {/* Audio Mute/Unmute */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-md border border-sky-100 flex items-center justify-center cursor-pointer transition backdrop-blur-md"
            title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-sky-600" />
            )}
          </motion.button>

          {/* Pause / Resume */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPaused(!isPaused)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-md border border-sky-100 flex items-center justify-center cursor-pointer transition backdrop-blur-md"
            title={isPaused ? "เล่นต่อ" : "หยุดชั่วคราว"}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            ) : (
              <Pause className="w-5 h-5 text-sky-700" />
            )}
          </motion.button>
        </div>
      </header>

      {/* Floating Whale Shark Animated Mascot Background Decor */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-40 animate-float-whale">
        <img
          src={whaleIcon}
          alt="Whale Shark Companion"
          className="w-36 h-20 object-contain filter drop-shadow-lg"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* FLOATING STRESS LEVEL WIDGET (ORIGINAL CLEAN POSITION) */}
      <StressFloatingWidget
        statusText="กำลังลดลง"
        storageKey="widget-pos-bubble"
        onClick={() => setShowGraphModal(true)}
      />

      {/* BOTTOM FLOATING AFFIRMATION TOAST (100% Matching Image Spec) */}
      <footer className="relative z-20 p-4 flex justify-center pointer-events-none mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAffirmation}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/85 backdrop-blur-md border border-sky-100/60 rounded-full px-6 py-3 shadow-xl flex items-center gap-3 text-slate-700 text-xs font-extrabold max-w-lg pointer-events-auto"
          >
            <div className="w-7 h-7 bg-[#8c67e8] text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <Smile size={16} />
            </div>
            <span className="text-slate-700 text-xs font-bold leading-normal">
              {currentAffirmation}
            </span>
          </motion.div>
        </AnimatePresence>
      </footer>

      {/* STRESS GRAPH MODAL */}
      <AnimatePresence>
        {showGraphModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/40 backdrop-blur-xs pointer-events-auto"
            onClick={() => setShowGraphModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl relative"
            >
              <button
                onClick={() => setShowGraphModal(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center border border-white/20 z-50 hover:bg-slate-700 shadow-lg cursor-pointer text-xs"
              >
                ✕
              </button>
              <StressGraph transparent={true} currentPercentage={32} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
