const PENTA = [0, 2, 4, 7, 9]; // major pentatonic (semitones) — always consonant

/** Note frequency that climbs with combo, wrapping after a few octaves so long
 *  streaks stay musical instead of going ultrasonic. */
export function pentatonicFreq(combo: number, base = 261.63): number {
  const span = PENTA.length * 3; // wrap after 3 octaves
  const i = Math.max(0, combo - 1) % span;
  const semis = PENTA[i % PENTA.length] + 12 * Math.floor(i / PENTA.length);
  return base * 2 ** (semis / 12); // climbs from C4 by default
}
