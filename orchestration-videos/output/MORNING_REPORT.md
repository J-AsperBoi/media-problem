# Morning report

_Updated 2026-09-26 18:20 UTC. Rounds continue; this file is rewritten at the end of each batch._

Open `output/index.html` for every film, sorted by virality. The ideas themselves are in `output/CONCEPT_BANK.md` (60 concepts). The research is in `research/`.

## Numbers
- **Finished films:** 9. All passed `tools/verify.js`, which checks that the duration matches DUR, that no colour other than red and green is saturated, and that a QR code shows in the last 1.5 s.
- **In progress:** 3 (`before-the-dark`, `ten-things-in-the-drawer`, `the-warehouse`).
- **Diversity** (mean pairwise distance): **0.935**. That breaks down as 9 structures, 9 media, 9 metaphor families and 8 analogs across 9 films.
- **Average virality estimate:** **6.4%** (range 5–8%). The agents were told to be harsh, and they were.

## Top 5 by virality
| Film | Virality | Why | 3D translation |
|---|---|---|---|
| `the-two-feeds` | 8% | Two phones on one couch, an arm's length apart. It's relatable, done entirely in type, and treats the believer with tenderness. The share motive is "this is my family." | Bodies as volumetric letterforms of their own names; the phones are the only light. The dolly goes out through the ceiling to a thousand lit windows. |
| `the-mold-strikes-back` | 7% | Nature-documentary deadpan over an x-ray petri world. The "1 in 8" hook is clean. | A 100 mm macro on a gloved hand under a light box, with colonies as luminous domes. A single 3 s pull-out to the ward. |
| `the-department-of-later` | 7% | "Meetings about the meeting" is instantly recognisable office satire, and it turns grave. | Over-the-shoulder at desk height, then a crane out through the window to a dusk city of identical ministries rippling red. |
| `fifty-nine-days` | 7% | A gaming HUD with a speedrun framing. "The patch shipped 59 days ago" is a strong cold open. | A voxel first-person walk at 1.65 m, with a screen-space HUD. One vertical crane from the corridor to the globe. |
| `fifteen-hundred` | 6% (Overall 7.0) | A split-screen highway race that reads like a game, with a cold open at hour 10. | Stacked night-highway frames lit only by emissive road edges. The camera flies through the phone glass into traffic. |

## Top 5 by Jiji's taste (CLAUDE.md §10)
1. **`two-days`**: one continuous Powers-of-Ten zoom from a researcher's hands to the world, with real per-country arrival data. Micro-to-macro plus real data. In 3D: an unbroken zoom with a sumi-e fog shader, each scale dissolving into the next like wet ink.
2. **`the-two-feeds`**: people on the same level who can't hear each other, literally one couch. Tender, not preachy.
3. **`the-department-of-later`**: the irony of perfect synchronisation on pointless things, and networks of green notes that never connect.
4. **`ninety-seconds`**: vertigo from a snowy street to a province, with a labelled log-time ruler as the legend. Grave without being horrific.
5. **`the-mold-strikes-back`**: nested scales (dish, ward, world) that turn chaos into order, with a mechanism like neuroscience or biology.

## What worked
- **Cold opens.** A flash-forward to the peak of the same timeline, clearly labelled, fixed the recurring weak thumbnail. `fifteen-hundred` and `fifty-nine-days` improved after this became a director's note.
- **Intimate scale beats map scale.** The films anchored on one relationship (the couch, the translator's desk, the window) scored higher on emotion than the map-first films.
- **The false-news analog** produced the two highest-virality films, because it happens on a phone, in first person.

## What failed or is weak
- **The snap is small in most analogs.** The researched AI counterfactuals are deliberately modest: COVID 421 vs 363 days, Cuba 12 vs 11, rice 31 vs 28 weeks. We didn't inflate them, so snap impact averages about 5–6 out of 10. The biggest honest gaps are WannaCry (a week vs about an hour), false news (13 h vs about 1 h) and heat 2003 (day 12 vs day 3). Future picks should lean on those.
- **`fifty-nine-days`** draws its red counter as a straight line between two sourced endpoints. It is flagged in the notes as a placeholder. It should be re-rendered with a logistic fit (the director's note has been added).
- **WannaCry red curve needs a data check (`the-relay`, `fifty-nine-days`).** The analog sources only the start and the 24 h total. `the-relay` fits a logistic from one machine, which puts most of the day's red *after* the 7.3 h kill switch. That split is unsourced, and a viewer could read it as "the fix didn't help." Before posting, source the infection count at the kill-switch hour and refit.
- **`the-two-feeds`** shows an "hour N" readout. It is time-mapping UI, but strictly it is a third changing number on screen.
- **Crude drawing:** hands, and tiny characters in wide shots, recur. Lettering in the snap panels was too small at first and is now fixed with a 44 px minimum.
- **Research caveat:** only `covid-2020` has a measured spread of human response times. The other nine derive p10/median/p90 from documented response dates, and every file says how. Eight analog files have at least one field marked `verified: false`, and those values are kept off screen.
- **Operations:** two usage-limit stops and one container restart. They cost about 5 hours of wall time but no finished work, because partial scenes are committed and agents resume from them.

## Before posting anything
- **`config.json` ctaUrl is still the placeholder** (`https://YOUR-LANDING-PAGE.example`), so every QR code points there. Set the real URL and re-render. Each film takes about 10–20 s: `node tools/render.js scenes/<slug>.js`.
- **The text safe zone:** research found TikTok's right-hand UI column starts around x≈915–960. Films made after that finding keep text inside x ≤ 900.
