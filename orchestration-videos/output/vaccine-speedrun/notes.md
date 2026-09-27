# Any Percent

Tier: animatic
Slug: vaccine-speedrun (internal only; nothing on screen names the threat or the product)
Structure: `game-hud-run` (research/VIRAL_STRUCTURES.md #10)
Analog: `covid-2020`
Medium: neon arcade (near-black background, glowing white/gray vector lines, faint scanlines; only red and green saturated)

## Logline
An Any% speedrun with a split timer. Split 1, DESIGN, is world-record fast: the answer is designed 2 days after the recipe arrives. Then the level turns into an escort mission to 217 countries, and the escort splits are the slowest in the run. The camera starts on one player's face lit by the screen, cranes up to the whole world-map level, then drops back down, closer, into a crowd at the far end that is still waiting.

## Time mapping (stated, labeled compression)
Day 0 = 2019-12-31 (analog t0). One piecewise-linear mapping, shown on the HUD as a speed badge (words and chevrons, no digits):
- **Normal speed, t = 2.2 to 5.2 s: 1 s = 2 days.** day(t) = 9 + 2 (t - 2.2). Covers days 9 to 15 (recipe shared day 11 at t = 3.2 s; design finalized day 13 at t = 4.2 s).
- **FAST-FORWARD, t = 5.2 to 17.3 s: 1 s = 40 days.** day(t) = 15 + 40 (t - 5.2). Covers days 15 to 499.
- Cold open (0 to 2.2 s) is a flash-forward to day 421 (the median country's first dose), then a REWIND glitch.
- Snap: a separate, labeled true-proportion axis, day 0 to 520 across 860 px, swept in 2.2 s per panel (1 s = 236 days). On that axis the 2-day design split is a 3 px sliver, which is the point.

## Speed math
**Threat (red).** The analog's sourced weekly points (s1: extent = share of 234 countries/territories with a confirmed case) are dense enough to interpolate piecewise-linearly between them (they are data, not two endpoints): 0.9% day 5, 3% day 19, 10.3% day 33, 25.6% day 61, 64.1% day 75, 87.6% day 96, 90.6% day 124, 93.6% day 369. Each of the 217 country nodes gets a rank (i + 0.5)/217 in order of distance from the red origin (plus seeded jitter); a node turns red when extent(day) ≥ rank, so the red share of nodes equals the data at every zoom. HUD "RED ZONE" is a bar of the same extent (no numeral). Red crosses most of the map during the crane up (t 5.3 to 7.2 s).

**Green fragments (from the analog).**
| fragment | ready_at (day) | film t | on screen |
|---|---|---|---|
| f1 spike design from earlier work | -900 (unverified) | held from frame 1 | faint green shard already in the player's hands; no number |
| f2 mRNA platform | 0 | held | second shard |
| f3 recipe (genome) shared | 11 | 3.2 s | green shard flies in to the player |
| f4 design finalized | 13 | 4.2 s | shards snap together; split DESIGN = "2 DAYS", badge "WR" (number #1, verified, RATES.md s4) |
| f5 first trial dose | 76 | 6.7 s | TRIALS bar tick |
| f6 first authorization | 337 | 13.25 s | APPROVAL bar completes |
| f7 first dose outside trials | 343 | 13.4 s | first escorts depart |

**Human aggregation (the escort).** 217 country nodes (= the 217 countries/territories in the analog's s2 computation). Stratified quantiles q = (i + 0.5)/217, shuffled with L.rng(7). Arrival day = max(339, L.lognormalQuantile(q, 421, 490)). sigma = ln(490/421)/1.2816 = 0.1184, which gives p10 = 362, matching the file's measured p10 of 363, so the lognormal fits all three sourced quantiles. The floor of 339 is the earliest real first dose in the file (Dec 4 2020); about 7 nodes sit on it. The crowd's node (far end of the map, farthest escort route) is given the quantile 201.5/217 = 0.929, arrival day ~500, so at the freeze (day 499) it is still waiting. Each escort payload travels its route over the 30 days before its arrival. Arrivals bunch around day 421 (t = 15.35 s), so the pip bar fills fastest during the drop-down: the pace accelerates on data, not on animation.

**AI-routed counterfactual (illustrative).** ai_counterfactual.aggregation_median = 363 (analog). Same quantiles, same sigma: arrival = max(339, L.lognormalQuantile(q, 363, 363 x 490/421 = 422.5)). About 28% of nodes sit on the 339 floor (nothing ships before it is approved and made). Median 363 = 58 days sooner for the median country; the crowd's node moves from ~500 to ~432. Basis (from the analog): design was already fast (2 days, RATES.md Science example), trials and manufacturing are bounded by biology and factories and are left unchanged; the counterfactual only assumes better coordination lets the median country get first doses as early as the fastest tenth actually did. It does not assume more supply. Labeled "ROUTED (ILLUSTRATIVE)" at 48 px. The gain is modest and the film stages it (freeze, silence, one hit, two full-width timelines) rather than inflating it.

**Numbers on screen (2):** "2 DAYS" (design split, s4) and "DAY 421" (median country's first dose, s2). 217 appears only as 217 pips and 217 map nodes, never as a numeral. The run timer is a dial, trials/approval are bars, the speed badge uses chevrons. Slates carry shot numbers (production marks only).

## Shot list and camera
| t (s) | shot | camera | beat |
|---|---|---|---|
| 0.0-2.2 | SC1 CLOSE, cold open DAY 421 | locked close on the player's face (zoom 45 on the player node), red light everywhere | Face lit red, green token in hand, HUD timer reads DAY 421, split list: DESIGN 2 DAYS WR / ESCORT pips half full. Card "Fastest split. Slowest run." REWIND glitch 1.8-2.2 |
| 2.2-5.2 | SC2 CLOSE, run start | slow push 45 → 52 | Day 9 → 15 at normal speed. Recipe shard arrives (3.2), design snaps (4.2), split flashes "2 DAYS WR". Card "Designed in two days." |
| 5.2-8.8 | SC3 CRANE UP | log zoom 52 → 1.0, framing drifts from the face to map centre | FAST-FORWARD badge. The player shrinks to a node; red floods the world map at data speed. Card "Then: the escort mission." |
| 8.8-14.0 | SC3 WIDE, hold | zoom 1.0 → 1.06 drift | 217 nodes, red nearly everywhere; TRIALS/APPROVAL bars fill; first escorts leave at day 343. Cards "The red took weeks." / "Trials take what they take." / "Then: country by country." |
| 14.0-16.2 | SC4 DROP DOWN | log zoom 1.06 → 34 onto the far node | Escorts arriving fastest (median day 421 at 15.35 s). |
| 16.2-17.3 | SC4 CLOSE, crowd | push 34 → 44 | Crowd at the far node, faces lit red, looking up; a green payload still on its way. Card "Still waiting." |
| 17.3-19.3 | SC5 FREEZE | frozen, dimmed | "We slowed it down / so you could see it." |
| 19.3-27.5 | SC6 SNAP, flat | locked | Black, silence, one hit. Panel A "AS IT HAPPENED" swept at true proportions; DAY 421 marker. Panel B "ROUTED (ILLUSTRATIVE)" swept; marker 58 days earlier, ghost of the old marker. Caption "Same design. Same factories. Better routing." |
| 27.5-31.8 | SC7 EXTREME CLOSE (IN++) | zoom 70 on the front figure of the same crowd, slow push | Routed version: the payload arrives, hands pass the green along, faces lit green. "People still carry it." / "This is the bottleneck." |
| 31.8-35.5 | END | card | L.endCard "The bottleneck is us." held 3.7 s |

**Zoom cycles:** OUT 5.2-8.8 (face → world), IN 14.0-17.3 (world → crowd, closer than the opening: 44 on a figure ~7 units tall vs 45 on a face 18 units wide), IN++ 27.5-31.8 (70 on one crowd face).

## 3D translation note
- Opening: 50 mm, eye level, 40 cm from a face lit only by a monitor; the reflections of red and green move in the eyes. The world map is a real neon wireframe globe-table under the player's desk.
- Crane up: a single continuous jib/drone rise from the face through the ceiling to 2 km, then orbit-free straight up to a top-down of a vector world map; 3.5 s, ease in and out, the player's desk becoming one glowing node.
- Drop down: a fast descent (1.5 s) onto the farthest node, decelerating hard into a street-level crowd at 35 mm, faces uplit red from a floor-level map; hold. IN++ is 85 mm on one face.
- Richer in 3D: escort payloads as light-trails arcing over a globe, real volumetric glow, crowds of ~200 low-poly figures at the far node, parallax on the HUD glass.

## Copy variants
- "Fastest split. Slowest run."
- "Designed in two days."
- "Then: the escort mission."
- "Trials take what they take."
- "Then: country by country."
- "Still waiting."
- "Same design. Same factories. Better routing."
- "People still carry it."
- Alt: "World record. Then the queue." / "The fix shipped. The route didn't." / "Civilization has lag."

## Tags
{"structure":"game-hud-run","medium":"neon arcade","family":"game","scale":"multi-scale zoom","pace":"accelerating","emotion":"resolve","protagonist":"a crowd","camera":"crane up and drop down","analog":"covid-2020"}
Diversity check: OK, distinct enough (nearest fifty-nine-days / ghost-rewind-covid / seventeen-days at 0.67).
