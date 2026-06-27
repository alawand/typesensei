// A single shared AudioContext for the whole app. Created lazily and resumed from a
// real user gesture (the Sound toggle click, or the first keystroke) so the browser
// autoplay policy lets it actually make sound.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function getAudio(): { ctx: AudioContext; out: GainNode } {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.3;
    master.connect(ctx.destination);
  }
  return { ctx, out: master as GainNode };
}

export function unlockAudio(): void {
  const { ctx } = getAudio();
  if (ctx.state === 'suspended') void ctx.resume();
}
