import type { SoundContext } from '../types';

/** A single plucked voice: oscillator + quick attack/decay gain envelope. */
export function pluck(
  c: SoundContext,
  hz: number,
  type: OscillatorType,
  decay: number,
  peak: number,
) {
  const o = c.ctx.createOscillator();
  const g = c.ctx.createGain();
  o.type = type;
  o.frequency.value = hz;
  g.gain.setValueAtTime(0.0001, c.now);
  g.gain.exponentialRampToValueAtTime(peak, c.now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, c.now + decay);
  o.connect(g).connect(c.out);
  o.start(c.now);
  o.stop(c.now + decay + 0.02);
}
