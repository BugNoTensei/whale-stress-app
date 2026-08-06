import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Volume2, VolumeX, Pause, Play, Music } from "lucide-react";
import whaleIcon from "../../assets/icon/whaleicon.png";
import oceanBg from "../../assets/whale_ocean_bg.png";
import { BGMTrack, Particle, RippleEffect } from "../../types/game";
import { BGM_OPTIONS, PEACE_MESSAGES } from "../../constants/game";
import { soundManager as sounds } from "../../utils/audioSynth";

export type { BGMTrack };

// ===== TYPE DEFINITIONS =====
interface Vec2 { x: number; y: number; }

interface OceanFish {
  id: number; x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
  tailPhase: number; fleeTimer: number; baseY: number;
}

interface Jellyfish {
  id: number; x: number; y: number; vy: number;
  radius: number; color: string;
  pulsePhase: number; glowAlpha: number; glowDir: number;
  touched: boolean; sparkleTimer: number;
}

interface SeaTurtle {
  id: number; x: number; y: number;
  speed: number; direction: number;
  flipperPhase: number; bobPhase: number;
}

interface OceanBubble {
  id: number; x: number; y: number;
  radius: number; speedY: number;
  wobblePhase: number; alpha: number; popped: boolean;
}

interface TrailBubble {
  id: number; x: number; y: number;
  radius: number; alpha: number; vy: number;
}

interface Seaweed {
  x: number; height: number; phase: number; speed: number; color: string;
}

interface Coral {
  x: number; y: number; type: "branch" | "round" | "fan";
  color: string; size: number; swayPhase: number;
}

interface CausticPatch {
  x: number; y: number; radius: number; phase: number; speed: number;
}

interface Crab {
  x: number; y: number; direction: number; walkPhase: number; size: number;
}

interface Starfish {
  x: number; y: number; rotation: number; size: number; color: string;
}

interface PlanktonParticle {
  x: number; y: number; vx: number; vy: number; alpha: number; radius: number;
}

interface EventFish {
  id: number; x: number; y: number;
  vx: number; vy: number; size: number; color: string; tailPhase: number;
}

interface ManteRay {
  x: number; y: number; direction: number; wingPhase: number; size: number;
}

interface WhaleOceanGameScreenProps {
  onBackToHome: () => void;
}

