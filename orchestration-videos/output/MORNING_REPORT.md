# Morning report

_Updated 2026-09-27 ~12:30 UTC. Rounds continue._

Open `output/index.html` to see every film, sorted by virality. All 62 concepts, built or not, are in `output/CONCEPT_BANK.md`. The research is in `research/`.

## Numbers
- **Finished films: 43.** All pass `tools/verify.js` (duration matches DUR, no saturated colour other than red and green, a QR code in the last 6 s).
- **Unrendered: 1** (`the-green-screen`, see "Needs your decision" below). **In progress: 2** (`recipe-for-a-worm`, `before-the-price`).
- **Diversity: 0.887** (mean pairwise distance). Every structure (18/18), medium (20/20) and analog (10/10) has at least one film. So do 18 metaphor families, including dance and library. The "mind" scale and an AI protagonist now have two films each.
- **Average virality estimate: 6.9%** (range 4–9%).

## Top 5 by virality
Ties are broken by overall score.

| Film | Virality | Overall | Why | 3D translation |
|---|---|---|---|---|
| `the-storm-doc` | 9% | 7.3 | A hushed particle nature documentary where the red is "observed" like an animal. It is one zoom from a kitchen fridge out to a gray sun and back, and the fridge goes quiet. | One continuous volumetric zoom across scales. The kitchen gets a single practical light, and the phone glows green. |
| `keep-the-lights` | 8% | **7.6** | A shadow-puppet theater. The lamp behind the screen is the grid, and four puppeteers hold pieces while their strings tangle. It has the best overall score in the set. | A real puppet stage with one practical lamp. The camera does one dolly back from an audience face to reveal the backstage. |
| `the-fact-check` | 8% | 7.4 | An unbroken particle zoom from one typed word out to a nation of cascades and back. "Speed is not belief" is on screen. | A continuous Powers-of-Ten camera through volumetric particles. |
| `the-heat-map` | 8% | 7.4 | A Powers-of-Ten zoom over topographic heat contours. The same heat field is true at every scale. It has the best honest gap: people act on day 12, after the peak, against an illustrative day 3 before it. | Relief terrain with isotherm contour shaders, and a macro on an old man's fan. |
| `six-to-twelve-hours` | 8% | 7.3 | The 1962 messages as a modern chat, where "delivered" takes 6–12 hours and read receipts never come. The anachronism is the hook. | Two phones across a dark gulf, lit only by their screens. |

Also at 8%: `the-committee-in-my-head`, `the-crash-call`, `the-ballroom`, `the-two-feeds`, `the-migration`, `recipe-for-a-shortage`.

## Top 5 by Jiji's taste (CLAUDE.md §10)
1. **`the-mind-grid`** (7.1). An x-ray of one engineer's neurons over the grid, drawn as the same network: signals that don't reach the part that can act. It combines neuroscience with networks visibly connecting and breaking. In 3D: a split frame of a glass-brain render over a glowing grid model that share one graph.
2. **`the-ballroom`** (7.1). The irony of perfect synchronisation, in a loop that directs attention to one idea at a time.
3. **`the-fact-check`** (7.4). Micro to macro and back again, on real data (Vosoughi 2018 and the Hoaxy fact-check study) with a legend.
4. **`ghost-rewind-covid`** (7.3). A stained-glass window of 78 panes, each lit red and then green on real per-country arrival data. It is a nested structure organising chaos, and it stays grave without becoming horrific.
5. **`the-committee-in-my-head`** (7.3). CLAUDE.md §5's "committee of tiny selves voting at once", shown literally. Three pieces of the truth already sit in one head, and the meeting runs on the wrong agenda. It is neuroscience as metaphor combined with incentive design. `the-rice-committee` and `the-department-of-later` are the system-scale versions of the same idea.

Honourable mentions: `keep-the-lights` (7.6, the best overall; strings between puppeteers visibly tangle), `the-switchboard` (AI as a quiet connective board, with people deciding), `the-two-feeds`, where the people who can't hear each other share one couch, and `the-stacks` (7.3), a lonely librarian among separate libraries.

