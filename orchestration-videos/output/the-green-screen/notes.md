# The Green Screen

Tier: animatic
Slug: the-green-screen
Title: The Green Screen
Logline: An embroidered route map of the world on charcoal linen. Red thread runs the travel routes with no stops. The green thread (the answer) has to stop at every station for paperwork and tie a knot before it can move on. The loop ends where it began: one stitcher, one green needle, red already through her station.
Structure: `seamless-loop` (research/VIRAL_STRUCTURES.md #15)
Analog: `covid-2020`
Scene: scenes/the-green-screen.js, DUR 36.0 s, 1080x1920, 30 fps

## Time mapping (one mapping)
- Race (film 2.0 s to 17.6 s): **1 film second = 36 days**, linear. day = (t - 2.0) * 36. The race covers days 0 to 562.
- The hook (0 to 1.8 s) is a flash-forward to day 300 of the same timeline. At 1.8 to 2.0 s the red thread unstitches back to day 0 (whoosh), then the race starts.
- Freeze at 17.6 s (day 562). The snap uses its own full-span sweep (days 0 to 562 in 1.2 s, "real speed"), so the same timeline runs about 13 times faster than the race.

## Speed math
**Threat (red).** 40 stations, each standing for 1/40 of the 234 countries/territories in the OWID/WHO file. extent(d) is piecewise-linear through the analog's sourced points (s1): (0, 1/234), (5, .009), (19, .03), (33, .103), (47, .124), (61, .256), (68, .436), (75, .641), (82, .782), (96, .876), (124, .906), (369, .936), held after that. These are weekly or biweekly data points, not endpoints, so interpolating between them follows the real curve (the spread is not linear, and the data shows it). Station k in red order (k = 0 is the origin) is reached on the first day extent(d) >= k/40. Two stations (k = 38, 39) are never reached in the window, matching extent topping out at 0.936. Red order is an illustrative geography (distance from the origin, with hubs pulled earlier). The share reached over time is the data. The stitcher's station is put at k = 26, reached on day ~75 (film 4.1 s, mid-pull-out). Her three neighbors are placed at k = 29, 32 and 35 so their red threads leave through her station.
- Red reaches 64% of stations by day 75 (t = 4.1 s) and 88% by day 96 (t = 4.7 s).

**Human aggregation (green).** Arrival day of the assembled answer at each station: g = max(343, L.lognormalQuantile(q, 421, 490)). Here 421 is the median, 490 the p90 (s2), and the floor 343 is fragment f7 (first dose given outside trials, s5). The lognormal's implied p10 is 361.6, which checks against the sourced 363. Quantiles q = (i + 0.5)/40, shuffled across stations. The first-dose station (f6/f7) gets the lowest q. The stitcher gets q = 0.9 (day 490, t = 15.6 s), a late country, which shows the real variance. The latest knot lands on day ~548 (t = 17.2 s).
- The green thread is a tree. Each station's thread comes from the nearest station that already has its knot, and it is stitched over the last 28 days before arrival (or from the parent's knot, whichever is later). Each station has a gray paperwork tag (visible from day ~200 to 260, staggered) that is stamped 6 days before its knot and filed away after.
- Early fragments appear as single green cross-stitches, unconnected: f2 mRNA platform (day 0, one European and one North American station), f3 genome (day 11, origin), f4 vaccine sequence (day 13), f5 first trial dose (day 76), f6 first authorization (day 337). f1 is unverified and is not shown.
- First green knot on day 343 (t = 11.5 s). Median country on day 421 (t = 13.7 s). p90 on day 490 (t = 15.6 s).

**AI counterfactual (snap, illustrative).** From ai_counterfactual: the median country gets first doses as early as the fastest 10% actually did, so the median moves to 363. Same lognormal shape (p90 scaled 490 x 363/421 = 422.5), same floor at day 343 (it assumes no more vaccine was made and no faster trials). Panel B shows cdfA(d) = d < 343 ? 0 : L.lognormalCDF(d, 363, 422.5). That is 58 days sooner for the median station. The gain is modest and not inflated. The staging carries it: freeze, silence, one hit, the true-speed sweep, then panel B, where the green curve lands visibly left of a dashed ghost at 421.

On-screen numbers (2): "day 421" (verified, s2) and "day 363" (the counterfactual, labeled illustrative; also the verified p10).

