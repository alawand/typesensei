export interface SoundContext {
  ctx: AudioContext;
  out: GainNode; // master gain to connect voices to
  now: number; // ctx.currentTime at trigger
}

/** A sound palette. Add one and register it in packs/index.ts — nothing else changes. */
export interface SoundPack {
  id: string;
  name: string;
  correct(c: SoundContext, combo: number): void; // pitch typically rises with combo
  error(c: SoundContext): void;
}
