import { useState } from 'react';
import type { Language } from '../content/snippets';

export function PasteModal({
  onStart,
  onClose,
}: {
  onStart: (text: string, lang: Language) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [lang, setLang] = useState<Language>('python');

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3 text-sm font-medium text-neutral-200">Paste code to drill</h3>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste any snippet…"
          spellCheck={false}
          className="h-64 w-full resize-none rounded-md bg-neutral-950 p-3 font-mono text-sm text-neutral-100 outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="rounded-md bg-neutral-800 px-2 py-1 text-sm text-neutral-200"
          >
            <option value="python">python</option>
            <option value="java">java</option>
            <option value="c">c</option>
          </select>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200">
              Cancel
            </button>
            <button
              onClick={() => onStart(text, lang)}
              disabled={!text.trim()}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-40"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
