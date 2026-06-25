# 03 — Gamification Concepts

The fun part. This is where Typesensei stops being a chore.

## The one rule that makes this work

> **The game reacts to your typing. Your typing never bends to the game.**

You always type the *real code, in order, every character*. The game is a **reactive
layer painted on top** — driven by signals derived from your keystrokes (correct
char, error, combo length, instantaneous speed, rhythm steadiness). This is the
crucial difference from ZType: ZType makes you type *what the game wants* (isolated
words), which trains the wrong skill. Typesensei makes the game *respond to good
code-typing*, so the fun reinforces the real skill instead of replacing it.

Mechanically: the typing engine emits an **event stream** —
`keystroke{correct, char, dt}`, `error`, `comboTick`, `comboBreak`, `lineComplete`,
`burst` — and each game mode is just a renderer that consumes those events. One
engine, many skins.

## Shared reward primitives (used by every mode)

- **Combo / streak:** consecutive correct keystrokes. Drives a multiplier. Breaks on
  any error. This is the heartbeat.
- **Flow / momentum meter:** rewards *steady rhythm*, not just speed. Erratic bursts
  + corrections drain it; smooth cadence fills it. (Directly trains your real goal.)
- **Heat / overdrive:** sustain a long combo → enter a juiced visual state (faster
  music, glow, screen tint) for bonus score. Pure dopamine.
- **Typo shockwave:** an error triggers an immediate, *visible* cost — screen shake,
  red flash, shield crack, combo shatter. Makes the typo-cost lesson *felt*.
- **Boss lines:** the gnarliest line in a snippet (symbol-dense, e.g.
  `const x = arr.map(([k, v]) => ({ ...k, [v]: () => {} }));`) is flagged as a
  "boss." Clear it clean for a big payoff.

---

## Mode A — "Aegis" (the reactive space shooter) ⭐ recommended first game

The signature mode. Your code sits in the normal typing panel; the **right/back
portion of the screen is a starfield battle** that you drive *by typing the code
accurately*.

**Mapping (keystrokes → spectacle):**
- Each **correct character** = your ship auto-fires one shot at the nearest enemy.
  You don't aim — accurate code-typing *is* the aim.
- **Combo multiplier** = fire rate + damage. Long clean streak → a beam/spread that
  shreds waves. Errors break the combo → back to a peashooter.
- **Completing a line** = clears a wave / drops a loot crate (cosmetic).
- **Boss line** = a boss ship with an HP bar; the symbol-dense line *is* the boss
  fight. Clean clear = boss explodes gloriously.
- **Typo** = you take a hit. Shield flashes, screen shakes, combo shatters. Enough
  hits in a snippet = ship destroyed (soft fail → restart the snippet, no real
  punishment, just stakes).
- **Overdrive** (long combo) = bullet-time tint, thicker beams, swelling music.
- **End screen** = score + the real stats (WPM, accuracy, typo cost), so the game
  score and the *honest* metrics live side by side.

Why it's good: it's ZType's thrill, but you can only do well by typing real code
cleanly and continuously. Speed *and* accuracy *and* rhythm all map to power. It
literally cannot reward hunt-and-peck.

**Look:** retro-synthwave vector starfield, CRT glow, chunky particle explosions.
Cheap to render (2D canvas), high payoff.

---

## Mode B — "Dojo" (the default, calmer mode)

For when you want focus, not fireworks. Monkeytype-clean, but alive:
- A subtle **ki/energy aura** around the caret that brightens with your combo.
- Clean streaks light up paper-lantern "rank" pips (white → yellow → black belt).
- Errors make a soft *thunk* and a brief ink-splatter on the offending char.
- A sensei one-liner on the results screen ("Your `;` is weak. Drill it.").

This is the default skin — the one a CTO uses at 7am without wanting explosions.

---

## Mode C — "Endless Runner / Code Climber"

Your avatar runs/climbs while you type. Speed = pace, combo = a trailing boost,
errors = stumbles. Each completed line = a platform. Boss line = a gap you leap.
Good for a "type until you die" endless high-score loop. (Later.)

## Mode D — "Tower / City Builder" (idle-ish, low adrenaline)

Each clean snippet builds a piece of a growing city/tower; accuracy = build quality,
errors = cracks you must patch. Appeals to the "I want to *make* something over a
week" instinct rather than twitch reflexes. (Later, optional.)

## Mode E — "Boss Rush: Symbol Gauntlet"

A focused drill mode dressed as boss fights. Each boss = a class of symbol you're
weak at (the `{}` boss, the `=>` boss, the `[]` boss). Beating a boss = you've
demonstrably improved on that symbol (measured by accuracy on it). Directly ties the
adaptive/weakness-targeting engine to a game goal. **Strong candidate for the second
mode after Aegis** because it fuses the keybr idea with the game layer.

---

## Progression / meta (cross-mode, keeps you coming back)

- **Daily streak** + daily goal (e.g. "5 min or 1500 clean keystrokes"). Streaks are
  the most reliable retention mechanic in existence.
- **Belt/rank system** (Dojo theme): white → black, earned by accuracy & typo-cost
  thresholds, not just speed. Speed alone shouldn't rank you up — that's the whole
  philosophy.
- **Symbol mastery map:** a per-symbol skill tree. Light up `{`, `}`, `=>`, `::`,
  `[]`, etc. as your accuracy on each crosses thresholds. Visualizes *exactly* where
  you're improving — deeply motivating for an engineer.
- **Achievements:** "100-clean-keystroke combo", "boss line, zero typos", "7-day
  streak", "sub-2% typo cost on a 200-char snippet".
- **Ghost runs:** race your own past best (semi-transparent caret replay). Add other
  people later for multiplayer.

## Recommended game roadmap

1. **Aegis (Mode A)** — the wow factor, validates the reactive-layer idea.
2. **Dojo (Mode B)** — the everyday default (lighter to build, reuses the engine).
3. **Boss Rush (Mode E)** — ties in adaptive weakness drills.
4. Runner / City — only if there's appetite.

All four are the *same typing engine* with different renderers subscribed to the same
event stream. Build the engine once (see [04](./04-technical-architecture.md)); skins
are comparatively cheap.
