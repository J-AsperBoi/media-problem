# Standing brief for a snippet builder

A **snippet** is a 3–5 s clip that isolates ONE film feature (for example a slow push-in, a dead stop, or silence then a hit), always starring **Ari**. Jiji compares snippets on a review page and picks the features she likes. Snippets are cheap building blocks for future films, not films.

Read first:
- `research/FILM_GRAMMAR.md`: the feature table and the snippet list, with parameters.
- `tools/character.md` and `tools/character.js`: Ari and all the dials.
- `CLAUDE.md` sections 1, 3 and 4: red/green rules, honesty, tone.
- `tools/lib.js`: camera keys, text, and the easing curves (the rate at which a move speeds up and slows down).

Rules:
- **Files:** `scenes/snippets/<slug>.js` uses the same `makeScene(SERIF, HAND) → {draw, DUR, acts, cues}` interface as films. Load Ari with `const A = require('../../tools/character.js')(L)`, where `L` is loaded from `'../../tools/lib.js'`.
- **Length and look:** 3–5 s, 1080×1920. Only red `#ff3b30` and green `#34d27b` are saturated. No end card and no QR code.
- **One feature per snippet.** Everything else stays neutral, so the feature is the only variable. Show it clearly and at full strength.
- **Label in the corner:** use `L.slate(ctx, '<slug> · <feature>')` so the clip identifies itself on the review page.
- **Text:** at most one short on-screen card, ≥44 px, inside x 80–900 and y 220–1500. Many snippets need no text.
- **Sound:** use `acts`/`cues` only when the feature is about sound (silence, hit, drone, heartbeat). Otherwise leave a quiet drone.
- **Purity:** `draw` must be a pure function of time `t` (no `Math.random`, no state kept between frames). Canvas has no Path2D.
- **Checks:**
  - Run `node tools/lint.js scenes/snippets/<slug>.js` and fix what it flags.
  - Preview with `node tools/render.js scenes/snippets/<slug>.js output/snippets/<slug> --preview`, then Read the contact sheet and actually look at it.
  - Full render with `node tools/render.js scenes/snippets/<slug>.js output/snippets/<slug>`, then confirm the duration with ffprobe.
- **Notes:** write `output/snippets/<slug>/notes.md` with the feature, what the viewer should feel (with the source from FILM_GRAMMAR.md), the exact parameters used, and 2–3 cheap variants worth comparing, e.g. a faster push-in or a longer hold. Then append ONE JSON line to `output/snippets/SNIPPETS.jsonl`: `{"slug","feature","group","feel","params":{...},"dur":<s>}`. Use `>>`.
- **Boundaries:** don't edit `tools/`, films, or other snippets. Don't git commit. Save work as you go.
- **Report:** each slug with its duration, what you built, and anything that failed or looks weak.
