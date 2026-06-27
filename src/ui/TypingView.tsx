import { useEffect, useRef, useState } from 'react';
import type { Snippet } from '../content/snippets';
import type { RunMetrics } from '../engine/metrics';
import { saveRun, type SaveResult } from '../storage/db';
import { useTypingSession } from './useTypingSession';
import { TypingPanel } from './TypingPanel';
import { LiveStats } from './LiveStats';
import { Results } from './Results';

export function TypingView({
  snippet,
  onComplete,
  gameOn,
  caretSkin,
}: {
  snippet: Snippet;
  onComplete?: (m: RunMetrics, save: SaveResult) => void;
  gameOn: boolean;
  caretSkin: string;
}) {
  const session = useTypingSession(snippet.source);
  const { state, metrics } = session;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);
  const savedRef = useRef(false);

  const focusPanel = () => wrapRef.current?.querySelector<HTMLElement>('[tabindex]')?.focus();

  // Autofocus on mount (and on snippet change, since this view is keyed by id).
  useEffect(focusPanel, []);

  // Persist the run exactly once when it completes.
  useEffect(() => {
    if (state.status !== 'done') {
      savedRef.current = false;
      setSaveResult(null);
      return;
    }
    if (savedRef.current) return;
    savedRef.current = true;
    saveRun(snippet, metrics).then((r) => {
      setSaveResult(r);
      onComplete?.(metrics, r);
    });
  }, [state.status, snippet, metrics, onComplete]);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-medium text-neutral-100">{snippet.title}</h2>
          <span className="text-xs uppercase tracking-wide text-neutral-500">{snippet.language}</span>
        </div>
        <LiveStats metrics={metrics} status={state.status} />
      </div>

      <div ref={wrapRef}>
        <TypingPanel target={snippet.source} session={session} gameOn={gameOn} caretSkin={caretSkin} />
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>Tab to indent · Backspace to fix typos · Esc to restart</span>
        <button
          onClick={() => {
            session.reset();
            focusPanel();
          }}
          className="rounded-md bg-neutral-800 px-3 py-1.5 text-neutral-200 hover:bg-neutral-700"
        >
          Restart
        </button>
      </div>

      {state.status === 'done' && (
        <Results
          metrics={metrics}
          save={saveResult}
          onRestart={() => {
            session.reset();
            focusPanel();
          }}
        />
      )}
    </div>
  );
}
