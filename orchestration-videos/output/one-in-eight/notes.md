# One in Eight (slug: one-in-eight)

Tier: animatic
Slug: one-in-eight
Structure: countdown-list (research/VIRAL_STRUCTURES.md #7)
Analog: penicillin-resistance-1946 (research/analogs/penicillin-resistance-1946.json)
Medium: constructivist poster (cream / gray / black flat blocks, bold diagonals, big type; only red and green saturated)
DUR: 40 s, 1080x1920, 30 fps

## Logline
A poster wall in the style of a 1920s constructivist print. A worker's face at eye level, a green gear-piece in his raised hand, and behind him a cream disc pierced by a red wedge (a nod to the red-wedge poster). The wedge is the share of one hospital's samples the red has taken; it starts at 1 in 8. A countdown of the pieces that already existed: 3 THE WARNING, 2 THE NEW COMPOUND, then 1, in red: IT ADAPTED. The camera cranes up to reveal the crowd of piece-holders and the machine their pieces should slot into, then drops down closer, to the one who arrives too late. Zero is the snap.

## Why only a 3-2-1 (concept said "five pieces")
Director's note: countdown items must be fragments in `solution.fragments`, and verified:false items are dropped. f1 (Oxford 1940, verified:false) and f5 (WHO 2015, verified:false, source s6 verified:false) are dropped. What remains is f2 (hospital bacteriologist's surveillance warning, ready 1.5), f3 (pharmaceutical chemists' new compound, ready 13) and f4 (the counter-move, ready 15, which the file itself marks as red, "shown for pacing"). So the countdown is 3 = f2 (green), 2 = f3 (green), 1 = f4 drawn in RED (honest: it is the red's own move, not a green piece). 0 = the snap. No names on screen (no Barber, no Hammersmith, no methicillin); the threat is never named.

## On-screen numbers (two)
1. "1 in 8" = 12.5% of Hammersmith staph isolates resistant, Apr 1946 (s1, verified value). The disc is labeled "one hospital's samples" (not the world).
2. "13 years" = t0 (Apr 1946) to the new compound's clinical use (1959, s5), f3.ready_at = 13.
Not shown: 59% (verified:false in the analog), 38%, the 0.56-yr doubling, the 2.5-yr counterfactual (an assumption: no numeral). Countdown numerals 3/2/1/0 are list indices, not data.

## Time mapping (one mapping)
Race: **1 film second = 1 year, linear, while the clock runs**. The clock stops on each numbered card (stop-start pace); a screen-space year ruler (15 ticks, one per year, no numerals) shows the progress bar frozen during stops, with a pause mark.
- Run 1: film 3.0-4.5 = years 0 -> 1.5 (f2 ready).
- Stop: 4.5-6.5 (card 3).
- Run 2: film 6.5-18.0 = years 1.5 -> 13 (f3 ready).
- Stop: 18.0-20.0 (card 2).
- Run 3: film 20.0-22.0 = years 13 -> 15 (f4, counter-move).
- Stop: 22.0-24.0 (card 1).
Cold open (film 0-1.5): flash-forward to year 2.5 on the same wall (ruler shows the year-2.5 position), then cut back to year 0.
Snap: years 0-15 replayed at one uniform speed (15 years in 3 s) in both panels, same mapping in both.

## Speed math
**Threat (red wedge).** The disc is the population of samples; the wedge's angle = extent x 360 deg. extent(y) = L.logistic(y, 0.56, 0.125): doubling time 0.56 yr is DERIVED in the analog file (logistic fit through 12.5% Apr 1946 and 38% Jun 1947: r = 1.245/yr, ln2/r = 0.56 yr), s0 = 0.125 so the curve passes 1 in 8 at t = 0. Check: fit gives 0.378 at 1.17 yr (data 0.38); 0.555 at 1.75 yr (the unverified 59% report is only a check, not shown). Beyond early 1948 the curve is an extrapolation of the fit (0.95 at year 4, ~1.0 by year 13); on screen the wedge is labeled "derived fit" and "one hospital's samples".

**Human aggregation (green pieces slotting into the machine).** 13 holders; holder i's piece slots into the central gear at Q_h((i+0.5)/13) = L.lognormalQuantile(q, median 13, p90eq). The file's p90 (69 yr) rests on s6, verified:false, so the spread is set from the verified p10 instead: sigma = ln(13/1.5)/1.2816 = 1.685, equivalent p90 = 13^2/1.5 = 112.7 yr. Quantiles (yr): 0.66, 1.73, 3.00, 4.61, 6.67, 9.37, 13.00, 18.03, 25.32, 36.65, 56.26, 97.93, 256.06. The two named holders use their documented dates: the lab worker (f2) takes the q=0.115 slot at its real 1.5 (lognormal gives 1.73), the chemist (f3) the median slot at exactly 13. The chemist holds a gray blank until year 13 (the compound did not exist before). By year 15: 7 of 13 slots filled. At year 15 (f4) the chemist's slot turns red: loss as absence (green drains out).

