# Nineteen Days

Tier: animatic

**Logline.** An x-ray of one older woman on a hot night: skull, reading glasses, ribcage, a heart whose beat is the clock. It quickens with the heat. A wall calendar fills red one night at a time. At the edges of the frame, too far away, three green glows: a neighbor's key, a doctor's warning, a cool room. One pull-out shows the whole apartment block in x-ray, every window a lit ribcage on the same clock; some go dim. Back in, closer: two pieces arrive late, one never does.

- Structure: `ticking-clock` (research/VIRAL_STRUCTURES.md #1). The clock is her heartbeat plus a digit-free wall calendar (19 cells), so it adds no numbers to the screen.
- Analog: `heatwave-2003` (France, Aug 1-20, 2003)
- Medium: x-ray (bone-white strokes on dark film; only red heat and green fragments are saturated)
- Differs from the other two films on this analog: day-three-hundred-five (reverse chronology, children's-book) and the-balcony (POV, shadow puppet, one door). This one is the body itself: locked-off on one chest, the heartbeat as the clock, one pull-out.

## Time mapping (one mapping, stated)
- Race (t = 1.4 to 20.4 s): **1 film second = 1 day**, day d = t - 1.4, days 0 (Aug 1) to 19 (Aug 20). Linear.
- Cold open (t 0 to 1.4): flash-forward to day 12 (same timeline: calendar shows 12 filled cells, heat at its peak), then a cut back to day 0.
- Snap (t 24.0 to 28.5): the same 19 days in **4.5 s**, the same clock in both lanes.

## Speed math
**Threat (red).** The analog sources only the endpoints (extent 0 on day 0; 1.0 = ~14,800 excess deaths by day 19, s2) plus the peak (daily excess > 1,000 on Aug 12 and 13 = days 11 to 12, s2; national temperature peak day 11, heat wave days 1-14). No straight line: `L.logistic` fitted through them.
- Midpoint (max rate) at day 11.5 (sourced peak); extent 0.99 at day 19 gives k = ln(99)/7.5 = 0.613/day, early doubling time ln2/k = **1.13 days**; s0 = 0.00087; normalized so E(0)=0, E(19)=1.
- E(d): d6 0.03, d8 0.10, d10 0.29, d11.5 0.50, d13 0.72, d15 0.90, d17 0.98.
- Daily rate (the peak shape) rho(d) = 4 s(1-s), s the raw logistic: 0 at the ends, 1 at day 11.5. This is the "heat curve" used on screen (a fit to the mortality peak, which the analog sources; the temperature peak day 11 and end day 14 bracket it).

**What the red drives on screen.**
- Heart tempo (the ticking clock): f(d) = 0.9 + 2.1 rho(d) beats per film second: 0.9 on day 0, 1.7 on day 8, 3.0 at day 11.5, 1.7 on day 15, 1.0 on day 19. Accelerating then slowing. The tempo is the fitted curve, not a measured heart rate. Heartbeat sounds (bonk cues) are placed at the same integer phases, so sound and picture share one clock.
- Red heat haze at the frame edges: alpha proportional to rho(d).
- Wall calendar: one cell per day, filled as the day passes, red intensity = rho of that day, so the calendar ends up drawing the peak.
- Wide shot: 5 of the block's 25 ribcages dim when E crosses 0.1 / 0.3 / 0.5 / 0.7 / 0.9 (days 8.1 / 10.1 / 11.5 / 12.9 / 15.1). Timing is the curve; the count of five is symbolic, not a death count. Loss only as absence (a ribcage's glow dims). The protagonist is never shown dimming or suffering.

**Human aggregation (green).** Analog aggregation median 12, p10 9.5, p90 305 (days). Two-sided lognormal: sigma_low = ln(12/9.5)/1.2816 = 0.182, sigma_high = ln(305/12)/1.2816 = 2.525. Three fragments at quantiles 0.2 / 0.5 / 0.8:
- a neighbor's key (next apartment, left) connects day 10.3;
- a doctor's warning (upper floor, right) connects day 12.0 (the median = Plan Blanc, Aug 13, verified in the analog);
- a cool room (lower floor) at day 100.4: never within the film; its line keeps reaching and breaking.
Before its day each line reaches 30-65% of the way and snaps back (attention elsewhere; the attempt rhythm is a vibe, the arrival days are data). Fragments are drawn where they are in the building; in the close-up, a fragment that is off-screen is pinned to the frame edge along the true direction to it, so they "glow at the edges, too far away" and stay consistent across zooms.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 3 days (basis in the analog: joining a known forecast with the heat-mortality relationship and routing a warning is a short expert task, inside the ~17.4 h METR 50% horizon in RATES.md). Same lognormal shape scaled 3/12: 2.6 / 3.0 / 25.1 days. Day 3 is before the peak (E(3) = 0.005). Labeled illustrative on screen; the red curve and heart tempo are drawn **identically** in both lanes: only the time the pieces meet changes, not the outcome. Not a claim that deaths would have been prevented.

**On-screen numbers (two):** "day 12" (Plan Blanc, verified) and "day 3" (illustrative). The calendar has no digits. Unverified dates (ER doctors' alarm, forecasts, foreign warning systems) never appear.

## Shot list and camera (locked-off close-up with a single pull-out)
| t | shot | camera | content |
|---|---|---|---|
| 0.0-1.4 | SC1 CLOSE (cold open, day 12) | locked, zoom 6 on her cell | x-ray bust, heart racing, red haze, 12 red calendar cells, three green edge glows. "Her heart is the clock." |
| 1.4-8.0 | SC2 CLOSE, locked-off | zoom 6 | day 0 to 6.6, heart at ~1/s speeding up, calendar fills. "Every night, a little faster." / "Help is close." (edge labels) / "Just out of reach." |
| 8.0-10.6 | SC3 PULL OUT | zoom 6 to 1.0, eased | the wall dissolves into the whole block in x-ray: 25 lit ribcages on the same pulse; red heat presses from the roof. |
| 10.6-13.2 | SC3 WIDE HOLD | locked | days 9.2-11.8; ribcages dim at E 0.3 and 0.5; the key connects (day 10.3). "Every window, a ribcage." / "All on the same clock." |
| 13.2-14.8 | SC4 PUSH IN | zoom 1.0 to 9 | back to her, closer than SC2 (face and heart). Doctor's warning connects (day 12.0) on the way. |
| 14.8-20.4 | SC4 CLOSE+ | slow creep 9 to 10 | heat recedes, pulse slows. "Two pieces arrived." / "One never did." |
| 20.4-23.0 | SLOW | hold, darken | "We slowed it down so you could see it." |
| 23.0-23.6 | freeze, black, silence | | |
| 23.6-31.5 | SC5 SNAP WIDE | two stacked 920 px x-ray panels | 19 days in 4.5 s, same red, same pulse; People: day 12 (after the peak) / Frontier AI: day 3, illustrative (before the peak). |
| 31.5-35.8 | SC6 CLOSE++ | zoom 14 on her heart | the three green lights close into one ring around the heart. "This is the bottleneck." |
| 35.8-40.0 | END | | end card, 4.2 s. |

Zoom cycles: IN 0-8.0 -> OUT 8.0-10.6 (hold to 13.2) -> IN+ 13.2-14.8 (zoom 9, closer than start); cycle 2: snap wide 23.6-31.5 -> IN++ 31.5-35.8 (zoom 14).

## 3D translation note
Shoot it as a real volumetric x-ray: bones as emissive translucent meshes, soft tissue as faint fresnel shells, the heart a pulsing emissive volume. SC1-SC2: 85 mm, locked-off at chest height, 60 cm from her, shallow depth so the wall calendar and the green edge lights bokeh. The pull-out is a single 2.6 s dolly straight back through the wall (the wall turns to x-ray film) to a 35 mm locked-off wide of the whole block, a dollhouse of 25 glowing skeletons breathing on one beat; red heat is a volumetric haze sinking from the roof. Push-in is faster (1.6 s) and lands at 100 mm, closer than the start. The snap is flat 2D panels on black. Richer in 3D: parallax between floors, the heartbeat pulsing light through the ribs onto the wall, glints on the glasses and pendant.

## Copy variants
- Her heart is the clock. / Every night, a little faster. / Help is close. / Just out of reach. / Every window, a ribcage. / All on the same clock. / Two pieces arrived. / One never did. / We slowed it down so you could see it. / Same days. Full speed. / This is the bottleneck.
- Alternates: "The pulse is the countdown." / "Next door has a key." / "The warning took the long way." / "Heat has no lag."

## Tags
{"structure":"ticking-clock","medium":"x-ray","family":"body/biology","scale":"body","pace":"accelerating","camera":"locked-off close-up with a single pull-out","emotion":"dread","protagonist":"one person","analog":"heatwave-2003"}

## Scores (after render; 40.0 s confirmed by ffprobe)
- Hook: 7 (frame 1: x-ray face with bright glasses, red haze and 12 red calendar cells, green glows at the edges, "Her heart is the clock.")
- Speed accuracy: 8 (logistic fit through sourced endpoints plus peak; the heartbeat tempo, haze, calendar and dimming all run on the fitted curve; lognormal arrivals; one mapping)
- Snap impact: 6 (black freeze, hit, stacked 920 px panels with identical red; the difference is only 9 days, staged rather than inflated)
- Emotion: 7 (the accelerating heartbeat is a real dread engine; ribcages dimming in the wide shot is loss as absence)
- Originality: 7 (heartbeat-as-clock, x-ray block of ribcages)
- Craft: 6 (clean x-ray look; mini figures in the wide shot are generic; the close+ shot is busy with lines)
- Honesty: 9 (two numbers, 12 verified and 3 illustrative; tempo stated as a fitted curve, not a heart rate; she is never shown dimming)
- Overall: 7.1
- Virality: 7% (an x-ray skull with a racing heartbeat stops the scroll, but the payoff is an abstract chart and the text-heavy middle stretch will lose casual viewers).

Fix pass: moved the snap's "after/before the peak" labels under their own panels and removed a duplicate "illustrative" tag that sat in the right-hand UI column.