## Shot list and zoom cycles
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-1.8 | SC1 CLOSE (flash-forward, day 300) | eye level on one stitcher, z 46 | Red running stitches already through her station. She holds a needle threaded green, waiting by her paperwork tag. Card: "Red thread / needs no passport." |
| 1.8-2.0 | SC1 UNSTITCH | hold | Red pulls back out of the linen to day 0 (whoosh). |
| 2.0-3.2 | SC1 CLOSE (day 0) | slow push | "Rewind. / Watch it travel." |
| 3.2-8.2 | SC1 CONTINUOUS ZOOM OUT | log zoom 46 -> 0.92, anchored on her station | Red arrives at her station (4.1 s, bonk), then races along routes across the whole map inside the hoop. |
| 8.2-12.8 | SC1 WIDE (the hoop is the world) | drift out 0.92 -> 0.86 | Green crosses glow scattered and unconnected. Paperwork tags at every station. First knot 11.5 s. Cards: "The answer / was stitched early." "Then it stopped / at every border." "Forms. Stamps. / Waiting rooms." |
| 12.8-15.0 | SC1 ZOOM IN | log zoom 0.86 -> 58 onto her | Green hops station to station, knot by knot. Median passes at 13.7 s. |
| 15.0-17.6 | SC1 CLOSE+ | push 58 -> 62 | Her tag is stamped. The green thread arrives from off-frame. She ties the knot at 15.6 s (ding). "It arrived. / Long after red." |
| 17.6-19.8 | SC1 FREEZE | hold | Dim. "We slowed it down / so you could see it." |
| 19.8-20.1 | black | - | Silence. |
| 20.1-26.5 | SC2 SNAP | screen panels, 900 px wide | "Real speed." Panel A: as it happened, sweep in 1.2 s, "day 421". Panel B: same pieces, better routing (illustrative), "day 363", ghost of 421 dashed. "Same thread. Fewer stops." |
| 26.5-29.8 | SC3 CLOSE++ | z 78 on her face | She holds the knot, eyes closed. "This is / the bottleneck." |
| 29.6-34.4 | END | - | L.endCard("Help close the gap."), 4.5 s full. |
| 34.4-36.0 | LOOP TAIL | the frame-1 shot | End card dissolves into the flash-forward close. The card fades back in and matches frame 1 at t = 36. |

Zoom cycles: IN (0-3.2) -> OUT (3.2-8.2, one continuous take) -> WIDE hold (8.2-12.8) -> IN+ (12.8-15.0, z 58 > 46) -> IN++ after the snap (26.5, z 78). The tail returns to the frame-1 close.

## 3D translation note
One unbroken take over a real embroidery hoop. Open on a macro lens (100 mm macro, f/2.8) at thread height beside an appliqué stitcher figure the size of a thumbnail, with linen weave in the foreground. Red cotton floss runs past the lens. The pull-out is a motion-control rise straight up to a top-down 35 mm view of the whole hoop over about 5 s, eased, with the floss catching raking light. The return is a faster dive (about 2 s) that ends closer than the start, in shallow focus on the figure's felt face and the green French knot. What gets richer in 3D: real thread sheen and fuzz, satin-stitch continents with relief, paper tags with ink stamps swaying, and the needle pulling floss through the weave. Characters: felt bean figures with stitched faces, one per station. Props: needle, paper tags, rubber stamps, the wooden hoop (desaturated).

## Copy variants
- Red thread needs no passport. (used)
- The answer was stitched early. (used)
- Then it stopped at every border. (used)
- Forms. Stamps. Waiting rooms. (used)
- It arrived. Long after red. (used)
- Same thread. Fewer stops. (used)
- Alt: "Every knot needs a signature." / "The pattern was ready. The route wasn't." / "Civilization has lag, stitch by stitch."

## Tags
{"slug":"the-green-screen","structure":"seamless-loop","medium":"embroidery","family":"traffic","scale":"between nations","pace":"one long take","emotion":"awe","protagonist":"a green fragment","camera":"continuous zoom through scales","analog":"covid-2020"}

## Status
Bash (and so node, ffmpeg and ffprobe) was blocked for this agent session by the auto-mode safety check. The scene was written but NOT previewed, rendered, diversity-checked or verified. Scores below are provisional estimates from the design, not from footage.

Before scoring for real, whoever renders this should check:
- `node tools/diversity.js '<tags above>'` (not run).
- `node tools/render.js scenes/the-green-screen.js --preview`, and look at: the satin-stitch continents at the wide shot (moire?), the stitcher's face and needle at z 46/58/78, the legibility of the red thread in frame 1, and the snap panel labels.
- Full render, then ffprobe (expect 36.00 s) and `node tools/verify.js the-green-screen` (the end card is fully opaque from 29.9 to 34.4 s, so the QR check in the last 6 s should pass; the tail from 34.4 to 36 s redraws the frame-1 shot).

## Scores (PROVISIONAL, unrendered)
- Hook: 6
- Speed accuracy: 8
- Snap impact: 5
- Emotion: 6
- Originality: 7
- Craft: 5 (unseen)
- Honesty: 9
Overall: 6.6
Virality: 6% (provisional). An embroidered world map is thumbnail-pretty and the loop helps rewatch, but the modest 58-day snap and a fifth film on the same analog cap its reach.
