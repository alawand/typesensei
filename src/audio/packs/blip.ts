import { pentatonicFreq } from './scale';
import { pluck } from './voice';
import type { SoundPack } from '../types';

// Chiptune: short square-wave blips. Lower peaks since squares are harsh/loud.
export const blipPack: SoundPack = {
  id: 'blip',
  name: 'Blip',
  correct(c, combo) {
    pluck(c, pentatonicFreq(combo), 'square', 0.08, 0.16);
  },
  error(c) {
    pluck(c, 73, 'square', 0.18, 0.18);
  },
  accent(c) {
    pluck(c, pentatonicFreq(10), 'square', 0.12, 0.12);
  },
};
