import { kotoPack } from './koto';
import type { SoundPack } from '../types';
import { getAudio, unlockAudio } from '../context';

// Register sound packs here. Adding one is a single line + a new file in packs/.
export const PACKS: Record<string, SoundPack> = {
  [kotoPack.id]: kotoPack,
};

export const DEFAULT_PACK = kotoPack.id;

/** Play a single note from a pack — used to confirm sound when toggling it on. */
export function previewPack(id: string): void {
  unlockAudio();
  const { ctx, out } = getAudio();
  const pack = PACKS[id] ?? kotoPack;
  pack.correct({ ctx, out, now: ctx.currentTime }, 5);
}
