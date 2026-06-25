# 04 — Technical Architecture

## Recommended stack

| Layer | Choice | Why |
|-------|--------|-----|
| Build/dev | **Vite** | Instant HMR, zero-config, fast |
| UI | **React + TypeScript** | You know the ecosystem; types matter for the engine |
| Styling | **Tailwind CSS** | Fast theming, easy to expose CSS-var themes |
| State | **Zustand** (or plain reducer) | Lightweight; the typing engine is the real state machine |
| Game layer | **2D Canvas** (PixiJS optional) | Aegis/Dojo are 2D particle scenes — canvas is plenty; reach for Pixi/WebGL only if particle counts demand it |
| Storage | **IndexedDB via Dexie** | Local-first stats, snippet cache, no backend needed for MVP |
| Sounds | **Web Audio API** (or Howler) | Low-latency keypress/error sounds (Web Audio for tight timing) |
| Charts | **uPlot / Recharts** | Results-screen WPM-over-time graph |

Keep it a **static SPA** for Phase 1 — deployable to Vercel/Netlify/Cloudflare
Pages, no server. Add a backend only when we need accounts/leaderboards (Phase 3).

> Note: Monkeytype is open source ([github.com/monkeytypegame/monkeytype](https://github.com/monkeytypegame/monkeytype)).
> Worth reading their input handling and results code for reference — don't copy
> wholesale (it's prose-oriented and large), but their caret + timing logic is
> battle-tested.

## The heart: the typing engine

Everything else is a renderer on top of this. It's a deterministic state machine
that consumes raw `keydown` events and emits a typed event stream.

### Core model
```
Snippet            // the target: raw source text, language, metadata, "boss" line ranges
TypingState {
  target: string[]          // chars (preserve every space, tab, newline)
  cursor: number            // index of next expected char
  typed: Keystroke[]        // full history (for replay + analysis)
  errorsOpen: number        // how many wrong chars are currently sitting uncorrected
  combo: number             // consecutive correct keystrokes
  startedAt, endedAt
}
Keystroke { char, expected, correct, tMs, wasBackspace }
```

### Input handling — the tricky, important decisions
1. **Capture every character, never skip.** Symbols, spaces, **Tab** (indentation),
   **Enter** (newlines), and **Backspace** all count. `preventDefault` on Tab so it
   doesn't move focus.
2. **Error model — choose one (recommend "strict-block" for code):**
   - *Strict-block (typing.io style):* a wrong char is shown red and the cursor does
     **not** advance until corrected with backspace. This makes the **typo cost**
     real — you must clean up before continuing, exactly like editing code. ✅ Recommended.
   - *Free-advance (Monkeytype style):* wrong char is recorded red and you move on;
     errors counted at the end. Smoother but hides recovery cost. Offer as a setting.
3. **Auto-indent handling:** when the user hits Enter, optionally auto-consume the
   leading whitespace of the next line (most editors do this). Decision in [06](./06-open-questions.md).
4. **IME / dead keys / paste:** block paste; handle composition events to avoid junk.

### Event stream (what game skins subscribe to)
```
keystroke { correct, char, dtMs }
error     { expected, got, cursor }
comboTick { combo }            // emitted on each correct char
comboBreak{ atCombo }          // emitted on first error after a streak
lineComplete { line, cleanLine: boolean }
bossEnter / bossClear
runComplete { stats }
```
Skins (Aegis, Dojo, …) and the stats recorder are all just subscribers. Add a mode =
add a subscriber. The engine knows nothing about spaceships.

## The metrics (do these honestly)

- **WPM** = `(correctChars / 5) / minutes`. Standard: a "word" = 5 chars. Use
  *correct* chars only.
- **Raw WPM** = all chars / 5 / minutes (includes errors) — shows the speed/accuracy gap.
- **Accuracy** = `correctKeystrokes / totalKeystrokes * 100`.
- **Consistency** = how steady your per-keystroke (or per-second) speed is — e.g.
  `100 - normalizedStdDev(intervals)`. This is the *flow* number; rewarding it trains
  your real weakness.
- **⭐ Typo cost (the headline metric):** total keystrokes "wasted" per typo =
  the wrong char + every keystroke spent backspacing/re-typing to recover. Track it
  globally and **attribute it per-character** so we can say *"`{` costs you 3.2
  keystrokes each time it goes wrong."* This is the whole point — it tells you
  exactly what to drill.
- **Per-key / per-symbol heatmap:** error rate and avg cost per character →
  keyboard heatmap + the "symbol mastery map" from [03](./03-gamification-concepts.md).

## Rendering the text (performance note)

- Render the snippet as **per-character spans**, classed `pending | correct | error |
  current`. **Memoize characters** — naive React re-renders every char on every
  keystroke and dies on long snippets. Only the chars whose state changed should
  re-render. (This bites everyone who builds one of these.)
- **Smooth caret:** absolutely-positioned element that animates (CSS transform) to
  the current char's box — don't reflow text to move the caret.
- Themes via **CSS variables**; ship a handful, make adding more trivial.

## Content / snippets pipeline

- **Source:** curated open-source files (MIT/Apache/permissive — check licenses) per
  language, chunked into ~10–40 line snippets. Tag each by language and difficulty
  (symbol density, line length, identifier complexity).
- **Storage:** ship a starter pack as static JSON; cache in IndexedDB. Later allow
  custom paste/upload (typing.io's paid feature — we can give it free).
- **Difficulty grading:** a simple score from symbol-per-char ratio + avg identifier
  length + nesting depth. Powers adaptive selection.
- **Adaptive selection (keybr-style):** weight snippet/drill choice toward the
  symbols/sequences with your worst per-key cost. Optionally synthesize micro-drills
  (e.g. repeated `=> {}` patterns) for a targeted symbol.

## Data model (local-first, IndexedDB)

```
runs:       { id, snippetId, lang, startedAt, wpm, rawWpm, acc, consistency,
              typoCost, keystrokes[] (optional, for replay) }
keyStats:   { char, attempts, errors, totalRecoveryCost }   // drives heatmap + adaptive
dailyStats: { date, secondsTyped, cleanKeystrokes, runs }   // drives streak + goal
settings:   { theme, sounds, gameMode, errorModel, autoIndent, ... }
progress:   { belt, achievements[], symbolMastery{} }
```

No backend in Phase 1. When accounts arrive: a thin API (e.g. Cloudflare
Workers/D1, or Supabase) that syncs these tables + leaderboard endpoints. Borrow
Monkeytype's anticheat lessons (validate server-side, flag implausible runs).
