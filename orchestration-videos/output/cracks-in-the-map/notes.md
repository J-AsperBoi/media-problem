# Cracks in the Map

Tier: animatic
Slug: cracks-in-the-map
Structure: nature-documentary (research/VIRAL_STRUCTURES.md #14)
Analog: gfc-2008
DUR: 40 s, 1080x1920, 30 fps

## Logline
A hushed nature documentary about something that lives in the cracks of an old topographic map. The map's sheet lines (the rules) were drawn for older ground; red grows in the seams between them, then floods out along the fault lines. Twelve surveyors each hold one corrected green sheet, each alone in a separate valley, and walk their sheets in to one table at the speed people actually coordinated.

Nonpartisan and about systems: the "creature" is an abstract red growth in regulatory gaps, never a person or group. No institutions, logos, names, or dates on screen.

## Time mapping (one mapping)
- Race: **1 second = 40 days** (day = 40 (t - 2.3), t in film seconds, 2.3 <= t <= 17.3; frozen at day 600 after that). Stated on screen during the race ("1 second = 40 days"; the only number on screen).
- Cold open (0-1.7 s) is a flash-forward to day 433 (Oct 2008 monthly point, the first month after the break) on the same timeline, then a fade back to day 0.
- Snap: both panels run day 0 -> 1100 in 3.0 s each (about 367 days/s), same axis, so the two lanes are directly comparable.

## Speed math
**Threat (red).** `threat.points` in gfc-2008.json: extent = share of the peak-to-trough fall in the monthly-average S&P 500 (s2), linear between monthly points (these are real monthly data, not two endpoints, so no logistic fit is needed). Red is drawn as a share of the crack network's total length: at day d, exactly extent(d) of the network's length is red. The network is ordered once at setup:
1. Seam cracks (the old sheet lines, i.e. the rules) ordered by geodesic distance from one origin seam node near the hero, until 41% of total length (the pre-Lehman drift, max monthly extent 0.412 in Sep 2008).
2. Five fault lines (following the terrain, not the grid) fill in parallel next, starting where they leave the red region. Fault length is sized to ~32% of the network so the faults flood during the Sep -> Oct 2008 jump (0.41 -> 0.73), the break month.
3. The remaining seams fill by distance from the flooded faults (0.73 -> 1.0, trough Mar 2009).
The data's dip in spring 2008 (0.285 -> 0.174) is shown as the red receding, as in the data. The origin seed dot at day 0 marks t0 (Aug 9 2007 fund freeze, s1); extent is 0 until the Oct 2007 peak.
Red width = age of red in extent units (brighter/wider where it has been red longer); width carries no extra data claim beyond "longer red".

**Human aggregation (green).** 12 surveyors, arrival day of surveyor i = `L.lognormalQuantile((i+0.5)/12, 426, 1077)` (solution.aggregation median 426, p90 1077, derived from documented dates; verified:false, so no response numbers are on screen; they are shown by position only):
122, 185, 237, 286, 338, 395, 460, 536, 634, 767, 979, 1492 days. The hero is the tail (1492). By the end of the race (day 600) 8 of 12 sheets are on the table; hers is not.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 220 (basis in the analog: shared exposure map assembled at the first large failure; METR ~17.4 h task horizon and ~40x/yr cost fall in RATES.md). Same spread (sigma kept): p90 = 220 x 1077/426 = 556. Arrivals: 63, 96, 122, 148, 175, 204, 237, 277, 327, 396, 506, 770. The hero's sheet arrives at 770 instead of 1492. Red is identical in both lanes (the counterfactual does not assume the crisis is avoided; labeled "illustrative" on screen at 48px+).
Ratio: human median / AI median = 426/220 = 1.9x. Small, and not inflated; the snap lands through staging (dead stop, silence, one hit, then the second lane).

## Shot list / camera (zoom cycles)
| t | shot | camera |
|---|---|---|
| 0.0-1.7 | SC1 CLOSE, cold open (flash-forward, day 433) | eye level on the hero surveyor's face, green sheet in hands, red crack flooding at her feet; zoom 13 |
| 1.7-2.3 | fade through black to day 0 | same framing |
| 2.3-6.5 | SC2 CLOSE | slow push-out 13 -> 10; red seeps into the crack at her feet at ~day 80-98 (t 4.3-4.8) |
| 6.5-11.0 | SC3 CONTINUOUS ZOOM OUT | log-zoom 10 -> 0.95 through valleys, sheets, whole map (OUT #1) |
| 11.0-14.3 | SC4 WIDE | hold on the whole map-economy; faults flood at day 403 (t 12.4) |
| 14.3-17.5 | SC5 ZOOM IN | log-zoom 0.95 -> 20, back to the hero, closer than the opening (IN #1) |
| 17.5-18.6 | dead stop | silence, frozen at day 600 |
| 18.6-21.2 | card | "We slowed it down so you could see it." |
| 21.3-29.4 | SC6 SNAP (OUT #2) | two 920px panels of the whole map + shared axis: true speed, freeze, hit, faster routing (illustrative) |
| 29.4-32.2 | SC7 MACRO (IN #2) | two surveyors' sheets meeting, closer than any earlier shot, routed lane |
| 32.2-34.6 | card | "This is the bottleneck." |
| 34.6-40.0 | end card | L.endCard "The bottleneck is us.", 5.4 s |

## 3D translation note
- Opening: telephoto (135mm equiv.) at eye height on a small surveyor figure standing on a physical relief map made of paper sheets; shallow depth of field; red liquid light glowing up out of a crack by her feet.
- Zoom out: one continuous crane/drone move straight up and back, ~8 s, accelerating in log scale; the paper relief resolves into ridges and valleys, then into the full map lying on a dark table. Other surveyors appear as tiny figures in their own valleys, each with a lit green sheet.
- Flood: red light races along the fault canyons in one beat; shot locked off.
- Return: faster dive than the pull-out, ending closer than the opener (macro lens), her sheet the only lit thing.
- Richer in 3D: real paper relief, cracks as physical gaps, red as emissive fluid, contour lines as laser-etched lines, green sheets as backlit vellum.

## Copy variants
- "It lives in the cracks." (hook)
- "The rules were drawn for older ground."
- "Each valley keeps one sheet."
- "Then the red finds the faults."
- "Her sheet has not arrived."
- "Same red. Faster routing."
- "The pieces were already here."
- Alt: "The map is old. The ground moved." / "Every surveyor is right. Alone."

## Tags
Diversity check with the assigned emotion "awe" returned TOO SIMILAR to the-storm-doc (0.44). Changed emotion awe -> **loneliness** (surveyors each alone in separate valleys); re-check OK (nearest the-storm-doc 0.56).
{"slug":"cracks-in-the-map","structure":"nature-documentary","medium":"topographic map","family":"ecology","scale":"economy","pace":"slow build","camera":"continuous zoom through scales","emotion":"loneliness","protagonist":"the red itself","analog":"gfc-2008"}

## Build notes
- Fault share of network length came out at 0.310 (stage A seams 0.412), so the faults flood over extent 0.412 -> 0.722, inside the Sep -> Oct 2008 jump (0.41 -> 0.73). The last 0.008 of that month spills into seams.
- First preview: red bands swamped the close-ups (world width fixed across zoom). Fixed by capping red width on screen above zoom 5. The held sheet covered the hero's mouth, so it was moved lower.
- Numbers on screen: only "1 second = 40 days" (the stated mapping). Day 426 and the other response dates never appear; they are shown by position only.

## Scores
- Hook: 7 (red-flooded crack, a face, a green sheet and one line in frame 1; the bean is small in the thumbnail)
- Speed accuracy: 8 (red is the exact share of network length from monthly points; lognormal arrivals from the analog; the fault/seam ordering is a design choice)
- Snap impact: 6 (the counterfactual is only 1.9x; the freeze and hit help, but the panels are dense)
- Emotion: 6 (loneliness reads in the close-ups; the wide map is more diagram than feeling)
- Originality: 7 (a topographic map where the rules are the cracks is a fresh image for this analog)
- Craft: 6 (clean zoom through scales; the macro exchange is stiff; the wide map is busy)
- Honesty: 9 (no names or institutions, illustrative labels, the red recedes where the data dips, no response numerals)
Overall: 7.0
Virality: 7% — a striking red-grid map and a clear zoom, but a slow, hushed nature-doc opening and an abstract finance analog make broad sharing from a small account unlikely.
