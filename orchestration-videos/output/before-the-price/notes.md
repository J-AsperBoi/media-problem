Tier: animatic

# Before the Price

**Logline.** One locked-off frame of a family table, like a page in a picture book. BEFORE: a grandmother ladles from a full pot while a child waits with a bowl. AFTER: the same frame, a smaller pot, and red creeping up the wall calendar. Week by week the pot shrinks, and one night the grandmother says she is not hungry and slides her bowl across. Then a single pull-out: the house sits on a shore, and across the sea an enormous warehouse of idle rice has been glowing green the whole time. The small green light in the kitchen window was it. Then the snap: the same people and the same stock, found about three weeks sooner (illustrative).

- Structure: `before-after` (VIRAL_STRUCTURES.md #11). Played as a same-frame before/after: the cold open shows AFTER, then cuts to BEFORE and lets the audience watch the frame become AFTER. The snap is a second before/after: "As it happened" against "AI-assisted routing · illustrative", on the same clock.
- Analog: `rice-2008`. The threat is never named. It is only red on a calendar and in windows. No countries, flags or officials on screen ("across the sea", "a warehouse").
- Medium: children's-book flat. Soft rounded flat shapes with no outlines and no drop shadows. Warm grays only. Red and green are the only saturated colors.
- DUR 40 s, 1080x1920, 30 fps. Scene: `scenes/before-the-price.js`.

## Time mapping (one stated mapping, with stops)
- **Running time: 1 second = 2 weeks.** The film is stop-start: at the stops, time freezes (the calendar stops flipping) and nothing about the data moves. It never runs at any other rate during the race.
  - t 1.4 to 4.2: STOP at week 12 (BEFORE).
  - t 4.2 to 8.2: run weeks 12 to 20.
  - t 8.2 to 9.8: STOP at week 20 (the grandmother gives her bowl away).
  - t 9.8 to 13.4: run weeks 20 to 27.2.
  - t 13.4 to 17.4: STOP at week 27.2 during the single pull-out and the wide hold.
  - t 17.4 to 19.45: run weeks 27.2 to 31.3 (the need lights at 27.3, and the deal thread lands at 31.3).
  - t 19.45 to 20.2: STOP at week 31.3.
  - t 20.2 to 22.4: run weeks 31.3 to 35.7 during the push back in.
- Weeks 0 to 12 are skipped because the fitted red is under 5% of its climb there. BEFORE = week 12.
- **Cold open (t 0 to 1.4):** a flash-forward to week 30.6 (the sourced peak), labeled AFTER. It is the same timeline and the same curve, and then it cuts back to BEFORE.
- **Snap (t 28.2 to 34.2):** both lanes run on one clock at 1 s = 7 weeks, weeks 12 to 40. They freeze together at week 28.3 (the AI-lane deal) for 1.0 s, then run on.

## Speed math
**Threat (red) = price-climb extent**, extent = (price - 300)/800 (analog notes). This reuses the-warehouse's fit. Sourced points are 0.875 at week 29.1 (s2, April 2008, over $1,000/t) and 1.0 at week 30.6 (s3, the peak, over $1,100/t). The week 5.3 point is `verified:false`, so it is only a shape anchor (0.01) and never appears on screen. The climb is not linear, so a logistic K/(1+exp(-r(w-m))) is least-squares fitted through the three anchors: **K = 1.564, r = 0.222/week (early doubling about 3.1 weeks), m = 28.02**, with residuals under 1e-3. Extent = min(fit, 1) until the deal.
- **Post-deal decay (sourced):** after the deal at week 31.3, extent decays exponentially toward the June point, 0.625 at week 35.7 (s3, about $800/t): k = ln(1/0.625)/4.4 = **0.107/week**. This is the analog's `deploy.median` of 4.4 weeks. Prices fall by more than a quarter (from over $1,100 to about $800) within about 4 weeks.
- Values used: extent 0.04 (wk 12), 0.23 (wk 20), 0.71 (wk 27.2), 0.81 (wk 28.3), 1.0 (wk 30.6), 0.625 (wk 35.7).
- **On screen:** the red fills the wall calendar's page from the bottom, with height = extent. In the wide shot every window on the shore holds the same red level, because rice is one market.
- **Pot size = rice per fixed budget.** Quantity is proportional to 300/price (relative, and the $300 base is only used as a ratio). Pot area follows quantity, so its linear scale is sqrt(300/price): 0.95 at week 12 and 0.52 at the peak. The bowls fill the same way.

**Human aggregation (green).** The analog gives median 31.3 (the Japan-Philippines deal, s1), p10 27.3 (the importer's failed tender, s1) and p90 205.3 (the G20 AMIS, `verified:false`, used only for the distribution's tail and never shown). The distribution is heavily skewed, so it is a two-sided lognormal: sigma_lo = ln(31.3/27.3)/1.2816 = 0.107 and sigma_hi = ln(205.3/31.3)/1.2816 = 1.468.
- In the wide shot, five green threads reach from the warehouse across the sea to five ports. Thread i connects at quantile q = 0.1, 0.3, 0.5, 0.7, 0.9, which gives weeks 27.3, 29.6, 31.3, 67.0 and 205.3. Each thread grows linearly from week 0 to its arrival, so at the freeze (week 27.2) most dangle mid-sea, and the late ones barely left. Our family's port is the q = 0.5 thread, the deal at week 31.3.
- The need (f2, week 27.3) lights our port green as time resumes. The economists' idea (f3) and AMIS (f5) are `verified:false` and stay off screen.
- The warehouse (f1) is ready at week 0. Its light is green in the kitchen window from frame 1 ("there the whole time").

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 28.3. Matching a public, stated shortage (the withdrawn tender, week 27.3) with a known idle stock and drafting terms is a short analysis-and-routing task well inside the ~17.4 h 50% task horizon in RATES.md (the METR entry). The assumption is that the match surfaces within 1 week of the need going public, and governments still negotiate and decide. Earlier detection is not assumed. In the AI lane the same decay law (k = 0.107/week) starts at week 28.3 from the fitted extent there (0.81). The pot stops shrinking at quantity 0.32 instead of 0.27 and recovers about 3 weeks sooner. The gain is modest and is not inflated. The snap lands through staging: a hard cut to black, silence, one stamp, the two panels side by side, and a freeze on the frame where only the AI lane has its green.

**Numbers on screen (two, both sourced):** "1.5 million tonnes" (f1, s1) and "a quarter" (the post-deal fall, s3). No week numbers appear. The snap panels use the words "peak" and "deal".

## Shot list and camera (L.camera keyframes, eased)
| t | shot | camera |
|---|---|---|
| 0.0-1.4 | SC1 CLOSE, cold open AFTER (week 30.6): small pot, calendar full red, the grandmother's worried face, the child looking up, a green light in the window. Chip "AFTER". "Same table. Smaller pot." | locked |
| 1.4-4.2 | SC2 CLOSE BEFORE (stop, wk 12): full pot, both smiling. Chip "BEFORE". "Before: a full pot." | locked |
| 4.2-8.2 | SC2 run (wk 12-20): calendar leaves flip, pot shrinks. "Each week, a little less." | locked |
| 8.2-9.8 | STOP (wk 20): the grandmother slides her bowl to the child. "Grandma says she's not hungry." | locked |
| 9.8-13.4 | run (wk 20-27.2): red climbs fast, faces worried. "The red kept climbing." | locked |
| 13.4-17.4 | SC3 THE PULL-OUT (stop, wk 27.2): one continuous eased dolly out from the kitchen, through the cut-away house, to the shore, the sea and the warehouse. "It was there the whole time." / "1.5 million tonnes. Idle." | zoom 8.3 to 1.0 |
| 17.4-20.2 | SC3 WIDE (wk 27.2-31.3): the port lights (need), threads crawl, and ours lands at 31.3. | hold |
| 20.2-22.4 | SC4 PUSH IN+ (wk 31.3-35.7): back into the kitchen, closer than SC1 on the child's face, pot growing, red falling. | zoom 1.0 to 10.5 |
| 22.4-24.8 | hold: "The red fell a quarter in a month." | hold |
| 24.8-27.6 | dim: "We slowed it down so you could see it." | hold |
| 27.6-28.2 | Hard cut to black. Silence. Stamp. | cut |
| 28.2-34.2 | SC5 SNAP: two 940 px panels, the same frame twice, "As it happened" against "AI-assisted routing · illustrative", one clock, and a freeze at the AI deal. "Same stock. Same people." / "Found sooner." | locked |
| 34.2-36.6 | SC6 IN++: extreme close on the child's full bowl and the grandmother's hand, green glow. "This is the bottleneck." | push |
| 36.6-40.0 | END: L.endCard("The bottleneck is us."), 3.4 s | hold |

**Zoom cycle.** IN (locked close-up) 0 to 13.4, OUT (the single pull-out) 13.4 to 16.0 with a wide hold to 20.2, IN+ 20.2 to 22.4 (zoom 10.5, tighter than 8.3), IN++ 34.2 to 36.6 (the bowl and hands, the tightest).

## 3D translation note
- The close-up is a truly locked-off 40 mm at seated child height, across the table, like an illustrated page. Soft, flat, matte shading (toon ramp with two tones, no speculars), and steam as flat cut shapes.
- The pull-out is one continuous camera move on a long jib: back through the missing front wall of the house (a dollhouse cutaway), rising to about 150 m over 2.6 s with a strong ease-out, then a slow drift as the sea opens. The window's green dot resolves into the warehouse in a single perspective shift. It should feel like a book page unfolding into a pop-up.
- The warehouse is enormous (size = resources), with rows of sacks emitting soft green light. The threads are glowing ropes floating on the sea.
- The push back in should be faster than the pull-out and end at 85 mm on the child's face.
- The characters are soft vinyl-toy shapes with swap-in brows and mouths (replacement faces). The grandmother's hands are simple mitten shapes.

## Copy variants
- "Same table. Smaller pot." / "Before: a full pot." / "Each week, a little less."
- "Grandma says she's not hungry." / "The red kept climbing."
- "It was there the whole time." / "1.5 million tonnes. Idle."
- "The red fell a quarter in a month."
- "Same stock. Same people." / "Found sooner." / "Not less rice. Slower routing."

## Tags
{"structure":"before-after","medium":"children's-book flat","family":"cooking","scale":"family","pace":"stop-start","camera":"locked-off close-up with a single pull-out","emotion":"tenderness","protagonist":"one person","analog":"rice-2008"}

Diversity check: OK: distinct enough (nearest the-warehouse 0.56, recipe-for-a-shortage 0.56).
