Tier: animatic

# Day 305

**Logline.** It opens on day 305, when the national plan finally exists, and rewinds to one lit apartment window on the first morning. With every step back the answer is in more pieces: the forecasters, the doctors, the hospital and the neighbors each hold one, and no one connects them.

- Structure template: `reverse-chronology` (VIRAL_STRUCTURES.md #13). The template's "stop-start" pace is played as a slow build with two holds (day 12 and the first morning).
- Analog: `heatwave-2003` (France, August 2003). The threat is never named on screen. It is only the red.
- Medium: children's-book flat. Soft rounded flat shapes, warm grays, no outlines, soft offset shadows. Only red and green are saturated.
- DUR 40 s, 1080x1920, 30 fps. Scene: `scenes/day-three-hundred-five.js`.

## Time mapping (one stated mapping per segment)
- **Rewind (t = 3.0 to 16.5 s): log time, played backward at a constant 0.204 decades per second.** Day 305 falls to day 12 over t = 3.0 to 9.9. A labeled hold on day 12 runs from 9.9 to 11.2. Day 12 falls to day 1 over 11.2 to 16.5, then day 1 holds to 22.6. Equal screen time covers an equal *ratio* of days, so the last ten months pass in seconds and the first two weeks get half the rewind. A strip at the bottom of the frame (log scale, no numbers except its two labeled ends) shows the playhead moving.
- **Snap A (t = 23.3 to 25.3 s): true proportional speed.** The full 305 days play linearly in 2.0 s (1 s = 152 days). All of the red fits in the first 56 px of a 900 px axis.
- **Snap B (t = 25.8 to 29.4 s): linear, days 0 to 19 in 3.6 s (1 s = 5.3 days), identical in both lanes.**

## Speed math
**Threat (red).** The analog provides only endpoints, with no daily death series: extent 0 on day 0 and 1.0 on day 19 (s1, s2). Its sourced shape: the heat begins on day 1, peaks on day 11 (Aug 12), and ends on day 14 (Aug 15). Excess deaths exceeded 1,000 a day on days 11 and 12 and stopped by day 19. **My interpolation, not data:** heat intensity h(d) is piecewise linear, 0 at d = 0, 0.55 at d = 2, 1.0 at d = 11, 0 at d = 14.5, then smoothed. The daily loss rate is h(d - 0.5)^2, and the cumulative extent E(d) is its running integral normalized to 1 at day 19. E(d) therefore follows the temperature shape and peaks around days 11 to 12, as the sources say. The red on screen is a sun and haze whose strength is h(d), plus the red humps in the snap panels (also h(d)). The windows that go dark are driven by E(d).
- The dark windows are **symbolic, not to scale**. Six of about 230 windows (2.6 %) go dark, at thresholds E = (i + 0.5)/6, all between roughly day 8 and day 14. The real toll was about 14,800 excess deaths in a country of about 60 million (about 0.025 %). The notes say so, and the film shows no count.
- Loss is shown only as absence: a window goes from cream to dark and a chair is empty. There are no bodies.

**Human aggregation (green).** From the analog: median 12 (Plan Blanc, Aug 13, s4), p10 9.5 (ER doctors' public alarm, *unverified day*, s7) and p90 305 (Plan canicule, June 1 2004, s6). The distribution is heavily skewed, so `L.lognormalQuantile` (one sigma) would put the p10 at 0.5 days, which is wrong. I use a two-sided lognormal: sigma_lo = ln(12/9.5)/1.2816 = 0.182 below the median and sigma_hi = ln(305/12)/1.2816 = 2.524 above it. Quantiles: q = .1: 9.5 d, .3: 10.9, .5: 12.0, .6: 22.7, .7: 45.1, .8: 100, .9: 305.
- The wide shot has 12 neighbor and holder links whose join days are these quantiles at q = (i + 0.5)/12. Links later than day 305 are never drawn. Two links are fixed: hospital to doctors on day 12 (Plan Blanc, verified) and forecasters to hospital on day 305 (the national plan, verified). As the rewind passes each link's join day the link disappears. By day 9 nothing is connected, and every fragment sits alone.
- Snap B, human lane: fragments join at q = .1, .3 and .5 (9.5, 10.9 and 12.0 d). The fourth, at q = .8, joins at 100 d and never arrives within the panel. The assembled piece appears at day 12, labeled "Day 12".

**AI counterfactual (illustrative).** From the analog `ai_counterfactual.aggregation_median` = 3. I keep the same distribution shape scaled by 3/12, so the lane's joins fall at 2.4, 2.7 and 3.0 d and the fourth at 25 d (outside the panel). Basis (from the analog): join a temperature forecast with a known heat-mortality relationship and route a warning to hospitals and home-care. That is a short expert analysis task, well inside the ~17.4 h 50 % task horizon (RATES.md, METR). People still decide and activate. The lane shows **only when the pieces assemble relative to the red**, never an outcome. No windows are shown staying lit, and there is no claim that deaths would have been prevented. It is labeled "frontier AI routing · illustrative" (44 px) and says "before the peak", with no day number.

**Numbers on screen (verified only): "Day 305" (s6) and "Day 12" (s4).** Day 1, the peak day and the doctors' date stay off screen as numbers: "the first morning" and "peak" are words. The forecaster (f1), cities abroad (f2) and ER doctors (f3) have `verified:false` dates. They appear as holders of pieces, never with a date.

## Honesty notes
- Frame 1 is a cold-open double exposure. The red sun of that summer sits over the day-305 window, with the text "Day 305." It fades by t = 2 s and the day-305 street is cool gray. The red therefore belongs to the same timeline and is not claimed to be present on day 305.
- The dark-window count is symbolic (see above). The per-link join times apply the analog's documented response distribution to a neighborhood. That is an interpretation, not a measured neighborhood dataset.

## Shot list and camera (L.camera keyframes, eased)
| t | shot | camera |
|---|---|---|
| 0.0-3.0 | SC1 CLOSE. POV from the sidewalk: her hand holds the whole green plan in front of a ground-floor window that is dark, with an empty chair. "Day 305." / "The plan arrived." Red double exposure fades. | locked, zoom 3.0 |
| 3.0-8.9 | SC2 REWIND, DOLLY OUT. The plan splits into pieces and two fly away. Snow and leaves rise (reverse seasons). Links vanish. "Rewind." / "Each step back, more pieces." | zoom 3.0 to 1.3 |
| 8.9-10.2 | SC3 CRANE UP. The whole block appears, the red sun rises (in reverse the heat returns), dark windows relight in reverse order. | zoom 1.3 to 0.5, y rises |
| 10.2-13.5 | SC3 WIDE hold. Day 12 hold: "Day 12. After the peak." Then "The pieces were all here." Labels: forecasters, doctors, hospital, neighbors. | hold 0.5 |
| 13.5-16.5 | SC4 DROP DOWN. Down to the one window on the first morning. "Before anyone connected them." | zoom 0.5 to 4.2, closer than SC1 |
| 16.5-22.6 | SC5 CLOSE+. Man in his chair, window lit, her hand with one piece, red at the top edge. "The first morning." then "We slowed it down / so you could see it." | slow push 4.2 to 4.5 |
| 22.6-23.3 | Dead stop. Silence, then one hit. | cut to black |
| 23.3-25.4 | SC6 SNAP A. True speed, 305 days on one axis. "As it happened." | locked |
| 25.4-31.0 | SC6 SNAP B. Two 900 px lanes, days 0 to 19, same clock: human (Day 12, after the peak) vs frontier AI routing (illustrative, before the peak). "Same pieces. Two speeds." | locked |
| 31.0-33.5 | SC7 EXTREME CLOSE. His hand and hers, the green piece passing through the window. "illustrative" | push in |
| 33.5-36.0 | SC8 NECK. "This is the bottleneck." over the lit window. | hold |
| 36.0-40.0 | END. L.endCard("The bottleneck is us."), 4.0 s | hold |

**Zoom cycles.** Cycle 1: IN 0-3, OUT 3-10.2 (dolly then crane up), hold, IN+ 13.5-16.5 (zoom 4.2 > 3.0). Cycle 2: OUT to the snap panels 23.3-31, IN++ 31-33.5 (hands, the closest framing of the film).

## 3D translation note
- SC1/SC5: a 50 mm lens at the eye height of a person standing on the sidewalk, looking slightly up at a ground-floor window. Her forearm enters from lower left in soft focus. The windows get real glass: a faint double reflection of the red sun in SC1.
- SC2 to SC3: a crane on a long arm, slow ease-in, rising about 40 m over about 7 s. Reverse particles (snow, leaves) drift upward in volumetric light. At the top, a 24 mm lens looks down across a whole block of rooftops, with the red sun low and huge.
- SC4: the drop is faster than the rise (about 3 s) and ends closer than SC1, at 85 mm on the lit window, so the room behind the glass has depth (a chair, a fan, a lamp).
- Characters: flat children's-book people as soft clay-like figures (bean bodies, dot eyes). The fragments are glowing green puzzle pieces with real emissive light. In 3D, the lit and dark windows could cast real light onto the street.
- The snap panels become a physical paper timeline on a table, with a playhead sliding along it.

## Copy variants
- Openers: "Day 305. The plan arrived." / "The plan came ten months late." / "Rewind to the first morning."
- Middle: "Each step back, more pieces." / "The pieces were all here." / "Before anyone connected them."
- Snap: "Same pieces. Two speeds." / "Routed before the peak. Illustrative."
- Closer: "This is the bottleneck." / "The bottleneck is us." / "The answer was on the street."

## Tags
{"structure":"reverse-chronology","medium":"children's-book flat","family":"weather/fluids","scale":"family","pace":"slow build","emotion":"grief","protagonist":"one person","camera":"crane up and drop down","analog":"heatwave-2003"}

Diversity check: OK: distinct enough (nearest two-days 0.89, the-last-thirteen-days 0.89).
