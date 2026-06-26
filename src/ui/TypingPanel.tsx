import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Char, type CharStatus } from './Char';
import { CaretHero } from './carethero/CaretHero';
import type { TypingSession } from './useTypingSession';

export function TypingPanel({
  target,
  session,
  gameOn,
  caretSkin,
}: {
  target: string;
  session: TypingSession;
  gameOn: boolean;
  caretSkin: string;
}) {
  const { state, caret } = session;
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ x: 0, y: 0, h: 0 });
  const [focused, setFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // let shortcuts (copy/paste/etc.) through
      if (e.key === 'Escape') {
        e.preventDefault();
        session.reset();
        return;
      }
      // Tab acts like an editor: fill exactly the indentation the snippet expects
      // here (spaces or tabs), rather than inserting a literal tab character.
      if (e.key === 'Tab') {
        e.preventDefault();
        if (session.blocked) return; // don't pile whitespace onto an uncorrected typo
        for (let i = session.state.cursor; i < target.length; i++) {
          const c = target[i];
          if (c !== ' ' && c !== '\t') break;
          session.onKey(c, e.timeStamp, true);
        }
        return;
      }
      let key: string | null = null;
      if (e.key === 'Backspace') key = 'Backspace';
      else if (e.key === 'Enter') key = '\n';
      else if (e.key.length === 1) key = e.key;
      if (key === null) return;
      e.preventDefault();
      session.onKey(key, e.timeStamp);
    },
    [session, target],
  );

  // Position the smooth caret over the current character.
  useLayoutEffect(() => {
    const all = containerRef.current?.querySelectorAll<HTMLElement>('[data-char]');
    if (!all || all.length === 0) return;
    const el = all[caret];
    if (el) {
      setBox({ x: el.offsetLeft, y: el.offsetTop, h: el.offsetHeight });
    } else {
      const last = all[all.length - 1];
      setBox({ x: last.offsetLeft + last.offsetWidth, y: last.offsetTop, h: last.offsetHeight });
    }
  }, [caret, target, state.errorBuffer.length]);

  // Render order: [correct…][extra (uncorrected typos)…][pending…]
  const parts: ReactNode[] = [];
  for (let i = 0; i < target.length; i++) {
    if (i === state.cursor) {
      state.errorBuffer.forEach((ch, j) =>
        parts.push(<Char key={`x${j}`} ch={ch === '\n' ? '↵' : ch} status="extra" />),
      );
    }
    const status: CharStatus =
      i < state.cursor ? 'correct' : i === state.cursor && !session.blocked ? 'current' : 'pending';
    parts.push(<Char key={i} ch={target[i]} status={status} />);
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative isolate whitespace-pre font-mono text-lg leading-7 outline-none
                 p-6 rounded-xl bg-neutral-900 cursor-text select-none"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 w-0.5 bg-emerald-400 transition-transform duration-75 ease-out"
        style={{
          height: box.h || '1.5rem',
          transform: `translate(${box.x}px, ${box.y}px)`,
          animation: focused ? 'caret-blink 1.1s step-end infinite' : undefined,
          opacity: focused ? undefined : 0.3,
        }}
      />
      {parts}
      {gameOn && (
        <CaretHero
          box={box}
          combo={state.combo}
          typos={session.metrics.typos}
          active={focused}
          skinId={caretSkin}
        />
      )}
      {!focused && (
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-neutral-900/60 text-sm text-neutral-400">
          click or press a key to focus
        </div>
      )}
    </div>
  );
}
