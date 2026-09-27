# Two Skies, One Clock  (slug: seventeen-days)

Tier: animatic
Title on screen: none as a title card; working title "Two Skies, One Clock". The slug's "seventeen days" is not a sourced number, so it never appears on screen.
Logline: A crowd stands on a lakeshore at night. Every star is a country. In the sky, red spreads star to star in weeks; in the lake below (the same sky, mirrored), green kindles country by country on the real first-dose dates, the last ones absurdly late. Both halves run on one clock.
Structure: split-screen-race (research/VIRAL_STRUCTURES.md #2): the split is sky (top, red lane) vs its reflection in the lake (bottom, green lane).
Analog: covid-2020
Duration: 37.0 s, 1080x1920, 30 fps.

## Time mapping (one mapping for the race)
- Race: day = 30 * (t - 4.2), i.e. **1 s = 30 days, linear**, from t = 4.2 s (day 0) to t = 22.0 s (day 534), then frozen.
- Cold open (0-3.3 s) is a flash-forward of the same timeline at day 421 (labeled "day 421"), then a rewind (3.3-4.2 s) to day 0.
- Snap replay: same data, linear, 1 s = 132 days (day 0 -> 660 in 5 s), both panels on one clock line.

## Speed math
- **Threat (top sky).** 217 country stars. Each star gets a stratified quantile q_r = (i+0.5)/217 (shuffled). A star turns red on the first day the analog's extent curve (share of countries with at least one confirmed case, OWID/WHO, s1) reaches q_r. The extent curve is piecewise linear through the analog's 11 dated points (days 5..369, spaced 7-14 days, dense enough that linear interpolation between neighbours is not the "straight line between endpoints" problem), with an added day-0 anchor of 1/234 (the origin country). Stars with q_r > 0.936 never turn red in the data window (real: territories with no reported case by day 369). Result: 10% of stars red by ~day 30 (t ~ 5.2 s), 64% by day 75 (t ~ 6.7 s), 88% by day 96 (t = 7.4 s). Each new red star draws a fading line from its nearest already-red star (spread "star to star").
- **Human aggregation (lake).** Each lake star gets stratified quantile q_g; first-dose day = L.lognormalQuantile(q_g, median 421, p90 490) (sigma = ln(490/421)/1.2816 = 0.118; implied p10 = 362, matching the data's 363), floored at day 343 (first dose outside trials, f7). The single last star uses the dataset's observed latest first dose, day 658 (the lognormal tail is thinner than the real one). Median country: day 421 (t = 18.2 s). At the freeze (day 534) ~6 lake stars are still dark.
- **Fragments.** Seven green glints at the shore under the crowd, lit at their analog ready_at days (f1, f2 pre-existing; f3 day 11; f4 day 13; f5 day 76; f6 day 337; f7 day 343), linked by lines as each appears. From day 343 a green thread runs from that assembled point to each lake star over the 8 days before it lights (routing / distribution).
- **AI counterfactual (illustrative).** From analog ai_counterfactual: the median country gets first doses as early as the real fastest tenth (p10 = day 363). Implemented as the same lognormal shape with median 363 (each star's day x 363/421; p90 -> 422), still floored at day 343 (no faster authorization, no extra supply). Median 58 days earlier. Consequence of the floor: ~1/3 of countries light in the first days after 343; noted as a limit of the illustration. Red is identical in both panels (AI changes routing, not the threat).
- AI gain is modest (421 -> 363). Not inflated: staged with freeze, 2.3 s of silence, a single hit, then two stacked panels on one moving clock line.

## Numbers on screen (two, both verified in the analog)
1. "day 96" (88% of countries with a case; s1) shown as "day 96: nearly every star red".
2. "day 421" (median country's first dose; s2) in the cold open and when the protagonist's star lights.

## Shot list and camera (custom log-zoom camera driven by L.key keyframes with ease.inOut)
| t | slate | move |
|---|---|---|
| 0.0-3.3 | SC1 ECU FACE (cold open, day 421) | locked ECU, z=110. Red sky stars ring the head, red light on the crown, green point in the eyes, green lake glow from below. Cards: "Every star is a country." / "Above, the spread. Below, the answer." |
| 3.3-4.2 | SC2 CLOSE REWIND | dolly back to z=55 while lights drain back to day 0. Card "From the first day." |
| 4.2-5.3 | SC3 CLOSE | hold; first red appears overhead. |
| 5.3-9.8 | SC4 CONTINUOUS ZOOM OUT | log zoom 55 -> 1 (face -> crowd -> whole split sky) as red explodes. "day 96" card. |
| 9.8-16.8 | SC5 WIDE LOCKED | the whole sky red, lake dark; fragments assemble at the shore. Cards: "The answer was already here." / "In pieces." Lake begins to kindle at 15.6 s. |
| 16.8-18.2 | SC6 DOLLY IN (ECU EYE) | log zoom 1 -> 170, closer than the open, onto one eye; their star lights at 18.23 s (day 421). |
| 18.2-19.8 | SC6 ECU EYE hold | card "day 421. Their star lights." |
| 19.8-22.0 | SC7 PULL OUT | 170 -> 1.25; lake nearly full, a few holes still dark. "Some waited far longer." |
| 22.0-24.3 | SC8 FREEZE | clock stops, dim, silence. "We slowed it down so you could see it." |
| 24.3-31.2 | SC9 SNAP (locked, two stacked 940px panels) | hit. Replay at true proportion; "as it happened" vs "faster routing (illustrative)". Shared vertical clock line. "half lit" markers. "Same supply. Better routing." |
| 31.2-33.2 | SC10 NECK | "This is the bottleneck." |
| 33.2-37.0 | SC11 END | L.endCard, 3.8 s. |

Zoom cycles: IN (0-5.3) -> OUT (5.3-9.8) -> IN+ (16.8-18.2, closer: eye vs face) -> OUT (19.8-22.0).

## 3D translation note
Real night lake with a mirror surface; each country a star at true positions scattered across a dome, its reflection in the water. Open on a 100mm macro of one face in a crowd on a pier, eyes catching a green point, red stars bokeh above. The pull-out is one unbroken crane/drone move (Powers of Ten), accelerating as the red spreads, ending on a 14mm locked wide with the crowd as silhouettes on the horizon line. Return is a slow push to a macro of an iris where the green light blooms. Crowd as simple, lit-from-above figures; stars as volumetric points with thin light threads (red spread lines across the dome, green routing threads across the water). Richer in 3D: real reflections, parallax between near and far stars, the lake's ripples when a star lights.

## Copy variants
- "Every star is a country." / "Two skies. One clock." / "Above, the spread. Below, the answer." / "The answer was already here. In pieces." / "Same supply. Better routing." / "Their star lights." / "Some waited far longer."

## Tags
{"slug":"seventeen-days","structure":"split-screen-race","analog":"covid-2020","medium":"particle/data","family":"cosmos","scale":"between nations","pace":"accelerating","camera":"continuous zoom through scales","emotion":"awe","protagonist":"a crowd"}
Diversity check: OK (nearest two-days 0.67).

## Scores (by the coordinator; the build agent hit a usage limit after the render)
Verified with tools/verify.js: duration 37.0 s = DUR, no stray saturation, QR present. Frames checked at 0.3, 7, 14, 18.5, 27 and 29.5 s.
- Hook: 6. The face under a red sky with green eyes reads well, but the "day 421" line on frame 1 is a spoiler without context.
- Speed accuracy: 8. Red follows the country-share points; green follows the real per-country lognormal with the first-dose floor.
- Snap impact: 5. At the half-lit moment the two lakes differ visibly, but the gain is modest (363 vs 421).
- Emotion: 6
- Originality: 7
- Craft: 6. The faces are simple, and the snap panels are clean and legible.
- Honesty: 9
- Overall: 6.7
- Virality: 7%. A star sky split into spread and answer is a striking thumbnail, but the abstract middle and the small snap gain cap it.
