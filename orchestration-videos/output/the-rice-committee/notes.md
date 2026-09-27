Tier: animatic

# The Rice Committee

**Logline.** A deadpan mockumentary: three stick-figure officials in three separate rooms, each holding one green key (the stock, the need, the sign-off). Each is sure someone else will ask. Behind every interview the same red price line creeps up the wall. Pull out: the rooms are far apart on one gray map, under one giant red line, and there is no committee. Drop back into the room that needs it, closer, angrier, until the keys finally meet in week 31. Then the snap: same keys, met in week 28 (illustrative).

- Structure: `mockumentary` (VIRAL_STRUCTURES.md #8): comedy -> dread -> resolve, stop-start cuts.
- Analog: `rice-2008`. The threat is never named; it is only a red line. Officials are "Official A/B/C", no countries, flags, maps of real places, or real people. The satire hits the routing (no standing body joins stock, need and sign-off), not the officials, who are competent and sincere.
- Medium: stick-figure animatic (L.stick with moods), gray rooms, sketch lines.
- DUR 42 s, 1080x1920, 30 fps. Scene: `scenes/the-rice-committee.js`.

## Keys = fragments (analog `solution.fragments`)
- Key A, **the stock** = f1 (idle imported stock in government warehouses, ready at week 0, s1). Green from the start.
- Key B, **the need** = f2 (an importer's withdrawn tender; the need becomes public at week 27.3, s1). Drawn as a gray outline key until week 27.3, then green.
- Key C, **the sign-off** = the third party's consent under trade rules that the deal needed (part of f4, s1). Staging assumption: the capacity to consent existed all along (green from the start); it is used only as a character and no date is claimed for it.
- f3 (economists' idea) and f5 (standing transparency system) are `verified:false`: off screen.

## Time mapping (one stated mapping)
- **Race (t = 2.8 to 28.4): linear, 1 second = 1 week.** Week w is on screen at t = 2.8 + (w - 12). Weeks 0-12 are skipped because the fitted red is under 5% of its climb there (a start point, not a second mapping). Need goes public (wk 27.3) at t = 18.1. Keys meet (wk 31.3) at t = 22.1. The June point (wk 35.7) at t = 26.5; the clock holds at 35.7 after that.
- **Cold open (t = 0 to 1.5):** flash-forward to week 30 (red near the top of A's wall chart), then a labeled rewind "Months earlier." (t = 1.5 to 2.8) drains it back to week 12. Same curve.
- **Snap (t = 29.2 to 33.2): weeks 12 to 40 in 4 s (1 s = 7 weeks)**, the same clock in both panels.

## Speed math
**Threat (red) = price-climb extent**, (price - 300)/800 (analog notes). Reusing the-warehouse fit for consistency: logistic K/(1+exp(-r(w-m))) least-squares through (5.3, 0.01 shape anchor, `verified:false`, never shown), (29.1, 0.875, s2), (30.6, 1.0, s3): **K = 1.564, r = 0.222/week (early doubling ~3.1 weeks), m = 28.02**, clamped at 1. After the keys meet (wk 31.3) extent decays exponentially toward the sourced June point: k = ln(1/0.625)/4.4 = 0.107/week (analog `deploy.median` 4.4 weeks).
- On screen the red is the same line on the wall chart in every room (x = week 0..40, y = extent) and one giant line running under the whole map in the wide shot (one market, one price).
- **Bowl on B's desk** = rice per fixed budget, area proportional to 300/price (internal only; the $300 base is unverified and never shown): at the peak ~27% of the week-0 amount.

**Human aggregation (green).** Analog: median 31.3 (deal, s1), p10 27.3 (failed tender, s1), p90 205.3 (AMIS, `verified:false`, tail only). Two-sided lognormal: sigma_lo = ln(31.3/27.3)/1.2816 = 0.107, sigma_hi = ln(205.3/31.3)/1.2816 = 1.468. In the wide shot five green threads run from room A (stock) toward room B (need) at quantiles q = 0.1, 0.3, 0.5, 0.7, 0.9 -> arrival weeks 27.3, 29.6, 31.3, 67.0, 205.3; each grows linearly from week 0, so the late ones dangle mid-map. Room C's thread arrives at the deal (31.3). Only the median thread "lands" as the keys meeting in B's room.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 28.3: matching a public, stated shortage (the tender, wk 27.3) to a known idle stock and drafting terms is a short analysis-and-routing task inside the ~17.4 h 50% task horizon (RATES.md, METR). Assumed surfaced within 1 week of the need going public; governments still negotiate and decide. Not assumed: earlier detection. The AI lane uses the same decay law from the fitted extent at 28.3 (0.81). The gain is ~3 weeks and is not inflated; the snap lands through staging (freeze, black, one stamp, silence, then both panels on one clock).

**Numbers on screen (two):** "Week 31" (keys meet; s1 mid-May 2008, weeks after the Oct 2007 ban, t0 day assumed) and "28" (the AI counterfactual, always with "illustrative"). No prices or tonnages.

## Shot list and camera (map-world camera, log-eased zoom, handheld noise on x/y/rotation throughout)
| t | shot | camera |
|---|---|---|
| 0.0-1.5 | SC1 CLOSE cold open (wk 30): Official A, green key raised, red line high on the wall. "Everyone had a key." | handheld close, zoom 3.9 on room A |
| 1.5-2.8 | Rewind: red drains to wk 12. "Months earlier." | handheld |
| 2.8-5.8 | SC2a CLOSE A (wk 12-15). "OFFICIAL A / holds the stock". "We have plenty. Nobody asked." | handheld, whip-pan cut |
| 5.8-8.8 | SC2b CLOSE B (wk 15-18). "holds the need". Gray key. "We'll ask once it's official." | handheld, whip-pan cut |
| 8.8-11.8 | SC2c CLOSE C (wk 18-21). "holds the sign-off". "Happy to sign. If asked." | handheld, whip-pan cut |
| 11.8-13.6 | SC2d back to A, tighter. Off-camera question: "Who holds all three?" Silence. | handheld push 3.9 -> 4.4 |
| 13.6-19.0 | SC3 PULL OUT (wk 22.8-28.2): A's room shrinks to a box on a gray map; B and C far away; one giant red line under all three. Threads crawl. "There is no committee." B's key lights (wk 27.3). | zoom 4.4 -> 0.33 (log), hold |
| 19.0-22.1 | SC4 PUSH IN+ to B, closer than SC2 (wk 28.2-31.3). Angry face, red glow. "We asked. Publicly. Still waiting." Keys A and C slide in, click (wk 31.3). | zoom 0.33 -> 5.2 on B's head/key |
| 22.1-25.8 | SC5 (wk 31.3-35). Red line bends down. "Week 31. The keys met." "Then the price turned." | handheld hold |
| 25.8-28.4 | Dim: "We slowed it down so you could see it." | hold |
| 28.4-28.8 | Freeze to black. One stamp. Silence. | cut |
| 28.8-35.2 | SC6 SNAP: two 900 px panels, same clock. "As it happened" / "AI-assisted routing · illustrative". Then "Week 31 vs 28." "(illustrative)". | locked off |
| 35.2-37.8 | SC7 IN++: extreme close on three joined green keys in B's hand. "This is the bottleneck." | push 1.0 -> 1.15 |
| 37.8-42.0 | END: L.endCard, 4.2 s | hold |

**Zoom cycles.** Cycle 1: IN 0-13.6 (zoom 3.9-4.4), OUT 13.6-17.0 (to 0.33), IN+ 19.0-22.1 (5.2, tighter than any interview). Cycle 2: OUT to the snap 28.8, IN++ 35.2-37.8 (the keys, the tightest framing).

## 3D translation note
- SC1/SC2: documentary handheld, 35 mm at seated eye height, shoulder-rig drift and small reframes; three rooms lit identically (flat fluorescent), each with the same wall chart; the red line is an emissive strip on the wall that slowly climbs.
- Whip-pans: 0.25 s motion-blurred swings, as if the operator ran from room to room.
- SC3: the camera backs out of the room through the doorway and keeps rising (drone pull, 3.5 s, ease-in/out) until the rooms are dollhouse boxes on a vast gray table-map; the red line is a glowing ridge running under the whole map.
- SC4: fast drop, 85 mm on B's face, shallow focus, red rim light from the chart.
- SC7: 100 mm macro on the key ring; the keys are brushed metal with green emissive cores.
- Characters: stick officials as flat wire puppets with swap-in eyebrows/mouths.

## Copy variants
- "Everyone had a key." / "Three keys. Three rooms." / "The door had three locks."
- "There is no committee." / "Who holds all three?" / "Nobody's job to ask."
- "Week 31. The keys met." / "Same keys. Found sooner."

## Tags
{"structure":"mockumentary","medium":"stick-figure animatic","family":"cooking","scale":"between nations","pace":"stop-start","emotion":"anger","protagonist":"an institution","camera":"handheld chase","analog":"rice-2008"}
Diversity check: OK (nearest the-department-of-later 0.56, recipe-for-a-shortage 0.56).

## Build log
- Preview 1: structure, continuous map-world pull-out and push-in all worked. Fixes: B's desk nameplate sat under the lower-third (moved down); "Week 31 vs 28." lacked an adjacent illustrative tag (added "28 is illustrative", 46 px); snap red lines ran past the panels' left edge (clipped to panel).
- Final: 42.0 s (ffprobe).

## Scores
- Hook: 6 (frame 1: deadpan face, glowing green key, a red line spiking high on the wall, "Everyone had a key." Clear, but a stick figure is not a scroll-stopper.)
- Speed accuracy: 8 (shared logistic fit with the-warehouse, 1 s = 1 week, sourced decay, lognormal thread quantiles, need key lights at week 27.3, AI lane from the analog)
- Snap impact: 5 (a ~3-week honest gap; freeze, black, stamp and two synced panels carry it, but the two curves look alike at a glance)
- Emotion: 6 (the deadpan quotes are funny; B's angry "Still waiting." and the lights dimming with price turn it, but anger stays mild)
- Originality: 7 (mockumentary interviews inside rooms that turn out to be dollhouse boxes on one map under one red line)
- Craft: 6 (true continuous zoom through one world, handheld noise and whip-pans read well; stick-figure keys cluster into a blob at the deal; map shot is busy)
- Honesty: 9 (no countries or people, unverified items off screen, sign-off key's timing flagged as a staging assumption, modest counterfactual labeled illustrative)
- Overall: 6.7
- Virality: 7% (the "Nobody asked" / "There is no committee" beats are shareable and native to the interview format, but the payoff is a subtle 3-week gap and the look is plain.)
