# The Two Feeds

Tier: animatic
Slug: the-two-feeds
Title: The Two Feeds
Logline: Two phones in one family, on one couch. Nana's phone gets the claim in the first hour; Sam's phone gets the fact-check about thirteen hours in. They are an arm's length apart. The answer was in the room; the routing sent it to the wrong phone, late.
Structure: `two-phones` (VIRAL_STRUCTURES.md #17, man-in-a-hole, stop-start beat map adapted to a sprint race)
Analog: `false-news-2018` (Vosoughi, Roy & Aral 2018; Hoaxy lag, Shao et al. 2016)
Medium: text-only typography. Everything is type: people are silhouettes filled with their own names, the room is words ("window", "lamp", "c o u c h"), every person in the audience is a single line of text (a pill). The claim is red redaction bars (its content is never shown); the correction is green words.

Difference from `fifteen-hundred` (same analog, highway race, neon arcade): this one is intimate, one family, one couch, no vehicles, no arcade; the race is between two phones an arm's length apart.

## Time mapping (one mapping)
- Race: **1 s = 1 h**, h = t - 1.5 for t in [1.5, 17.5] (hours 0 to 16). A small "hour N" readout shows the mapping.
- Cold open (0 to 1.4 s) is a flash-forward to hour 13 of the same timeline, labeled "hour 13".
- Snap: both panels on one shared clock, **1 s = 5 h** (playhead sweeps 0 to 20 h in 4 s). Same scale for both rows, so the comparison is proportional.

## Speed math
- **Threat (red).** Analog gives only sourced endpoints: 0 at 0 h, the whole 1,500-person audience at ~10 h (s2). No doubling time is sourced, so the path between is a stated monotone ease: extent(h) = smoothstep(h/10). The field has 1,500 homes (30 x 50); home i's claim-reader turns red at the h where smoothstep(h/10) equals its shuffled rank quantile, so the red share on screen equals extent(h) at every frame. Nana's rank is set to the quantile at h = 1 (she is early: "It finds her first"). That per-person time is illustrative; the curve is the data's.
- **Human aggregation (green).** Hoaxy: fact-check sharing lags misinformation by ~13 h, typical range 10 to 20 h (used as p10/p90, s3). Each home's second person receives the correction at L.lognormalQuantile(q, 13, 20) h with q spread evenly, so some get it at ~8 h and some absurdly late (>30 h). Sam is the median home: 13 h. By the end of the race (16 h) about 64% of homes have it; by then the red has been at 100% for 6 h.
- **Snap panels.** Red area = extent(h) (same in both rows: AI does not stop the claim spreading). Green area = L.lognormalCDF(h, 13, 20) in the human row, L.lognormalCDF(h, 1, 20/13) in the AI row (median from ai_counterfactual.aggregation_median = 1 h, p90 scaled by the same ratio as the human spread).
- **AI counterfactual (illustrative).** From the analog's ai_counterfactual: matching a circulating claim to an existing verified ruling and routing it to the people sharing it is a well-under-1-hour expert task, far inside the ~17.4 h 50% time horizon (RATES.md, METR), and cost at fixed capability falls ~40x/year (RATES.md, Epoch), so screening every rising claim is affordable. Assumed ~1 h vs human ~13 h. Labeled "illustrative" on screen. Honest caveat on screen: "Sooner isn't believed. People still decide." Speed of a correction does not guarantee it is accepted; the film does not claim it would be.

## Numbers on screen
- "13 h" (Hoaxy characteristic lag, verified in analog) and "~1 h" (illustrative counterfactual). The "hour N" readout is the time-mapping clock, not a data claim; it ends at 16 and passes 13 at the green arrival.

## Shot list (DUR 36 s)
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-1.4 | SC1 COLD OPEN | OTS WIDE, both phones (flash-forward, hour 13) | Over two typographic shoulders: Nana's phone with a big red redacted bubble, Sam's with the green "checked" card. Card: "Same couch. Different feeds." |
| 1.4-4.5 | SC2 OTS NANA | CLOSE, over Nana's shoulder | Hour 0. Gray chat. At h1 the red forwarded bubble slides in. Nana types "sharing, just in case. love you all" and sends (h 2.8). Card: "It finds her first." |
| 4.5-8.0 | SC3 PULL OUT | DOLLY OUT through the room to the field | Phone -> the room made of words (two silhouettes, one couch) -> 1,500 homes, each two lines of type. Red filling at the data's pace. |
| 8.0-11.5 | SC4 WIDE | hold, slow drift | Red reaches the whole audience at 10 h. A few green lines begin (lognormal early tail). Card: "Faster than anything true." |
| 11.5-14.3 | SC5 DIVE | DOLLY IN to Sam, closer than SC2 | Back through the room to Sam's phone. Gray feed tiles. Card: "The answer is in the room." |
| 14.3-16.2 | SC6 OTS SAM | CLOSE+ | h13: green "checked" card slides in. Sam types "that's fake", deletes it, types "Nana, sit with me?" and sends. Card: "Right answer. Wrong phone." |
| 16.2-17.5 | SC7 PAN | whip pan across the couch | To Nana's phone: Sam's green message lands under the red bubble, 15 hours after it. |
| 17.5-20.0 | SC8 FREEZE | locked | Dim, silence. "We slowed it down so you could see it." |
| 20.0-26.5 | SC9 SNAP | flat, two panels 920 px wide | One hit. Same clock sped up: human row, green rises at 13 h; AI row (illustrative), green at ~1 h. Caveat line. |
| 26.5-29.0 | SC10 OTS NANA | CLOSEST (IN++) | Red and green bubbles together; "Nana is typing..." Card: "Not her. The wiring." |
| 29.0-31.5 | SC11 | hold | "This is the bottleneck." |
| 31.5-36.0 | END | | L.endCard, 4.5 s. |

Zoom cycles: Cycle 1: IN 1.4-4.5 (zoom 167) -> OUT 4.5-8.0 (to zoom 1) -> IN+ 11.5-14.3 (zoom 200). Cycle 2: SNAP flat 20-26.5 -> IN++ 26.5-29 (zoom 275).

## 3D translation note
- Key shots: the OTS on Nana (35 mm, camera just behind her left shoulder at head height, shallow focus on the screen), the dolly out (a single continuous pull back through the living room ceiling into an aerial of a thousand lit windows, 8 s, eased), the dive to Sam (faster, 50 mm at the end, closer than the first OTS), and the whip pan across the couch (half a second, motion blur).
- Characters and props: keep the type-body idea: bodies as volumetric letterforms of their own names, a couch spelled in upholstered letters; phones are the only light sources. Red bubble is a glowing redaction bar, never legible.
- Richer in 3D: parallax of the two phones' light on the faces of the letters, the field of homes as windows in apartment blocks, each window a line of text turning red.

## Copy variants
- "Same couch. Different feeds." (used) / "One couch. Two feeds." / "An arm's length. Thirteen hours."
- "It finds her first." / "Faster than anything true." / "The answer is in the room." / "Right answer. Wrong phone." / "Not her. The wiring."
- Snap: "Same clock, sped up." / "Sooner isn't believed. People still decide."

## Tags
{"structure":"two-phones","medium":"text-only typography","family":"language","scale":"family","pace":"sprint","emotion":"tenderness","protagonist":"one person","camera":"over-the-shoulder","analog":"false-news-2018"}
Diversity check: OK (nearest day-three-hundred-five 0.78, fifteen-hundred 0.78).
