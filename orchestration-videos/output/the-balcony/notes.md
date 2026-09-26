# The Balcony

Tier: animatic

**Logline.** You carry water up four flights to the woman upstairs, every day, in first person and present tense. She never opens the door. On the pull-out, the building is a shadow-puppet screen: the doctor, the daughter and the clerk with the council list are each in their own lit room, their green lines reaching for her door and breaking.

- Structure: `pov` (research/VIRAL_STRUCTURES.md #6)
- Analog: `heatwave-2003` (France, August 2003)
- Medium: shadow puppet (black silhouettes on a warm-gray backlit screen; only the red heat and green fragments are saturated)
- Differs from day-three-hundred-five (same analog): strictly forward, first-person, present tense, one building, not reverse chronology.

## Time mapping (one mapping, stated)
- Race (t = 1.4 to 20.4 s): **1 film second = 1 day**, day d = t - 1.4, days 0 (Aug 1) to 19 (Aug 20). Linear.
- Cold open (t 0 to 1.4): a flash-forward to day 13 at the same door (red near its full extent), then a flicker cut back to day 0 at the bottom of the stairs.
- Snap (t 24.0 to 28.5): the same 19 days at **4.5 s for 19 days**, the same clock in both lanes.

## Speed math
**Threat (red).** The analog only sources the endpoints (extent 0 on day 0, 1.0 = ~14,800 excess deaths by day 19) plus the peak (daily excess > 1,000 on Aug 12 and 13 = days 11 to 12). No straight line: I fit `L.logistic` through them:
- midpoint (maximum rate) at day 11.5, the sourced peak;
- extent 0.99 at day 19 gives k = ln(99)/7.5 = 0.613/day, early doubling time ln2/k = **1.13 days**;
- s0 = e^(-k*11.5)/(1+e^(-k*11.5)) = 0.00086; then normalized so E(0)=0 and E(19)=1 exactly.
- E(d): d3 0.005, d8 0.10, d10 0.29, d11.5 0.50, d12 0.58, d14 0.83, d17 0.98.
- On screen, E drives how far the red reaches down the building (top floors first) and the red tint of the POV screen. Loss is absence only: five of the building's rooms go dark when E crosses 0.1, 0.3, 0.5, 0.7, 0.9 (the timing is the curve; the count of five is symbolic, not a death count). The neighbor's room is the 0.5 one (day 11.5, the peak). No bodies; a dark room and a dark strip under a door.

**Human aggregation (green).** Analog aggregation median 12, p10 9.5, p90 305 (days). Two-sided lognormal: sigma_low = ln(12/9.5)/1.2816 = 0.182, sigma_high = ln(305/12)/1.2816 = 2.525. Three holders at quantiles 0.2 / 0.5 / 0.8:
- doctor (ground floor) connects at day 10.3;
- daughter (second floor) at day 12.0 (the median; Plan Blanc, Aug 13, verified in the analog);
- council list clerk (first floor) at day 100.4: never within the film. Their line keeps breaking.
Before a holder's day, the line reaches part way and snaps back (attention elsewhere; attempt rhythm is a vibe, arrival days are data).

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 3 days (basis in the analog: joining a known forecast with the heat-mortality relationship and routing a warning is a short expert task, inside the ~17.4 h METR 50% horizon in RATES.md). Same lognormal shape scaled by 3/12: 2.6 / 3.0 / 25.1 days. Arrival on day 3 is before the day 11.5 peak (E(3) = 0.005). On screen it is labeled illustrative, and the red curve is drawn **identically** in both lanes: the film shows only when the pieces meet relative to the peak, never a changed outcome.

On-screen numbers (two): "12" (Plan Blanc, verified) and "3" (illustrative). The unverified dates (ER doctors' alarm, forecasts, foreign warning systems) never appear on screen.

## Shot list and camera
| t | shot | camera | content |
|---|---|---|---|
| 0.0-1.4 | SC1 CLOSE POV (cold open, day 13) | locked, handheld sway | your fist knocks; red floods the landing window; green-lit rooms across the courtyard. "POV: she still hasn't answered." |
| 1.4-6.2 | SC2 POV WALK | walk bob, stairs scroll | day 0 to 4.8: four flights, water bottle in hand. |
| 6.2-11.0 | SC3 POV DOOR | close, slight push | knocks, no answer; light under door on; red rising in the window. |
| 11.0-16.0 | SC4 PULL OUT / CRANE UP | L.camera zoom 6 to 0.92, eased | through the wall into the cross-section: you are a puppet on the fourth landing; three green rooms, lines breaking; red descends from the roof; rooms go dark. |
| 16.0-17.6 | SC5 DROP DOWN | zoom 0.92 to 7 on the door | back into your eyes. |
| 17.0-20.4 | SC5 CLOSE+ POV | closer than SC3 | your palm on the door, strip dark; two green threads arrive at your hand, late. |
| 20.4-23.0 | SLOW | hold | "We slowed it down so you could see it." |
| 23.0-23.6 | freeze, black, silence | | |
| 23.6-31.5 | SC6 SNAP WIDE | two stacked 920 px panels | same clock, 19 days in 4.5 s; People: plan day 12 / Frontier AI: day 3, illustrative; after vs before the peak. |
| 31.5-35.8 | SC7 CLOSE++ | closest | your palm, three threads knot into one green glow. "This is the bottleneck." |
| 35.8-40.0 | END | | end card, 4.2 s. |

Zoom cycles: IN 0-11.0, OUT 11.0-15.2 (hold to 16.0), IN+ 16.0-17.6 (POV from 17.0); cycle 2: SNAP wide 23.6-31.5, IN++ 31.5-35.8.

## 3D translation note
Real shadow theater staged in 3D: a translucent screen lit from behind by one warm practical lamp, cut-paper puppets on rods a few cm from it so the edges stay sharp. SC1-SC3 on a 24 mm lens at eye height (1.6 m), handheld, the step-rise felt in the bob. The pull-out is a slow 5 s dolly back through the stairwell wall (the wall becomes the screen) to a 50 mm locked-off wide of the whole building, like a dollhouse theater; red is a gel on a second lamp lowering from the top of the frame, green is small LED props in three rooms, lines are lit threads. Drop-down is fast (1.5 s) and ends closer than the start (35 mm, 40 cm from the door). Richer in 3D: parallax between puppet layers, rod shadows, the lamp flicker marking each night.

## Copy variants
- POV: she still hasn't answered. / Four flights. Every morning. / Water for the woman upstairs. / She never opens the door. / Other people knew, too. / Every piece was in the building. / In separate rooms. / Nobody put them together.
- Alternates: "Same building. No wiring." / "Three lit rooms. One dark door." / "The pieces took the stairs."

## Tags
{"structure":"pov","medium":"shadow puppet","family":"family","scale":"family","pace":"slow build","emotion":"loneliness","protagonist":"one person","camera":"POV walk","analog":"heatwave-2003"}
Diversity check: OK (nearest day-three-hundred-five 0.56).
