import { pentatonicFreq } from './scale';
import { pluck } from './voice';
import type { SoundPack } from '../types';

export const kotoPack: SoundPack = {
  id: 'koto',
  name: 'Koto',
  correct(c, combo) {
    pluck(c, pentatonicFreq(combo), 'triangle', 0.18, 0.28);
  },
  error(c) {
    pluck(c, 110, 'sawtooth', 0.25, 0.22); // low thud — you hear the streak drop
  },
  accent(c) {
    pluck(c, pentatonicFreq(8), 'triangle', 0.3, 0.18); // soft chime on line complete
  },
};
