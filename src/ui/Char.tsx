import { memo } from 'react';

export type CharStatus = 'pending' | 'correct' | 'extra';

function CharImpl({ ch, status }: { ch: string; status: CharStatus }) {
  const cls =
    status === 'correct'
      ? 'text-neutral-100'
      : status === 'extra'
        ? 'text-red-400 bg-red-500/20 rounded-sm'
        : 'text-neutral-600';
  // A newline shows a dim return glyph, then the real line break (via white-space: pre).
  if (ch === '\n') return <span data-char className={`${cls} opacity-60`}>{'↵\n'}</span>;
  return <span data-char className={cls}>{ch}</span>;
}

// Memoized: only characters whose status actually flips will re-render.
export const Char = memo(CharImpl);
