export interface GauntletView {
  bosses: string[];
  index: number;
  results: (boolean | null)[];
  lastVerdict: boolean | null;
}

export function GauntletBar({
  bosses,
  index,
  results,
  lastVerdict,
  onNext,
  onExit,
}: GauntletView & { onNext: () => void; onExit: () => void }) {
  const done = index >= bosses.length;
  const clearedCount = results.filter((r) => r === true).length;
  const isLast = index + 1 >= bosses.length;

  return (
    <div className="flex w-full max-w-3xl items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-indigo-200">Symbol Gauntlet</span>
        <div className="flex gap-1.5 font-mono text-sm">
          {bosses.map((b, i) => {
            const st = results[i];
            const cls =
              i === index && !done
                ? 'bg-indigo-500 text-neutral-950'
                : st === true
                  ? 'bg-emerald-500/30 text-emerald-300'
                  : st === false
                    ? 'bg-red-500/30 text-red-300'
                    : 'bg-neutral-800 text-neutral-500';
            return (
              <span key={i} className={`flex h-7 w-7 items-center justify-center rounded ${cls}`}>
                {b}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        {done ? (
          <>
            <span className="text-indigo-200">
              {clearedCount}/{bosses.length} cleared
            </span>
            <button onClick={onExit} className="rounded-md bg-indigo-500 px-3 py-1.5 text-neutral-950">
              Done
            </button>
          </>
        ) : lastVerdict !== null ? (
          <>
            <span className={lastVerdict ? 'text-emerald-300' : 'text-red-300'}>
              {lastVerdict ? 'Boss cleared!' : 'Missed — keep at it'}
            </span>
            <button onClick={onNext} className="rounded-md bg-indigo-500 px-3 py-1.5 text-neutral-950">
              {isLast ? 'Finish' : 'Next boss →'}
            </button>
          </>
        ) : (
          <span className="text-neutral-400">
            Boss {index + 1}/{bosses.length}: clean up{' '}
            <span className="font-mono text-indigo-300">{bosses[index]}</span>
          </span>
        )}
        <button onClick={onExit} className="text-neutral-500 hover:text-neutral-300">
          exit
        </button>
      </div>
    </div>
  );
}