## What worked
- **By structure:** Powers-of-Ten (7.4), ghost-rewind (7.15) and ticking-clock (7.03) scored highest. Man-in-a-hole, recipe-parody and wait-for-it (6.7) scored lowest.
- **By analog:** false-news and penicillin average 7.13. The Cuban Missile Crisis is lowest at 6.70, because its honest AI gain is one day.
- **Cold opens:** starting on a labelled flash-forward to the peak of the same timeline fixed the weak thumbnails everywhere it was used.
- **Intimate anchors:** films built around a couch, a bowl, a door or a librarian's shoulder scored higher on emotion than films that start from a map.
- **Big honest gaps:** these give the best snaps. Heat 2003 has people acting on day 12, after the peak, against an illustrative day 3 before it. False news has 13 h against about 1 h.

## What failed or is weak
- **The snap is small in most analogs.** The researched AI counterfactuals are deliberately modest: COVID 421 vs 363 days, Cuba 12 vs 11 days, rice 31 vs 28 weeks. We didn't inflate them, so snap impact averages about 5–6. The agents staged the snap with a freeze, silence and one hit, but many snap panels still look alike at a glance.
- **Recurring craft limits:** tiny figures in wide shots, busy mid-zoom frames, and simple hands and faces. These are animatics, and 3D is where this gets fixed.
- **`the-ballroom` poster:** the renderer takes the poster at 0.6 s, when the couple has turned away. Use frame 0 as the thumbnail.

## Data and honesty notes (read before posting)
- **WannaCry red curve, now fixed.** The agent building `the-worm-rewind` found Kryptos Logic CEO testimony to the House Science Committee (June 15, 2017, read via search snippets). It says most of the spread happened *before* the 7.3 h kill switch. `the-relay` and `fifty-nine-days` were refit to saturate by 7.3 h and re-rendered. The shape of the curve inside 0–7.3 h is still illustrative.
- **Human response spread:** only `covid-2020` has a measured spread of human response times. The other nine analogs derive their p10, median and p90 from documented response dates, and each file says how. Eight analog files have fields marked `verified: false`, and those values are kept off screen.
- **Fitted curves:** where an analog sources only the endpoints, the red is a logistic curve fitted through them, and the film's notes say so. This applies to blackout, Quebec, heat, false news and WannaCry. The penicillin doubling time (0.56 yr) is derived from two data points, not published.
- **Worth a second look:**
  - `the-crash-call` shows "32%". It is sourced at the data-point level, but the analog file's top-level flag is unverified.
  - `the-two-feeds` shows an "hour N" clock as part of the time mapping. Strictly, that is a third number on screen.
- **Blocked sources:** page fetches were blocked for most domains, so several sources were read through search snippets. Each file marks where that happened.

## Needs your decision
- **`the-green-screen` is unrendered.** The agent's shell commands were blocked by auto mode's safety check, so it wrote `scenes/the-green-screen.js` and its notes without ever running them. I didn't run the render on its behalf, because the check blocked it and that needs your go-ahead. If you're fine with it, run `node tools/render.js scenes/the-green-screen.js --preview` first; the scene has never been executed and may have runtime errors.

## Before posting anything
- **The QR codes point to a placeholder.** `config.json` ctaUrl is still `https://YOUR-LANDING-PAGE.example`. Set the real URL, then re-render every scene except the `example_*` ones: `for s in scenes/*.js; do node tools/render.js $s; done`. Each film takes about 10–30 s on an idle machine.
- **Text safe zone:** the research found that TikTok's right-hand UI column starts around x≈915–960. Every film since the first batch keeps its text inside x ≤ 900.

## Operations log
- **Interruptions:** three usage-limit stops (09:20–11:20, ~15:00–17:10 and ~22:00–23:10 UTC) and one container restart.
- **No finished work lost:** partial scenes are committed as work in progress, and agents resume from them.
- **Resume routine:** a routine wakes the session every 2 h to resume, and deletes itself once 60 films are built.
- **Throughput:** at about 130–150k tokens per film, one usage window yields roughly 8–10 films.
