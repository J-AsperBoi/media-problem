# Fifty-Nine Days

Tier: animatic
Slug: fifty-nine-days
Structure: `game-hud-run` (research/VIRAL_STRUCTURES.md #10)
Analog: `wannacry-2017`
Medium: 8-bit (chunky grid-aligned pixels, gray palette; only red and green are saturated)

## Logline
A speedrun HUD rides one hospital IT worker's walk down a corridor to a terminal. The red SPREAD meter fills to 230,000 in a day. Every green item slot is already there: the patch shipped 59 days ago, the alert is sitting unread in an inbox, and the off switch is one registration away. The run is lost to routing, not to skill.

## Time mapping (one mapping for the race)
- Race: film t = 2.0 s to 14.0 s ↔ hours 0 to 24 after outbreak. **1 s = 2 h, linear.** hours(t) = 2·(t − 2).
- Hook (0 to 2 s) is a cold open flash-forward to hour 24 (meter full, labeled "230,000"), then a REWIND glitch back to hour 0.
- Snap: a separate, labeled "true proportions" axis, 0 to 168 h across the full panel width; drawn in 2.4 s (1 s = 70 h). Both panels share this axis.

## Speed math
**Threat (red).** Analog gives only endpoints: extent 0 at 0 h, 1.0 (= >230,000 systems, >150 countries) at 24 h (s2). No hourly series is sourced and the file says not to show a pre/post kill-switch split, so the SPREAD meter interpolates **linearly** between the two endpoints and is labeled "REPORTED". The linear shape is a placeholder, not data; the only numeral it ever shows is the endpoint 230,000, at t = 14.0 s. On the world map, land cells turn red in a distance-plus-jitter order so that the red share of cells equals the meter at every zoom level. The worker's hospital cell turns red when the meter crosses 0.85 (hour 20.4, t = 12.2 s); its exact hour is not sourced, it is a rank on the linear curve.

**Green fragments (from the analog).**
| fragment | ready_at | on screen |
|---|---|---|
| f1 patch (vendor) | −1,416 h (59 days, s5) | green item slot "PATCH" from frame 1; green vendor cell on the map; "59 days" is one of the two numbers |
| f2 alerts (national health IT) | ~−1,440 h (unverified) | slot "ALERT: UNREAD", no number |
| f3 kill switch (one researcher) | 7.3 h → t = 5.65 s | slot "OFF SWITCH" lights, map pixel lights far away; card says one person, partly luck |
| f4 emergency patch for old systems | ~20 h (hour unverified) → t = 12.0 s | second pulse at the vendor cell, no number |
| f5 the unpatched machines | clear by ~168 h | the worker's hospital; clears off screen in the race, shown on the snap axis |

**Human aggregation.** 36 organisation nodes on the map. Each gets a quantile q (stratified, shuffled with L.rng) and an arrival time `max(7.3, L.lognormalQuantile(q, 20, 168))` hours (median 20 h, p90 168 h from the analog; floored at the 7.3 h kill switch, the earliest documented stop). sigma = ln(168/20)/1.2816 = 1.66. Within the 24 h race 20 of 36 (56%) have connected; the rest arrive days later. The worker's hospital is assigned the quantile nearest 0.82 (arrival ~91 h, day four; highlighted "HIS" on both snap panels, AI ~5 h), so inside the race its green line never lands.

**AI-speed counterfactual (illustrative).** aggregation_median = 1 h (analog `ai_counterfactual`). Same quantiles, same sigma: AI p90 = 1 × 168/20 = 8.4 h. On the shared 168 h axis the AI pips land inside the first day (latest ~39 h, the 36th stratified quantile); the human pips spread across the whole week. Basis (from the analog): spotting a hard-coded domain in a sample is a few-hour expert task, inside the ~17.4 h METR 50% time horizon (RATES.md); matching unpatched machines to a 59-day-old critical patch and routing the alert is inventory work made cheap by ~40x/year cost decline (Epoch, RATES.md). Humans still approve and apply the patch (the IN++ shot shows the worker's own hand doing it). Labeled "ILLUSTRATIVE" on screen at 48 px. Not a claim the event would have been prevented; the kill switch was found by one person, partly by luck, and the film says so.

**Numbers on screen:** 59 (days) and 230,000. Everything else in the HUD is bars, icons, and words.

## Shot list and camera
| t (s) | shot | camera | beat |
|---|---|---|---|
| 0.0–2.0 | SC1 POV CLOSE | locked POV, slight bob | Cold open, hour 24: pixel hand holds green PATCH disk, corridor monitors red, meter full "230,000". Card: "The patch shipped 59 days ago." REWIND glitch at 1.7–2.0 |
| 2.0–7.0 | SC2 POV WALK | walking dolly down the corridor (depth scroll, head bob) | Run start, hour 0. Meter climbs. Item slots: PATCH (in inbox), ALERT (unread), OFF SWITCH (dark). t = 5.65 OFF SWITCH lights: "One stranger. Partly luck." |
| 7.0–11.5 | SC3 SPECTATOR CAM, CRANE UP | top-down on the worker sprite, log zoom out ×45 → ×0.9 | Hospital floor, then the whole pixel world: red cells across nations, 36 organisations, green lines connecting at lognormal times, many not yet |
| 11.5–15.0 | SC4 POV DOLLY IN (closer) | cut back into POV and push to the terminal, then onto his face reflected in the screen | Red arrives down the corridor (t = 12.2), inbox shows ALERT UNREAD, meter hits 230,000 at t = 14.0, lights go out to gray |
| 15.0–17.4 | SC5 FREEZE | locked | Frozen gray frame, silence, "We slowed it down so you could see it." |
| 17.4–25.5 | SC6 SNAP, FLAT | locked split, two 920 px panels | Hit. True proportions: AS IT HAPPENED (pips across a week, off switch pip marked) vs ROUTED, ILLUSTRATIVE (pips inside the first hours) |
| 25.5–28.5 | SC7 POV EXTREME CLOSE, DOLLY IN | closest yet | The same hand slots the green disk into the terminal; screen shows PATCH APPLIED; his reflected face, resolved. "ILLUSTRATIVE" stays up |
| 28.5–31.0 | SC7 hold | | "This is the bottleneck." |
| 31.0–35.0 | END | | L.endCard, 4.0 s |

Zoom cycles: Cycle 1: IN (POV) 0–7 → OUT (crane up to world) 7–11.5 → IN+ (terminal/face) 11.5–15. Cycle 2: OUT (snap, flat axis over a whole week) 17.4–25.5 → IN++ (hand in the slot, face) 25.5–31.

## 3D translation note
- SC2/SC4/SC7 are a true first-person walk: 24 mm lens at 1.65 m eye height, gentle head bob, 1.2 m/s, rendered as voxel geometry with a nearest-neighbour upscale so the 8-bit read survives in 3D. The HUD stays a flat screen-space overlay.
- SC3 is one continuous vertical crane: start 2 m above the worker, rise through the ceiling (floor plan cut-away) to orbit height over a voxel globe, 5 s, ease-in-out, log speed. The hospital stays centered.
- Props: green 3.5-inch-disk style cartridge (the patch), CRT terminal with inbox, corridor of monitors that flip to red. Characters: one voxel IT worker with a readable pixel face (tired → alarmed → resolved).
- Richer in 3D: red bleeding along real cable runs in the ceiling; the green lines on the globe as arcs; the terminal glow on his face in the final close-up.

## Copy
- Hook: "The patch shipped 59 days ago."
- "Friday morning. Run start." / "The fix is in an inbox." / "One stranger. Partly luck." / "Every piece already existed." / "Nobody routed them." / "We slowed it down so you could see it." / "At true proportions." / "Same pieces. Faster routing." / "This is the bottleneck."
- Variants (not used): "Speedrun: any percent, 59 days late." / "The patch was the easy part." / "Latency kills runs." / "Ping: one week."

## Tags
{"structure":"game-hud-run","medium":"8-bit","family":"game","scale":"between nations","pace":"sprint","camera":"POV walk","emotion":"resolve","protagonist":"one person","analog":"wannacry-2017"}
Diversity check: OK: distinct enough (nearest the-last-thirteen-days 0.78).

## Build notes
- Rendered 35.0 s (ffprobe 35.000000), 1080x1920, 30 fps. POV and terminal drawn into a 180x320 buffer and upscaled x6 nearest-neighbour; world map and HUD drawn as grid-aligned rects.
- Snap staging: freeze on the dead terminal (15.0–17.4), 0.5 s of black silence, one "hit" at 17.9 with a flash, then both panels sweep a shared 168 h axis in 2.4 s.
- Known weaknesses: the human-vs-AI difference on the true-proportion axis is honest but modest (both clusters start near hour 0; the human tail runs the whole week); pixel text at 45 px is chunky but on the small side; the world-map mid-zoom is busy.

## Scores
- Hook: 7 (red hallway, green disk in hand, "59 days" in frame 1)
- Speed accuracy: 7 (endpoints, 7.3 h, lognormal per org are real; linear meter shape is a labeled placeholder)
- Snap impact: 6
- Emotion: 5
- Originality: 7
- Craft: 6
- Honesty: 8
Overall: 6.6
Virality: 7% — the 8-bit HUD and "patch shipped 59 days ago" are native to gaming feeds and legible sound-off, but the snap is abstract and the film has no strong character payoff to drive shares.
