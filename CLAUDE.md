# Typesensei

A typing dojo for programmers: type real source code, fix the muscle memory you
never formally trained, and have a game (Aegis, a reactive space shooter) respond
to clean keystrokes. See `ai-notes/` for the full research + plan.

## Stack
TypeScript + React + Vite + Tailwind. 2D Canvas for the game layer. Dexie/IndexedDB
for local stats. Static SPA — no backend in Phase 1.

## Architecture — one rule
The typing **engine** (`src/engine/`) is pure, framework-agnostic TypeScript. It is
the source of truth and the moat. Everything else subscribes to it:
- React UI renders the target text and reads engine state.
- Game skins (Aegis) react to engine output; they NEVER change the text being typed.

Keep `src/engine/` free of React/DOM imports so it stays testable and reusable.

## Typing model: strict-block
A wrong character does not advance the cursor. It piles into an "error buffer" and
the run is blocked until backspaced. This makes typo *recovery cost* real and
measurable — the core metric of this product (`typoCost` in `metrics.ts`).

## Commands
- `npm run dev`    — dev server (hot reload)
- `npm run build`  — typecheck + production build
- `npm test`       — vitest (engine unit tests)
- `npm run lint`   — eslint

## Conventions
- No skipped characters, ever: symbols, spaces, tabs, newlines, backspace all count.
- Never inflate WPM. Honest numbers only.
- Keep the engine UI-agnostic; put React glue in `src/ui/`.
