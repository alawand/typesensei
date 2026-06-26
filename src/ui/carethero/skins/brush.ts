import type { CaretSkin } from '../types';

type RGB = [number, number, number];

const INK: RGB = [226, 232, 240]; // light ink, legible on the dark panel
const GOLD: RGB = [250, 204, 21];
const RED: RGB = [220, 80, 80];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

const css = (c: RGB, alpha = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;

export const brushSkin: CaretSkin = {
  id: 'brush',
  name: 'Ink Brush',
  draw(ctx, s) {
    ctx.save();
    // ink shifts to gold in overdrive, to red on a fresh typo
    const ink = mix(mix(INK, GOLD, s.overdrive), RED, s.errorFlash);

    // tapering calligraphic stroke through the trail (thicker toward the head)
    const n = s.trail.length;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 1; i < n; i++) {
      const a = s.trail[i - 1];
      const b = s.trail[i];
      const f = i / n; // 0..1 toward the head
      ctx.globalAlpha = 0.08 + 0.5 * f;
      ctx.lineWidth = (0.6 + 3.2 * f) * (1 + 0.5 * s.overdrive);
      ctx.strokeStyle = css(ink);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // ink nib at the head
    const nib = s.h * 0.14 * (1 + 0.4 * s.overdrive);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = css(ink);
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, nib * 1.1, nib, 0, 0, Math.PI * 2);
    ctx.fill();

    // splatter (typo sparks) / motes (streak)
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.9;
      ctx.fillStyle = p.hue < 20 ? css(RED) : css(mix(INK, GOLD, 0.6));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // ink ripples (line-complete rings)
    for (const r of s.rings) {
      ctx.globalAlpha = (r.life / r.max) * 0.4;
      ctx.strokeStyle = css(ink);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // milestone popups
    for (const pu of s.popups) {
      ctx.globalAlpha = pu.life / pu.max;
      ctx.fillStyle = css(GOLD);
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px ui-monospace, monospace';
      ctx.fillText(pu.text, pu.x, pu.y);
    }

    ctx.restore();
  },
};
