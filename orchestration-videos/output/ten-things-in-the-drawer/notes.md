# Three Things We Already Had (slug: ten-things-in-the-drawer)

Tier: animatic
Slug: ten-things-in-the-drawer
Structure: countdown-list (research/VIRAL_STRUCTURES.md #7)
Analog: gfc-2008 (research/analogs/gfc-2008.json)
DUR: 36 s, 1080x1920, 30 fps

## Logline
Close on one hand at an embroidery hoop, a green needle between finger and thumb. On gray linen the hoop is a stitched map of an economy: houses, factories, and five small bank buildings, each with a green French knot. A countdown, embroidered in green, lists what was already in the drawer: 3 central banks, 2 swap lines, 1 coordinated liquidity. The needle works in bursts and waits. A red thread, couched onto the linen at the pace of the market's monthly fall, drifts for a year, then jumps, crosses the whole hoop and runs off its edge. One pull-out shows the whole map; the camera comes back in closer to the hand, holding still. Zero is the snap.

## Why only three items (concept said "ten things")
Director's note: the countdown items must be fragments in `solution.fragments`, and verified:false items stay off screen. In gfc-2008.json only **f2** is verified (f1 and f3-f7 are verified:false). So the list is built only from f2's own wording: who = "central banks" (3), had = "coordinated liquidity (... swap lines)" (2 and 1). The facility's proper name and the bank names are not shown (no real institution names). The slug stays; the on-screen title is "3 things we already had". f1, f3-f7 are not drawn or named.

## On-screen numbers
None of the data numbers. Countdown numerals 3/2/1/0 are list indices, not data. Day 426 and day 220 (from the concept's snap line) are NOT shown: 426 is the Oct 8 2008 date, verified:false in the analog; 220 is the counterfactual. Time is shown as a stitched calendar: one cross-stitch per 30 days.

## Time mapping (one mapping)
Race: **1 film second = 40 days, linear**, t0 = Aug 9 2007 (analog t0) at film t = 1.5 s. day(t) = 40 (t - 1.5). Day 584 (Mar 2009 monthly-average trough, last threat point) is reached at t = 16.1 s.
Cold open (t 0-1.4): the same timeline shown at day 433 (Oct 2008 point), clearly the same hoop, then a cut back to day 0.
Snap: the same days 0-584 replayed at one uniform speed (584 days in 1.6 s, then both panels in 2.4 s), identical mapping in both panels.

## Speed math
**Threat (red thread).** extent(day) = piecewise-linear interpolation of `threat.points` (share of the peak-to-trough fall in the monthly-average S&P 500; extent 0 until day 67). The red thread follows one fixed path across the hoop; drawn length = extent(day) x path length. The path is laid so extent 0.9 reaches the hoop rim and extent 1.0 hangs off the edge ("runs off the hoop"). The stop-start pace is the data's own: 403 days of drift to 0.41, then 0.41 -> 0.73 in the month after day 403 (film t 11.58 -> 12.33). Houses the thread passes lose their gray stitches (loss as absence only). This data is monthly-point interpolation (the analog sources every month), not a fit, so no logistic was needed.

**Human aggregation (green running stitches).** 8 links join the five bank knots to the rest of the map. Link i finishes on day Q_h((i+0.5)/8) with Q_h = L.lognormalQuantile(q, median 426, p90 1077) (sigma = ln(1077/426)/1.2816 = 0.724):
140, 224, 299, 380, 477, 607, 810, 1293 days.
The needle stitches each link during the 25 days before it finishes and sits still otherwise (stop-start). By day 584 five of eight links are done; three stay as faint pencil pattern lines. The swap-line ring between the five banks (f2, verified) is stitched by day 125 (ready_at). Q_h(0.0625) = 140 lands 15 days after f2's real ready_at of 125: the lognormal p10 of the file is itself f2.

**AI counterfactual (illustrative, labeled on screen).** `ai_counterfactual.aggregation_median` = 220 (vs 426). Same sigma: Q_ai = Q_h x 220/426 = 72, 116, 154, 196, 247, 313, 418, 668 days. By day 584, 7 of 8 links. The red thread is identical in both panels: the counterfactual does not claim the fall is avoided. Basis (from the analog file): the missing piece was a shared map of exposures sitting in separate institutions' books; assembling it is document-heavy expert work inside the ~17.4 h 50% METR task horizon (RATES.md) per institution, and the ~40x/yr fall in AI cost at fixed capability makes running it across thousands of books cheap. People still decide and deploy; laws still take human time. Calendar marks: the median link (the file's median, the coordinated response) is marked with a green knot on the stitched calendar at month 426/30 = 14.2 (human) vs 220/30 = 7.3 (AI). No day numbers on screen.

## Shot list and camera (one world camera, L.camera keyframes, eased)
| t | shot | camera | slate |
|---|---|---|---|
| 0.0-1.4 | Cold open, day 433: hand with green needle, red thread lying right across the linen by the fingers. Card "3 things we already had" | CLOSE, locked-off (z 3.0) | SC1 CLOSE (FLASH-FORWARD) |
| 1.4-6.4 | Cut back to day 0. Countdown cards: "3 central banks" (knots glow), "2 swap lines" (needle stitches the ring, done day 125), "1 coordinated liquidity" (first link, day 140) | CLOSE locked-off, z 3.0 | SC2 CLOSE |
| 6.4-9.6 | The single pull-out: hand shrinks, the whole hoop becomes a map of an economy on a wooden drawer | PULL OUT z 3.0 -> 1.0 | SC3 PULL OUT |
| 9.6-13.8 | Wide: red drift, then the jump at 11.58-12.33 (needle frozen). "Every piece already stitched." / "Nobody tied them together." | WIDE locked | SC3 WIDE |
| 13.8-16.1 | Back in, closer than SC2: the hand still, red thread across the knuckles | DOLLY IN z 1 -> 4.2 | SC4 DOLLY IN |
| 16.1-19.8 | Dead stop, silence; "We slowed it down / so you could see it." | CLOSE hold | SC4 CLOSE |
| 19.8-28.4 | "0". Black, one hit. Top panel "as it happened" replays 0-584 at true proportion; then both panels replay side by side, bottom "found sooner" + "illustrative" (52 px). Stitched calendar with the median knot. "Same pieces. Found sooner." | FLAT SPLIT | SC5 SNAP |
| 28.4-32.0 | Extreme close on the hand and the slack green thread, three unstitched pattern lines. "This is the bottleneck." | EXTREME CLOSE z 5.2 | SC6 EXTREME CLOSE |
| 32.0-36.0 | End card, 4 s | - | - |
Zoom cycles: IN (0-6.4) -> OUT (6.4-9.6, hold to 13.8) -> IN+ (13.8-19.8, z 4.2 vs 3.0) ; split -> IN++ (28.4-32, z 5.2).

## 3D translation note
- SC1/2: 100 mm macro, locked on a tripod over a real linen hoop, soft window light from the left; fibers of the gray thread readable, the green thread slightly glossy. The hand is lit warm but desaturated; only the two threads carry color.
- SC3: one slow 3 s crane straight up (ceiling-mounted), revealing the hoop sitting in an open wooden drawer; the stitched map reads like a town from a plane. Red thread casts a tiny shadow.
- SC4/6: return on a slider, lower and tighter than the start (macro 1:1 at the end), shallow depth of field; the red thread passes in soft focus across the knuckles.
- Snap: two hoops side by side on the same table, top light, the camera static; threads drawn by motion-control.
Richer in 3D: real thread sheen, fabric puckering where the red pulls tight, the needle's glint, the drawer's grain.

## Copy variants (logged)
- "3 things we already had" (hook) / "It was in the drawer." / "Every piece already stitched." / "Nobody tied them together." / "Same pieces. Found sooner." / "The thread was never the problem." / "This is the bottleneck."

## Tags
{"structure":"countdown-list","medium":"embroidery","family":"market","scale":"economy","pace":"stop-start","emotion":"tenderness","protagonist":"a green fragment","camera":"locked-off close-up with a single pull-out","analog":"gfc-2008"}
Diversity check: OK: distinct enough (nearest the-last-thirteen-days and the-department-of-later at 0.78).

## Build log
- Resumed after a usage-limit cutoff; scene was complete on disk. Preview contact sheet checked: frame 1 has red, green, hand, one line; pull-out and dolly-in read; snap panels 920 px wide, labels 46/52 px; end card held 4 s. No fixes needed. Full render 36.0 s (ffprobe).
- Honesty check: no numerals besides countdown indices 3/2/1/0; day 426 not shown as a number (only the median link's month position on the stitched calendar, which is the speed math itself); no institution names; only f2 wording on screen.

## Scores
Hook: 6
Speed accuracy: 8
Snap impact: 5
Emotion: 6
Originality: 8
Craft: 6
Honesty: 9
Overall: 6.9
Virality: 4% — a lovely, quiet embroidery idea but the "3 things" countdown resolves to abstract finance words and the snap panels are small and busy on a phone, so it is unlikely to hold a scrolling audience.