// ===== COMPONENT =====
export default function WhaleOceanGameScreen({ onBackToHome }: WhaleOceanGameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showBGMPicker, setShowBGMPicker] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<BGMTrack>("ocean");
  const [peaceMsg, setPeaceMsg] = useState<string | null>(null);
  const [playSeconds, setPlaySeconds] = useState(0);
  const [calmScore, setCalmScore] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingEnabled] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Whale shark state
  const whaleRef = useRef<{
    x: number; y: number; targetX: number; targetY: number;
    angle: number; tailPhase: number; size: number;
    blinkTimer: number; isBlinking: boolean;
    idleTimer: number; isIdle: boolean;
    idleFloat: number; idleBubbleTimer: number;
    prevAngle: number; rippleCooldown: number;
    happyTimer: number; expression: "normal" | "happy" | "idle";
    trailTimer: number;
  }>({
    x: 400, y: 300, targetX: 400, targetY: 300,
    angle: 0, tailPhase: 0, size: 48,
    blinkTimer: 120, isBlinking: false,
    idleTimer: 0, isIdle: false,
    idleFloat: 0, idleBubbleTimer: 0,
    prevAngle: 0, rippleCooldown: 0,
    happyTimer: 0, expression: "normal",
    trailTimer: 0,
  });

  const isPausedRef = useRef(false);
  const mouseRef = useRef<Vec2>({ x: 400, y: 300 });
  const lastMouseMoveRef = useRef(performance.now());
  const soundCooldownRef = useRef(0);
  const playSecondsRef = useRef(0);
  const cameraXRef = useRef(0);

  // Focus mode timer ref
  const focusModeTimerRef = useRef<any>(null);
  const uiHideTimeoutRef = useRef<any>(null);

  // Ocean entities
  const fishesRef = useRef<OceanFish[]>([]);
  const jellyfishRef = useRef<Jellyfish[]>([]);
  const turtlesRef = useRef<SeaTurtle[]>([]);
  const bubblesRef = useRef<OceanBubble[]>([]);
  const trailBubblesRef = useRef<TrailBubble[]>([]);
  const ripplesRef = useRef<RippleEffect[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const seaweedRef = useRef<Seaweed[]>([]);
  const coralsRef = useRef<Coral[]>([]);
  const causticRef = useRef<CausticPatch[]>([]);
  const crabsRef = useRef<Crab[]>([]);
  const starfishRef = useRef<Starfish[]>([]);
  const planktonRef = useRef<PlanktonParticle[]>([]);
  const eventFishRef = useRef<EventFish[]>([]);
  const mantaRayRef = useRef<ManteRay | null>(null);
  const oceanEventCooldownRef = useRef(0);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Sync playSeconds to ref
  useEffect(() => { playSecondsRef.current = playSeconds; }, [playSeconds]);

  // Timer, calm, breathing
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setPlaySeconds(s => s + 1);
        setCalmScore(s => Math.min(100, s + 0.25));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show breathing guide after 30s
  useEffect(() => {
    if (playSeconds === 30 && breathingEnabled) setShowBreathing(true);
  }, [playSeconds, breathingEnabled]);

  // Focus mode after 2 minutes
  useEffect(() => {
    if (playSeconds === 120) {
      focusModeTimerRef.current = setTimeout(() => setFocusMode(true), 1000);
    }
    return () => { if (focusModeTimerRef.current) clearTimeout(focusModeTimerRef.current); };
  }, [playSeconds === 120]);

  // Peace messages every 45s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        const msg = PEACE_MESSAGES[Math.floor(Math.random() * PEACE_MESSAGES.length)];
        setPeaceMsg(msg);
        setTimeout(() => setPeaceMsg(null), 5000);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // BGM
  useEffect(() => {
    sounds.enabled = !isMuted;
    if (!isMuted && !isPaused) {
      sounds.startAmbientBGM(selectedTrack);
      sounds.startAmbientEvents();
    } else {
      sounds.stopAmbientBGM();
    }
    return () => { sounds.stopAmbientBGM(); };
  }, [isMuted, isPaused, selectedTrack]);

  // Restore UI on mouse activity in focus mode
  const restoreUI = useCallback(() => {
    if (focusMode) {
      setUiVisible(true);
      if (uiHideTimeoutRef.current) clearTimeout(uiHideTimeoutRef.current);
      uiHideTimeoutRef.current = setTimeout(() => {
        if (focusMode) setUiVisible(false);
      }, 4000);
    }
  }, [focusMode]);

  useEffect(() => {
    if (focusMode) setUiVisible(false);
    else setUiVisible(true);
  }, [focusMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
    lastMouseMoveRef.current = performance.now();
    restoreUI();
  }, [restoreUI]);

  const handleCanvasClick = useCallback(() => { restoreUI(); }, [restoreUI]);

  // ===== MAIN GAME LOOP =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Init Seaweed
    if (seaweedRef.current.length === 0) {
      const colors = ["rgba(72,187,120,0.6)", "rgba(56,161,105,0.5)", "rgba(104,211,145,0.55)"];
      for (let i = 0; i < 16; i++) {
        seaweedRef.current.push({
          x: (i / 16) * (canvas.width + 40) - 20,
          height: 65 + Math.random() * 90,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.9,
          color: colors[i % colors.length],
        });
      }
    }

    // Init Corals
    if (coralsRef.current.length === 0) {
      const types: ("branch" | "round" | "fan")[] = ["branch", "round", "fan"];
      const ccolors = ["#ff8fa3", "#ff9f7f", "#c084fc", "#38bdf8", "#fb923c", "#a78bfa", "#f9a8d4"];
      for (let i = 0; i < 12; i++) {
        coralsRef.current.push({
          x: (i / 12) * canvas.width + Math.random() * 50 - 25,
          y: canvas.height, type: types[i % 3],
          color: ccolors[i % ccolors.length],
          size: 28 + Math.random() * 38,
          swayPhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Init Caustic patches
    if (causticRef.current.length === 0) {
      for (let i = 0; i < 12; i++) {
        causticRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height - 60 - Math.random() * 180,
          radius: 20 + Math.random() * 50,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.5,
        });
      }
    }

    // Init Fish
    if (fishesRef.current.length === 0) {
      const fcolors = ["#fbbf24","#f97316","#22d3ee","#a78bfa","#f472b6","#4ade80","#fb923c","#60a5fa","#34d399","#f9a8d4"];
      for (let i = 0; i < 14; i++) {
        const bx = Math.random() * canvas.width;
        const by = Math.random() * canvas.height * 0.6 + 60;
        fishesRef.current.push({
          id: i, x: bx, y: by, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 0.4,
          size: 8 + Math.random() * 8, color: fcolors[i % fcolors.length],
          tailPhase: Math.random() * Math.PI * 2, fleeTimer: 0, baseY: by,
        });
      }
    }

    // Init Jellyfish
    if (jellyfishRef.current.length === 0) {
      const jcolors = ["rgba(255,182,193,0.65)","rgba(216,180,254,0.65)","rgba(186,230,253,0.65)","rgba(249,168,212,0.65)"];
      for (let i = 0; i < 5; i++) {
        jellyfishRef.current.push({
          id: i, x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.55 + 40,
          vy: 0.12 + Math.random() * 0.2,
          radius: 16 + Math.random() * 18,
          color: jcolors[i % jcolors.length],
          pulsePhase: Math.random() * Math.PI * 2,
          glowAlpha: 0.3, glowDir: 1, touched: false, sparkleTimer: 0,
        });
      }
    }

    // Init Turtles
    if (turtlesRef.current.length === 0) {
      for (let i = 0; i < 2; i++) {
        turtlesRef.current.push({
          id: i, x: i === 0 ? -100 : canvas.width + 100,
          y: 80 + Math.random() * canvas.height * 0.35,
          speed: 0.32 + Math.random() * 0.2,
          direction: i === 0 ? 1 : -1,
          flipperPhase: Math.random() * Math.PI * 2,
          bobPhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Init Bubbles
    if (bubblesRef.current.length === 0) {
      for (let i = 0; i < 22; i++) {
        bubblesRef.current.push({
          id: i, x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          radius: 4 + Math.random() * 12, speedY: 0.28 + Math.random() * 0.45,
          wobblePhase: Math.random() * Math.PI * 2, alpha: 0.3 + Math.random() * 0.4, popped: false,
        });
      }
    }

    // Init Crabs
    if (crabsRef.current.length === 0) {
      for (let i = 0; i < 4; i++) {
        crabsRef.current.push({
          x: (i / 4) * canvas.width + Math.random() * 60,
          y: canvas.height - 18,
          direction: Math.random() > 0.5 ? 1 : -1,
          walkPhase: Math.random() * Math.PI * 2,
          size: 8 + Math.random() * 5,
        });
      }
    }

    // Init Starfish
    if (starfishRef.current.length === 0) {
      const sfcolors = ["#f97316", "#ec4899", "#fb923c", "#a78bfa"];
      for (let i = 0; i < 5; i++) {
        starfishRef.current.push({
          x: (i / 5) * canvas.width + Math.random() * 80 - 40,
          y: canvas.height - 14 - Math.random() * 20,
          rotation: Math.random() * Math.PI * 2,
          size: 10 + Math.random() * 10,
          color: sfcolors[i % sfcolors.length],
        });
      }
    }

    // Init Plankton
    if (planktonRef.current.length === 0) {
      for (let i = 0; i < 35; i++) {
        planktonRef.current.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.1,
          alpha: 0.15 + Math.random() * 0.25, radius: 1 + Math.random() * 1.5,
        });
      }
    }

    // Preload background image
    const bgImg = new Image(); bgImg.src = oceanBg;
    const wsImg = new Image(); wsImg.src = whaleIcon;

    let animId: number;
    oceanEventCooldownRef.current = 3600;

    const spawnOceanEvent = () => {
      const eventType = Math.floor(Math.random() * 4);
      if (eventType === 0) {
        // Large school of fish
        const fcolors = ["#fbbf24","#f97316","#22d3ee","#a78bfa"];
        const startX = Math.random() > 0.5 ? -60 : W() + 60;
        const dir = startX < 0 ? 1 : -1;
        const gy = 100 + Math.random() * H() * 0.5;
        for (let i = 0; i < 18; i++) {
          eventFishRef.current.push({
            id: Math.random(), x: startX + (Math.random() - 0.5) * 80,
            y: gy + (Math.random() - 0.5) * 60,
            vx: dir * (0.8 + Math.random() * 0.5), vy: (Math.random() - 0.5) * 0.2,
            size: 6 + Math.random() * 5, color: fcolors[Math.floor(Math.random() * fcolors.length)],
            tailPhase: Math.random() * Math.PI * 2,
          });
        }
      } else if (eventType === 1) {
        // Manta ray
        const startX = Math.random() > 0.5 ? -120 : W() + 120;
        mantaRayRef.current = {
          x: startX, y: 80 + Math.random() * H() * 0.4,
          direction: startX < 0 ? 1 : -1,
          wingPhase: 0, size: 55,
        };
      }
      // eventType 2 & 3 are handled in render (extra sunlight, bubble stream) via flags
    };

    const render = () => {
      const t = performance.now() * 0.001;
      ctx.clearRect(0, 0, W(), H());

      // Helper for infinite horizontal wrapping
      const cameraX = cameraXRef.current;
      const getRenderX = (x: number, parallaxFactor = 1.0) => {
        const w = W();
        const relX = (x - cameraX * parallaxFactor) % w;
        return relX < 0 ? relX + w : relX;
      };

      // --- BACKGROUND (Infinite Horizontal Tiling) ---
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        const bgW = W();
        const bgOffsetX = -((cameraX % bgW) + bgW) % bgW;
        ctx.drawImage(bgImg, bgOffsetX - bgW, 0, bgW, H());
        ctx.drawImage(bgImg, bgOffsetX, 0, bgW, H());
        ctx.drawImage(bgImg, bgOffsetX + bgW, 0, bgW, H());
      } else {
        const grd = ctx.createLinearGradient(0, 0, 0, H());
        grd.addColorStop(0, "#b3e5fc"); grd.addColorStop(0.5, "#4fc3f7"); grd.addColorStop(1, "#0277bd");
        ctx.fillStyle = grd; ctx.fillRect(0, 0, W(), H());
      }

      // Depth overlay
      const depthOv = ctx.createLinearGradient(0, 0, 0, H());
      depthOv.addColorStop(0, "rgba(0,100,180,0.08)");
      depthOv.addColorStop(1, "rgba(0,50,120,0.28)");
      ctx.fillStyle = depthOv; ctx.fillRect(0, 0, W(), H());

      // --- UNDERWATER CAUSTIC LIGHT (Feature 1) ---
      causticRef.current.forEach(c => {
        c.phase += 0.008 * c.speed;
        const cx = getRenderX(c.x + Math.sin(c.phase) * 30, 0.85);
        const cy = c.y + Math.cos(c.phase * 0.7) * 15;
        const alpha = Math.sin(c.phase * 1.3) * 0.04 + 0.06;
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.radius);
        cg.addColorStop(0, `rgba(255,255,200,${alpha})`);
        cg.addColorStop(0.5, `rgba(180,230,255,${alpha * 0.5})`);
        cg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.save();
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.ellipse(cx, cy, c.radius * (0.8 + Math.sin(c.phase * 0.9) * 0.2), c.radius * 0.5, c.phase * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- SUNLIGHT RAYS ---
      ctx.save();
      for (let i = 0; i < 5; i++) {
        const baseRx = (W() / 5) * i + Math.sin(t * 0.32 + i) * 28;
        const rx = getRenderX(baseRx, 0.3);
        const op = Math.sin(t * 0.38 + i * 1.2) * 0.03 + 0.05;
        const rg = ctx.createLinearGradient(rx, 0, rx + 80, H());
        rg.addColorStop(0, `rgba(255,255,255,${op * 2.2})`);
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(rx, 0); ctx.lineTo(rx + 70, 0);
        ctx.lineTo(rx + 170, H()); ctx.lineTo(rx + 100, H());
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      if (!isPausedRef.current) {
        // --- UPDATE WHALE SHARK ---
        const ws = whaleRef.current;
        const mx = mouseRef.current.x, my = mouseRef.current.y;
        const dx = mx - ws.x, dy = my - ws.y;
        const dist = Math.hypot(dx, dy);

        // Idle detection (Feature 2)
        const timeSinceMove = performance.now() - lastMouseMoveRef.current;
        ws.isIdle = timeSinceMove > 5000;

        if (!ws.isIdle) {
          const moveX = dx * 0.042;
          const moveY = dy * 0.042;
          ws.x += moveX;
          ws.y += moveY;

          // Infinite camera scrolling as whale swims left/right
          cameraXRef.current += moveX * 0.75;

          // Keep whale shark within comfortable screen boundaries while ocean background & environment scroll endlessly
          const margin = 120;
          if (ws.x < margin) ws.x = margin;
          if (ws.x > W() - margin) ws.x = W() - margin;

          ws.angle = Math.atan2(dy, dx);
          ws.tailPhase += 0.09;
          ws.idleTimer = 0;
          ws.idleFloat = 0;

          // Direction change ripple (Feature 4)
          const angleDiff = Math.abs(ws.angle - ws.prevAngle);
          if (angleDiff > 0.45 && ws.rippleCooldown <= 0 && dist > 30) {
            ripplesRef.current.push({ id: Math.random(), x: ws.x, y: ws.y, radius: 5, maxRadius: 55, alpha: 0.6 });
            sounds.playWaterRipple();
            ws.rippleCooldown = 45;
          }
          ws.prevAngle = ws.angle;
          if (ws.rippleCooldown > 0) ws.rippleCooldown--;

          // Bubble trail (Feature 3)
          ws.trailTimer++;
          if (ws.trailTimer >= 5 && dist > 8) {
            ws.trailTimer = 0;
            const trailAngle = ws.angle + Math.PI;
            const tx = ws.x + Math.cos(trailAngle) * ws.size * 0.7 + (Math.random() - 0.5) * 12;
            const ty = ws.y + Math.sin(trailAngle) * ws.size * 0.3 + (Math.random() - 0.5) * 10;
            trailBubblesRef.current.push({
              id: Math.random(), x: tx, y: ty,
              radius: 1.5 + Math.random() * 3,
              alpha: 0.55, vy: 0.35 + Math.random() * 0.35,
            });
          }
        } else {
          // IDLE animation (Feature 2)
          ws.idleTimer++;
          ws.idleFloat = Math.sin(ws.idleTimer * 0.04) * 2.8;
          ws.y += ws.idleFloat * 0.1;
          ws.tailPhase += 0.035; // slow wag
          ws.expression = "idle";

          // Idle bubbles
          ws.idleBubbleTimer++;
          if (ws.idleBubbleTimer > 120) {
            ws.idleBubbleTimer = 0;
            trailBubblesRef.current.push({
              id: Math.random(),
              x: ws.x + (Math.cos(ws.angle) >= 0 ? 1 : -1) * ws.size * 0.8,
              y: ws.y - 8,
              radius: 3 + Math.random() * 4, alpha: 0.6, vy: 0.5,
            });
            sounds.playBubblePop(0.05);
          }
        }

        // Whale expression
        if (ws.happyTimer > 0) { ws.happyTimer--; ws.expression = "happy"; }
        else if (ws.isIdle) ws.expression = "idle";
        else ws.expression = "normal";

        // Blink timer (Feature 5)
        ws.blinkTimer--;
        if (ws.blinkTimer <= 0) {
          ws.isBlinking = true;
          setTimeout(() => { ws.isBlinking = false; }, 120);
          ws.blinkTimer = 180 + Math.floor(Math.random() * 240);
        }

        // --- TRAIL BUBBLES ---
        trailBubblesRef.current.forEach(tb => { tb.y -= tb.vy; tb.alpha -= 0.015; });
        trailBubblesRef.current = trailBubblesRef.current.filter(tb => tb.alpha > 0);

        // --- RIPPLES ---
        ripplesRef.current.forEach(r => { r.radius += 0.8; r.alpha -= 0.012; });
        ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0);

        // --- UPDATE FISH ---
        fishesRef.current.forEach(f => {
          const fdx = ws.x - f.x, fdy = ws.y - f.y;
          const fdist = Math.hypot(fdx, fdy);
          if (fdist < 120) {
            f.fleeTimer = 90;
            if (soundCooldownRef.current <= 0) { sounds.playFishNearby(); soundCooldownRef.current = 70; }
          }
          soundCooldownRef.current = Math.max(0, soundCooldownRef.current - 1);
          if (f.fleeTimer > 0) {
            f.fleeTimer--;
            const fa = Math.atan2(fdy, fdx) + Math.PI;
            f.vx += Math.cos(fa) * 0.09; f.vy += Math.sin(fa) * 0.05;
          } else {
            f.vx += (Math.random() - 0.5) * 0.04;
            f.vy += (f.baseY - f.y) * 0.002;
          }
          f.vx *= 0.96; f.vy *= 0.96;
          f.vx = Math.max(-2.8, Math.min(2.8, f.vx));
          f.vy = Math.max(-1.5, Math.min(1.5, f.vy));
          f.x += f.vx; f.y += f.vy; f.tailPhase += 0.11;
          if (f.x > W() + 50) { f.x = -50; f.baseY = Math.random() * H() * 0.6 + 60; }
          if (f.x < -50) { f.x = W() + 50; }
          if (f.y < 30) f.y = 30;
          if (f.y > H() - 75) f.y = H() - 75;
        });

        // --- UPDATE JELLYFISH ---
        jellyfishRef.current.forEach(j => {
          j.y -= j.vy; j.x += Math.sin(t * 0.3 + j.id) * 0.22;
          j.pulsePhase += 0.04; j.glowAlpha += 0.007 * j.glowDir;
          if (j.glowAlpha > 0.55 || j.glowAlpha < 0.2) j.glowDir *= -1;
          if (j.sparkleTimer > 0) j.sparkleTimer--;
          if (j.y < -j.radius - 10) { j.y = H() + j.radius; j.x = Math.random() * W(); }
          if (!j.touched) {
            const jd = Math.hypot(ws.x - j.x, ws.y - j.y);
            if (jd < j.radius + ws.size * 0.55) {
              j.touched = true; j.sparkleTimer = 45; sounds.playJellyfish();
              ws.happyTimer = 60;
              for (let p = 0; p < 6; p++) {
                const a = (p / 6) * Math.PI * 2;
                particlesRef.current.push({ x: j.x, y: j.y, vx: Math.cos(a) * 1.4, vy: Math.sin(a) * 1.4, radius: 2.5, color: j.color.replace("0.65", "0.9"), alpha: 0.85, decay: 0.028 });
              }
              setTimeout(() => { j.touched = false; }, 1400);
            }
          }
        });

        // --- UPDATE TURTLES ---
        turtlesRef.current.forEach(tu => {
          tu.x += tu.speed * tu.direction; tu.flipperPhase += 0.055; tu.bobPhase += 0.018;
          tu.y += Math.sin(tu.bobPhase) * 0.16;
          if (tu.direction === 1 && tu.x > W() + 120) { tu.x = -120; tu.y = 80 + Math.random() * H() * 0.4; }
          else if (tu.direction === -1 && tu.x < -120) { tu.x = W() + 120; tu.y = 80 + Math.random() * H() * 0.4; }
        });

        // --- UPDATE OCEAN BUBBLES ---
        bubblesRef.current.forEach(b => {
          b.y -= b.speedY; b.wobblePhase += 0.038;
          b.x += Math.sin(b.wobblePhase) * 0.38;
          if (!b.popped) {
            const bd = Math.hypot(ws.x - b.x, ws.y - b.y);
            if (bd < b.radius + ws.size * 0.45) {
              b.popped = true; sounds.playBubblePop();
              ws.happyTimer = 40;
              for (let p = 0; p < 4; p++) {
                const a = Math.random() * Math.PI * 2;
                particlesRef.current.push({ x: b.x, y: b.y, vx: Math.cos(a) * 1.0, vy: Math.sin(a) * 1.0 - 0.7, radius: 2, color: "rgba(200,235,255,0.9)", alpha: 0.75, decay: 0.04 });
              }
              b.y = H() + 20; b.x = Math.random() * W();
              b.radius = 4 + Math.random() * 12; b.speedY = 0.28 + Math.random() * 0.45;
              b.alpha = 0.3 + Math.random() * 0.4; b.popped = false;
            }
          }
          if (b.y < -20) { b.y = H() + 20; b.x = Math.random() * W(); }
        });
        while (bubblesRef.current.length < 22) {
          bubblesRef.current.push({ id: Math.random(), x: Math.random() * W(), y: H() + 20, radius: 4 + Math.random() * 12, speedY: 0.28 + Math.random() * 0.45, wobblePhase: Math.random() * Math.PI * 2, alpha: 0.38, popped: false });
        }

        // --- UPDATE PARTICLES ---
        particlesRef.current.forEach(p => { p.x += p.vx; p.y += p.vy; p.alpha -= p.decay; });
        particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

        // --- UPDATE CRABS (Feature 7) ---
        crabsRef.current.forEach(c => {
          c.walkPhase += 0.06;
          c.x += Math.sin(c.walkPhase * 0.5) * 0.25 * c.direction;
          if (c.x < 10 || c.x > W() - 10) c.direction *= -1;
        });

        // --- UPDATE PLANKTON ---
        planktonRef.current.forEach(p => {
          p.x += p.vx + Math.sin(t * 0.4 + p.y * 0.01) * 0.06;
          p.y += p.vy + Math.cos(t * 0.3 + p.x * 0.01) * 0.04;
          if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0;
          if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        });

        // --- OCEAN EVENTS (Feature 6) ---
        oceanEventCooldownRef.current--;
        if (oceanEventCooldownRef.current <= 0) {
          spawnOceanEvent();
          oceanEventCooldownRef.current = 2400 + Math.floor(Math.random() * 2000);
        }

        // Update event fish
        eventFishRef.current.forEach(ef => {
          ef.x += ef.vx; ef.tailPhase += 0.12;
          ef.y += Math.sin(ef.tailPhase * 0.1) * 0.18;
        });
        eventFishRef.current = eventFishRef.current.filter(ef => ef.x > -80 && ef.x < W() + 80);

        // Update manta ray
        if (mantaRayRef.current) {
          const mr = mantaRayRef.current;
          mr.x += mr.direction * 0.7; mr.wingPhase += 0.05;
          if ((mr.direction === 1 && mr.x > W() + 140) || (mr.direction === -1 && mr.x < -140)) {
            mantaRayRef.current = null;
          }
        }
      } // end !isPaused

      // ===== DRAW PASS =====

      // Plankton
      planktonRef.current.forEach(p => {
        const renderX = getRenderX(p.x, 1.1);
        ctx.save(); ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "rgba(180,230,255,0.9)";
        ctx.beginPath(); ctx.arc(renderX, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // Seaweed
      ctx.save(); ctx.lineWidth = 5; ctx.lineCap = "round";
      seaweedRef.current.forEach(sw => {
        const renderX = getRenderX(sw.x, 1.0);
        ctx.strokeStyle = sw.color;
        const sway = Math.sin(t * sw.speed + sw.phase) * 13;
        ctx.beginPath();
        ctx.moveTo(renderX, H());
        ctx.quadraticCurveTo(renderX + sway, H() - sw.height / 2, renderX + sway * 1.5, H() - sw.height);
        ctx.stroke();
      });
      ctx.restore();

      // Corals
      coralsRef.current.forEach(c => {
        const renderX = getRenderX(c.x, 1.0);
        ctx.save();
        const sway = Math.sin(t * 0.65 + c.swayPhase) * 1.8;
        ctx.translate(renderX, c.y); ctx.rotate(sway * 0.014);
        ctx.fillStyle = c.color; ctx.strokeStyle = c.color;
        ctx.globalAlpha = 0.85;
        if (c.type === "branch") {
          for (let b = 0; b < 5; b++) {
            const bx = (b - 2) * (c.size / 5);
            const bh = c.size * (0.55 + Math.abs(2 - b) * 0.04);
            ctx.lineWidth = 4 - Math.abs(2 - b);
            ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx + Math.sin(b) * 7, -bh); ctx.stroke();
          }
        } else if (c.type === "round") {
          ctx.beginPath(); ctx.arc(0, -c.size * 0.4, c.size * 0.48, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(0, -c.size * 0.5, c.size * 0.52, Math.PI, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });

      // Starfish (Feature 7)
      starfishRef.current.forEach(sf => {
        const renderX = getRenderX(sf.x, 1.0);
        ctx.save(); ctx.translate(renderX, sf.y); ctx.rotate(sf.rotation);
        ctx.fillStyle = sf.color; ctx.globalAlpha = 0.75;
        for (let arm = 0; arm < 5; arm++) {
          const a = (arm / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * sf.size, Math.sin(a) * sf.size);
          ctx.lineTo(Math.cos(a + Math.PI / 5) * sf.size * 0.4, Math.sin(a + Math.PI / 5) * sf.size * 0.4);
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      });

      // Crabs (Feature 7)
      crabsRef.current.forEach(c => {
        const renderX = getRenderX(c.x, 1.0);
        ctx.save(); ctx.translate(renderX, c.y); ctx.globalAlpha = 0.75;
        const w = c.walkPhase;
        ctx.fillStyle = "#f97316";
        ctx.beginPath(); ctx.ellipse(0, 0, c.size, c.size * 0.65, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ea580c"; ctx.lineWidth = 1.5;
        [[-c.size, -2], [-c.size * 1.4, -c.size * 0.5 + Math.sin(w) * 3], [c.size, -2], [c.size * 1.4, -c.size * 0.5 + Math.sin(w + 1) * 3]].forEach(([ex, ey]) => {
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
        });
        ctx.fillStyle = "#fef3c7"; ctx.beginPath(); ctx.arc(-c.size * 0.3, -c.size * 0.2, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(c.size * 0.3, -c.size * 0.2, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // Ocean Bubbles
      bubblesRef.current.forEach(b => {
        const renderX = getRenderX(b.x, 0.9);
        ctx.save(); ctx.globalAlpha = b.alpha;
        const bg2 = ctx.createRadialGradient(renderX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.05, renderX, b.y, b.radius);
        bg2.addColorStop(0, "rgba(255,255,255,0.9)");
        bg2.addColorStop(0.5, "rgba(200,235,255,0.5)");
        bg2.addColorStop(1, "rgba(180,220,255,0.15)");
        ctx.fillStyle = bg2; ctx.beginPath(); ctx.arc(renderX, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      });

      // Trail Bubbles (Feature 3)
      trailBubblesRef.current.forEach(tb => {
        ctx.save(); ctx.globalAlpha = Math.max(0, tb.alpha);
        ctx.fillStyle = "rgba(200,240,255,0.8)";
        ctx.beginPath(); ctx.arc(tb.x, tb.y, tb.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.restore();
      });

      // Water Ripples (Feature 4)
      ripplesRef.current.forEach(r => {
        ctx.save(); ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.strokeStyle = "rgba(180,220,255,0.8)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = Math.max(0, r.alpha * 0.4);
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      });

      // Jellyfish
      jellyfishRef.current.forEach(j => {
        const renderX = getRenderX(j.x, 0.7);
        ctx.save();
        const pulse = Math.sin(j.pulsePhase) * 0.1 + 1;
        const rx = j.radius * pulse, ry = j.radius * pulse * 0.72;
        const jglow = ctx.createRadialGradient(renderX, j.y, 0, renderX, j.y, rx * 1.7);
        jglow.addColorStop(0, j.color.replace("0.65", String(j.glowAlpha)));
        jglow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = jglow; ctx.beginPath(); ctx.ellipse(renderX, j.y, rx * 1.7, ry * 1.7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = j.color; ctx.beginPath(); ctx.ellipse(renderX, j.y, rx, ry, 0, Math.PI, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = j.color.replace("0.65", "0.35"); ctx.lineWidth = 1.4;
        for (let ti = 0; ti < 6; ti++) {
          const tx = renderX + (ti - 2.5) * (rx / 3);
          ctx.beginPath(); ctx.moveTo(tx, j.y);
          ctx.bezierCurveTo(tx + Math.sin(t + ti) * 6, j.y + 12, tx + Math.sin(t + ti + 1) * 8, j.y + 24, tx + Math.sin(t + ti) * 4, j.y + 32);
          ctx.stroke();
        }
        if (j.sparkleTimer > 0) {
          ctx.fillStyle = "rgba(255,255,200,0.8)";
          for (let s = 0; s < 4; s++) { const sa = (s / 4) * Math.PI * 2 + t * 3; ctx.beginPath(); ctx.arc(renderX + Math.cos(sa) * (rx + 8), j.y + Math.sin(sa) * (ry + 6), 3, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.restore();
      });

      // Sea Turtles
      turtlesRef.current.forEach(tu => {
        const renderX = getRenderX(tu.x, 0.7);
        ctx.save(); ctx.translate(renderX, tu.y);
        if (tu.direction === -1) ctx.scale(-1, 1);
        const shGrad = ctx.createRadialGradient(0, -2, 4, 0, -2, 22);
        shGrad.addColorStop(0, "#6ee7b7"); shGrad.addColorStop(1, "#059669");
        ctx.fillStyle = shGrad; ctx.beginPath(); ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#047857"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(10, -4); ctx.moveTo(-12, 3); ctx.lineTo(12, 3); ctx.moveTo(0, -14); ctx.lineTo(0, 14); ctx.stroke();
        ctx.fillStyle = "#34d399"; ctx.beginPath(); ctx.ellipse(22, 0, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a1a2e"; ctx.beginPath(); ctx.arc(26, -2, 2, 0, Math.PI * 2); ctx.fill();
        const fp = Math.sin(tu.flipperPhase) * 0.4;
        ctx.fillStyle = "#34d399";
        [{ x: -8, y: -18, a: -0.5 + fp }, { x: 8, y: -18, a: 0.5 - fp }, { x: -8, y: 18, a: 0.5 + fp }, { x: 8, y: 18, a: -0.5 - fp }].forEach(fl => {
          ctx.save(); ctx.translate(fl.x, fl.y); ctx.rotate(fl.a);
          ctx.beginPath(); ctx.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        });
        ctx.restore();
      });

      // Fish (main shoal)
      fishesRef.current.forEach(f => {
        const renderX = getRenderX(f.x, 1.0);
        ctx.save();
        const fdir = f.vx >= 0 ? 1 : -1;
        ctx.translate(renderX, f.y); ctx.scale(fdir, 1);
        ctx.fillStyle = f.color;
        ctx.beginPath(); ctx.ellipse(0, 0, f.size, f.size * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        const tw = Math.sin(f.tailPhase) * 4;
        ctx.beginPath(); ctx.moveTo(-f.size * 0.8, 0); ctx.lineTo(-f.size * 1.6, -f.size * 0.5 + tw); ctx.lineTo(-f.size * 1.6, f.size * 0.5 + tw); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(f.size * 0.38, -f.size * 0.14, f.size * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a1a2e"; ctx.beginPath(); ctx.arc(f.size * 0.43, -f.size * 0.14, f.size * 0.1, 0, Math.PI * 2); ctx.fill();
        if (f.id % 3 === 0) {
          ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.8;
          for (let s = 0; s < 2; s++) { ctx.beginPath(); ctx.moveTo(-f.size * 0.2 + s * f.size * 0.4, -f.size * 0.45); ctx.lineTo(-f.size * 0.2 + s * f.size * 0.4, f.size * 0.45); ctx.stroke(); }
        }
        ctx.restore();
      });

      // Event Fish (school)
      eventFishRef.current.forEach(ef => {
        ctx.save(); ctx.translate(ef.x, ef.y);
        const edir = ef.vx >= 0 ? 1 : -1; ctx.scale(edir, 1);
        ctx.fillStyle = ef.color; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.ellipse(0, 0, ef.size, ef.size * 0.48, 0, 0, Math.PI * 2); ctx.fill();
        const etw = Math.sin(ef.tailPhase) * 3.5;
        ctx.beginPath(); ctx.moveTo(-ef.size * 0.8, 0); ctx.lineTo(-ef.size * 1.55, -ef.size * 0.45 + etw); ctx.lineTo(-ef.size * 1.55, ef.size * 0.45 + etw); ctx.closePath(); ctx.fill();
        ctx.restore();
      });

      // Manta Ray (Feature 6)
      if (mantaRayRef.current) {
        const mr = mantaRayRef.current;
        ctx.save(); ctx.translate(mr.x, mr.y);
        if (mr.direction === -1) ctx.scale(-1, 1);
        ctx.globalAlpha = 0.65;
        const wingFlap = Math.sin(mr.wingPhase) * 0.2;
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(mr.size * 0.4, 0);
        ctx.bezierCurveTo(0, -mr.size * 0.7 - wingFlap * mr.size, -mr.size * 0.5, -mr.size * 0.5, -mr.size * 0.6, 0);
        ctx.bezierCurveTo(-mr.size * 0.5, mr.size * 0.5, 0, mr.size * 0.7 + wingFlap * mr.size, mr.size * 0.4, 0);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#94a3b8";
        ctx.beginPath(); ctx.ellipse(mr.size * 0.1, 0, mr.size * 0.2, mr.size * 0.12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Particles
      particlesRef.current.forEach(p => {
        ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });

      // ===== DRAW WHALE SHARK (player) =====
      const ws = whaleRef.current;
      ctx.save();
      ctx.translate(ws.x, ws.y);

      // Facing orientation calculation (whaleicon.png naturally faces left)
      const isFacingRight = Math.cos(ws.angle) >= 0;
      const facingX = isFacingRight ? -1 : 1;

      // Pitch calculation (up/down rotation without upside-down inversion)
      let pitchAngle = ws.angle;
      if (isFacingRight) {
        pitchAngle = ws.angle;
      } else {
        pitchAngle = ws.angle > 0 ? ws.angle - Math.PI : ws.angle + Math.PI;
      }
      const clampedPitch = Math.max(-0.42, Math.min(0.42, pitchAngle));

      ctx.scale(facingX, 1);
      ctx.rotate(clampedPitch * (isFacingRight ? -1 : 1));

      // Glow aura
      const wglow = ctx.createRadialGradient(0, 0, 10, 0, 0, ws.size * 1.45);
      wglow.addColorStop(0, ws.expression === "happy" ? "rgba(250,200,100,0.22)" : "rgba(147,197,253,0.22)");
      wglow.addColorStop(1, "rgba(147,197,253,0)");
      ctx.fillStyle = wglow; ctx.beginPath(); ctx.arc(0, 0, ws.size * 1.45, 0, Math.PI * 2); ctx.fill();

      // Draw whale icon with natural aspect ratio to prevent squishing/distortion
      if (wsImg.complete && wsImg.naturalWidth > 0) {
        const imgAspect = wsImg.naturalWidth / wsImg.naturalHeight;
        const drawW = ws.size * 2.3;
        const drawH = drawW / imgAspect;
        ctx.drawImage(wsImg, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        // Fallback drawn whale
        ctx.fillStyle = "#1e40af";
        ctx.beginPath(); ctx.ellipse(0, 0, ws.size, ws.size * 0.52, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath(); ctx.ellipse(ws.size * 0.1, ws.size * 0.1, ws.size * 0.55, ws.size * 0.24, 0.2, 0, Math.PI * 2); ctx.fill();
        // Spots
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        [[0.2, -0.25], [-0.1, -0.3], [0.45, -0.12]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(sx * ws.size, sy * ws.size, 4, 0, Math.PI * 2); ctx.fill(); });
        // Tail
        const wt = Math.sin(ws.tailPhase) * (ws.isIdle ? 6 : 9);
        ctx.fillStyle = "#1e40af";
        ctx.beginPath(); ctx.moveTo(-ws.size * 0.82, 0); ctx.lineTo(-ws.size * 1.45, -ws.size * 0.48 + wt); ctx.lineTo(-ws.size * 1.45, ws.size * 0.48 + wt); ctx.closePath(); ctx.fill();
        // Eye
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(ws.size * 0.42, -ws.size * 0.12, ws.size * 0.14, 0, Math.PI * 2); ctx.fill();
        if (!ws.isBlinking) {
          ctx.fillStyle = "#1a1a2e"; ctx.beginPath(); ctx.arc(ws.size * 0.45, -ws.size * 0.12, ws.size * 0.08, 0, Math.PI * 2); ctx.fill();
          // Pupil shine
          ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(ws.size * 0.47, -ws.size * 0.145, ws.size * 0.035, 0, Math.PI * 2); ctx.fill();
        } else {
          // Blink line
          ctx.strokeStyle = "#1a1a2e"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(ws.size * 0.35, -ws.size * 0.12); ctx.lineTo(ws.size * 0.52, -ws.size * 0.12); ctx.stroke();
        }
        // Expression (Feature 5)
        ctx.strokeStyle = ws.expression === "happy" ? "#22c55e" : "rgba(30,30,80,0.7)";
        ctx.lineWidth = 1.5; ctx.lineCap = "round";
        if (ws.expression === "happy") {
          ctx.beginPath(); ctx.arc(ws.size * 0.28, -ws.size * 0.02, ws.size * 0.14, 0, Math.PI); ctx.stroke();
        } else if (ws.expression === "idle") {
          ctx.beginPath(); ctx.moveTo(ws.size * 0.18, -ws.size * 0.04); ctx.lineTo(ws.size * 0.4, -ws.size * 0.04); ctx.stroke();
          // Tiny idle bubbles from mouth
          ctx.fillStyle = "rgba(180,220,255,0.65)"; ctx.globalAlpha = 0.7;
          ctx.beginPath(); ctx.arc(ws.size * 0.55, -ws.size * 0.05, 2.5, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(ws.size * 0.28, ws.size * 0.0, ws.size * 0.12, 0, Math.PI); ctx.stroke();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resizeCanvas); };
  }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="whale-ocean-screen">
      <canvas
        ref={canvasRef}
        className="whale-ocean-canvas"
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
      />

      {/* HUD */}
      <motion.div
        className="whale-ocean-hud"
        animate={{ opacity: focusMode ? (uiVisible ? 1 : 0) : 1 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        style={{ pointerEvents: focusMode && !uiVisible ? "none" : undefined }}
      >
        {/* TOP LEFT */}
        <div className="wo-top-left">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="wo-back-btn" onClick={onBackToHome} id="wo-back-btn">
            <ChevronLeft size={18} /><span>กลับหน้าหลัก</span>
          </motion.button>
          <div className="wo-stat-card">
            <div className="wo-stat-label">⏱ เวลาที่เล่น</div>
            <div className="wo-stat-value">{formatTime(playSeconds)}</div>
            <div className="wo-stat-sub">นาที</div>
          </div>
          <div className="wo-stat-card">
            <div className="wo-stat-label">🌊 ความสงบ</div>
            <div className="wo-stat-value">{Math.round(calmScore)}%</div>
            <div className="wo-calm-bar"><div className="wo-calm-fill" style={{ width: `${calmScore}%` }} /></div>
          </div>
        </div>

        {/* TOP CENTER */}
        <div className="wo-title-badge">
          <span className="wo-title-icon">🐋</span>
          <div>
            <div className="wo-title-text">Whale Ocean</div>
            <div className="wo-title-sub">ผ่อนคลายไปกับโลกใต้ทะเล</div>
          </div>
        </div>

        {/* TOP RIGHT */}
        <div className="wo-top-right">
          <div className="wo-control-group">
            <div className="wo-bgm-wrapper">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }} className="wo-ctrl-btn" onClick={() => setShowBGMPicker(v => !v)} id="wo-music-btn">
                <Music size={18} />
              </motion.button>
              <AnimatePresence>
                {showBGMPicker && (
                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.92 }} className="wo-bgm-picker">
                    {BGM_OPTIONS.map(opt => (
                      <button key={opt.id} className={`wo-bgm-option ${selectedTrack === opt.id ? "active" : ""}`} onClick={() => { setSelectedTrack(opt.id); setShowBGMPicker(false); }} id={`wo-bgm-${opt.id}`}>
                        <span>{opt.icon}</span><span>{opt.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }} className="wo-ctrl-btn" onClick={() => setIsMuted(v => !v)} id="wo-mute-btn">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }} className="wo-ctrl-btn" onClick={() => setIsPaused(v => !v)} id="wo-pause-btn">
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </motion.button>
          </div>
          {/* Focus mode hint */}
          {focusMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: uiVisible ? 1 : 0 }} className="wo-focus-hint">
              Focus Mode — เลื่อนเมาส์เพื่อแสดง UI
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* BACK BUTTON always visible in focus mode */}
      {focusMode && (
        <motion.button
          className="wo-focus-back"
          animate={{ opacity: uiVisible ? 0 : 0.55 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          onClick={onBackToHome}
          id="wo-focus-back-btn"
        >
          <ChevronLeft size={16} /> กลับ
        </motion.button>
      )}

      {/* PAUSE OVERLAY */}
      <AnimatePresence>
        {isPaused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="wo-pause-overlay">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} className="wo-pause-card">
              <div className="wo-pause-icon">⏸</div>
              <div className="wo-pause-title">หยุดพักชั่วคราว</div>
              <div className="wo-pause-sub">ฉลามวาฬรอคุณอยู่ใต้ทะเล 🐋</div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="wo-resume-btn" onClick={() => setIsPaused(false)} id="wo-resume-btn">
                <Play size={16} /> กลับไปว่ายน้ำ
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BREATHING GUIDE (Feature 8) */}
      <AnimatePresence>
        {showBreathing && breathingEnabled && !isPaused && (
          <BreathingGuide onDismiss={() => setShowBreathing(false)} />
        )}
      </AnimatePresence>

      {/* BOTTOM BAR */}
      <div className="wo-bottom-bar">
        <AnimatePresence mode="wait">
          {peaceMsg ? (
            <motion.div key={peaceMsg} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="wo-peace-msg">
              {peaceMsg}
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="wo-hint">
              <span className="wo-hint-icon">💡</span>
              <span>ขยับเมาส์เพื่อพาฉลามวาฬว่ายน้ำ หยุดนิ่ง 5 วินาทีเพื่อดูท่า Idle น่ารัก 🐋</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ===== BREATHING GUIDE COMPONENT (Feature 8) =====
function BreathingGuide({ onDismiss }: { onDismiss: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [scale, setScale] = useState(0.6);
  const [label, setLabel] = useState("หายใจเข้า");

  useEffect(() => {
    // 8-second cycle: 3s in, 1s hold, 4s out
    const cycle = () => {
      setPhase("in"); setLabel("หายใจเข้า");
      setScale(1);
      setTimeout(() => {
        setPhase("hold"); setLabel("กลั้นหายใจ");
        setTimeout(() => {
          setPhase("out"); setLabel("หายใจออก");
          setScale(0.6);
        }, 1000);
      }, 3000);
    };
    cycle();
    const interval = setInterval(cycle, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="wo-breathing-container"
    >
      <motion.div
        className="wo-breathing-circle"
        animate={{ scale }}
        transition={{ duration: phase === "in" ? 3 : phase === "hold" ? 0.1 : 4, ease: phase === "hold" ? "linear" : "easeInOut" }}
      >
        <div className="wo-breathing-label">{label}</div>
      </motion.div>
      <button className="wo-breathing-dismiss" onClick={onDismiss}>✕</button>
    </motion.div>
  );
}
