import { useEffect, useRef } from 'react';
import type { Snippet } from '../content/snippets';
import { useTypingSession } from './useTypingSession';
import { TypingPanel } from './TypingPanel';
import { LiveStats } from './LiveStats';

export function TypingView({ snippet }: { snippet: Snippet }) {
  const session = useTypingSession(snippet.source);
  const { state, metrics } = session;
  const wrapRef = useRef<HTMLDivElement>(null);

  const focusPanel = () => wrapRef.current?.querySelector<HTMLElement>('[tabindex]')?.focus();

  // Autofocus on mount (and on snippet change, since this view is keyed by id).
  useEffect(focusPanel, []);

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
        <TypingPanel target={snippet.source} session={session} />
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
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <p className="mb-2 font-medium text-emerald-300">Done!</p>
          <div className="flex gap-8 text-neutral-100">
            <span>
              <b className="tabular-nums">{metrics.wpm}</b> wpm
            </span>
            <span>
              <b className="tabular-nums">{metrics.accuracy}%</b> accuracy
            </span>
            <span>
              <b className="tabular-nums">{metrics.typoCost}</b> typo cost
            </span>
            <span>
              <b className="tabular-nums">{metrics.consistency}</b> consistency
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
