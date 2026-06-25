# Typesensei — Project Notes

> A typing dojo for programmers. Type *real code*, fix the muscle memory you never
> formally trained, and have a game react to every clean keystroke.

These notes are the research + plan phase. **No code yet.** Read in order, or jump
to what you need.

## The one-paragraph pitch

You've coded for 30 years without formal typing training. Generic typing tutors
(words, quotes) don't help — your bottleneck isn't prose, it's `{`, `}`, `=>`,
`::`, `[]`, snake_case, camelCase, and the *cost of recovering from a typo* mid-line.
Typesensei is typing.io's realistic "type real source code" engine, with
Monkeytype's buttery feel and zero clutter, **plus** a reactive game layer that
turns clean typing into a dopamine loop — without ever distorting what you're
typing. Type accurate code → the game rewards you. Sloppy → the game punishes you.

## What's in here

| File | What it covers |
|------|----------------|
| [01-competitive-research.md](./01-competitive-research.md) | Deep dive on typing.io, Monkeytype, ZType, keybr — features, pricing, what to steal |
| [02-product-vision.md](./02-product-vision.md) | Who it's for, the core insight, what we build vs. skip |
| [03-gamification-concepts.md](./03-gamification-concepts.md) | The fun part. Several game-layer designs incl. the space shooter, with the key design rule that makes them *teach* instead of *cheat* |
| [04-technical-architecture.md](./04-technical-architecture.md) | Stack, the typing engine, WPM/accuracy math, data model, rendering |
| [05-mvp-roadmap.md](./05-mvp-roadmap.md) | Phased build: dry MVP → game layer → multiplayer. What to ship first |
| [06-open-questions.md](./06-open-questions.md) | Decisions that need your call before we write code |

## TL;DR recommendation

1. **Build the boring-but-correct typing engine first** (real code, real symbols,
   typo-cost tracking). This is the moat and the hard part. ~1–2 weeks.
2. **Layer the game on top as a togglable skin.** The game *reacts*, it never
   changes the text you type. Start with one mode ("Aegis" — the reactive space
   shooter). ~1 week.
3. **Local-first, no backend at first.** Stats in IndexedDB. Add accounts/
   leaderboards only once the single-player loop is addictive.

Stack rec: **Vite + React + TypeScript + Tailwind**, canvas/WebGL for the game
layer, IndexedDB (Dexie) for stats. Details in [04](./04-technical-architecture.md).

## ✅ Locked decisions (2026-06-24)
- **Error model:** strict-block (cursor holds on a typo until you fix it)
- **First game mode:** Aegis (reactive space shooter)
- **Launch languages:** Python, Java, C
- **Stack:** TypeScript + React + Vite + Tailwind + 2D Canvas + Dexie/IndexedDB, static SPA

See [06-open-questions.md](./06-open-questions.md) for the full decision log.
