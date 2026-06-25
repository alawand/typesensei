export type RunStatus = 'idle' | 'running' | 'done';

/** One physical key the user produced, in order. The full log lets us recompute
 *  every metric and replay the run. */
export interface Keystroke {
  /** The character produced, or 'Backspace' for a delete. */
  key: string;
  /** What the engine expected at the cursor when this key landed (null for backspace). */
  expected: string | null;
  /** True only for a forward key that matched `expected`. */
  correct: boolean;
  /** True if this was a Backspace. */
  backspace: boolean;
  /** True if the engine generated this key (e.g. Tab auto-filling indentation)
   *  rather than the user pressing it. Excluded from speed/accuracy metrics. */
  auto: boolean;
  /** ms since the run started (first keystroke = 0). */
  tMs: number;
  /** Cursor index at the moment the key landed. */
  cursorAt: number;
}

export interface EngineState {
  /** Raw target text. EVERY character counts: symbols, spaces, tabs, newlines. */
  readonly target: string;
  /** Index of the next character to commit correctly. */
  cursor: number;
  /** Wrong characters typed at the cursor that haven't been backspaced yet.
   *  While this is non-empty the run is "blocked" (strict-block model). */
  errorBuffer: string[];
  /** Full ordered keystroke log. */
  keystrokes: Keystroke[];
  /** ms timestamp of the first keystroke, or null before the run starts. */
  startedAt: number | null;
  /** ms timestamp when the last character was committed, or null until done. */
  endedAt: number | null;
  status: RunStatus;
}
