import { useEffect, useRef } from 'react';
import { SKINS } from './skins';
import type { Particle, SparkState, TrailPoint } from './types';

interface Props {
  box: { x: number; y: number; h: number };
  combo: number;
  typos: number;
  active: boolean;
  skinId: string;
}

const OVERDRIVE_AT = 18; // combo needed for full overdrive
const TRAIL_BASE = 8;
const TRAIL_PER_COMBO = 1.4;
const TRAIL_CAP = 44;

/** Transparent canvas overlay aligned to the typing panel. Reads the engine's
 *  caret position + combo + typo count and renders the active caret skin. It
 *  never writes back to the typing state — purely a reactive layer. */
export function CaretHero({ box, combo, typos, active, skinId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ box, combo, typos, active, skinId });
  propsRef.current = { box, combo, typos, active, skinId };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const world = {
      x: propsRef.current.box.x,
      y: propsRef.current.box.y + propsRef.current.box.h / 2,
      trail: [] as TrailPoint[],
      particles: [] as Particle[],
      overdrive: 0,
      errorFlash: 0,
      t: 0,
      prevTypos: propsRef.current.typos,
      streakTimer: 0,
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const spawnError = () => {
      world.errorFlash = 1;
      if (world.trail.length > 4) world.trail.length = 4; // snap the momentum tail
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 40 + Math.random() * 120;
        world.particles.push({
          x: world.x,
          y: world.y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.5,
          max: 0.5,
          hue: 0, // red
          size: 1.5 + Math.random() * 1.5,
        });
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = propsRef.current;
      world.t += dt;

      // typo edge-detection (and reset detection when a new run drops the count)
      if (p.typos < world.prevTypos) world.prevTypos = p.typos;
      else if (p.typos > world.prevTypos) {
        world.prevTypos = p.typos;
        spawnError();
      }

      // ease the spark toward the caret center
      const tx = p.box.x;
      const ty = p.box.y + p.box.h / 2;
      world.x += (tx - world.x) * Math.min(1, dt * 18);
      world.y += (ty - world.y) * Math.min(1, dt * 18);

      // overdrive + error flash easing
      const odTarget = Math.min(1, p.combo / OVERDRIVE_AT);
      world.overdrive += (odTarget - world.overdrive) * Math.min(1, dt * 6);
      world.errorFlash = Math.max(0, world.errorFlash - dt * 3);

      // trail grows with combo
      world.trail.push({ x: world.x, y: world.y });
      const maxLen = Math.min(TRAIL_CAP, Math.round(TRAIL_BASE + p.combo * TRAIL_PER_COMBO));
      while (world.trail.length > maxLen) world.trail.shift();

      // streak motes at high overdrive
      world.streakTimer -= dt;
      if (world.overdrive > 0.6 && world.streakTimer <= 0) {
        world.streakTimer = 0.05;
        const a = Math.PI / 2 + (Math.random() - 0.5);
        world.particles.push({
          x: world.x,
          y: world.y,
          vx: Math.cos(a) * 30,
          vy: Math.sin(a) * 30,
          life: 0.4,
          max: 0.4,
          hue: 45, // gold
          size: 1 + Math.random(),
        });
      }

      for (const pt of world.particles) {
        pt.life -= dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.94;
        pt.vy *= 0.94;
      }
      world.particles = world.particles.filter((q) => q.life > 0);

      resize();
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      if (p.active || world.particles.length > 0) {
        const skin = SKINS[p.skinId] ?? SKINS.orb;
        const state: SparkState = {
          x: world.x,
          y: world.y,
          h: p.box.h || 24,
          combo: p.combo,
          overdrive: world.overdrive,
          errorFlash: world.errorFlash,
          trail: world.trail,
          particles: world.particles,
          t: world.t,
        };
        skin.draw(ctx, state);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // -z-10 (inside the panel's `isolate` stacking context) paints the glow above the
  // panel background but behind the opaque glyphs, so the text stays fully legible.
  return (
    <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" aria-hidden />
  );
}