**AI counterfactual (illustrative, labeled on screen, no numeral).** ai_counterfactual.aggregation_median = 2.5 yr (an assumption in the analog: a stewardship/routing response assembled ~1 yr after the warning, vs the ~13-yr median). Same sigma: Q_ai = Q_h x 2.5/13 = 0.13, 0.33, 0.58, 0.89, 1.28, 1.80, 2.50, 3.47, 4.87, 7.05, 10.82, 18.83, 49.24. By year 15: 11 of 13. Basis (analog file + RATES.md): turning surveillance data from many hospitals into routed policy is analysis and communication work well inside the ~17.4 h 50% METR task horizon, and cheap to repeat (Epoch AI: ~40x/yr cost fall at fixed capability). It does NOT assume a faster compound: design can be days (RATES.md science example) but trials and manufacturing still take years. The red wedge is IDENTICAL in both panels: the counterfactual does not claim the red is stopped, only that the pieces meet sooner. People still decide and deploy.

Snap ratio (notes only): 13 yr vs 2.5 yr median, ~5x.

## Shot list (L.camera keyframes [x, y, zoom, rot], eased)
| t | shot | camera | slate |
|---|---|---|---|
| 0.0-1.5 | COLD OPEN, year 2.5: lab worker's poster face, green piece raised, wedge at ~3/4 behind him. "It started at 1 in 8." | CLOSE eye level, z 2.6, rot -0.10 | SC1 CLOSE (FLASH-FORWARD) |
| 1.5-3.0 | Cut to year 0 (flash). "The answer existed. In pieces." | CLOSE | SC2 CLOSE |
| 3.0-6.5 | Clock runs 0-1.5; lab's piece slots in. Card 3 THE WARNING (stop) | CLOSE, slow push z 2.6 -> 2.8 | SC2 CLOSE |
| 6.5-10.0 | CRANE UP: from face to the whole poster wall: disc + wedge, gear machine, 13 holders, gray guide beams | z 2.8 -> 1.0, rot -0.10 -> 0 | SC3 CRANE UP |
| 10.0-15.5 | WIDE: wedge swells to nearly full; pieces slot in one by one at lognormal times. "Every piece in a different hand." / "Nobody routing them together." | WIDE hold | SC3 WIDE |
| 15.5-18.0 | DROP DOWN to the chemist, closer than shot 1; his blank lights green at year 13 | z 1.0 -> 3.6, rot 0 -> +0.08 | SC4 DROP DOWN |
| 18.0-24.0 | Card 2 THE NEW COMPOUND + "13 years"; run to 15; card 1 IT ADAPTED (red), his slot drains red | push z 3.6 -> 4.3 | SC4 CLOSE |
| 24.0-26.4 | Dead stop, silence. "We slowed it down so you could see it." | CLOSE hold z 4.3 | SC4 CLOSE (STOP) |
| 26.4-33.4 | 0 (freeze, one hit). Two stacked 920-px panels: "as it happened" and "routed sooner / illustrative". Years 0-15 in 3 s each: top alone, then both together | flat SPLIT | SC5 SNAP |
| 33.4-35.8 | "This is the bottleneck." over the wall at extreme close on the lab worker's hand/piece (closest of all, z 5) | DROP IN | SC6 EXTREME CLOSE |
| 35.8-40.0 | L.endCard (4.2 s) | - | - |

Zoom cycles: IN 0-6.5 (z 2.6-2.8) -> OUT 6.5-15.5 (z 1.0) -> IN+ 15.5-26.4 (z 3.6-4.3) -> (snap, flat) -> IN++ 33.4-35.8 (z 5).

## 3D translation note
A real wall of layered printed posters, shot like a documentary crane in a vast hall. Shot 1: 50 mm at eye height on one printed worker's face, shallow depth of field, the red wedge out of focus behind him. Crane up: 3-4 s, the camera rising 6-8 m on a jib and tilting down, lens widening to 24 mm; the wall reveals itself as a mural the size of a building, the disc a sun, the gear a real iron machine with 13 sockets, beams as steel girders that extend when a piece connects. Drop down: fast, 2.5 s, landing lower and closer than before (85 mm) on the chemist. Paper texture, halftone, misregistered print layers get rich in 3D; the red wedge should read as a physical slab pushing through the disc.

## Copy variants
- Hook: "It started at 1 in 8." / "1 in 8. Then it doubled." / "The answer existed. In pieces."
- Cards: "3 THE WARNING", "2 THE NEW COMPOUND", "1 IT ADAPTED."
- Wide: "Every piece in a different hand." / "Nobody routing them together." / "The machine had empty sockets."
- Snap: "as it happened" / "routed sooner - illustrative" / "Same pieces. Routed sooner."
- Close: "This is the bottleneck."

## Tags
structure countdown-list, medium constructivist poster, family machine, scale history, pace stop-start, camera crane up and drop down, emotion resolve, protagonist a crowd, analog penicillin-resistance-1946.
Diversity check: OK (nearest the-relay / ghost-rewind-covid at 0.56).
