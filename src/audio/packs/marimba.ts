import { pentatonicFreq } from './scale';
import { pluck } from './voice';
import type { SoundPack } from '../types';

// Rounder, woodier than the koto: sine fundamental + a soft octave.
export const marimbaPack: SoundPack = {
  id: 'marimba',
  name: 'Marimba',
  correct(c, combo) {
    const hz = pentatonicFreq(combo);
    pluck(c, hz, 'sine', 0.26, 0.24);
    pluck(c, hz * 2, 'sine', 0.12, 0.06); // faint octave for warmth
  },
  error(c) {
    pluck(c, 98, 'sine', 0.3, 0.2);
  },
  accent(c) {
    pluck(c, pentatonicFreq(10), 'sine', 0.4, 0.16);
  },
};
