import { describe, it, expect } from 'vitest';
import { createState, applyKey, isBlocked, caretIndex } from './engine';
import { computeMetrics } from './metrics';

/** Type a list of keys with a fixed cadence, starting at t=1000. */
function play(target: string, keys: string[], step = 10) {
  let s = createState(target);
  let t = 1000;
  for (const k of keys) {
    s = applyKey(s, k, t);
    t += step;
  }
  return s;
}

describe('strict-block engine', () => {
  it('completes a clean run', () => {
    const s = play('ab', ['a', 'b']);
    expect(s.status).toBe('done');
    expect(s.cursor).toBe(2);
    expect(isBlocked(s)).toBe(false);
  });

  it('blocks the cursor on a typo until backspaced', () => {
    let s = createState('ab');
    s = applyKey(s, 'a', 1000); // correct
    s = applyKey(s, 'x', 1010); // wrong -> blocked
    expect(isBlocked(s)).toBe(true);
    expect(s.cursor).toBe(1);
    expect(caretIndex(s)).toBe(2); // caret sits after the wrong char

    // typing the otherwise-correct next char while blocked does NOT advance
    s = applyKey(s, 'b', 1020);
    expect(s.cursor).toBe(1);
    expect(s.errorBuffer.length).toBe(2);
  });

  it('recovers with backspace, then advances', () => {
    let s = createState('ab');
    s = applyKey(s, 'a', 1000);
    s = applyKey(s, 'x', 1010); // wrong
    s = applyKey(s, 'Backspace', 1020); // recover
    expect(isBlocked(s)).toBe(false);
    s = applyKey(s, 'b', 1030); // now correct
    expect(s.status).toBe('done');
  });

  it('backspace un-commits a correct char when not blocked', () => {
    let s = createState('ab');
    s = applyKey(s, 'a', 1000);
    expect(s.cursor).toBe(1);
    s = applyKey(s, 'Backspace', 1010);
    expect(s.cursor).toBe(0);
  });

  it('is immutable — does not mutate the previous state', () => {
    const s0 = createState('ab');
    const s1 = applyKey(s0, 'a', 1000);
    expect(s0.cursor).toBe(0);
    expect(s0.keystrokes.length).toBe(0);
    expect(s1.cursor).toBe(1);
  });
});

describe('metrics', () => {
  it('counts typo cost as wrong keys + backspaces', () => {
    // a, wrong x, backspace, b  =>  1 typo + 1 backspace = cost 2
    let s = createState('ab');
    s = applyKey(s, 'a', 1000);
    s = applyKey(s, 'x', 1010);
    s = applyKey(s, 'Backspace', 1020);
    s = applyKey(s, 'b', 1030);
    const m = computeMetrics(s);
    expect(m.typos).toBe(1);
    expect(m.typoCost).toBe(2);
    expect(m.correctChars).toBe(2);
  });

  it('computes accuracy over forward keys only', () => {
    let s = createState('ab');
    s = applyKey(s, 'a', 1000);
    s = applyKey(s, 'x', 1010); // forward wrong
    s = applyKey(s, 'Backspace', 1020); // not counted in accuracy
    s = applyKey(s, 'b', 1030);
    const m = computeMetrics(s);
    // forward keys: a(ok), x(bad), b(ok) -> 2/3
    expect(m.accuracy).toBeCloseTo(66.7, 1);
  });

  it('computes wpm from correct chars and duration', () => {
    // 5 correct chars over exactly 1 second => (5/5)/(1/60) = 60 wpm
    const target = 'abcde';
    let s = createState(target);
    let t = 1000;
    for (const c of target) {
      s = applyKey(s, c, t);
      t += 250; // first at 1000, last at 2000 -> duration 1000ms
    }
    const m = computeMetrics(s);
    expect(m.durationMs).toBe(1000);
    expect(m.wpm).toBe(60);
  });

  it('excludes auto-filled (Tab) indentation from speed, accuracy and per-key', () => {
    // "  ab": two indent spaces auto-filled via Tab, then 'a' and 'b' typed
    let s = createState('  ab');
    s = applyKey(s, ' ', 1000, true); // auto
    s = applyKey(s, ' ', 1000, true); // auto
    s = applyKey(s, 'a', 1100); // manual
    s = applyKey(s, 'b', 1200); // manual
    const m = computeMetrics(s);
    expect(s.status).toBe('done');
    expect(m.correctChars).toBe(2); // only 'a' and 'b', not the indent
    expect(m.totalKeystrokes).toBe(2);
    expect(m.accuracy).toBe(100);
    expect(m.perKey.find((k) => k.char === ' ')).toBeUndefined();
  });

  it('attributes errors to the expected character', () => {
    let s = createState('a;b');
    s = applyKey(s, 'a', 1000);
    s = applyKey(s, ':', 1010); // wrong, expected ';'
    s = applyKey(s, 'Backspace', 1020);
    s = applyKey(s, ';', 1030);
    s = applyKey(s, 'b', 1040);
    const semi = computeMetrics(s).perKey.find((k) => k.char === ';')!;
    expect(semi.errors).toBe(1);
    expect(semi.attempts).toBe(2); // one wrong, one correct
  });
});
