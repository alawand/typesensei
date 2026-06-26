import type { CaretSkin } from '../types';

type RGB = [number, number, number];

const INK: RGB = [165, 180, 252]; // indigo-300 — a cool ink, distinct from the orb's warm glow
const VIVID: RGB = [129, 140, 248]; // indigo-400 — overdrive shift (wetter / more saturated)
const RED: RGB = [220, 80, 80];

const NIB_ANGLE = -Math.PI / 4.5; // ~ -40° chisel angle

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

const css = (c: RGB, alpha = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export const brushSkin: CaretSkin = {
  id: 'brush',
  name: 'Ink Brush',
  draw(ctx, s) {
    ctx.save();
    // distinct medium: opaque wet ink (no additive glow like the orb)
    const ink = mix(mix(INK, VIVID, s.overdrive), RED, s.errorFlash);

    // --- ink ribbon: one filled, variable-width polygon through the trail ---
    const n = s.trail.length;
    if (n >= 2) {
      const baseW = s.h * 0.1 * (1 + 0.8 * s.overdrive);
      // nib normal: a calligraphy pen is thick across its tip, thin along it
      const nnx = Math.cos(NIB_ANGLE + Math.PI / 2);
      const nny = Math.sin(NIB_ANGLE + Math.PI / 2);
      const left: Array<[number, number]> = [];
      const right: Array<[number, number]> = [];
      for (let i = 0; i < n; i++) {
        const p = s.trail[i];
        const prev = s.trail[Math.max(0, i - 1)];
        const next = s.trail[Math.min(n - 1, i + 1)];
        let dx = next.x - prev.x;
        let dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        const px = -dy; // perpendicular to the local direction
        const py = dx;
        const taper = (i + 1) / n; // thin tail -> thick head
        const calli = 0.45 + 0.55 * Math.abs(dx * nnx + dy * nny);
        const w = baseW * (0.25 + 0.75 * taper) * calli;
        left.push([p.x + px * w, p.y + py * w]);
        right.push([p.x - px * w, p.y - py * w]);
      }
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = css(ink);
      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      for (let i = 1; i < n; i++) ctx.lineTo(left[i][0], left[i][1]);
      for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
      ctx.closePath();
      ctx.fill();
    }

    // --- chisel nib at the head (slanted pen tip — reads even when parked) ---
    const nibLen = s.h * 0.45;
    const nibThick = s.h * 0.16;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(NIB_ANGLE);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = css(ink);
    roundRectPath(ctx, -nibLen / 2, -nibThick / 2, nibLen, nibThick, nibThick / 2);
    ctx.fill();
    ctx.restore();

    // --- splatter (typo) / motes (streak) as ink blots ---
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.9;
      ctx.fillStyle = p.hue < 20 ? css(RED) : css(ink);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- ink ripples (line complete) ---
    for (const r of s.rings) {
      ctx.globalAlpha = (r.life / r.max) * 0.4;
      ctx.strokeStyle = css(ink);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // --- milestone popups ---
    for (const pu of s.popups) {
      ctx.globalAlpha = pu.life / pu.max;
      ctx.fillStyle = css(VIVID);
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillText(pu.text, pu.x, pu.y);
    }

    ctx.restore();
  },
};
