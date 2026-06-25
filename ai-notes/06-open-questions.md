# 06 — Open Questions (need your call before coding)

## ✅ DECISIONS LOCKED (2026-06-24)
- **Error model:** strict-block (cursor holds on errors until fixed). [Q1]
- **First game mode:** Aegis (reactive space shooter). [Q3]
- **Launch languages:** Python, Java, C. [Q4]
- **Auto-indent (Q2), content sourcing (Q5), monetization (Q6), product-vs-tool (Q7):**
  using recommended defaults for now (auto-indent off / type whitespace; ~20 curated
  permissive snippets per lang; no monetization; build as personal tool, keep product
  door open).
- **Stack (Q8):** ✅ TypeScript + **React** + Vite + Tailwind + 2D Canvas (Aegis) +
  Dexie/IndexedDB (stats), shipped as a static SPA. Typing engine itself is plain,
  framework-agnostic TypeScript.

---

These are the decisions that actually change the build. My recommendation is marked ✅.

### 1. Error model — strict-block vs. free-advance
- **✅ Strict-block (typing.io):** wrong char turns red, cursor *won't* advance until
  you backspace and fix it. Makes typo-recovery cost real — closest to editing code,
  best for *your* stated weakness.
- Free-advance (Monkeytype): record the error, keep going, count at end. Smoother,
  but hides the recovery tax.
- **Rec:** default strict-block; expose free-advance as a setting. Either way we
  *measure* typo cost.

### 2. Auto-indent on newlines?
Real editors auto-insert leading whitespace after Enter. Do we (a) auto-consume next
line's indentation, or (b) make you type every space/tab?
- **✅ (b) for the realism purist** (you said the symbols/whitespace *are* the
  problem) — but offer auto-indent as a comfort setting. Indentation typing is a real
  skill, but it can also feel like busywork. Your call.

### 3. First game mode
- **✅ Aegis (space shooter)** for the wow factor and to validate the reactive layer.
- Or Dojo first (cheaper, calmer, faster to ship) then Aegis.
- **Rec:** Aegis — it's the thing that'll make you go "ok this is different."

### 4. Languages at launch
Which 2–3 do you want first? **Rec: JavaScript/TypeScript + Python + one of
Go/Rust/C** (symbol-dense contrast). What do *you* write most day-to-day?

### 5. Content sourcing
Curated permissive-licensed OSS snippets vs. hand-written exemplar snippets vs. let
you paste your own code from day one.
- **Rec:** start with ~20 hand-picked permissive snippets per launch language; add
  paste-your-own in Phase 3.

### 6. Monetization — build it in or ignore for now?
typing.io charges $9.99/mo (gating analytics + custom upload). We can give all that
away to win on goodwill, and decide later.
- **✅ Ignore for now.** Build the loop. If it's good, monetization options are easy
  (cosmetic themes/modes, optional cloud sync, team/edu seats). Don't let it shape
  the MVP.

### 7. Is this a personal tool or a product?
- Personal tool → optimize purely for *your* daily use, skip accounts forever.
- Product → Phase 4 (accounts/leaderboards) matters, and we'd weigh polish/SEO/landing.
- **Rec:** build it as a personal tool first; the architecture (local-first, then a
  thin sync layer) leaves the product door open without committing now.

### 8. Tech stack sign-off
Vite + React + TS + Tailwind + Canvas + Dexie (IndexedDB), static SPA. Any
preferences (Svelte? Solid? no-framework?) before we lock it in?
- **Rec:** the above unless you have a strong preference — it's boring, fast, and you
  know it.

---

## What I need from you to start coding
1. Error model: strict-block default? (Q1)
2. First game mode: Aegis? (Q3)
3. Launch languages: which 2–3? (Q4)
4. Stack sign-off. (Q8)

Everything else has a sane default and can be decided as we go.
