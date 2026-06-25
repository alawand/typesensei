import type { EngineState } from './types';

export function createState(target: string): EngineState {
  return {
    target,
    cursor: 0,
    errorBuffer: [],
    keystrokes: [],
    startedAt: null,
    endedAt: null,
    status: 'idle',
  };
}

/** Cursor is parked on an uncorrected typo. The only productive key here is
 *  Backspace — this is what makes a typo actually cost something. */
export function isBlocked(s: EngineState): boolean {
  return s.errorBuffer.length > 0;
}

/** Where the caret renders: after any piled-up wrong characters. */
export function caretIndex(s: EngineState): number {
  return s.cursor + s.errorBuffer.length;
}

/** Pure transition. Returns a NEW state; never mutates the input.
 *  `key` is a single produced character or 'Backspace'; `now` is a ms timestamp
 *  (e.g. event.timeStamp or performance.now()). */
export function applyKey(prev: EngineState, key: string, now: number): EngineState {
  if (prev.status === 'done') return prev;

  const startedAt = prev.startedAt ?? now;
  const tMs = now - startedAt;
  const s: EngineState = {
    ...prev,
    startedAt,
    status: 'running',
    errorBuffer: [...prev.errorBuffer],
    keystrokes: [...prev.keystrokes],
  };

  if (key === 'Backspace') {
    if (s.errorBuffer.length > 0) {
      s.errorBuffer.pop(); // recover one wrong char (this is the typo cost)
    } else if (s.cursor > 0) {
      s.cursor -= 1; // un-commit a correct char (allowed)
    }
    s.keystrokes.push({ key, expected: null, correct: false, backspace: true, tMs, cursorAt: s.cursor });
    return s;
  }

  const expected = s.target[s.cursor] ?? null;

  if (s.errorBuffer.length === 0 && key === expected) {
    // Clean forward progress.
    s.cursor += 1;
    s.keystrokes.push({ key, expected, correct: true, backspace: false, tMs, cursorAt: s.cursor - 1 });
    if (s.cursor >= s.target.length) {
      s.status = 'done';
      s.endedAt = now;
    }
  } else {
    // Wrong key, or already blocked: pile onto the error buffer.
    s.errorBuffer.push(key);
    s.keystrokes.push({ key, expected, correct: false, backspace: false, tMs, cursorAt: s.cursor });
  }

  return s;
}
