# 02 — Product Vision

## The user (you)

- 30 years coding, self-taught typist. Competent but not fast, and **error-prone**.
- Bottleneck isn't English prose — it's **code**: symbols, brackets, operators,
  mixed-case identifiers, indentation, and especially **recovering from a mistake
  mid-line** (the backspace tax).
- Motivation killer: generic tutors are boring and don't target the real problem.
- You want it to be **fun** enough that you'll actually do 10 minutes a day.

## The core insight

> The skill that makes coding feel slow isn't raw speed. It's **accuracy under
> symbol load** and **cheap error recovery**. Optimize for *flow* (long unbroken
> correct streaks), not for peak WPM.

Everything below follows from this. We measure and reward *clean continuous typing
of real code*, and we make typos visibly, viscerally costly — then we wrap that in a
game so the feedback is fun instead of nagging.

## Positioning

**"Monkeytype's feel + typing.io's realism + a game that reacts to your flow."**

Three pillars:
1. **Real.** You type actual source code with every symbol and backspace. No
   inflated WPM, no skipped characters.
2. **Felt.** Instant start, smooth caret, optional sounds, instant red errors,
   beautiful themes. Polish is the product.
3. **Fun.** A reactive game layer (space shooter first) turns clean keystrokes into
   spectacle. Togglable — power users can run it dead-plain like Monkeytype.

## What we build (in scope)

- Code-typing engine over real snippets, multi-language, every char counts.
- **Typo-cost analysis** (the headline metric) + per-key/per-symbol heatmap. **Free.**
- Smooth caret, optional keypress/error sounds, themes.
- Rich results screen: WPM, raw WPM, accuracy, consistency, typo cost, a
  WPM-over-time graph, and *which characters hurt you*.
- Adaptive drills targeting *your* worst symbols/sequences (keybr-style, for code).
- A togglable **game layer**, starting with one mode.
- Local-first stats (IndexedDB). Streaks. Daily goal.

## What we skip (for now)

- Accounts, cloud sync, leaderboards, multiplayer — Phase 3+. The single-player
  loop must be addictive first.
- Mobile / touch — this is a physical-keyboard tool.
- Paywall — build the loop first; monetization is a later, optional question
  (see [06](./06-open-questions.md)). typing.io proves $9.99/mo is viable.
- Custom-code upload — easy to add later; not needed for the loop.

## Design principles (non-negotiable)

1. **The game never changes the text you type.** Reactions are layered *on top* of
   real code. This is what keeps it teaching instead of cheating (the ZType trap).
2. **Reward flow, punish typos visibly** — combos for clean streaks, screen-shake /
   shield-break / broken combo on errors.
3. **Zero friction.** Page loads → you're typing in <1s. Esc/Tab restarts.
4. **Honest numbers.** Never inflate WPM by skipping hard characters.
5. **Toggle everything.** Sounds, game layer, smooth caret, theme — all opt-out.

## Naming

Repo is **`typesensei`** — lean into it. A *dojo* for typing. The default game mode
can be the dojo/sensei flavor, with "Aegis" (space shooter) as an alternate skin.
Plan tier names can riff on keyboard switches like typing.io did (e.g. *Membrane* /
*Mechanical*) if we ever monetize.
