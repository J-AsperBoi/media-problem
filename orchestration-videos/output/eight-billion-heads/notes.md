Tier: animatic

# Eight Billion Heads

**Logline.** One body. Eight billion heads. The planet as a single x-ray body whose organs are countries. Red crosses organ to organ at its real share-of-countries speed; the answer (green) exists in a few hands almost from the start, but reaches each organ on its own late day. The fall, the long dark bottom of the hole, then the long uneven rise.

**Structure.** man-in-a-hole (research/VIRAL_STRUCTURES.md #3): warm close moment -> fall (organs go red, their glow fades) -> bottom (the answer exists, unrouted) -> the climb (organs turn green one by one, the late ones absurdly late) -> snap as the second, faster climb.

**Analog.** covid-2020 (research/analogs/covid-2020.json). Threat never named; the product never named ("the answer").

## Time mapping (one mapping)
- Race clock: `day = 30 * (t - 2)` for film t in [2, 22] s, i.e. **1 s = 30 days**, linear, day 0 = 2019-12-31 (t0 in the analog). Clock frozen at day 600 after t = 22.
- Cold open t 0-1.4 is a flash-forward to the same timeline at day 70 (red front at the frame edge), rewound to day 0 at t 1.4-2.0.
- Snap replay: the same days at 1 s = 200 days (both panels identical mapping).

## Speed math
- **Organs = countries.** N = 96 organs, each 1/96 of the 234 countries/territories in the OWID file.
- **Threat (red).** analog `threat.points` extent (share of countries with at least one confirmed case, s1), piecewise-linear between the 11 sourced weekly-to-monthly points (dense enough; no endpoint-only fit needed). Organs are ranked by distance from an origin organ plus seeded noise; organ k turns red on the first day extent(d) >= (k+0.5)/96. Extent tops out at 0.936, so the last ~6 organs never turn red (as in the data). Inside one organ the red crosses as a front over 6 days (visual only, within the organ's day). After turning red an organ's glow decays (absence, not bodies).
- **Human aggregation (green).** Per organ quantile q (evenly spaced, shuffled), green day = max(343, L.lognormalQuantile(q, 421, 490)); median 421, p90 490 from `solution.aggregation` (s2; p10 363 is reproduced by the same sigma: 421*exp(-1.2816*ln(490/421)/1.2816) = 361.7 ~ 363). Floor 343 = first dose outside trials (f7, s5). The hero organ gets q = 0.5 -> day 421. Latest organ q=0.995 -> ~day 571 (data's actual latest: day 658).
- **Fragments that already existed** (green glints in single hands, not yet reaching organs): f2 platform day 0, f3 genome day 11, f4 design day 13, f5 first trial dose day 76, f6 authorization day 337, f7 first dose day 343. They connect by thin lines on their days.
- **AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 363 (the fastest tenth's actual date becomes the median; ~58 days sooner). Same sigma, same floor, **same supply** (no extra doses assumed): aiDay = max(343, lognormalQuantile(q, 363, 363*490/421)). Labeled "illustrative" and "same supply" on screen.
- **Numbers on screen (2):** 421 (median organ, as it happened; s2, verified) and 363 (median organ, routed; illustrative, analog ai_counterfactual).

## Shot list / camera (zoom cycles)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.4 | SC1 CLOSE | eye level on one x-ray face, zoom 60, slow push | HOOK (flash-forward, red front at the edge, green glint in hand). "One body." |
| 1.4-2.0 | SC1 | hold | rewind day 70 -> 0 |
| 2.0-3.4 | SC1 CLOSE | hold, faint push | "Eight billion heads." |
| 3.4-7.8 | SC2 CRANE UP | zoom 60 -> 1 (log-eased), through the organ level (a crowd of x-ray people) to the whole body | RACE fall: red crosses the organs. "Every organ, a country." |
| 7.8-13.5 | SC3 WIDE HOLD | locked, very slow drift | bottom of the hole: glow fading, green glints in a few hands. "The answer was already here." / "In pieces." |
| 13.5-16.0 | SC4 DROP DOWN | zoom 1 -> 90 onto the same person, closer than frame 1 | climb begins; the answer reaches the hero's organ on day 421 |
| 16.0-17.6 | SC4 CLOSE | hold | "On its own late day." |
| 17.6-21.8 | SC5 CRANE UP | zoom 90 -> 1, faster than SC2 | stragglers turn green absurdly late. "Some waited months more." |
| 21.8-22.8 | SC6 | freeze, silence | dead stop |
| 22.8-25.4 | SC6 | hold | "We slowed it down" / "so you could see it." |
| 25.4-32.0 | SC7 SNAP | two 920px panels stacked | true speed replay (top), hit, routed replay (bottom, illustrative, same supply); 421 vs 363 |
| 32.0-35.2 | SC8 DROP DOWN | zoom to 140 on the hero's face | "This is the bottleneck." |
| 35.2-39.2 | END | end card | 4 s |

Zoom cycles: cycle 1 IN 0-3.4 -> OUT 3.4-7.8 -> IN+ 13.5-16; cycle 2 OUT 17.6-21.8 -> (snap) -> IN++ 32-35.2.

## 3D translation note
A single continuous volumetric x-ray: the hero is a translucent skeleton bust lit from inside (subsurface bone glow), shot on a 50mm at eye level, shallow focus on the hand holding the glint. Crane up is a true dolly-zoom-free vertical rise of ~5 orders of magnitude (use a scale-space camera with log-speed easing): the person becomes one of hundreds of translucent figures packed like cells in an organ, the organ one of ~96 in a planet-sized body floating in black. Red is a volumetric fluid front moving tissue to tissue; loss is the organ's inner light dimming. Drop-downs should accelerate, the second one closer (85mm, inches from the skull). What gets richer in 3D: parallax between tissue layers, figures turning their heads toward the incoming green, the glint's light spilling onto finger bones.

## Copy variants
- "One body. Eight billion heads." (used)
- "Every organ, a country." (used)
- "The answer was already here. In pieces." (used)
- "On its own late day." (used)
- "Same supply. Better routing." (alt snap caption)
- "The signal existed. The nerves were slow."
- "Civilization has lag." (alt opener)

## Tags
structure man-in-a-hole; medium x-ray; family body/biology; scale multi-scale zoom; pace stop-start (changed from assigned "accelerating": diversity.js said TOO SIMILAR to vaccine-speedrun at 0.44; the film's freeze-hold-sprint rhythm fits stop-start); emotion awe; protagonist a crowd; camera crane up and drop down; analog covid-2020.
