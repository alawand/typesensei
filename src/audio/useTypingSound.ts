import { useEffect, useRef } from 'react';
import type { EngineState } from '../engine/types';
import { getAudio, unlockAudio } from './context';
import { PACKS } from './packs';

/** Plays the active sound pack in response to the engine's keystrokes. Like the
 *  caret-hero overlay, it diffs new keystrokes off engine state and never writes back.
 *  Uses the shared AudioContext, resumed on a user gesture (see context.ts). */
export function useTypingSound(state: EngineState, enabled: boolean, packId: string) {
  const processed = useRef(0);

  useEffect(() => {
    const ks = state.keystrokes;
    if (ks.length < processed.current) processed.current = 0; // run was reset

    if (!enabled) {
      processed.current = ks.length; // stay caught up so re-enabling never bursts
      return;
    }
    if (ks.length === processed.current) return;

    unlockAudio(); // first keystroke is a gesture too — covers sound-on-by-default
    const { ctx, out } = getAudio();
    const pack = PACKS[packId] ?? PACKS.koto;
    for (let i = processed.current; i < ks.length; i++) {
      const k = ks[i];
      if (k.auto || k.backspace) continue; // Tab-indent and corrections stay silent
      const sc = { ctx, out, now: ctx.currentTime };
      if (k.correct) {
        pack.correct(sc, state.combo);
        if (k.key === '\n') pack.accent?.(sc); // line-complete flourish
      } else {
        pack.error(sc);
      }
    }
    processed.current = ks.length;
  }, [state.keystrokes, state.combo, enabled, packId]);
}
