# The Cure, Before and After

Tier: animatic
Slug: the-cure-before-after
Structure: before-after (research/VIRAL_STRUCTURES.md #11)
Analog: penicillin-resistance-1946
Tags: medium stick-figure animatic · family myth/ritual · scale history · pace slow build · camera locked-off close-up with a single pull-out · emotion awe · protagonist a green fragment

## Logline
BEFORE: the moment a miracle answer arrives. A stick-figure crowd dances in a ring of forty stones around one green vial, held high by one figure like a relic. Five of the stones are already red: one in eight already knows the answer. AFTER: the same frame, years later. The stones go red one by one while the ritual goes on and the vial's glow thins (its glow = the share of stones it still works on). One pull-out reveals the whole storyboard sheet: a frozen BEFORE column beside a live AFTER column, four groups in four panels (the ward, a hospital lab with a warning, biochemists, chemists), each holding a green fragment of the next answer, reaching across panel borders and breaking. Thirteen years in, the pieces meet and a new vial arrives; two years later two stones turn red again. The snap: the same record at true speed beside routed coordination (illustrative, coordination only).

Never named: no "bacteria", "antibiotic", "penicillin", "drug", "resistance" on screen. It is only the red. The-mold-strikes-back used this analog as an x-ray nature doc about the red; this one is about the ritual of the cure and the passage of time.

## Time mapping (one stated mapping for the race)
The BEFORE close (t 1.2-4.8) is frozen at year 0 (April 1946). The AFTER race runs film t = 4.8 s to 18.8 s over analog years 0 to 15 (Apr 1946 to the 1961 counter-move) on a **log time scale**:
film_t = 4.8 + L.mapTime(year, 15, 14, 'log') = 4.8 + 14 * log10(1 + year) / log10(16).
Placements: year 1.17 (Jun 1947) t 8.71; year 1.5 (the warning) t 9.43; year 1.75 t 9.91; year 2.5 (AI counterfactual median) t 11.13; year 5 t 13.85; year 13 (new answer, 1959) t 18.13; year 15 (red adapts, 1961) t 18.80. The log scale is why the pace is a slow build: the first months crawl, the long wait flies. Hand-lettered "log time" note on the wide.
Cold open (t 0-1.2) is a flash-forward to year 1.75 on the same curve, tagged AFTER.

Snap: both lanes at **true proportional (linear) speed**, 0 to 15 years in 3.0 s (1 s = 5 years).

## Speed math
**Threat (red).** L.logistic(year, 0.56, s0 = 0.125) from the analog's doubling_time. The 0.56-year doubling time is **derived, not published**: the analog fits a logistic through 12.5% (Apr 1946, s1) and 38% (Jun 1947, s1): r = 1.245/yr, ln2/r = 0.56 yr. Check: fit gives 0.378 at year 1.17 and 0.555 at 1.75 (59% reported in 1948, month unverified). The ring holds 40 stones = 40 samples; stone i has a fixed threshold q_i = (i + 0.5)/40, shuffled by L.rng at setup; a stone is red when the logistic share exceeds its threshold, so the red count is the share (5 of 40 = 1 in 8 at year 0; 15 at 1.17; 22 at 1.75). One hospital's samples, not the world (sub-label on screen). The logistic runs toward 100%; real hospital shares plateaued below that, so after ~year 3 the count is model extrapolation (the snap graph draws the post-data part hatched and labeled "fit"). At year 13 the new vial arrives and red stones go gray (the new answer works on them); at year 15 two stones turn red again: qualitative staging of the first 1961 reports (s5), not a measured share.
The vial's glow = 1 - share (the fraction of stones the old answer still works on).

**Human aggregation (green).** 10 links between the four groups' fragments (ward f-none/the vial, hospital lab f2 lit at year 1.5, biochemists f1 lit from the start because the enzyme was known in 1940 [f1 unverified in the analog; no number shown], chemists f3 lit at year 13). Link i connects at L.lognormalQuantile((i + 0.5)/10, median 13, p90 69) years: 1.5, 3.4, 5.4, 7.9, 11.0, 15.3, 21.5, 31.3, 50.1, 110.7. Before connecting, each link flickers as a dashed reach that breaks. By year 13 half are in (the analog's median, methicillin 1959, s5); at year 13 the four panels flash together ("the pieces meet") and the new vial arrives in the ward. The distribution is derived from dated events (p10 1.5, median 13, p90 69; p90 unverified), not measured; the fitted p10 is 2.4 vs documented 1.5.

**AI counterfactual (illustrative, coordination only).** Analog ai_counterfactual: aggregation median 2.5 years instead of 13, same lognormal spread (sigma = ln(69/13)/1.2816 = 1.30, so p90 = 13.3). Link quantiles: 0.29, 0.65, 1.04, 1.51, 2.12, 2.94, 4.13, 6.02, 9.64, 21.3 years. Basis: turning many hospitals' surveillance into a routed prescribing / infection-control response is analysis and communication work well inside the ~17.4 h 50% task horizon (RATES.md, METR), repeatable cheaply (RATES.md, Epoch cost trend). It does NOT assume faster chemistry: trials, manufacturing, and the red's own evolution still take years. The concept's snap string "13 vs 2.5 yr" is shown as positions on the same axis; "2.5" is an assumption, so it gets no numeral on screen. The red curve is identical in both lanes.

