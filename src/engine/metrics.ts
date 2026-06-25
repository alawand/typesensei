import type { EngineState } from './types';

export interface KeyCost {
  char: string;
  attempts: number;
  errors: number;
}

export interface RunMetrics {
  durationMs: number;
  wpm: number; // correct chars / 5 / minutes
  rawWpm: number; // all forward chars / 5 / minutes
  accuracy: number; // % correct forward keys of all forward keys
  consistency: number; // 0–100, steadiness of keystroke rhythm (the "flow" number)
  correctChars: number;
  totalKeystrokes: number;
  typos: number; // wrong forward keys
  typoCost: number; // wasted keystrokes = wrong forward keys + backspaces
  perKey: KeyCost[]; // error attribution -> heatmap / "which symbol hurts you"
}

export function computeMetrics(s: EngineState): RunMetrics {
  const ks = s.keystrokes;
  // Manual keystrokes only: drop engine-generated (Tab) indentation so it never
  // inflates speed or accuracy.
  const manual = ks.filter((k) => !k.auto);
  const forward = manual.filter((k) => !k.backspace);
  const backspaces = manual.length - forward.length;
  const correct = forward.filter((k) => k.correct);
  const typos = forward.length - correct.length;

  const durationMs =
    s.startedAt == null || ks.length === 0
      ? 0
      : (s.endedAt ?? s.startedAt + ks[ks.length - 1].tMs) - s.startedAt;
  const minutes = durationMs / 60000;

  // Per-key error attribution (only forward keys aimed at a real character).
  const map = new Map<string, KeyCost>();
  for (const k of forward) {
    if (k.expected == null) continue;
    const e = map.get(k.expected) ?? { char: k.expected, attempts: 0, errors: 0 };
    e.attempts++;
    if (!k.correct) e.errors++;
    map.set(k.expected, e);
  }

  return {
    durationMs,
    wpm: minutes ? Math.round(correct.length / 5 / minutes) : 0,
    rawWpm: minutes ? Math.round(forward.length / 5 / minutes) : 0,
    accuracy: forward.length ? +((100 * correct.length) / forward.length).toFixed(1) : 100,
    consistency: computeConsistency(manual.map((k) => k.tMs)),
    correctChars: correct.length,
    totalKeystrokes: manual.length,
    typos,
    typoCost: typos + backspaces,
    perKey: [...map.values()].sort((a, b) => b.errors - a.errors),
  };
}

/** Steadiness of inter-keystroke intervals -> 0–100. Erratic bursts score low,
 *  smooth cadence scores high. This is the metric that maps to "flow". */
function computeConsistency(times: number[]): number {
  if (times.length < 3) return 100;
  const gaps: number[] = [];
  for (let i = 1; i < times.length; i++) gaps.push(times[i] - times[i - 1]);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (mean <= 0) return 100;
  const variance = gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length;
  const cv = Math.sqrt(variance) / mean; // coefficient of variation
  return Math.max(0, Math.round((1 - cv) * 100));
}
