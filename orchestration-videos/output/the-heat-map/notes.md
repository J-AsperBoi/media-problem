# The Heat Map

Tier: animatic

**Logline.** One old man, one fan on a sill, on a hot night. The camera pulls straight back through his window, then out through powers of ten: his block, his city, his country, all drawn as a topographic map where the heat is a stack of red isotherms rising like a hill. Green pins sit on the same map: a neighbor with a key, a hospital plan, a national heat plan. Nobody holds the whole map. The camera dips back into the city as the hospital plan connects, after the peak, then falls all the way back to his face, closer than before. Across the street, a window has gone dark.

- Structure: `powers-of-ten-zoom` (research/VIRAL_STRUCTURES.md #5)
- Analog: `heatwave-2003` (France, Aug 1-20, 2003)
- Medium: topographic map (gray land and relief contours; only the red isotherms and green pins are saturated)
- Differs from the other three films on this analog: day-three-hundred-five (reverse chronology, children's-book), the-balcony (POV, shadow puppet), nineteen-days (x-ray, heartbeat clock). This one is scale: the same heat field seen at four scales, one continuous zoom.

## Time mapping (one mapping, stated)
- Race (t = 1.4 to 20.4 s): **1 film second = 1 day**, day d = t - 1.4, days 0 (Aug 1) to 19 (Aug 20). Linear. The camera moves; the clock never changes speed.
- Cold open (t 0 to 1.4): flash-forward to day 11 (same timeline; heat near its peak), then a cut back to day 0.
- Snap (t 24.0 to 28.5): the same 19 days in **4.5 s** in both lanes, same red in both.

## Speed math
**Threat (red).** Same fit as nineteen-days / the-balcony, for consistency. The analog sources only the endpoints (extent 0 on day 0; 1.0 = all ~14,800 excess deaths by day 19, s2) plus the peak (daily excess > 1,000 on days 11-12, s2). No straight line: `L.logistic` fitted through them.
- Midpoint at day 11.5 (sourced peak); extent 0.99 at day 19: k = ln(99)/7.5 = 0.613/day, early doubling ln2/k = 1.13 days, normalized so E(0)=0, E(19)=1.
- Heat curve h(d) = rho(d) = 4 s(1-s), s the raw logistic: 0.003 on day 0, 0.05 on day 4.4, 0.38 day 8, 0.98 day 11, 1.0 day 11.5, 0.59 day 14, 0.04 day 19. This is a fit to the sourced mortality peak (temperature peak day 11, heat wave days 1-14 bracket it), used as the "heat" on screen, and stated as such.

**What the red drives on screen.** One heat field T(x, y, d) = h(d) * G(x, y), where G is a fixed spatial pattern in one global map coordinate system (a regional dome, an urban heat island over his city, and finer relief at each scale; normalized so G = 1 at his window). Red isotherms are the contour lines T = 0.05, 0.10, ..., 0.95 (every fourth drawn heavier, like index contours), extracted by marching squares every frame. Because every scale samples the same G (coarse scales drop detail finer than their grid), the red is consistent across the zoom: the same day shows the same heat at every scale; only the framing changes. The isotherms "rise" (appear at the dome and spread outward) as h grows and recede after day 11.5. A faint red wash is proportional to T. G's shape is illustrative geography; its timing is the fitted curve.
- Windows going dark (loss as absence): lit windows at block and city scale go dark when E(d) crosses per-window thresholds; the one across the street from him goes dark at E = 0.5 (day 11.5). The share that goes dark is symbolic, not a death count.

**Human aggregation (green).** Analog aggregation median 12, p10 9.5, p90 305 (days). Two-sided lognormal: sigma_low = ln(12/9.5)/1.2816 = 0.182, sigma_high = ln(305/12)/1.2816 = 2.525.
- Labeled pins: a neighbor with a key (q 0.2, connects day 10.3); a hospital plan (q 0.5, day 12.0 = the median = Plan Blanc, Aug 13, the analog's verified f4); a national heat plan (q 0.9, day 305 = p90, Plan canicule June 2004, verified f5; never within the film).
- Eight unlabeled pins across the country at quantiles (i+0.5)/8: days 9.6 to ~1,700, so a couple connect during the film and most never do (real skew).
- Before its day each line reaches part way and breaks (attention elsewhere; the attempt rhythm is a vibe, the arrival days are data).
- Unverified fragments (forecasters day 1, ER doctors' alarm ~day 9.5, foreign warning systems) are NOT on screen.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 3 days (basis in the analog: joining a known forecast with the heat-mortality relationship and routing a warning to hospitals and home care is a short expert task, inside the ~17.4 h METR 50% horizon in RATES.md). Same lognormal shape scaled by 3/12: 2.6 / 3.0 / 76 days. Day 3 is before the peak (h(3) = 0.02). Labeled illustrative on screen; the red isotherms are drawn identically in both lanes. Only the day the pieces meet changes; no outcome is claimed.

**On-screen numbers (two):** "day 12" (hospital plan, verified) and "day 3" (illustrative). Scale labels are words (his window / block / city / country), not distances. "11 C above normal" is sourced (s1, s2) but left off screen to keep two numbers.

## Shot list and camera (continuous zoom through scales; camera p = log10 scale, 0 = his window)
| t | shot | camera | content |
|---|---|---|---|
| 0.0-1.4 | SC1 CLOSE (flash-forward, day 11) | p 0 | his face, fan, red isotherms sweeping the room, green pins glowing at the window edge. "He can't see the map." |
| 1.4-4.6 | SC2 CLOSE | p 0 | day 0-3: gray, fan turning. "One fan. One window." |
| 4.6-10.4 | SC3 ZOOM OUT | p 0 to 3, eased | window -> block -> city -> country; red isotherms appear at the dome (day 4.4) and spread. "The heat has a shape." / "Help exists. In pieces." |
| 10.4-12.2 | SC3 WIDE HOLD | p 3 | country, days 9-10.8, red climbing to the peak; neighbor connects (day 10.3). "No one holds the whole map." Legend. |
| 12.2-13.2 | SC4 DIP IN | p 3 to 2 | into his city at the peak. |
| 13.2-15.2 | SC4 CITY HOLD | p 2 | hospital plan connects day 12.0; windows go dark. "The plan came after the peak." |
| 15.2-17.6 | SC5 FALL IN | p 2 to -0.2 | back through block to his face, closer than SC2. |
| 17.6-20.4 | SC5 CLOSE+ | p -0.2 to -0.26 | heat receding. "Across the street, a window went dark." |
| 20.4-23.0 | SLOW | hold, darken | "We slowed it down so you could see it." |
| 23.0-23.6 | freeze, black, silence | | |
| 23.6-31.5 | SC6 SNAP | two stacked 920 px panels | 19 days in 4.5 s, same isotherms; People: hospital plan day 12 (after the peak) / Frontier AI: day 3, illustrative (before the peak). |
| 31.5-35.8 | SC7 CLOSE++ | p 1.3 to -1.0 | fall from his block into his eye; the green pins close into a ring. "This is the bottleneck." |
| 35.8-40.0 | END | | end card, 4.2 s. |

Zoom cycles: IN 0-4.6 -> OUT 4.6-12.2 (country) -> half IN 12.2-13.2 (city) -> IN+ 15.2-17.6 (p -0.2, 1.6x closer than start); cycle 2: snap wide 23.6-31.5 -> IN++ 31.5-35.2 (p -1.0, his eye).

## 3D translation note
Build it as a real relief model: a physical-looking topographic map (laser-cut layered gray card) at country, city and block scale, nested, with his room as a practical set at the center. The red isotherms are emissive red lines lying on the terrain that rise off it as a translucent heat dome (height = h(d)), so at the peak the dome swallows the city. Green pins are glowing map pins with long thin light threads. SC1-SC2: 85 mm, eye level, 50 cm from his face, the fan's blades soft with motion blur, red lines crawling across the wall and his glasses. The zoom-out is a single vertical crane on an exponential curve (constant perceived speed, ~2 s per power of ten), lens widening from 50 to 24 mm, with the roof dissolving into map. Holds are locked-off top-down. The fall back in is faster and ends at 100 mm on his face; SC7 ends macro on his eye with the green ring reflected in the cornea. Richer in 3D: parallax between terrain layers, the heat dome's volume, real light from lit windows going out.

## Copy variants
- He can't see the map. / One fan. One window. / The heat has a shape. / Help exists. In pieces. / No one holds the whole map. / The plan came after the peak. / Across the street, a window went dark. / We slowed it down so you could see it. / Same heat. Full speed. / This is the bottleneck.
- Alternates: "Every line is hotter." / "The map was never shared." / "Help had a pin, not a route." / "Zoom out. Nobody's routing."

## Tags
{"structure":"powers-of-ten-zoom","medium":"topographic map","family":"weather/fluids","scale":"multi-scale zoom","pace":"slow build","camera":"continuous zoom through scales","emotion":"dread","protagonist":"one person","analog":"heatwave-2003"}

Diversity check: OK (nearest day-three-hundred-five 0.56, two-days 0.67, the-balcony 0.67).

## Scores (after render; 40.0 s confirmed by ffprobe)
- Hook: 7 (frame 1: a worried old man's face and fan crawling with red isotherms, green pins glowing in the window, "He can't see the map.")
- Speed accuracy: 8 (one heat field, T = h(d) G, contoured by marching squares at every scale, so the red agrees across the zoom; logistic fit through sourced endpoints plus peak; lognormal arrivals; 1 s = 1 day throughout the race)
- Snap impact: 6 (black freeze, hit, stacked 920 px panels with the same isotherms and curve; the gap is 9 days, staged rather than inflated)
- Emotion: 7 (the face is readable and the zoom out gives real vertigo; the dark window next to him lands quietly)
- Originality: 8 (a topographic map where the heat is the relief; Powers-of-Ten through nested map scales)
- Craft: 7 (clean crossfades with full-frame layers; the block level is busy and the city grid reads a little mechanical)
- Honesty: 9 (two numbers, 12 verified and 3 illustrative; unverified fragments off screen; heat curve stated as a fit; window share symbolic)
- Overall: 7.4
- Virality: 8% (a face melting into red contour lines, then a Powers-of-Ten pull-out, is a real scroll-stopper, but the middle is map abstraction and the payoff is a chart, which caps sharing).

Fix pass: country layer got the wrong scale argument (no lines drawn); pins moved below the title band; extended isotherm levels past 1.0 so the peak shows lines at close range; moved the darkening window and eased the CLOSE+ zoom so the "window went dark" card shows what it says.
