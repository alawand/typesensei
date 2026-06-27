# Typesensei

A typing dojo for programmers. Type **real source code** (Python / Java / C, or paste
your own), fix the muscle memory you never formally trained, and let a reactive caret
and generated music reward your flow — without ever pulling your eyes off the code.

> Built as an alternative to typing.io: honest WPM (every symbol, space, tab and
> backspace counts), the things it paywalls given away for free, and a game layer that
> actually reinforces good code-typing instead of distracting from it.

## What it does

- **Honest typing engine** — strict-block model: a typo holds the cursor until you fix
  it, so the *real cost of a mistake* (the backspaces, the recovery) is measured, not
  hidden. Tab fills indentation like your editor; auto-indent isn't counted toward WPM.
- **Caret "Flow"** — the caret becomes a glowing ki-spark that lives where your eyes
  already are: a clean streak grows its trail and tips into overdrive; a typo flashes
  red and snaps it back. Skinnable (Ki Spark / Ink Brush). Toggle off for plain focus.
- **Typing writes music** — opt-in Web Audio: each correct key climbs a pentatonic
  scale (a streak becomes a melody), a typo resets it. Soundpacks: Koto / Marimba / Blip.
- **Adaptive practice** — a per-symbol **mastery map** from your own error history, a
  **"Drill weak spots"** generator (real code lines weighted to your worst symbols),
  and a **Symbol Gauntlet** of single-symbol boss drills. Achievements + daily streak.
- **Paste your own code** — drill the real code you write, through the full experience.
- **Local-first** — all stats live in your browser (IndexedDB). No account, no backend.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build -> dist/
npm run lint
npm test         # engine + drill unit tests
```

Stack: Vite + React + TypeScript + Tailwind, 2D Canvas for the caret layer, Web Audio
for sound, Dexie/IndexedDB for stats. It's a static SPA — no server.

## Deploy (Vercel)

It's a zero-config Vite static site:

1. In the Vercel dashboard, **Add New → Project** and import this repo.
2. Vercel auto-detects Vite — Build Command `npm run build`, Output Directory `dist`.
   (No env vars, no settings to change.)
3. **Deploy.** Every push to `main` ships to production; PRs get preview URLs.

## Notes & planning

Research, product decisions, and the phase-by-phase plan live in [`ai-notes/`](./ai-notes).
