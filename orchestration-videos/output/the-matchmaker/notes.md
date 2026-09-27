# The Matchmaker

Tier: animatic
Slug: the-matchmaker · Structure: powers-of-ten-zoom · Analog: rice-2008 · Medium: blueprint · DUR 43 s

**Logline.** Powers of Ten on a blueprint: from one child's face over a bowl with less rice each week, out through the kitchen, the street, the country, to the world grain ledger, where the need and 1.5 million idle tonnes sit two cells apart while hand-drawn routes wander between them. People sign the deal; the zoom dives back to the bowl, closer. The snap: the same ledger where frontier AI only draws a faint candidate line between the two cells a few weeks sooner, and people still sign (illustrative).

## Time mapping (one mapping)
- **Race: linear, 1 second = 1 week.** Week w is on screen at t = 2.0 + (w - 12), weeks 12 -> 35.7 over t 2.0 -> 25.7. Weeks 0-12 skipped (fitted red < 5% of its climb; a start point, not a second mapping). Hold on week 35.7 from t 25.7 to 27.0.
- Need goes public (f2, wk 27.3) at t 17.3; deal (f4, wk 31.3) at t 21.3; June point (wk 35.7) at t 25.7.
- **Cold open (0 - 1.2 s):** flash-forward to week 30 (red near peak), then a labeled rewind ("Months earlier.") draining to week 12 by t 2.0. Same curve.
- **Snap:** both lanes share one clock, weeks 12 -> 40 in 4.0 s (7 weeks per second), t 30.4 -> 34.4.
- The zoom (camera) is independent of the clock: framing changes, speeds do not.

## Speed math
**Threat (red) = price-climb extent** e = (price - 300)/800 (analog notes). Reused from the-warehouse: logistic least-squares fit K/(1+exp(-r(w-m))) through (5.3, 0.01 shape anchor, verified:false, never on screen), (29.1, 0.875, s2), (30.6, 1.0, s3): **K 1.564, r 0.222/wk (early doubling 3.1 wk), m 28.02**, clamped at 1. After the deal, exponential decay to the sourced June point: k = ln(1/0.625)/4.4 = **0.107/wk**.
Red is the same single number at every scale (one market):
- Bowl (sheet 1): rice fill = relative quantity per fixed budget = 300/price; the empty part of the bowl is hatched red (at the peak 73% of the bowl is red hatch).
- Kitchen: the rice jar, same fraction.
- Street: market price boards filled to height e.
- Country plan: land hatched red from the south up to fraction e.
- World ledger: each importing cell's red bar filled to e.

**Human aggregation (green).** Two-sided lognormal (analog is skewed): p10 27.3 (failed tender, s1), median 31.3 (deal, s1), p90 205.3 (AMIS, verified:false, used only as distribution tail, off screen). sigma_lo = ln(31.3/27.3)/1.2816 = 0.107, sigma_hi = ln(205.3/31.3)/1.2816 = 1.468.
- Ledger: five hand-routed lines leave the stock cell (f1, green from week 0) and wander cell to cell toward five need cells. Line i arrives at quantile q = 0.1, 0.3, 0.5, 0.7, 0.9 -> weeks 27.3, 29.6, 31.3, 67.5, 205.3. Drawn length = min(1, w / arrival). The q = 0.5 line is our child's country (the deal). Two lines still dangle when the race ends (some connect absurdly late). The wandering path shape is a visual metaphor for routing through intermediaries; only arrival times are data.
- Need (f2, wk 27.3) rings our cell green. Deal: a green signature (people sign) at wk 31.3.
- f3 (economists) and f5 (AMIS) are verified:false: off screen.

**AI counterfactual (illustrative).** ai_counterfactual.aggregation_median = 28.3: matching a public, stated shortage (withdrawn tender, wk 27.3) with a known idle stock and drafting terms is a short routing task inside the ~17.4 h 50% task horizon (RATES.md, METR). Assumed surfaced within ~1 week of the need going public; governments still negotiate and sign. Not assumed: earlier detection. On screen AI is only a faint dashed straight line between the two cells, drawn wk 27.3 -> 28.3 and labeled "candidate match"; it turns solid only when people sign (wk 28.3). Same decay law (k 0.107) from the fitted extent at 28.3 (0.80). The gap (~3 weeks) is modest and not inflated; the snap lands by staging (freeze, silence, one stamp, both lanes on one clock).

