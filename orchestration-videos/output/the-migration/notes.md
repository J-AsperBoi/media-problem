Tier: animatic

# The Migration

**Logline.** A hushed nature documentary in ink wash. At the edge of a dry land, one family's bowl holds less each week as a red wash creeps over the plain. The camera cranes up: far across the ridges, a green herd of grain rests in a quiet valley. It migrates only when a route is found. The camera drops down to one small green grain, closer than before, as the route finally opens and the wash recedes. Then the snap: the same herd, the same land, the route found about three weeks sooner (illustrative).

- Structure: `nature-documentary` (VIRAL_STRUCTURES.md #14). Documentary lower-third captions in serif, few words, sound-off legible. The tone is tender, never mocking.
- Analog: `rice-2008`. The threat is never named; it is only a red wash, like drought. There are no countries, flags or officials on screen. "Between nations" appears only as ridges between two lands.
- Medium: ink wash. Pale rice paper, layered gray washes, brush lines. Only red and green are saturated.
- Protagonist: a green fragment. One grain of the herd has a gentle face: closed, sleeping eyes, then open eyes and a small smile.
- DUR 44 s, 1080x1920, 30 fps. Scene: `scenes/the-migration.js`.

## Time mapping (one stated mapping)
- **Race (t = 2.4 to 26.1 s): linear, 1 second = 1 week**, weeks 12 to 35.7 after t0. t0 is the first major export ban, Oct 2007. Week w appears on screen at t = 2.4 + (w - 12). Weeks 0-12 are skipped because the fitted red is under 5% of its climb there. This is a start point, not a second mapping. It is the same mapping as the-warehouse, for consistency.
  - The need becomes public (f2, week 27.3) at t = 17.7. The route opens (f4 deal, week 31.3) at t = 21.7. Prices reach ~$800/t (week 35.7) at t = 26.1.
- **Cold open (t = 0 to 1.4):** a flash-forward to week 30, when the red is near its peak. It is the same timeline. From 1.4 to 2.4 the red drains back to week 12, labeled "Months earlier."
- **Snap (t = 30.6 to 34.6): weeks 12 to 40 in 4.0 s (1 s = 7 weeks), identical in both lanes.**

## Speed math
**Threat (red) = price-climb extent**, where extent = (price - 300)/800, per the analog notes. This reuses the-warehouse's fit, for consistency across films. The sourced points are 0.875 at week 29.1 (s2) and 1.0 at week 30.6 (s3). The week 5.3 point is `verified:false`, so it serves only as a 0.01 shape anchor and never appears on screen. Least-squares logistic K/(1+exp(-r(w-m))): **K = 1.564, r = 0.222/week (early doubling ~3.1 weeks), m = 28.02**, and the extent is clamped at 1. After the route opens (week 31.3), the extent decays exponentially to the sourced June point: k = ln(1/0.625)/4.4 = 0.107/week, which matches the analog's `deploy.median` of 4.4 weeks. That is a fall of more than a quarter in price (>$1,100 to ~$800, s3) within ~4 weeks.
- CLOSE layer: the red wash rises from the horizon over the land behind the family. Wash height is proportional to extent.
- WORLD layer: the red wash covers the plains from the east edge westward. Covered width = extent. Price is one market, so the whole plain shares one level.
- Bowl: grain per fixed budget is proportional to 1/price, so the grain-surface radius is proportional to sqrt(300/price). At the peak the bowl holds ~27% of the week-0 amount. Price is used only internally, and the $300 base is unverified.

**Human aggregation (green).** The analog gives median 31.3 (the deal, s1), p10 27.3 (the importer's failed tender, s1) and p90 205.3 (the G20 transparency system, `verified:false`, used only as the tail and never shown). The distribution is skewed, so it is a two-sided lognormal: sigma_lo = ln(31.3/27.3)/1.2816 = 0.107, sigma_hi = ln(205.3/31.3)/1.2816 = 1.468.
- The p10 fragment (f2, the need) is a green signal that lights at the family's land edge at week 27.3.
- Route searches: three green trails leave the herd valley toward the plains, one for each quantile. q = 0.5 arrives at week 31.3 and becomes the open route. q = 0.7 would arrive at week 67.0 and q = 0.9 at week 205.3; both stall partway in the film, drawn at w/arrival of their length. This shows the real variance: some routes connect absurdly late.
- The economists' idea (f3) and the AMIS system (f5) are `verified:false`, so they stay off screen.
- The "migration" (the green stream flowing down the route after week 31.3) is a metaphor for the stock being released. Per s3, the announcement itself moved prices, and little rice needed to ship. The stream is not a claim about shipped volumes.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 28.3. Matching a public, stated shortage (the withdrawn tender, week 27.3) with a known idle stock and drafting terms is a short analysis-and-routing task. It fits within the ~17.4 h 50% task horizon (RATES.md, METR). The assumption is that the match surfaces within 1 week of the need going public, and governments still negotiate and decide. The film does not assume earlier detection. The AI lane uses the same decay law (k = 0.107/week), starting at week 28.3 from the fitted extent there (0.80). The gain is ~3 weeks and is not inflated. The snap lands through staging instead: a freeze, silence, one stamp, then two 940 px panels. The AI lane's route opens before the peak, and a bracket shows the gap.

**Numbers on screen (two):** "Week 31" (the deal, f4, s1) and "Week 28" (AI lane, labeled illustrative, from the analog counterfactual). Both appear only in the snap. Everything else is words.

## Shot list and camera (L.camera keyframes, eased)
| t | shot | camera |
|---|---|---|
| 0.0-1.4 | SC1 CLOSE eye level, cold open (week 30). The child's face over a nearly empty bowl, a hand at the rim. A red wash high over the land. The green herd glows on the far horizon. "Enough grain existed. Just not here." | locked, slow push |
| 1.4-2.4 | The red drains back: "Months earlier." | locked |
| 2.4-9.5 | SC2 CLOSE race (weeks 12-19.1). The wash creeps up, the grain level shrinks, the face goes from calm to worried. "At the edge of the land, a bowl." / "Each week, it holds less." | push 1.0 -> 1.1 |
| 9.5-15.5 | SC3 CRANE UP (weeks 19.1-25.1). The close layer shrinks and fades full-frame into the world layer: plains, red spreading, ridges, the far valley with the green herd resting. "Far away, a herd rests." | world zoom 7 -> 1 |
| 15.5-19.0 | SC3b WIDE hold (weeks 25.1-28.6). Green trails wander in the ridges and stall. The need signal lights at 17.7. "It cannot find a route." | hold 1.0 |
| 19.0-21.7 | SC4 DROP DOWN to one grain in the herd, asleep (weeks 28.6-31.3). "Week after week, it waits." | zoom 1 -> 11 |
| 21.7-23.6 | SC4b Its eyes open. The route opens; the herd rises and flows. "Then, a route opens." | zoom 11 -> 4, track along route |
| 23.6-26.5 | SC5 CLOSE at the bowl, closer than SC1 (1.35). The green grain arrives at the rim, the wash recedes, the child smiles. "The wash recedes within weeks." | push 1.3 -> 1.4 |
| 26.5-29.3 | Dead stop: "We slowed it down so you could see it." | hold, dim |
| 29.3-30.0 | Freeze. Silence. One stamp. | cut |
| 30.0-36.6 | SC6 SNAP: two 940 px ink panels on one clock: "As it happened · Week 31" vs "AI-assisted routing · Week 28 · illustrative". "Same herd. Found sooner." | locked |
| 36.6-39.8 | SC7 IN++: extreme close on the green grain in cupped hands. "This is the bottleneck." | push 1.6 -> 1.9 |
| 39.8-44.0 | END: L.endCard("The bottleneck is us."), 4.2 s | hold |

**Zoom cycles.** Cycle 1: IN 0-9.5, OUT (crane up) 9.5-15.5, hold, IN+ (drop down to the grain, zoom 11) 19-21.7. Cycle 1b: a small pull 21.7-23.6, then IN+ at the bowl 23.6-26.5 (1.35 > 1.0). Cycle 2: OUT to the snap 30-36.6, then IN++ 36.6-39.8 (the tightest framing).

## 3D translation note
- SC1/SC2: a telephoto 85 mm at seated child eye height, with shallow focus. The bowl's rim is soft in the foreground, the face is sharp, and the far valley with its green herd is a soft bokeh glow on the horizon. The red wash should be a volumetric, dusty haze that stains the paper-textured ground like spreading ink, not a flat fill.
- SC3: a true crane on a long arm, 6 s, ease-in/ease-out, rising to aerial height, then a slight tilt down so the whole two-land valley reads as one sumi-e scroll. The mountain layers are separate planes with parallax and mist between them. The herd is hundreds of small grain creatures, with instanced idle breathing.
- SC4: the drop is a fast descent through the mist layers. It ends at a macro 100 mm on one grain's face, closer than any earlier shot. The eyes open, and the herd stands up in a ripple.
- SC7: a macro on cupped hands, with soft green subsurface glow from the grain.
- Characters: grain creatures are translucent jade, rice-shaped, with a small leaf sprout and ink-line eyes. Humans are brush-ink figures with pale faces and minimal features.

## Copy variants
- "Enough grain existed. Just not here." / "The herd was never lost. Just unrouted."
- "At the edge of the land, a bowl." / "Each week, it holds less."
- "Far away, a herd rests." / "It cannot find a route." / "Week after week, it waits." / "Then, a route opens."
- "Same herd. Found sooner." / "Routing, not rain."

## Tags
{"structure":"nature-documentary","medium":"ink wash","family":"ecology","scale":"between nations","pace":"slow build","camera":"crane up and drop down","emotion":"tenderness","protagonist":"a green fragment","analog":"rice-2008"}
Diversity: OK (nearest the-warehouse 0.56).

## Build log
- Preview 1: the structure worked. Fixes: the family's home in the world layer blew up into a dark rectangle during the crane crossfade, so it is now a tiny soft mark and the close layer fades out sooner. The "Week" labels in the snap overlapped the grain marker, so the labels moved under the axis and the grain moved to the top of the route line.
- Render: 44.0 s (ffprobe).

## Scores
- Hook: 7 (frame 1 shows a worried child's face over a small bowl, a big red wash across the land, and a green herd glowing on the horizon, with "Enough grain existed. Just not here.")
- Speed accuracy: 8 (the-warehouse's logistic fit through sourced points, 1 s = 1 week, the sourced 4.4-week decay, lognormal route trails, the AI lane from the analog)
- Snap impact: 5 (the honest gap is ~3 weeks. The bracket and the before-the-peak green line help, but the two panels still look alike at a glance.)
- Emotion: 7 (the sleeping-grain close-up waking as the route opens, and the grain arriving at the bowl, are genuinely tender)
- Originality: 7 (nature-doc captions plus a grain "herd" is a fresh metaphor, though the analog is now used four times)
- Craft: 6 (the ink-wash ridges and mist read well and the grain character is appealing. The humans are simple and the crane is a crossfade, not one continuous move.)
- Honesty: 9 (no countries or officials, unverified items off screen, and the migration noted as a metaphor since the announcement moved prices)
- Overall: 7.0
- Virality: 8% (a cute, shareable grain character and a clear "the food existed" twist, but the hushed slow build and the small snap will lose most swipers.)
