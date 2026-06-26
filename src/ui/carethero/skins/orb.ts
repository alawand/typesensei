import type { CaretSkin } from '../types';

type RGB = [number, number, number];

const EMERALD: RGB = [52, 211, 153];
const GOLD: RGB = [250, 204, 21];
const RED: RGB = [248, 113, 113];
const WHITE: RGB = [255, 255, 255];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

const css = (c: RGB, alpha = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;

export const orbSkin: CaretSkin = {
  id: 'orb',
  name: 'Ki Spark',
  draw(ctx, s) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const tint = mix(EMERALD, GOLD, s.overdrive);

    // momentum trail (oldest -> newest, brighter toward the head)
    const n = s.trail.length;
    for (let i = 0; i < n; i++) {
      const p = s.trail[i];
      const f = (i + 1) / n;
      const r = (0.8 + 2.4 * f) * (1 + 0.6 * s.overdrive);
      ctx.globalAlpha = 0.04 + 0.3 * f;
      ctx.fillStyle = css(tint);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // particles (error sparks + streak motes)
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // core orb: tint shifts to red on a fresh typo
    const color = mix(tint, RED, s.errorFlash);
    const radius = s.h * 0.16 * (1 + 0.5 * s.overdrive);

    const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 4 + 2);
    glow.addColorStop(0, css(color, 0.6));
    glow.addColorStop(1, css(color, 0));
    ctx.globalAlpha = 1;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(s.x, s.y, radius * 4 + 2, 0, Math.PI * 2);
    ctx.fill();

    // bright white core (subtle, since it now sits behind the glyphs)
    ctx.fillStyle = css(WHITE, 0.55);
    ctx.beginPath();
    ctx.arc(s.x, s.y, Math.max(1, radius * 0.6), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },
};
