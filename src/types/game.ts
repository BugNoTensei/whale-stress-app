export type BGMTrack = "piano" | "lofi_piano" | "ocean" | "nature" | "rain_piano";

export interface BGMOption {
  id: BGMTrack;
  name: string;
  icon: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface RippleEffect {
  id?: number;
  x: number;
  y: number;
  radius: number;
  maxRadius?: number;
  alpha: number;
  color?: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
}
