import { useEffect, useState } from 'react';
import { SNIPPETS } from './content/snippets';
import { getDailyProgress, type SaveResult } from './storage/db';
import { loadSettings, saveSettings } from './storage/settings';
import { SKINS } from './ui/carethero/skins';
import { MasteryMap } from './ui/MasteryMap';
import { TypingView } from './ui/TypingView';

export default function App() {
  const [snippetId, setSnippetId] = useState(SNIPPETS[0].id);
  const [progress, setProgress] = useState<SaveResult | null>(null);
  const [settings, setSettings] = useState(loadSettings);
  const [showMastery, setShowMastery] = useState(false);
  const snippet = SNIPPETS.find((s) => s.id === snippetId) ?? SNIPPETS[0];

  useEffect(() => {
    getDailyProgress().then(setProgress);
  }, []);

  const toggleGame = () => {
    setSettings((prev) => {
      const next = { ...prev, gameOn: !prev.gameOn };
      saveSettings(next);
      return next;
    });
  };

  const setCaretSkin = (id: string) => {
    setSettings((prev) => {
      const next = { ...prev, caretSkin: id };
      saveSettings(next);
      return next;
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-neutral-950 px-4 py-12 text-neutral-100">
      <header className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Typesensei</h1>
        {progress && progress.streak > 0 && (
          <span className="text-sm text-neutral-400">
            🔥 {progress.streak} day{progress.streak === 1 ? '' : 's'} streak
          </span>
        )}
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
        <div className="flex items-center gap-2">
          <button
            onClick={toggleGame}
            className="rounded-md px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200"
            title="Toggle the caret Flow effect"
          >
            {settings.gameOn ? '✦ Flow: on' : 'Flow: off'}
          </button>
          {settings.gameOn &&
            Object.values(SKINS).map((skin) => (
              <button
                key={skin.id}
                onClick={() => setCaretSkin(skin.id)}
                className={`rounded-md px-2 py-1 text-xs ${
                  settings.caretSkin === skin.id
                    ? 'bg-neutral-700 text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {skin.name}
              </button>
            ))}
        </div>
        <button
          onClick={() => setShowMastery((v) => !v)}
          className="rounded-md px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200"
        >
          {showMastery ? 'Hide mastery' : 'Symbol mastery'}
        </button>
      </header>

      <TypingView
        key={snippet.id}
        snippet={snippet}
        onSaved={setProgress}
        gameOn={settings.gameOn}
        caretSkin={settings.caretSkin}
      />

      {showMastery && <MasteryMap key={progress?.todayCorrectChars ?? 0} />}
    </main>
  );
}
