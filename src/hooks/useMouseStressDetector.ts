import { useEffect, useState, useRef, useCallback } from "react";

export function useMouseStressDetector(cooldownMs = 15000) {
  const [isStressDetected, setIsStressDetected] = useState(false);
  const [detectedStressPct, setDetectedStressPct] = useState(85);
  const lastTriggerTimeRef = useRef<number>(0);
  const positionsRef = useRef<{ x: number; y: number; time: number }[]>([]);

  const triggerTestAlert = useCallback(() => {
    setDetectedStressPct(Math.floor(Math.random() * 15) + 82);
    setIsStressDetected(true);
    lastTriggerTimeRef.current = Date.now();
  }, []);

  const dismissAlert = useCallback(() => {
    setIsStressDetected(false);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTriggerTimeRef.current < cooldownMs) return;

      const pos = { x: e.clientX, y: e.clientY, time: now };
      positionsRef.current.push(pos);
      positionsRef.current = positionsRef.current.filter((p) => now - p.time <= 600);

      if (positionsRef.current.length > 8) {
        let totalDist = 0;
        let directionChanges = 0;

        for (let i = 1; i < positionsRef.current.length; i++) {
          const p1 = positionsRef.current[i - 1];
          const p2 = positionsRef.current[i];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          totalDist += Math.sqrt(dx * dx + dy * dy);

          if (i > 1) {
            const p0 = positionsRef.current[i - 2];
            const prevDx = p1.x - p0.x;
            const prevDy = p1.y - p0.y;
            if (prevDx * dx < 0 || prevDy * dy < 0) {
              directionChanges++;
            }
          }
        }

        if (totalDist > 1600 && directionChanges >= 4) {
          lastTriggerTimeRef.current = now;
          setDetectedStressPct(Math.min(99, Math.floor(75 + totalDist / 100)));
          setIsStressDetected(true);
          positionsRef.current = [];
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cooldownMs]);

  return {
    isStressDetected,
    detectedStressPct,
    dismissAlert,
    triggerTestAlert,
  };
}
