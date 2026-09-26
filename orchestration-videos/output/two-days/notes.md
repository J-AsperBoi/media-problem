# Two Days

Tier: animatic
Slug: two-days
Structure: based-on-a-true-story (research/VIRAL_STRUCTURES.md #12)
Analog: covid-2020 (research/analogs/covid-2020.json)
DUR: 40 s, 1080x1920, 30 fps

## Logline
Close on one researcher's hands as a tiny green fragment (a shared genetic sequence) lights up on a screen. The camera pulls out through a lab, a city, the whole map: red spreading at its real speed, green fragments (sequencers, platform makers, designers, trial sites, regulators, clinics) scattered and connecting on the real lognormal spread of delays. We come back in, closer, to one face in a late country. Snap: the same timeline at true proportions, then an AI-assisted routing version beside it (illustrative). Ending turn: "Based on a true story."

## On-screen numbers (max two, both verified)
1. "2 days": genome shared Jan 11 2020 -> vaccine sequence finalized Jan 13 2020 (analog f3/f4, src s4 = RATES.md Science example, Moderna SEC filing).
2. "2020": the analog year (template rule: the year counts as a number). No threat name.
No other digits appear on screen (no axis numbers, no day counter).

## Time mapping (one mapping)
- SC1 (0-4 s) is the day-13 moment held (the design is done; not a timed interval).
- From t = 4 s: **1 film second = 30 days, linear**. day(t) = 13 + 30 (t - 4). The clock runs to t = 21 s (day 523), then freezes.
- Snap replay: the same days 0-560 at true proportions (linear) compressed into 2.0 s (280 days/s), both panels identical mapping.

## Speed math
**Threat (red).** extent(day) = piecewise-linear interpolation of the analog's `threat.points` (share of 234 countries with >= 1 confirmed case; (0,0) prepended). The map has N = 60 country nodes; node with red-rank r turns red when extent(day) >= (r + 0.5)/60. Ranks = distance from the origin node + noise (geography only; timing is all from the data). Key film times: 26% of nodes at day 61 (t = 5.6 s), 64% at day 75 (t = 6.07 s), 88% at day 96 (t = 6.77 s); the curve tops out at ~94%, so ~4 nodes never go red in the window, as in the data.
Inside one city (the lab's and the face's), blocks turn red with L.logistic(day - d_node, 7.4 days, s0 = 1/blocks), the analog's early Wuhan doubling time (s3, Li et al. NEJM), which the file says to use only for within-city growth.

**Solution fragments (green), from `solution.fragments`:**
| fragment | ready day | film t |
|---|---|---|
| f2 platform makers | 0 | lit from start |
| f3 sequencers (genome shared) | 11 | lit at open |
| f4 designers (vaccine sequence) | 13 | 4.0 (end of SC1) |
| f5 trial sites (first dose) | 76 | 6.43 |
| f6 regulators (first authorization) | 337 | 14.8 |
| f7 clinics / health systems (first dose outside trials) | 343 | 15.0 |
Chain lines f3->f4, f2->f4, f4->f5, f5->f6, f6->f7 draw at those times (0.25 s ink-bleed growth, cosmetic). f1 (spike design, unverified) is not shown. The logline's "manufacturers" and "funders" have no dated entry in the analog file, so they are not shown as separate fragments (platform makers stand in for makers; funders dropped) to keep every timing sourced.

**Human aggregation (per-country first dose).** From f7 (clinics) a green line travels to each node. Node i arrives at day_i = L.lognormalQuantile(q_i, 421, 490) with q_i = (i+0.5)/60 shuffled by L.rng; sigma = ln(490/421)/1.2816 = 0.1185, which gives p10 = 362 (data: 363). Clamped to >= day 343 (no country can dose before the first dose outside trials). Film: p10 -> t 15.7 s, median -> t 17.6 s, p90 -> t 19.9 s; the last node (q = 0.992, day 559) never arrives before the clock stops at 21 s.
The face we zoom into lives in the q = 0.9 node: green reaches it at day ~490, t ~ 19.9 s.

**AI counterfactual (illustrative, labeled on screen).** From `ai_counterfactual`: median country gets first doses as early as the real fastest tenth (median 363 instead of 421, ~58 days sooner); no extra vaccine is made; design, trials and authorization are unchanged. Same lognormal shape (same sigma), so p90 = 363 x 490/421 = 422.5; same clamp at day 343 (32% of nodes bunch at 343: the counterfactual cannot beat the first authorization). Red is identical in both panels. Honest upshot on screen: red still wins the first months either way; faster routing narrows the delivery tail. Basis: RATES.md Science example (design already took 2 days, so AI claims nothing there) + distribution inequity entry (advocacy analysis, not shown on screen).

## Shot list and camera (zoom cycles)
World is a nest of four ink-wash layers, each 10x the one inside it: HANDS (1) in LAB (10) in CITY (100) in MAP (1000). A second chain CLINIC/FACE sits in a late country. Camera = (center, visible width F) in map units; center is interpolated linearly in F so the focal point stays locked while scale changes exponentially.
| t | shot | camera | slate |
|---|---|---|---|
| 0.0-4.0 | SC1 hands on keyboard, green sequence row lit, red at the window | CLOSE, slow push-in (F 1.08 -> 0.98) | SC1 CLOSE |
| 4.0-11.0 | SC2 continuous zoom through scales: hands -> lab -> city -> whole map; red sweeps the map | ZOOM OUT x1000, ease in-out | SC2 CONTINUOUS ZOOM OUT |
| 11.0-15.0 | SC3 wide hold, fragments waiting, regulators/clinics connect | WIDE, slow drift | SC3 WIDE HOLD |
| 15.0-19.4 | SC4 zoom into a late country, city, clinic, one face (closer than SC1) | ZOOM IN x1400 | SC4 ZOOM IN |
| 19.4-23.4 | green reaches the face (19.9); "We slowed it down..." | CLOSE hold | SC4 CLOSE HOLD |
| 23.4-29.2 | SC5 snap: true-proportion replay, then AI-assisted beside it (illustrative) | FLAT GRAPHIC | SC5 SNAP |
| 29.2-35.8 | SC6 back to the first hands, closest yet; "Based on a true story." / "Every timing came from real data." 2020 / "This is the bottleneck." | EXTREME CLOSE, push-in | SC6 DOLLY IN |
| 35.8-40.0 | end card (4.2 s) | - | - |
Cycles: IN (0-4) -> OUT (4-11) -> IN+ (15-19.4); snap wide -> IN++ (29.2-35.8).

## 3D translation note
- SC1: 85 mm macro, eye height just above the desk, shallow focus on the green row; the red is a smear of light on a window, out of focus.
- SC2: one unbroken Powers-of-Ten pull, 10x per ~1.75 s, camera rising straight up; ink-wash rendered as volumetric fog layers (sumi-e shader) so each scale dissolves into the next like wet ink.
- SC3: orbital height, slight tilt; red blooms as ink dropped in water, green as thin glowing threads.
- SC4: descent into a different country, faster than the pull-out, landing at 50 mm on a profile face; green light arrives across the room and reflects in the eye.
- SC6: 100 mm macro closer than SC1, rack focus from the hands to the green row.
Richer in 3D: real paper grain and ink bleed simulation, rain-like ink drops for red, parallax between scales.

## Copy
- "The design took / 2 days."
- "Then it had to reach everyone."
- "Every piece already existed."
- "Some waited far longer."
- "We slowed it down / so you could see it."
- "At true proportions." / "Same pieces. Faster routing." (panel label "AI-assisted routing - illustrative")
- "Based on a true story." / "Every timing came from real data." + "2020"
- "This is the bottleneck."
- End card line: "The bottleneck is us." + "Scan. Help close the gap."
Variants (unused): "The answer was written in two days. It shipped in a year." / "Design at lab speed. Delivery at legacy speed." / "The patch was ready. The rollout wasn't."

## Tags
{"slug":"two-days","structure":"based-on-a-true-story","medium":"ink wash","family":"body/biology","scale":"multi-scale zoom","pace":"slow build","emotion":"awe","protagonist":"a green fragment","camera":"continuous zoom through scales","analog":"covid-2020"}

## Build notes
- Diversity check: OK, distinct enough (no ledger rows yet at check time).
- Preview critique: the scales read, and so do the red sweep, the green chain and the lognormal delivery tail. The SC2 crossfades between scales show some rectangular paper patches mid-zoom. The hands are simple ink strokes. In SC6 the cards sat on the keyboard, so I added a paper wash behind them. The snap is honest but modest: the AI panel's green median tick lands about 58 days earlier and the red is identical.
- Final render: 40.0 s (ffprobe), matches DUR.

## Scores
- Hook: 6
- Speed accuracy: 9
- Snap impact: 5
- Emotion: 6
- Originality: 7
- Craft: 5
- Honesty: 9
Overall: 6.7
Virality: 6% (the ink-wash Powers-of-Ten zoom and the true-story reveal are distinctive, but the snap is deliberately small, the hook opens on a keyboard rather than a face, and the animatic drawing is rough. That makes it a thoughtful watch more than a share trigger.)
