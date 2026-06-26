export interface TrailPoint {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // remaining seconds
  max: number; // initial life
  hue: number; // css hue for color
  size: number;
}

export interface Ring {
  x: number;
  y: number;
  r: number;
  life: number;
  max: number;
}

export interface Popup {
  x: number;
  y: number;
  text: string;
  life: number;
  max: number;
  vy: number;
}

/** Everything the overlay computes each frame. A skin only decides how to paint it. */
export interface SparkState {
  x: number; // current eased center position
  y: number;
  h: number; // line height at the caret (for sizing)
  combo: number;
  overdrive: number; // 0..1 eased combo intensity
  errorFlash: number; // 0..1, decays after a typo
  trail: TrailPoint[]; // oldest -> newest
  particles: Particle[];
  rings: Ring[]; // checkpoint pulses (line complete)
  popups: Popup[]; // floating milestone numbers
  t: number; // elapsed seconds
}

/** A caret look. Add a new one and register it in skins/index.ts — nothing else changes. */
export interface CaretSkin {
  id: string;
  name: string; // shown in the (future) theme picker
  draw(ctx: CanvasRenderingContext2D, s: SparkState): void;
}
