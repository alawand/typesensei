import { useEffect, useState } from 'react';
import { getAllKeyStats, type KeyStat } from '../storage/db';

const GROUPS: { label: string; chars: string }[] = [
  { label: 'digits', chars: '0123456789' },
  { label: 'brackets', chars: '(){}[]<>' },
  { label: 'operators', chars: '=+-*/%!&|^~' },
  { label: 'punctuation', chars: ';:,._?' },
  { label: 'quotes & misc', chars: '"' + "'" + '`' + '\\' + '@#$' },
];

const MIN_ATTEMPTS = 10;

type Mastery = 'nodata' | 'weak' | 'learning' | 'mastered';

function classify(k?: KeyStat): Mastery {
  if (!k || k.attempts < MIN_ATTEMPTS) return 'nodata';
  const rate = k.errors / k.attempts;
  if (rate > 0.08) return 'weak';
  if (rate > 0.02) return 'learning';
  return 'mastered';
}

const CELL: Record<Mastery, string> = {
  nodata: 'bg-neutral-800 text-neutral-600',
  weak: 'bg-red-500/25 text-red-300',
  learning: 'bg-amber-500/25 text-amber-300',
  mastered: 'bg-emerald-500/25 text-emerald-300',
};

const LEGEND: { m: Mastery; label: string }[] = [
  { m: 'weak', label: 'weak' },
  { m: 'learning', label: 'learning' },
  { m: 'mastered', label: 'mastered' },
  { m: 'nodata', label: 'no data' },
];

export function MasteryMap() {
  const [stats, setStats] = useState<Map<string, KeyStat>>(new Map());

  useEffect(() => {
    getAllKeyStats().then((rows) => setStats(new Map(rows.map((r) => [r.char, r]))));
  }, []);

  return (
    <div className="w-full max-w-3xl rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-200">Symbol mastery</h3>
        <div className="flex gap-3">
          {LEGEND.map(({ m, label }) => (
            <span key={m} className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className={`inline-block h-3 w-3 rounded-sm ${CELL[m]}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {GROUPS.map((g) => (
          <div key={g.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs uppercase tracking-wide text-neutral-500">
              {g.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {g.chars.split('').map((ch) => {
                const k = stats.get(ch);
                const m = classify(k);
                const pct = k && k.attempts ? Math.round((k.errors / k.attempts) * 100) : 0;
                return (
                  <span
                    key={ch}
                    title={k ? `${ch}  ${k.errors}/${k.attempts} errors (${pct}%)` : `${ch}  no data yet`}
                    className={`relative flex h-7 w-7 items-center justify-center rounded font-mono text-sm ${CELL[m]}`}
                  >
                    {ch}
                    {m === 'mastered' && (
                      <span className="absolute -right-1 -top-1.5 text-[9px] text-emerald-300">★</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        Needs ~{MIN_ATTEMPTS} attempts on a key before it&apos;s rated.
      </p>
    </div>
  );
}
