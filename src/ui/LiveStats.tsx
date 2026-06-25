import type { RunMetrics } from '../engine/metrics';
import type { RunStatus } from '../engine/types';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-2xl font-semibold tabular-nums text-neutral-100">{value}</span>
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
    </div>
  );
}

export function LiveStats({ metrics, status }: { metrics: RunMetrics; status: RunStatus }) {
  const idle = status === 'idle';
  return (
    <div className="flex gap-8">
      <Stat label="wpm" value={idle ? '—' : String(metrics.wpm)} />
      <Stat label="accuracy" value={idle ? '—' : `${metrics.accuracy}%`} />
      <Stat label="typo cost" value={idle ? '—' : String(metrics.typoCost)} />
    </div>
  );
}
