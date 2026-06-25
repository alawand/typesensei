# 01 — Competitive Research

Research done June 2026. Sources linked at the bottom.

## typing.io — the closest thing to what you want

**What it is:** A typing tutor *built specifically for programmers*. Instead of
drilling words or quotes, you type through **real open-source code**, character for
character, including all the awkward symbols and indentation.

### Features worth stealing
- **Real source code as lessons** — 16 languages (JavaScript, Ruby, C, C++, Java,
  PHP, Perl, Haskell, Scala, …). You practice the actual sequences you hit daily,
  not contrived drills.
- **"Realistic key processing engine"** — does *not* skip symbols, and does *not*
  skip backspace/delete. Most tutors quietly ignore these, which inflates WPM. They
  don't. Backspace is described as "the most frequently typed key" in programming.
- **Typo Cost Analysis** — their killer feature. They count not just the typo, but
  every keystroke you waste *recovering* from it (the chars you typed after the
  error that now must be backspaced/arrowed over). These "collateral keystrokes"
  often cost more than the mistake itself, and nobody else measures them. **This is
  the single most valuable idea for someone in your situation.**
- **Typo Heatmap** — a keyboard heatmap of where you make mistakes (paid).
- **Touch-typing fingering guide** — shows which finger to use, especially for
  symbol keys (paid).
- **Progress tracking** — WPM and unproductive-keystroke trends over time (paid).

### Pricing (their model)
| Plan | Price | Includes |
|------|-------|----------|
| **Scissor Switch** (free) | $0 forever | Lessons in 16 languages, realistic key engine, typo cost analysis |
| **Mechanical** (paid) | **$9.99/mo** | + custom code upload, typo heatmap, fingering guide, progress tracking |

No free trial; free tier is permanent. Stripe (card/PayPal). Cute plan names
(keyboard switch types) — nice touch.

### Weaknesses (our opportunity)
- **Dry.** It's effective but joyless. No game, no flow rewards, no "one more round."
- Dated UI. Functional, not delightful.
- Charges for *progress tracking* and *heatmap* — table-stakes analytics behind a
  paywall feels stingy. We can give these away.
- No multiplayer / social / sharing.

---

## Monkeytype — the gold standard for *feel*

**What it is:** A minimalist, hyper-customizable typing test (prose/words, not
code). Wildly popular because it feels perfect.

### Features / why people love it
- **Test modes:** time (15/30/60/120s), word-count, quote, **zen** (free typing, no
  target), and custom text.
- **Feel is everything:** loads instantly, no ads, no popups, no mascots. You hit a
  key and you're typing within a second. For someone running 15–20 tests a day that
  smoothness compounds.
- **Smooth caret** that glides between letters; configurable caret styles.
- **Keypress sounds** — click, beep, pop, typewriter, etc. (huge for the dopamine
  loop).
- **Instant, visible error feedback** — wrong chars flash red *as you type*. "Fingers
  learn faster when mistakes are that visible."
- **Deep metrics:** WPM, raw WPM, accuracy, consistency, char count, burst, error
  analysis. A replay of your run.
- **Themes** — hundreds. Personalization drives attachment.
- **Accounts:** email / Google / GitHub. Leaderboards (daily + all-time),
  anticheat, result tags to organize history, Discord role for 60s PBs.

### What to steal
The *feel*: zero-friction start, smooth caret, optional keypress sounds, instant red
error feedback, gorgeous themes, a rich post-run results screen with a graph. This
is the bar for polish.

### What it's missing for you
It's prose-first. Code mode isn't its focus, and there's no game layer.

---

## ZType — the "type to shoot" space shooter

**What it is:** An arcade space shooter where enemy ships carry words; you type a
word to blast that ship before it reaches you.

### Mechanics
- Enemies descend, each labeled with a word. Type the whole word → ship explodes.
- Bigger/tougher ships carry **longer words**.
- **Focus lock:** no two on-screen enemies share a starting letter, so once you type
  the first letter the game "locks on" to that ship and routes the rest of your
  keystrokes to it. (Solves the ambiguity problem elegantly.)
- **Limited bombs** clear all nearby enemies — a panic button.
- Escalating waves, satisfying explosions, **global leaderboards**, rivalries.
- The loop hits a near-meditative flow state, like classic arcade games.

### The catch (important design lesson)
ZType teaches you to type **isolated whole words fast** — which is *not* the skill
you need. It can even reinforce hunt-and-peck because you can glance, then burst.
It's fun but it doesn't build the muscle memory for *continuous accurate code*.

**→ Our synthesis (see [03](./03-gamification-concepts.md)): keep ZType's reactive
dopamine, but drive it from accurate typing of real code, not from word-targeting.
The game reacts to your flow; it never becomes the thing you type.**

---

## keybr — adaptive drilling

- Generates **algorithmic pseudo-words** weighted toward the letters *you're worst
  at*. Adapts to your skill, avoids repetitive patterns, builds muscle memory.
- Lesson: an **adaptive/weakness-targeting mode** is valuable. We can do the
  code-symbol version: detect that you fumble `=>`, `};`, or `]`, then generate /
  select drills heavy on those.

---

## Synthesis — what Typesensei takes from each

| Source | What we take |
|--------|--------------|
| **typing.io** | Real source code lessons, no-skip symbol/backspace engine, **typo-cost analysis**, heatmap, fingering hints — but give the analytics away free |
| **Monkeytype** | The feel: instant start, smooth caret, optional sounds, instant red errors, themes, rich results screen + graph |
| **ZType** | Reactive arcade dopamine, combos, escalating intensity, leaderboards — re-aimed at accurate flow |
| **keybr** | Adaptive weakness-targeting, but for code symbols/sequences |

## Sources
- [typing.io](https://typing.io/) · [pricing](https://typing.io/pricing) · [lessons](https://typing.io/lessons)
- [Monkeytype](https://monkeytype.com/) · [GitHub (open source)](https://github.com/monkeytypegame/monkeytype)
- [ZType](https://zty.pe/)
- [keybr](https://www.keybr.com/)
- Reviews: [G2](https://www.g2.com/products/typing-io/reviews) · [CosmicKeys Monkeytype review](https://cosmickeys.app/en/blog/monkeytype-review)
- Build refs: [WPM test with React Hooks](https://paulnovacovici.medium.com/building-a-wpm-typing-test-with-react-hooks-805da08e2eed) · [Typing speed tester (GfG)](https://www.geeksforgeeks.org/reactjs/typing-speed-tester-using-react/)