**Numbers on screen (two):** "one in eight" (12.5%, Apr 1946, s1) and "13 years" (methicillin in use 1959, s5, 13 years after t0).

## Shot list (DUR 39.5 s)
| t | slate | camera | beat |
|---|---|---|---|
| 0.0-1.2 | SC1 CLOSE · COLD OPEN | locked zoom 4.6 on the AFTER ward panel, one face + vial | flash-forward to year 1.75: half the stones red, vial dim, face sad. Tag AFTER. "Watch the red learn." |
| 1.2-4.8 | SC2 CLOSE · BEFORE | locked zoom 4.6 on the BEFORE panel (same framing) | flash cut; year 0: the vial held high, the ring dancing. "An answer arrives." / "One in eight already knows." |
| 4.8-9.0 | SC3 CLOSE · AFTER | locked (full-frame dissolve from BEFORE, same frame) | the race starts; stones turn red; dancing slows to glazed. "Same frame. Years later." / "The red is learning." |
| 9.0-12.0 | SC4 THE PULL-OUT | single pull-out, zoom 4.6 -> 1, 3 s, eased | the panel becomes one cell of a storyboard sheet: BEFORE column frozen, AFTER column live, four groups |
| 12.0-16.6 | SC5 WIDE | hold | links reach across panel borders and break. "The next answer: in pieces." / "Held apart for years." |
| 16.6-18.1 | SC6 DOLLY IN | zoom 1 -> 6 onto the AFTER ward face (closer than frame 1) | |
| 18.1-20.6 | SC6 CLOSER | hold | year 13: new vial, stones gray, "13 years."; year 15: two stones red. "The red learns again." Dead stop, silence |
| 20.6-23.0 | SC7 CARD | — | "We slowed it down so you could see it." |
| 23.0-30.0 | SC8 THE SNAP | two lanes 940 px wide | freeze, silence, one hit at 23.6; both lanes sweep 0-15 years in 3 s; "13 years." over the top lane; bottom lane "routed coordination", "illustrative", "coordination only" |
| 30.0-34.0 | SC9 CLOSEST | full-frame fade back in, zoom 8 on face + vial | "The pieces were already here." / "This is the bottleneck." |
| 34.0-39.5 | END | — | L.endCard, 5.5 s |

Zoom cycle: IN (4.6, 0-9.0) -> OUT (1, 9.0-16.6) -> IN+ (6, 16.6-20.6) -> [snap insert] -> IN++ (8, 30-34). One pull-out only, per the assigned camera.

## 3D translation note
A real storyboard wall: two columns of lit panels, each a miniature stage set. Open on an 85 mm locked-off close of one chalk-white stick figure (flat-shaded, line-boil kept as a stepped shader) lifting a glass vial that is the only green light in the room; the ring of 40 flat stones around the crowd glows red from inside, one by one. The dissolve BEFORE->AFTER is a match-cut on a locked tripod. The single pull-out is a 3 s dolly back on a slow ease until the panel is one cell among eight on the wall, green threads strung between cells like string on a detective board, snapping. Return is a push straight into the AFTER panel on a 135 mm, closer than the open. The snap is two lanes projected on the wall. Richer in 3D: volumetric glow from the vial, the stones as a real stone circle, the paper texture of the panels, the depth between panels.

## Copy variants
- Watch the red learn.
- An answer arrives.
- One in eight already knows.
- Same frame. Years later.
- The red is learning.
- The next answer: in pieces.
- Held apart for years.
- The red learns again.
- The pieces were already here.
- (unused) Every miracle has a clock.
- (unused) We kept dancing.

## Diversity check
`node tools/diversity.js` -> OK: distinct enough (nearest two-days 0.67, the-mold-strikes-back 0.67). No changes needed.

## Preview critique and fixes
- Preview 1: world-space headers ("BEFORE"/"AFTER", "log time"), row labels, and the green link lines were magnified 4.6x in the close shots, colliding with the cards and slashing through the face. Fixed by fading world text and links with zoom (visible only below zoom ~2). Preview 2 clean.
- Known weak spots: the two re-red stones at year 15 are mostly off-frame in the closest shot; row labels on the wide are small (30 px) for a phone; the snap reuses the-mold-strikes-back's two-lane grammar.

## Render
output/the-cure-before-after/the-cure-before-after.mp4, ffprobe duration 39.5 s (DUR 39.5).

## Scores
- Hook: 7 (frame 1: a sad face, a dimming green vial, a ring of red stones, "Watch the red learn.")
- Speed accuracy: 8 (logistic with the derived 0.56-yr doubling time, stone count = share, lognormal links, one stated log mapping; post-data red labeled "fit")
- Snap impact: 6 (freeze + hit + two lanes; small counterfactual not inflated, but the grammar is familiar)
- Emotion: 7 (the ritual that keeps dancing while the vial dims reads as awe turning to unease)
- Originality: 7 (BEFORE/AFTER as a literal storyboard sheet with a frozen column beside a live one)
- Craft: 6 (rough animatic, legible; wide-shot labels small)
- Honesty: 9 (threat never named, two sourced numbers, illustrative + coordination-only labels, fit marked)
Overall: 7.1
Virality: 6% - a grave, slow-build stick-figure piece with a clever before/after sheet but no trending hook or outrage; small-account odds sit in single digits.
