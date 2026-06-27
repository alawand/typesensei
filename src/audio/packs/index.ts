import { kotoPack } from './koto';
import { marimbaPack } from './marimba';
import { blipPack } from './blip';
import type { SoundPack } from '../types';
import { getAudio, unlockAudio } from '../context';

// Register sound packs here. Adding one is a single line + a new file in packs/.
export const PACKS: Record<string, SoundPack> = {
  [kotoPack.id]: kotoPack,
  [marimbaPack.id]: marimbaPack,
  [blipPack.id]: blipPack,
};

export const DEFAULT_PACK = kotoPack.id;

/** Play a single note from a pack — used to confirm sound when toggling/selecting. */
export function previewPack(id: string): void {
  unlockAudio();
  const { ctx, out } = getAudio();
  const pack = PACKS[id] ?? kotoPack;
  pack.correct({ ctx, out, now: ctx.currentTime }, 5);
}
