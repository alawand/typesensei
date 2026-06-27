import type { SoundContext, SoundPack } from '../types';

const PENTA = [0, 2, 4, 7, 9]; // major pentatonic (semitones) — always consonant

/** Note frequency that climbs with combo, wrapping after a few octaves so long
 *  streaks stay musical instead of going ultrasonic. */
function freq(combo: number): number {
  const span = PENTA.length * 3; // wrap after 3 octaves
  const i = Math.max(0, combo - 1) % span;
  const semis = PENTA[i % PENTA.length] + 12 * Math.floor(i / PENTA.length);
  return 261.63 * 2 ** (semis / 12); // climbs from C4
}

function pluck(c: SoundContext, hz: number, type: OscillatorType, decay: number, peak: number) {
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

export const kotoPack: SoundPack = {
  id: 'koto',
  name: 'Koto',
  correct(c, combo) {
    pluck(c, freq(combo), 'triangle', 0.18, 0.28);
  },
  error(c) {
    pluck(c, 110, 'sawtooth', 0.25, 0.22); // low thud — you hear the streak drop
  },
};