**Numbers on screen (two, sourced):** "1.5 million tonnes" (f1, s1), "a quarter" (prices >$1,100 -> ~$800 in ~4 weeks, s3). Sheet names are words, no scale numbers, no week numbers, no countries, flags or officials.

## Shot list and camera (L.camera-equivalent: one fixed zoom center, log-scale zoom u)
Levels (each a blueprint sheet nested at the center of the next): BOWL x10 KITCHEN x10 STREET x20 COUNTRY x12 WORLD LEDGER (u = log10 zoom-out, 0 -> 4.38).
| t | shot | camera |
|---|---|---|
| 0.0-1.2 | SC1 CLOSE cold open (wk 30): child's face over a bowl mostly red hatch; green callout "stock: another sheet". "Enough rice. One sheet away." | hold u 0 |
| 1.2-2.0 | Rewind, red drains. "Months earlier." | hold |
| 2.0-5.0 | SC2 CLOSE (wk 12-15). "One bowl." | slow push u 0 -> -0.04 |
| 5.0-14.0 | SC3 CONTINUOUS ZOOM OUT (wk 15-24): kitchen, street, country, ledger. Accelerating (u ~ f^1.7), hard stop at 14. | OUT |
| 14.0-22.3 | SC4 WIDE, the ledger (wk 24-32.3). "1.5 million tonnes." "Idle. Two cells over." need rings (17.3), routes crawl, deal signed (21.3). | slow push u 4.38 -> 4.32 |
| 22.3-25.7 | SC5 DIVE IN (wk 32.3-35.7) to the bowl, closer than SC1. Red recedes, rice rises. | IN+ u 4.32 -> -0.35 |
| 25.7-27.0 | hold wk 35.7. "Prices fell a quarter." | hold |
| 27.0-29.6 | Freeze, dim: "We slowed it down so you could see it." | hold |
| 29.6-36.8 | SC6 THE SNAP: stamp, two 940 px panels on one clock: "As it happened" vs "Frontier AI drafts the match / illustrative · people still sign". "Same stock. Same people." | locked |
| 36.8-39.5 | SC7 EXTREME CLOSE on the bowl, full. "This is the bottleneck." | IN++ u -0.35 -> -0.55 |
| 39.5-43.0 | End card "The bottleneck is us." (3.5 s) | |
Zoom cycles: IN 0-5, OUT 5-14, hold 14-22.3, IN+ 22.3-25.7, IN++ 36.8-39.5.

## 3D translation note
One unbroken dolly on a single optical axis, like the Eames film: start with a 100 mm macro at the child's eye line over the bowl (the bowl rim soft in the foreground), then pull straight up and back with an exponential speed ramp so each sheet lasts about the same time, and the pull accelerates. The world is literally drafting paper: each scale is a vellum sheet lying on the next, lines drawn in white ink, and at each transition the camera passes through the sheet's paper grain. At the ledger, stop dead (a 1-frame settle) and hold on a huge drafting table of cells. The dive back is faster and ends at 35 mm closer than the opening, lens nearly touching the rice. Characters: one child in white-ink contour lines; rice as real grains in the bowl, red as translucent ink hatching. AI in 3D is only a light pencil line snapping taut between two cells; a real hand (in contour lines) signs.

## Copy variants
- "Enough rice. One sheet away." / "The stock was on the same page." / "Two cells apart. Months apart." / "Routed by hand." / "A faint line. People signed." / "The bottleneck is us."

## Tags
{"structure":"powers-of-ten-zoom","medium":"blueprint","family":"market","scale":"economy","pace":"accelerating","emotion":"resolve","protagonist":"AI","camera":"continuous zoom through scales","analog":"rice-2008"}
Diversity: OK (nearest the-fact-check 0.67, the-warehouse 0.78).
