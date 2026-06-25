# 05 — MVP Roadmap

Philosophy: **the typing engine is the hard part and the moat — build it correctly
first, prove the loop is good plain, then make it fun, then make it social.** Each
phase is independently shippable and useful.

Rough estimates assume one focused dev. Treat as relative sizing, not promises.

---

## Phase 0 — Skeleton (½–1 day)
- Vite + React + TS + Tailwind scaffold. Static SPA, deploys to Cloudflare/Vercel.
- Theme system via CSS variables (1 dark theme to start).
- A few hardcoded code snippets in JSON.
- **Goal:** repo runs, a snippet renders on screen.

## Phase 1 — The honest typing engine (the moat) (~1–2 weeks)
The thing nobody else bothers to get right. No game yet.
- Char-by-char engine: every symbol, space, **Tab**, **Enter**, **Backspace** counts.
- **Strict-block error model** (cursor holds on errors) + Monkeytype-style as a setting.
- Per-character render with **memoization**; **smooth animated caret**.
- Live stats; **post-run results screen**: WPM, raw WPM, accuracy, consistency,
  **typo cost**, WPM-over-time graph.
- **Per-key heatmap + typo-cost attribution** ("`{` costs you 3.2 keystrokes").
- IndexedDB: runs, keyStats, dailyStats, settings. **Streak + daily goal.**
- Optional keypress/error sounds (Web Audio), restart on Tab/Esc.
- **Ship-gate:** is this *already* better for you than typing.io, even with no game?
  It should be (free analytics + better feel). If yes, the foundation is right.

## Phase 2 — The game layer (~1 week for first mode)
Make it fun. Reactive layer on the engine's event stream.
- Event-stream API finalized; **combo / flow / overdrive** primitives.
- **Mode A "Aegis"** (reactive space shooter) on 2D canvas: correct char fires,
  combo powers up, typo = hit/shake, boss line = boss ship, end screen shows score
  *and* honest stats.
- **Mode B "Dojo"** (calm default) reusing the same primitives.
- Game-layer toggle (run dead-plain like Monkeytype if you want).
- **Belt/rank progression** + symbol mastery map + a few achievements.
- **Ship-gate:** do you hit "one more round" unprompted? That's the win condition.

## Phase 3 — Depth & adaptivity (~1–2 weeks)
- **Adaptive engine:** weight snippet/drill selection toward your worst symbols
  (keybr-for-code). Synthesized micro-drills for a target symbol.
- **Mode E "Boss Rush: Symbol Gauntlet"** — beat the `{}` boss, the `=>` boss, etc.
- Custom paste/upload (give away what typing.io charges for).
- More languages, more curated snippets, difficulty grading, more themes.
- **Ghost run** (race your own past best).

## Phase 4 — Social / cloud (only after the loop is addictive)
- Accounts (email / Google / GitHub), cloud sync.
- Leaderboards (daily + all-time) with server-side validation / anticheat.
- Shareable result cards; ghost-race other people.
- *Then* consider monetization ([06](./06-open-questions.md)) — proven loop first.

---

## What to deliberately NOT do early
- ❌ Accounts / backend before the single-player loop is fun (Phase 1–2 are 100% local).
- ❌ Mobile/touch — physical keyboard tool.
- ❌ Many game modes at once — nail **Aegis** before building Runner/City.
- ❌ Paywall before retention exists.
- ❌ Over-engineering content — 20 great snippets in 2 languages beats 2000 mediocre ones.

## First-week concrete target (if/when we start coding)
1. Vite+React+TS+Tailwind scaffold, one theme.
2. Render a JS snippet char-by-char (memoized), smooth caret.
3. Strict-block engine: type it, errors hold the cursor, backspace recovers.
4. Live WPM/accuracy + a results screen with **typo cost**.
5. Persist runs + a streak counter in IndexedDB.

That alone is a tool you'd use daily — and the base every game mode plugs into.
