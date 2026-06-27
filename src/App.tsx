import { useEffect, useState } from 'react';
import { SNIPPETS, type Snippet } from './content/snippets';
import { buildDrill } from './content/drills';
import type { RunMetrics } from './engine/metrics';
import { evaluateRun, unlockGauntlet, type AchievementDef } from './storage/achievements';
import { getDailyProgress, getTopProblemKeys, type SaveResult } from './storage/db';
import { loadSettings, saveSettings } from './storage/settings';
import { SKINS } from './ui/carethero/skins';
import { GauntletBar } from './ui/GauntletBar';
import { MasteryMap } from './ui/MasteryMap';
import { TypingView } from './ui/TypingView';

interface Gauntlet {
  bosses: string[];
  index: number;
  results: (boolean | null)[];
  drill: Snippet;
  lastVerdict: boolean | null;
}

export default function App() {
  const [snippetId, setSnippetId] = useState(SNIPPETS[0].id);
  const [progress, setProgress] = useState<SaveResult | null>(null);
  const [settings, setSettings] = useState(loadSettings);
  const [showMastery, setShowMastery] = useState(false);
  const [drill, setDrill] = useState<Snippet | null>(null);
  const [gauntlet, setGauntlet] = useState<Gauntlet | null>(null);
  const [toast, setToast] = useState<AchievementDef[]>([]);
  const snippet = SNIPPETS.find((s) => s.id === snippetId) ?? SNIPPETS[0];
  const active = gauntlet ? gauntlet.drill : (drill ?? snippet);

  useEffect(() => {
    getDailyProgress().then(setProgress);
  }, []);

  useEffect(() => {
    if (toast.length === 0) return;
    const t = setTimeout(() => setToast([]), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleComplete = async (m: RunMetrics, save: SaveResult) => {
    setProgress(save);
    if (gauntlet && gauntlet.lastVerdict === null && gauntlet.index < gauntlet.bosses.length) {
      const sym = gauntlet.bosses[gauntlet.index];
      const ks = m.perKey.find((k) => k.char === sym);
      const verdict = !ks || ks.errors === 0;
      const results = [...gauntlet.results];
      results[gauntlet.index] = verdict;
      setGauntlet({ ...gauntlet, results, lastVerdict: verdict });
    }
    const newly = await evaluateRun({ metrics: m, save });
    if (newly.length) setToast(newly);
  };

  const startDrill = async () => {
    setGauntlet(null);
    const weak = await getTopProblemKeys(6);
    setDrill(buildDrill(weak.map((k) => k.char), snippet.language));
  };

  const startGauntlet = async () => {
    setDrill(null);
    const weak = await getTopProblemKeys(5);
    let bosses = weak
      .map((k) => k.char)
      .filter((c) => /[^\w\s]/.test(c))
      .slice(0, 4);
    if (bosses.length === 0) bosses = ['{', '}', ';', '('];
    setGauntlet({
      bosses,
      index: 0,
      results: bosses.map(() => null),
      drill: buildDrill([bosses[0]], snippet.language, 8),
      lastVerdict: null,
    });
  };

  const nextBoss = () => {
    if (!gauntlet) return;
    const next = gauntlet.index + 1;
    if (next >= gauntlet.bosses.length) {
      setGauntlet({ ...gauntlet, index: next });
      if (gauntlet.results.every((r) => r === true)) {
        unlockGauntlet().then((newly) => {
          if (newly.length) setToast(newly);
        });
      }
    } else {
      setGauntlet({
        ...gauntlet,
        index: next,
        drill: buildDrill([gauntlet.bosses[next]], snippet.language, 8),
        lastVerdict: null,
      });
    }
  };

  const exitGauntlet = () => setGauntlet(null);

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
              onClick={() => {
                setSnippetId(s.id);
                setDrill(null);
                setGauntlet(null);
              }}
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
          onClick={startDrill}
          className="rounded-md bg-emerald-600/20 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-600/30"
        >
          Drill weak spots
        </button>
        <button
          onClick={startGauntlet}
          className="rounded-md bg-indigo-600/20 px-3 py-1 text-xs text-indigo-300 hover:bg-indigo-600/30"
        >
          Symbol Gauntlet
        </button>
        <button
          onClick={() => setShowMastery((v) => !v)}
          className="rounded-md px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200"
        >
          {showMastery ? 'Hide mastery' : 'Symbol mastery'}
        </button>
      </header>

      {gauntlet && (
        <GauntletBar
          bosses={gauntlet.bosses}
          index={gauntlet.index}
          results={gauntlet.results}
          lastVerdict={gauntlet.lastVerdict}
          onNext={nextBoss}
          onExit={exitGauntlet}
        />
      )}

      <TypingView
        key={active.id}
        snippet={active}
        onComplete={handleComplete}
        gameOn={settings.gameOn}
        caretSkin={settings.caretSkin}
      />

      {showMastery && <MasteryMap key={progress?.todayCorrectChars ?? 0} />}

      {toast.length > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          {toast.map((a) => (
            <div
              key={a.id}
              className="rounded-lg border border-amber-500/40 bg-neutral-900 px-4 py-3 shadow-lg"
            >
              <div className="text-sm font-medium text-amber-300">🏆 {a.name}</div>
              <div className="text-xs text-neutral-400">{a.desc}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
