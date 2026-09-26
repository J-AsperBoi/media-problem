Tier: animatic

# The Warehouse

**Logline.** A mother measures rice into a pot; each week the scoop holds less as red price ink seeps up the paper wall behind her. Crane up: across the sea, a warehouse of idle rice glows green, unconnected. Drop back into the kitchen at the worst week, when the stock and the need finally meet and the red recedes. Then the snap: same people, same stock, found a few weeks sooner (illustrative).

- Structure: `man-in-a-hole` (VIRAL_STRUCTURES.md #3). Played as one clean fall-rise (the real price fall after the deal), then a second, smaller climb in the snap.
- Analog: `rice-2008`. The threat is never named: it is only red ink. No countries, flags or officials on screen ("across the sea", "a warehouse").
- Medium: paper cutout. Layered cut-paper shapes with soft drop shadows, gray and cream papers; only red and green are saturated.
- DUR 44 s, 1080x1920, 30 fps. Scene: `scenes/the-warehouse.js`.

## Time mapping (one stated mapping)
- **Race (t = 2.2 to 26.0 s): linear, 1 second = 1 week**, weeks 12 to 35.7 after t0 (t0 = first major export ban, Oct 2007). Week w is on screen at t = 2.2 + (w - 12). Weeks 0-12 are skipped because the fitted red is under 5% of its climb there (flat); this is a start point, not a second mapping.
  - Deal (f4, week 31.3) lands at t = 21.5. Prices reach ~$800 (week 35.7) at t = 25.9.
- **Cold open (t = 0 to 2.2):** flash-forward to week 30 (red near the top), then the red drains back down to week 12 (a labeled rewind "Months earlier."). Same timeline, same curve.
- **Snap (t = 31.0 to 35.0): weeks 12 to 40 in 4.0 s (1 s = 7 weeks), identical in both lanes.**

## Speed math
**Threat (red) = price climb extent** (extent = (price - 300)/800, analog notes). Sourced points: 0.875 at week 29.1 (s2, April 2008 > $1,000/t), 1.0 at week 30.6 (s3, peak > $1,100/t). The only early point (week 5.3, extent 0) is `verified:false`: used only as a shape anchor (0.01), never on screen. The price does not climb linearly, so I fit a logistic K/(1+exp(-r(t-m))) through the three anchors by least squares: **K = 1.564, r = 0.222/week (early doubling time 3.1 weeks), m = 28.02**. Fit residual < 1e-3 at all three anchors. Red extent = min(fit, 1) until the deal.
- After the deal (week 31.3), extent decays exponentially toward the June point: 1.0 -> 0.625 at week 35.7 (s3) gives k = ln(1/0.625)/4.4 = 0.107/week. This is the analog's `deploy.median` = 4.4 weeks.
- On screen, the red is the ink height on the paper wall behind her (0 = baseboard, 1 = near the ceiling) and red ink in every coastal window during the wide shot (price is one market, so all houses share one level).
- **Scoop size = rice per fixed budget.** Quantity is proportional to 1/price, so scoop area is proportional to 300/price and the radius to sqrt(300/price): at the peak the scoop holds ~27% of the week-0 amount (radius x0.52). Price is used internally only (the $300 base is unverified; it only sets the ratio and is not shown).

**Human aggregation (green).** Analog: median 31.3 (Japan-Philippines deal, s1), p10 27.3 (importer's failed tender, s1), p90 205.3 (G20 AMIS, `verified:false`, used only as distribution tail, never shown). Heavily skewed, so a two-sided lognormal: sigma_lo = ln(31.3/27.3)/1.2816 = 0.107, sigma_hi = ln(205.3/31.3)/1.2816 = 1.468.
- Wide shot: five green threads reach from the warehouse across the sea toward the coast. Thread i connects at quantile q = 0.1, 0.3, 0.5, 0.7, 0.9 -> weeks 27.3, 29.6, 31.3, 67.0, 205.3. Each grows linearly from week 0 to its arrival, so the late ones visibly dangle mid-sea (some connect early, some absurdly late). Only the q = 0.5 thread (the deal, week 31.3) is drawn as the assembled line into the kitchen.
- The buyers' need (f2, week 27.3) lights green at the coastal port. The economists' idea (f3) and AMIS (f5) are `verified:false`: off screen.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 28.3 (analog): matching a public, stated shortage (the withdrawn tender, week 27.3) with a known idle stock and drafting terms is a short analysis-and-routing task within the ~17.4 h 50% task horizon (RATES.md, METR). Assumed surfaced within 1 week of the need going public; governments still negotiate and decide. Not assumed: earlier detection. In the AI lane the same decay law (k = 0.107/week) starts at week 28.3 from the fitted extent there (0.80). The lane shows the deal landing before the peak and the curve bending ~3 weeks sooner; it makes no claim about outcomes beyond the same measured decay. Label: "AI-assisted routing · illustrative" (44 px+). The gap is modest and is not inflated: the snap lands via staging (freeze, silence, one stamp, panels side by side).

**Numbers on screen (two, sourced):** "1.5 million tonnes" (f1, s1) and "a quarter" (prices fell >25% within ~4 weeks, s3: >$1,100 -> ~$800). No week numbers on screen: the panels share an unlabeled axis with "peak" and "deal" as words.

## Shot list and camera (L.camera keyframes, eased)
| t | shot | camera |
|---|---|---|
| 0.0-1.2 | SC1 CLOSE, cold open (week 30): her worried face, tiny scoop over the pot, red ink high on the paper wall, green warehouse glowing through the window across the sea. "There was enough rice." | locked, slight push |
| 1.2-2.2 | Red drains back down: "Months earlier." | locked |
| 2.2-11.0 | SC2 CLOSE race (weeks 12-20.8). Scoop shrinks, ink rises, calendar leaves fall, mood calm -> worried. | slow push in 1.0 -> 1.15 |
| 11.0-17.0 | SC3 CRANE UP (weeks 20.8-26.8). Kitchen layer rises away and fades full-frame; paper coast of houses with red windows; sea; warehouse. "1.5 million tonnes. Idle." Green threads crawl across. | map zoom 9 -> 1 |
| 17.0-21.5 | SC4 DROP DOWN, closer (weeks 26.8-31.3). Port lights green (need, wk 27.3). Down into the kitchen tighter than SC1: face, sad. Deal thread arrives through the window at 21.5 (at the peak). | map zoom 1 -> 9, kitchen 1.35 |
| 21.5-26.0 | SC5 RISE (weeks 31.3-35.7). Red drains a quarter, scoop grows, small smile. "The stock and the need met." / "Prices fell a quarter in a month." | hold 1.35 |
| 26.0-29.8 | Dead stop: "We slowed it down so you could see it." | hold, dim |
| 29.8-31.0 | Freeze. Silence. One stamp. | cut |
| 31.0-36.8 | SC6 SNAP WIDE: two 940 px paper panels, same clock: "As it happened" (deal at the peak) vs "AI-assisted routing · illustrative" (deal before the peak). "Same stock. Same people. Found sooner." | locked |
| 36.8-40.0 | SC7 IN++: extreme close on her hands, full scoop, green glow. "This is the bottleneck." | push 1.6 -> 1.8 |
| 40.0-44.0 | END: L.endCard("The bottleneck is us."), 4.0 s | hold |

**Zoom cycles.** Cycle 1: IN 0-11, OUT (crane up) 11-17, IN+ (drop) 17-21.5 (1.35 > 1.0). Cycle 2: OUT to the snap 31-36.8, IN++ 36.8-40 (hands, the tightest framing).

## 3D translation note
- SC1/SC2: 50 mm at seated eye height across the stove; her face three-quarter, steam in front. The wall is real layered paper; red ink wicks up it like capillary bleed (a shader, not a fill).
- SC3: a crane on a long arm straight up through a cutaway paper ceiling, 6 s, ease-in/ease-out, to ~200 m, then tilt to reveal the sea as stacked paper layers with parallax. The warehouse is enormous (size = resources), stacked sacks emitting soft green light.
- SC4: the drop is faster than the rise and ends at 85 mm on her face, closer than SC1.
- SC7: macro, 100 mm, on rice grains filling the scoop; shallow depth of field.
- Characters: paper puppets with jointed limbs and hand-cut faces (brows and mouth swap per mood, like replacement animation).

## Copy variants
- "There was enough rice." / "Enough rice. Wrong side of the sea." / "The answer was in a warehouse."
- "The stock and the need met." / "Prices fell a quarter in a month."
- "Same stock. Same people. Found sooner." / "Routing, not rice."

## Tags
{"structure":"man-in-a-hole","medium":"paper cutout","family":"cooking","scale":"economy","pace":"slow build","camera":"crane up and drop down","emotion":"tenderness","protagonist":"one person","analog":"rice-2008"}

## Build log
- Preview 1: structure worked. Fixes: calendar leaves fell behind the counter and read as a stray dark shape (fall shortened); the green warehouse glow in the window was too small for the thumbnail (enlarged); the "deal" label overlapped the red curve in the snap panels (moved above the dot).

## Scores
- Hook: 6 (frame 1 has a worried face, a wall of red and a green warehouse in the window, with "There was enough rice." The green is still small.)
- Speed accuracy: 8 (logistic fit through the sourced points, 1 s = 1 week, sourced decay, lognormal thread quantiles, AI lane from the analog)
- Snap impact: 5 (the honest gap is only ~3 weeks. Staging carries it, but the panels look alike at a glance.)
- Emotion: 6 (the face changes from calm to worried, sad and then a small smile. The rice scoop is a tender anchor.)
- Originality: 7 (a paper-cutout kitchen as an economy film, and a man-in-a-hole rise built on real data)
- Craft: 6 (the paper layers and shadows read well. The mother's body and arm are stiff, and the crane is a crossfade, not a continuous move.)
- Honesty: 9 (no countries or officials, unverified items off screen, the modest counterfactual labeled illustrative)
- Overall: 6.7
- Virality: 6% (a quiet, warm film with a real twist that says "the rice existed", but the slow build and the small snap will lose most swipers in the first 3 s.)
