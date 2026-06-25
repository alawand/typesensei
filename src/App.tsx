import { useState } from 'react';
import { SNIPPETS } from './content/snippets';
import { TypingView } from './ui/TypingView';

export default function App() {
  const [snippetId, setSnippetId] = useState(SNIPPETS[0].id);
  const snippet = SNIPPETS.find((s) => s.id === snippetId) ?? SNIPPETS[0];

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-neutral-950 px-4 py-12 text-neutral-100">
      <header className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Typesensei</h1>
        <div className="flex gap-2">
          {SNIPPETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSnippetId(s.id)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                s.id === snippetId
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {s.language}
            </button>
          ))}
        </div>
      </header>

      <TypingView key={snippet.id} snippet={snippet} />
    </main>
  );
}
