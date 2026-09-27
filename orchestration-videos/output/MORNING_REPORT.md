# Morning report

_Updated 2026-09-27 ~01:45 UTC. The overnight run is still going, and this file is rewritten every few batches._

Open `output/index.html` to see every film, sorted by virality. All 62 concepts, built or not, are in `output/CONCEPT_BANK.md`. The research is in `research/`.

## Numbers
- **Finished films: 31.** All pass `tools/verify.js`, which checks three things: the duration matches DUR, no colour other than red and green is saturated, and a QR code appears in the last 6 s.
- **In progress: 2** (`the-heat-map`, `one-in-eight`).
- **Diversity: 0.891** (mean pairwise distance). Every one of the 18 structures has at least one film. So do all 20 media and all 10 analogs. 18 of the 17 listed families appear (the extra is "family"), including dance and library, which were added mid-run. No two films are closer than 0.56.
- **Average virality estimate: 6.7%** (range 4–8%). The agents were told to be harsh, and none claims more than 8%.

## Top 5 by virality
Ties are broken by the overall score.

| Film | Virality | Overall | Why | 3D translation |
|---|---|---|---|---|
| `the-fact-check` | 8% | 7.4 | One unbroken particle zoom: from one typed word out to a nation of cascades, then back to one face that already knew. "Speed is not belief" is on screen. | A continuous Powers-of-Ten camera through volumetric particles, with parallax at every scale. It dives back to a 100 mm macro on her face. |
| `the-crash-call` | 8% | 7.1 | A sports play-by-play on isometric pitches. Players can't pass across pitch walls while red floods the grid on real monthly data. The handheld shake follows the red's speed. | Tilt-shift isometric pitches under glass. The camera cranes up from a handheld chase to a god's-eye view of the grid. |
| `the-ballroom` | 8% | 7.1 | The grid as a ballroom dancing in perfect sync. One missed step cascades across it in 90 s. It is a true seamless loop: 37 s is exactly 20 dance turns. | Paper-cutout dancers as layered cards with real depth. A slow orbital crane over the ballroom-province. |
| `the-two-feeds` | 8% | 7.0 | Two phones on one couch, an arm's length apart. It is all typography, and it treats the person who believed the claim with tenderness. | Bodies built as volumetric letterforms of their own names. The phones are the only light. |
| `the-migration` | 8% | 7.0 | A hushed ink-wash nature documentary: idle grain as a sleeping green herd that can't find its route. A child's bowl anchors it. | Ink-wash fog layers and one long crane from the bowl up to the valley. The grain creature becomes a hero character. |

`recipe-for-a-shortage` (8%, overall 6.7) just misses the list. It is a chalkboard cooking-show parody that turns grave at 10 s.

## Top 5 by Jiji's taste (CLAUDE.md §10)
1. **`the-mind-grid`** (7.1). An x-ray of one engineer's neurons over the grid, drawn as the same network: signals that don't reach the part that can act. It combines neuroscience with networks visibly connecting and breaking. In 3D: a split frame of a glass-brain render over a glowing grid model that share one graph.
2. **`the-ballroom`** (7.1). The irony of perfect synchronisation, in a loop that directs attention to one idea at a time.
3. **`the-fact-check`** (7.4). Micro to macro and back again, on real data (Vosoughi 2018 and the Hoaxy fact-check study) with a legend.
4. **`ghost-rewind-covid`** (7.3). A stained-glass window of 78 panes, each lit red and then green on real per-country arrival data. It is a nested structure organising chaos, and it stays grave without becoming horrific.
5. **`the-rice-committee`** and **`the-department-of-later`** (6.7 and 6.9). People on the same level who can't hear each other, satirising the system rather than the people.

Honourable mentions: `the-two-feeds`, where the people who can't hear each other share one couch, and `the-stacks` (7.3), a lonely librarian among separate libraries.

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

## Before posting anything
- **The QR codes point to a placeholder.** `config.json` ctaUrl is still `https://YOUR-LANDING-PAGE.example`. Set the real URL, then re-render every scene except the `example_*` ones: `for s in scenes/*.js; do node tools/render.js $s; done`. Each film takes about 10–30 s on an idle machine.
- **Text safe zone:** the research found that TikTok's right-hand UI column starts around x≈915–960. Every film since the first batch keeps its text inside x ≤ 900.

## Operations log
- **Interruptions:** three usage-limit stops (09:20–11:20, ~15:00–17:10 and ~22:00–23:10 UTC) and one container restart.
- **No finished work lost:** partial scenes are committed as work in progress, and agents resume from them.
- **Resume routine:** a routine wakes the session every 2 h to resume, and deletes itself once 60 films are built.
- **Throughput:** at about 130–150k tokens per film, one usage window yields roughly 8–10 films.
