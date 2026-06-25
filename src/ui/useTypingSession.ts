import { useCallback, useMemo, useReducer } from 'react';
import { createState, applyKey, isBlocked, caretIndex } from '../engine/engine';
import { computeMetrics, type RunMetrics } from '../engine/metrics';
import type { EngineState } from '../engine/types';

type Action =
  | { type: 'key'; key: string; now: number; auto: boolean }
  | { type: 'reset'; target: string };

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case 'key':
      return applyKey(state, action.key, action.now, action.auto);
    case 'reset':
      return createState(action.target);
  }
}

export interface TypingSession {
  state: EngineState;
  caret: number;
  blocked: boolean;
  metrics: RunMetrics;
  onKey: (key: string, now: number, auto?: boolean) => void;
  reset: () => void;
}

export function useTypingSession(target: string): TypingSession {
  const [state, dispatch] = useReducer(reducer, target, createState);
  const onKey = useCallback(
    (key: string, now: number, auto = false) => dispatch({ type: 'key', key, now, auto }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: 'reset', target }), [target]);
  const metrics = useMemo(() => computeMetrics(state), [state]);
  return { state, caret: caretIndex(state), blocked: isBlocked(state), metrics, onKey, reset };
}
