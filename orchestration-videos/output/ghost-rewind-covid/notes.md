Tier: animatic

# The Window (ghost-rewind-covid)

**Logline.** A cathedral window of many panes, one pane per community. A gentle ghost rewinds the year to show where every green piece already sat, then keeps arriving a little ahead of the real glass. At the snap we learn the ghost was the same pieces, routed faster (illustrative).

- Structure: `ghost-rewind` (research/VIRAL_STRUCTURES.md #18)
- Analog: `covid-2020` (research/analogs/covid-2020.json)
- Medium: stained glass. Lead lines near-black, glass desaturated gray; only red panes and green glass are saturated.
- DUR 37 s, 1080x1920, 30 fps. Scene: scenes/ghost-rewind-covid.js

## World
- 70-ish irregular panes (jittered 7x11 grid clipped to a lancet arch) = communities/countries.
- A crowd of gray bean figures stands on the stone floor under the window; the window throws coloured light pools on the floor. The protagonist is one face in the crowd.
- The ghost: a pale, desaturated, translucent bean (soft, not scary). Its layer is a dim gray-green "ghost pane" drawn in each pane on that pane's AI-counterfactual day. Unexplained until the snap.
- Loss is shown only as absence: a red pane dims toward dark gray the longer it waits for green. Darkness = days waited. No bodies.

## Time mapping (one mapping, stated)
- Race clock: **1 second = 35 days** while the clock runs. Day 0 = 2019-12-31 (analog t0).
- Stop-start: the clock *holds* (freezes, no days pass) at 6.6-7.8 s and stops dead at 17.3 s (day 490 = analog p90). Holds never compress or stretch days.
- Cold open 0-1.5 s is a flash-forward to day 96 (88% of countries reporting red, sourced point), then the ghost visibly rewinds the window to day 0 (1.5-2.1 s). Same timeline.
- dayAt(t): 96 for t<1.5; rewind 96->0 over 1.5-2.1; 35*(t-2.1) to day 157.5 at 6.6; hold to 7.8; 157.5+35*(t-7.8) until day 490 at 17.3.
- Snap panels: same days, compressed so 0->560 days plays in 2.2 s (true proportional order and spacing, uniform compression).

## Speed math
**Threat (red).** Share of panes red on day d = analog `threat.points[].extent` (share of 234 countries with >=1 confirmed case, OWID/WHO, s1), piecewise-linear between the 11 sourced points (dense sampling, days 5-369, so no endpoint-only fit needed). Panes are ranked by distance from an origin pane (+ seeded noise) and pane k turns red on the first day extent >= (k+0.5)/N. 93.6% red by day 369; the remaining panes never turn red on screen (matches the data ceiling).
- Check: extent(61)=0.256, extent(75)=0.641, extent(96)=0.876. On screen at 35 d/s: from 26% to 88% of panes in 1 s of film.

**Human aggregation (green).** Each pane gets its own arrival day at quantile q (shuffled, q=(i+0.5)/N): gDay = max(339, L.lognormalQuantile(q, 421, 490)), analog `solution.aggregation` (median 421, p90 490, p10 363; OWID vaccinations.csv first dose per country, s2). The lib's sigma = ln(490/421)/1.2816 = 0.1185 reproduces p10 = 362 (data: 363). Floor 339 = earliest first dose in the data (Dec 4 2020). The long tail matters: the ~10% of panes after day 490 are still dark when the clock stops.
- The early fragments already sat in the window long before: f2 mRNA platform (day 0), f3 genome shared (day 11), f4 vaccine sequence (day 13), f5 first trial dose (day 76), f6 first authorization (337), f7 first dose outside trials (343), all from the analog (s4, s5). They are drawn as small green shards in four panes, with real green links drawn on their analog days. f1 (unverified) is not used.
- Protagonist pane is the median pane: real green day ~421 (t = 15.33 s).

**AI counterfactual (the ghost, illustrative).** aiDay = max(339, L.lognormalQuantile(q, 363, 363*490/421 = 422.5)): analog `ai_counterfactual.aggregation_median` = 363, i.e. the median country gets first doses as early as the fastest tenth actually did, same spread (sigma), same floor (no vaccine exists before first authorization; the counterfactual assumes better routing only, not more vaccine or faster trials). Gain for the median pane = 58 days = 1.66 s of film. Deliberately modest: the snap is staged (freeze, silence, one hit, two panels) rather than inflated.
- The ghost timeline is the AI line; revealed at the snap with "illustrative" (>=44 px).

**Numbers on screen (2):** "day 421" (median, verified, s2) and "day 363" (AI counterfactual, labelled illustrative).

## Shot list and camera
| t (s) | shot | camera | beat |
|---|---|---|---|
| 0-1.5 | SC1 CLOSE (cold open) | locked, zoom 3.0 on a face at the base of the window | Flash-forward day 96: panes above her mostly red, her face lit red, green shard in her hands; ghost beside her holds its shard already joined to a second. Card "Every piece was already here." |
| 1.5-2.1 | SC1 REWIND | slight shake | Ghost raises a hand; panes un-redden in reverse order; day 96 -> 0. |
| 2.1-3.8 | SC2 CLOSE | slow push 3.0 -> 3.2 | Clock runs. "Rewind the year." Shards glint (platform, genome, design). |
| 3.8-6.6 | SC3 CRANE UP | 3.2 -> 0.95, ease inOut | Reveal the whole window; red spreads at data speed (26% -> 88% in ~1 s at days 61-96). |
| 6.6-10.4 | SC4 WIDE | hold | Clock holds 6.6-7.8 ("The red took weeks."), runs on: red panes dimming as they wait; ghost links already joined, real links broken. "The pieces sat apart." |
| 10.4-13.0 | SC5 DROP DOWN | 0.95 -> 4.2 | Down to the same face, closer than before. "Then everyone waited." |
| 13.0-17.3 | SC6 CLOSE+ | push 4.2 -> 4.6 | Ghost pane appears above her (day 363, t 13.67); real green only at day 421 (t 15.33). "The ghost always came first." Clock dead-stops at day 490. |
| 17.3-19.8 | SC7 FREEZE | still | Silence. "We slowed it down so you could see it." |
| 19.8-27.0 | SC8 SNAP | screen-space panels | Hit. Panel A (as it happened) runs alone, then A and ghost panel B side by side; "day 421" vs "day 363 illustrative"; "The ghost was faster routing." |
| 27.0-29.5 | SC9 EXTREME CLOSE | 6.0, drop in | Ghost hand and real hand align on one shard. "Same pieces. Found sooner." |
| 29.5-32.0 | SC9 hold | slow push | "This is the bottleneck." |
| 32.0-37.0 | END | - | L.endCard, 5 s. |

Zoom cycles: cycle 1 IN 0-3.8 -> OUT 3.8-6.6 (hold to 10.4) -> IN+ 10.4-13.0 (closer, 4.2x vs 3.0x). Cycle 2: SNAP (flat, out) 19.8-27 -> IN++ 27-29.5 (6.0x).

## 3D translation note
Interior of a tall Gothic nave at dusk, one lancet window ~12 m tall, backlit so each pane's colour throws a pool on the flagstones. Open on an 85 mm portrait at eye height, her face lit by red light through glass, a small green glass shard in cupped hands; the ghost is a volumetric, faintly emissive figure with no hard edges. The crane-up is a slow 6 s rise on a 24 mm to the vaulting line, ending locked-off on the whole window with the crowd tiny at the base; the drop is faster (2.6 s, eased), finishing tighter than the opening (100 mm). Richer in 3D: real caustics, dust in the light shafts, lead came catching the light, panes dimming as a slow falloff of transmitted light rather than a colour change. Snap: two windows side by side as flat elevations. The final shot is a macro of two hands (one real, one translucent) meeting on the same shard.

## Copy variants
- "Every piece was already here." (hook, used)
- "Rewind the year." (used)
- "The red took weeks." / "The pieces sat apart." / "Then everyone waited." (used)
- "The ghost always came first." (used; open loop)
- "The ghost was faster routing." (snap reveal, used)
- "Same pieces. Found sooner." (used)
- Unused: "The window was never empty." / "Stained with lag." / "Light arrives late."

## Tags
{"slug":"ghost-rewind-covid","structure":"ghost-rewind","medium":"stained glass","family":"myth/ritual","scale":"history","pace":"stop-start","emotion":"grief","protagonist":"a crowd","camera":"crane up and drop down","analog":"covid-2020"}
Diversity check: OK, distinct enough (nearest before-the-dark 0.67).

## Build notes
- Snap staging: panel A runs days 0-560 alone at true (uniformly compressed) speed; then A and the ghost panel B re-run side by side and both stop on day 421, the real median, so the left window is half lit and the ghost window is ~90% lit. Then "day 421" / "day 363" and "The ghost was faster routing."
- Protagonist pane is the median pane: ghost pane at day 362 (t 13.65 s, pop cue), real green at day 420 (t 15.31 s, ding cue). 78 panes total.
- Rendered 37.0 s (ffprobe), matches DUR.

## Scores
- Hook: 7 (red window, face lit red, green shard, ghost; the flash-forward reads, but the rewind is fast)
- Speed accuracy: 8 (red from sourced points, per-pane lognormal 421/363/490, one mapping with honest holds; pane dimming rate is a chosen constant)
- Snap impact: 6 (a modest 58-day gain; the freeze + stop-on-median staging helps but it's still a quiet snap)
- Emotion: 7 (panes dimming while waiting, the ghost's gentle presence, crowd faces turning sad)
- Originality: 8 (stained glass window as the world, ghost timeline as dashed ghost panes)
- Craft: 6 (clean read, but beans are simple and the ghost's rewind gesture is small)
- Honesty: 9 (illustrative label, routing-only counterfactual, same floor day, loss only as dimming)
Overall: 7.3
Virality: 6% - beautiful and legible as a thumbnail, but grave, slow, and the payoff is a modest gap, so a small account likely stalls well below 100k.
