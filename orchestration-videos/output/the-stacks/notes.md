# The Stacks

Tier: animatic
Slug: the-stacks
Structure: based-on-a-true-story (research/VIRAL_STRUCTURES.md #12)
Analog: penicillin-resistance-1946
Tags: medium woodblock · family library · scale organization · pace slow build · camera over-the-shoulder · emotion loneliness · protagonist a green fragment

## Logline
Over a librarian's shoulder: she holds one volume, the warning she has just written from her own card catalog, where red slips are spreading drawer by drawer. The next answer already exists as separate volumes on separate shelves in separate libraries across town. Loan slips go out between the buildings and get lost; the red spreads through the catalog faster than anyone can check the volumes out together. Late reveal: every timing was taken from a real record that starts in 1946 (the threat is never named).

Never named on screen: no "bacteria", "antibiotic", "penicillin", "drug", "resistance". It is only the red. Siblings on this analog: the-mold-strikes-back (x-ray nature doc about the red) and the-cure-before-after (stick-figure ritual). This one is the library metaphor, woodblock print style (flat carved shapes, wood grain, gray inks on paper; only red and green saturated).

## Metaphor map (all from the analog file)
| on screen | analog |
|---|---|
| her card catalog, 40 drawers; a drawer with a red slip | share of hospital isolates that are resistant (Hammersmith, s1). One library = one hospital's records. |
| her volume (turns green when written, year 1.5) | f2: the hospital bacteriologist's surveillance warning (ready ~1947-48, s1) |
| biochemists' library, green volume from the start | f1: the enzyme knowledge (1940, unverified in analog; no number on screen) |
| chemists' library, blank volume that turns green at year 13 | f3: the new penicillinase-resistant compound (1959, s5) |
| "the world" library, gray and dark for the whole film | f5: global coordinated plan (2015, unverified): lies outside the 15-year window, shown only as never lighting |
| loan slips (dashed lines) between buildings, breaking; solid green when they arrive | human aggregation links, lognormal arrival times |
| year 15: two drawers red again | the 1961 counter-move (s5), qualitative |

## Time mapping (one stated mapping for the race)
Cold open (t 0-1.2) is a flash-forward on the same timeline to year 1.75 (the last sourced point), stamped LATER. Then t 1.2-3.6 is frozen at year 0 (April 1946).
Race: film t 3.6 to 17.6 covers analog years 0 to 15 (Apr 1946 to the 1961 counter-move) on a **log time scale**:
film_t = 3.6 + L.mapTime(year, 15, 14, 'log') = 3.6 + 14 * log10(1 + year) / log10(16).
Placements: year 1.17 t 7.51; year 1.5 (warning written) t 8.23; year 1.75 t 8.71; year 2.5 t 9.93; year 5 t 12.65; year 13 (the pieces meet) t 16.93; year 15 (red again) t 17.60. The log scale makes the pace a slow build: the first months crawl, the long wait flies. A hand-cut "log time" note sits on the wide.
Snap: both lanes at **true proportional (linear) speed**, 0 to 15 years in 3.0 s (1 s = 5 years).

## Speed math
**Threat (red).** L.logistic(year, 0.56, s0 = 0.125) using the analog's doubling_time. The 0.56-year doubling is **derived, not published**: a logistic fit through 12.5% (Apr 1946, s1) and 38% (Jun 1947, s1): r = 1.245/yr, ln2/r = 0.56 yr. Check: 0.378 at year 1.17, 0.555 at 1.75 (59% reported in 1948, month unverified). 40 drawers = 40 samples; drawer i has a fixed threshold q_i = (i + 0.5)/40, shuffled by L.rng at setup; a drawer shows a red slip when the share exceeds q_i, so the red count is the share (5 of 40 at year 0, 15 at 1.17, 22 at 1.75). The same thresholds drive the building's 40 facade windows at the wide, so the math is identical at every zoom. After year 1.75 the curve is model extrapolation toward 100%; real hospital shares plateaued below that, so the snap draws the post-data red hatched and labeled "fit". At year 13 red slips go gray (the new answer works on them); at year 15 two slips turn red again: qualitative staging of the first 1961 reports (s5), not a measured share.

**Human aggregation (green).** 10 loan-slip links between the four libraries. Link i arrives at L.lognormalQuantile((i + 0.5)/10, median 13, p90 69) years: 1.5, 3.4, 5.4, 7.9, 11.0, 15.3, 21.5, 31.3, 50.1, 110.7. Before arriving, a link is a dashed gray line with a slip travelling on it that breaks and restarts (attention elsewhere). By year 13 five of ten have arrived (the analog median, s5), and the chemists' volume lights: "the pieces meet", and three green volumes slide onto her desk. Links to "the world" mostly arrive after the window. The distribution is derived from dated events (p10 1.5, median 13, p90 69; p90 unverified), not measured.

**AI counterfactual (illustrative, coordination only).** Analog ai_counterfactual: aggregation median 2.5 years instead of 13, same lognormal spread (sigma = ln(69/13)/1.2816 = 1.30, so p90 = 13.3). Link quantiles: 0.29, 0.65, 1.04, 1.51, 2.12, 2.94, 4.13, 6.02, 9.64, 21.3 years. Basis: turning many hospitals' surveillance into a routed prescribing / infection-control response is analysis and communication work well inside the ~17.4 h 50% task horizon (RATES.md, METR), repeatable cheaply (RATES.md, Epoch cost trend). It does NOT assume faster chemistry: trials, manufacturing and the red's own evolution still take years. "2.5" is an assumption, so it gets no numeral on screen: it appears only as a position on the same axis. The red curve is identical in both lanes. On screen: "routed coordination", "illustrative", "coordination only".

**Numbers on screen (two):** "1946" (t0, Apr 1946, s1) and "13 years" (the new compound in use 1959, s5, 13 years after t0).

## Shot list (DUR 40.0 s)
| t | slate | camera | beat |
|---|---|---|---|
| 0.0-1.2 | SC1 OTS · COLD OPEN | zoom 6.6 over her shoulder | flash-forward to year 1.75: half the drawers red, green volume in her arms, worried face. Stamp LATER. "The answer is already here." |
| 1.2-3.6 | SC2 OTS · YEAR ZERO | zoom 6.6, locked | flash cut; year 0: a few red slips, her volume blank. "One library's records." |
| 3.6-8.4 | SC3 OTS | slow push 6.6 -> 7.2 | the race: slips go red; year 1.5 she writes it down, the volume turns green. "Red slips, drawer by drawer." / "She writes it down." |
| 8.4-11.2 | SC4 PULL OUT | 7.2 -> 1, eased, out through the building | the room becomes a window of one building; facade windows are the same 40 drawers; three more libraries across town |
| 11.2-14.6 | SC5 WIDE | hold, slight drift | loan slips reach between buildings and break. "The next answer: in pieces." / "Separate shelves. Separate buildings." |
| 14.6-16.4 | SC6 DOLLY IN | 1 -> 10 onto her face (closer than frame 1) | |
| 16.4-18.6 | SC6 CLOSER | hold | year 13: three green volumes slide in beside hers, slips go gray, "13 years."; year 15: two slips red again, she looks up. Dead stop |
| 18.6-21.0 | SC7 CARD | — | "We slowed it down so you could see it." |
| 21.0-24.2 | SC8 REVEAL | — | "Based on a true story." / "Timed from real records. 1946." |
| 24.2-31.0 | SC9 THE SNAP | two carved panels 940 px wide | freeze, silence, one hit; both lanes sweep 0-15 years in 3 s; top "as it happened", "13 years."; bottom "routed coordination", "illustrative", "coordination only" |
| 31.0-35.0 | SC10 CLOSEST | back over her shoulder, zoom 12 on face + volumes | "The pieces were already here." / "This is the bottleneck." |
| 35.0-40.0 | END | — | L.endCard, 5 s |

Zoom cycles: IN (6.6-7.2, 0-8.4) -> OUT (1, 8.4-14.6) -> IN+ (10, 14.6-18.6) -> [card, reveal, snap] -> IN++ (12, 31-35). The reading room is drawn inside building A at 1/6 scale, so the pull-out is one continuous camera move with no crossfade.

## 3D translation note
A real carved-print world: every surface is a flat relief block with visible wood grain, lit low and warm like a print under a lamp. Open on a 50 mm over-the-shoulder at seated eye height behind the librarian's cardigan, the catalog wall filling the back of the frame; red slips stand proud of the drawers like tongues of wet red ink. The pull-out is a single 3 s crane back on a slow ease through the cutaway wall of the building until it is one print-block among four on a paper street; loan slips are paper strips on wires between roofs that sag and snap. The return is a push on a 135 mm straight to her profile, closer than the open. Richer in 3D: the depth of the relief (ink sitting on the raised surfaces), the paper texture, the drawers' shadows, the green volumes' glow in a dim room.

## Copy variants
- The answer is already here.
- One library's records.
- Red slips, drawer by drawer.
- She writes it down.
- The next answer: in pieces.
- Separate shelves. Separate buildings.
- The red returns.
- Based on a true story.
- Timed from real records.
- The pieces were already here.
- (unused) Nobody checked them out together.
- (unused) Overdue by years.
- (unused) The catalog knew first.

## Diversity check
`node tools/diversity.js` -> OK: distinct enough (nearest two-days 0.67, the-cure-before-after 0.67, the-department-of-later 0.78). No changes needed.

## Preview critique and fixes
- Preview 1: the dolly-in (14.6-16.4) interpolated center and zoom linearly, so mid-move frames drifted across the facade instead of pushing into the room. Fixed with a log-zoom about the move's fixed point (camAt), used for the pull-out and push-in; now both read as one continuous move through the cutaway wall.
- Snap: the "pieces meet" label collided with "illustrative" and "fit" in the lower lane and the green curve got lost on the red; moved labels onto paper tags, gave the green curve an ink outline, moved "fit".
- Closest shot: head was cut by the card; reframed lower and set her mood to lonely for the ending.
- Wide was slightly too tight (right-hand signs cropped); eased to zoom 1.04.
- Known weak spots: the town wide is small on a phone (signs ~40 px); a ~0.1 s empty paper beat between the slow-down card and the reveal; the snap reuses the two-lane grammar of its sibling films; the dolly-in is fast (1.8 s).

## Scores
- Hook: 7 (frame 1: a worried librarian in profile, a glowing green volume, a wall of red slips, "The answer is already here.", stamped LATER)
- Speed accuracy: 8 (drawer count = logistic share with the derived 0.56-yr doubling, identical drawers on the facade at the wide, lognormal loan links, one stated log mapping, post-data red hatched "fit")
- Snap impact: 6 (freeze, hit, two carved lanes; small counterfactual not inflated, but a familiar grammar)
- Emotion: 7 (loneliness lands: one person holding the warning in a room full of red while loan slips die between buildings)
- Originality: 7 (woodblock print on paper, card catalog as the population, a town of libraries)
- Craft: 7 (clean carved look, continuous camera through a cutaway; wide is small for phones)
- Honesty: 9 (threat never named, 2.5 years shown only as position, "illustrative" and "coordination only" on screen, reveal says "timed from real records" rather than "every timing is real")
- Overall: 7.3
- Virality: 7% (a distinctive print look and a quiet, lonely character help it stand out, but the pacing is slow, the payoff is a chart, and it lacks a share-trigger beyond the "true story" reveal.)

## Render
output/the-stacks/the-stacks.mp4, ffprobe duration 40.0 s (DUR 40.0).
