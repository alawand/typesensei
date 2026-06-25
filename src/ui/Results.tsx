import { useEffect, useState } from 'react';
import type { RunMetrics } from '../engine/metrics';
import { getTopProblemKeys, type KeyStat, type SaveResult } from '../storage/db';

const GLYPH: Record<string, string> = { ' ': '␣', '\n': '↵', '\t': '⇥' };
const show = (c: string) => GLYPH[c] ?? c;

function Big({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span
        className={`text-4xl font-semibold tabular-nums ${accent ? 'text-emerald-400' : 'text-neutral-100'}`}
      >
        {value}
      </span>
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
    </div>
  );
}

function KeyChips({ keys }: { keys: KeyStat[] }) {
  if (keys.length === 0) return <span className="text-sm text-neutral-500">none — clean run 🎯</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((k) => (
        <span
          key={k.char}
          className="flex items-center gap-2 rounded-md bg-neutral-800 px-2.5 py-1 font-mono text-sm"
        >
          <span className="text-red-400">{show(k.char)}</span>
          <span className="text-neutral-500">
            {k.errors}/{k.attempts}
          </span>
        </span>
      ))}
    </div>
  );
}

export function Results({
  metrics,
  save,
  onRestart,
}: {
  metrics: RunMetrics;
  save: SaveResult | null;
  onRestart: () => void;
}) {
  const [weak, setWeak] = useState<KeyStat[]>([]);
  useEffect(() => {
    if (save) getTopProblemKeys().then(setWeak);
  }, [save]);

  const runProblems = metrics.perKey.filter((k) => k.errors > 0).slice(0, 8);
  const pct = save ? Math.min(100, Math.round((save.todayCorrectChars / save.goal) * 100)) : 0;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-wrap gap-10">
        <Big label="wpm" value={String(metrics.wpm)} accent />
        <Big label="accuracy" value={`${metrics.accuracy}%`} />
        <Big label="consistency" value={String(metrics.consistency)} />
        <Big label="typo cost" value={String(metrics.typoCost)} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-500">what cost you this run</span>
        <KeyChips keys={runProblems} />
      </div>

      {weak.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            your weakest keys (all-time)
          </span>
          <KeyChips keys={weak} />
        </div>
      )}

      {save && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-300">
              🔥 {save.streak} day{save.streak === 1 ? '' : 's'} streak
            </span>
            <span className="text-neutral-500">
              today {save.todayCorrectChars}/{save.goal} chars
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="self-start rounded-md bg-emerald-500 px-4 py-2 font-medium text-neutral-950 hover:bg-emerald-400"
      >
        Type again
      </button>
    </div>
  );
}
