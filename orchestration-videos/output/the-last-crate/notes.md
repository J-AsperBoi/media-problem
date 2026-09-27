Tier: animatic

# The Last Crate

**Logline.** Handheld chase behind one courier carrying a green crate to the last village on the list. A ticking clock counts the days. The answer was designed in 2 days; the crate is real, the road is real; the paperwork at every border is the clock.

**Structure template:** `ticking-clock` (research/VIRAL_STRUCTURES.md #1)
**Analog:** `covid-2020` (research/analogs/covid-2020.json)
**DUR:** 38 s, 1080x1920, 30 fps. Scene: scenes/the-last-crate.js

## Time mapping (one mapping)
- Clock = days since t0 (2019-12-31, first WHO notification), shown as "DAY N".
- Cold open (0-1.8 s) is a labeled flash-forward: the same clock frozen at DAY 490, at the village gate.
- Race: from t = 1.8 s, **day = 13 + 28 x (t - 1.8)** (linear, 1 s = 4 weeks), starting at day 13 (vaccine sequence finalized, "2 days" after the genome was shared on day 11). The clock reaches day 490 at t = 18.84 s and stops.
- Snap (true proportion, flat): both panels run the same 0-490 day span at a linear 190 days/s.

## Speed math
**Threat (red).** Analog `threat.points` (share of 234 countries with >= 1 confirmed case; OWID/WHO), linearly interpolated between the dated points (the points are dense, weekly around the take-off, so this is the data's own curve, not a straight line between endpoints). Used twice:
- Chase shot: the hills ahead are 28 carved ridge segments ranked far-to-near; a segment turns red when extent(day) >= (rank + 0.5)/28. By day 96 (t = 4.8 s) 88% of the hills are red.
- Map and snap: 60 country nodes ranked by distance from the origin plus jitter; node turns red on the first day extent >= (rank + 0.5)/60.

**Human aggregation (green).** Fragment days from the analog: sequence finalized day 13 (s4), first trial dose day 76 (s4), first authorization day 337 (s5), first dose outside trials day 343 (s5). Per country: arrival = max(343, L.lognormalQuantile(q, 421, 490)), q = (i + 0.5)/60 shuffled. The courier's village is forced to q = 0.90 -> **day 490.0** (the p90 tail; the real p90 is 2021-05-04). On the map, crates wait at the central "approval" gate until day 343, then walk their road tree, waiting ~70% of each hop at a border gate and moving the other 30%, so each crate arrives on its own lognormal day.

**AI counterfactual (illustrative).** Analog `ai_counterfactual`: median 363 (the real p10), same spread (sigma = ln(490/421)/1.2816 = 0.118), so AI p90 = 363 x 490/421 = 422.5. Same quantile for the village -> **day ~422**, 68 days sooner. Supply is unchanged: the same crates, the same first-dose floor (day 343); only routing is faster. Basis: design was already fast (2 days, RATES.md "Science example"); the spread is in distribution (RATES.md "Vaccine distribution inequity", advocacy analysis). Labeled "illustrative" on screen at 44 px+.

## Numbers on screen (two)
1. "2 days" (design: sequence shared Jan 11 2020, finalized Jan 13 2020; RATES.md / analog s4, verified).
2. The DAY clock (the running mapped time; it stops at DAY 490 for this village; analog aggregation p90, s2, verified). In the snap the same clock runs once more (shared by both panels); the routed village lights as it passes ~422, no separate figure is printed.

## Shot list and camera
| t | shot | camera | what |
|---|---|---|---|
| 0.0-1.8 | SC1 COLD OPEN | CLOSE handheld behind courier | Flash-forward: DAY 490 clock, red over every hill, village gate ahead, green crate glowing on his back. "Designed in 2 days." |
| 1.8-6.0 | SC2 CHASE | CLOSE handheld chase, slight push | Clock rewinds to DAY 13 and runs. Red floods the hills ahead at data speed. "trials" gate at day 76 (stamp). "Then came the road." |
| 6.0-8.0 | SC3a CRANE UP | camera tilts up/pulls out, full-frame crossfade to top-down map | |
| 8.0-15.0 | SC3b WIDE MAP | slow drift, hold | Whole map: carved roads and borders, red on ~90% of nodes, every green crate stalled at the "approval" gate; day 343 they release and stall at each border. "The red needed no papers." / "Every border, a stamp." |
| 15.0-19.0 | SC4 DOLLY IN | map pushes down to the courier's road, crossfade to village gate, closer than SC2 | Two border stamps, then the village gate. Clock stops at DAY 490 (t 18.84). Empty chairs in the square. |
| 19.0-21.2 | SC4 HOLD | locked | Dead stop, silence. "Some chairs were already empty." |
| 21.2-23.4 | SLOW | hold, paper wash | "We slowed it down so you could see it." |
| 23.4-30.0 | SNAP / OUT | WIDE flat, two 900 px panels | "As it happened" runs 0-490 alone (hit), then both panels together: "Routed" (illustrative) - the village lights ~68 days sooner. "Same crates. Better routes." |
| 30.0-33.8 | IN++ | EXTREME CLOSE, dolly in | Hands on the green crate at the village gate, empty chair behind. "This is the bottleneck." |
| 33.8-38.0 | END | L.endCard ("The bottleneck is us."), 4.2 s | |

**Zoom cycles.** Cycle 1: IN (0-6) -> OUT (6-15, crane to map) -> IN+ (15-21, village gate, closer). Cycle 2: OUT (23.4-30, snap) -> IN++ (30-33.8, hands on crate).

## 3D translation note
- Chase: 35 mm handheld at shoulder height, 1.5 m behind the courier, real footfall bob (~2.6 Hz) and small roll; dirt road, cut-wood hills as layered flat planes (woodblock look through toon shading with a carved-grain normal map). Only the crate emits green; red is a flat emissive layer creeping over the far ridges.
- Crane: 4 s rising crane to ~300 m, tilting down to a tabletop relief map carved from wood; the roads are grooves, borders are raised ridges with tiny barrier arms; crates are green glowing blocks queued at each ridge.
- Dolly in: 5 s descending push along one groove to the village gate; lens 50 mm; end locked-off.
- IN++: 85 mm macro on hands and the crate's carved slats, shallow depth, empty wooden chair soft behind.
- Richer in 3D: parallax between hill planes, the grain catching raking light, the queue of crates at a border reading as a real traffic jam.

## Copy variants
- "Designed in 2 days." / "The answer took 2 days. The road took the rest."
- "Then came the road." / "The red needed no papers." / "Every border, a stamp."
- "The last village on the list." / "Some chairs were already empty."
- "Same crates. Better routes." / "The crate was ready. The route wasn't."
- Campaign: "The bottleneck is us."

## Tags
{"slug":"the-last-crate","structure":"ticking-clock","medium":"woodblock","family":"traffic","scale":"between nations","pace":"sprint","emotion":"grief","protagonist":"one person","camera":"handheld chase","analog":"covid-2020"}

Diversity check: OK, distinct enough (nearest the-last-thirteen-days / fifteen-hundred / fifty-nine-days, distance 0.67).
