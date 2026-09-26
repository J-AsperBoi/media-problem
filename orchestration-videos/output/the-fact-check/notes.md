# The Fact-Check

Tier: animatic
Slug: the-fact-check
Structure: powers-of-ten-zoom (research/VIRAL_STRUCTURES.md #5)
Analog: false-news-2018 (Vosoughi, Roy & Aral, Science 2018; Hoaxy lag, Shao et al. 2016)
DUR: 39 s, 1080x1920, 30 fps

## Logline
Start on one word, thumb-typed into one post. Send. Then one unbroken zoom out by powers of ten, riding the red front: a feed, a person, a street, a city-sized cascade of 1,500 people, a nation of cascades. The green specks are people who already knew the true version, there from the first second, scattered and too far apart; the fact-checks are six green points that reach each cascade hours after it has gone red. The snap replays all 60 hours beside an AI-routed version (illustrative), then the camera falls back down, closer than it started, onto one green speck: a woman who knew.

This analog's third film (after fifteen-hundred and the-two-feeds). This one is the vast one: pure particles, no UI chrome, one camera move out and one back in.

## Time mapping (one mapping per section, both linear)
- Race (t 4.6 to 18.6 s): **1 second = 1 hour**, h = t - 4.6. Covers h 0 to 14. (t 1.3 to 4.6 is before the post is sent, h < 0: typing.)
- Freeze at h = 14 (t 18.6 to 21.0): "We slowed it down so you could see it."
- Snap (t 21.4 to 27.4 s): **1 second = 10 hours**, h = 10 (t - 21.4). Covers 0 to 60 h. Same mapping in both panels.
- Cold open (t 0 to 1.3) is a flash-forward to h = 10 on the same timeline, labeled "later".
- Zoom back in (t 30 to 34) is frozen at h = 14 of the human timeline.

## Speed math
**Threat (red), one cascade.** Analog sources only endpoints: one person at 0 h, 1,500 people at ~10 h (s2). Per director's notes, not a straight line: L.logistic fitted through the endpoints with s0 = 1/1500 and share(10 h) = 0.99, giving r = ln(99 (1 - s0)/s0)/10 = 1.19 /h, **doubling 0.58 h (~35 min, a fit, not a sourced number)**. People reached: 3 at 1 h, 11 at 2 h, 109 at 4 h, 687 at 6 h, 1,352 at 8 h, 1,485 at 10 h.
Each of the 1,500 people has a rank i in a random reshare tree (preferential attachment); person i turns red at the inverse logistic of (i + 0.5)/1500. Red lines are the reshare edges (lines = real communication).
Layout (staging, not data): person i sits at parent + random direction x 12 (i+1)^0.9 m, so the cascade widens as it grows and the camera's zoom out tracks the red front.

**Green specks: people who already knew (f2, ready at 0 h).** The true version spreads through the same 1,500 people along its own tree rooted at the protagonist, with the same logistic shape stretched 6x (s1: truth takes ~6x longer to reach 1,500): doubling 3.49 h, 99% at 60 h (s2). At the freeze (14 h) only ~16 of 1,500 know it, scattered across the city.

**Fact-checks (f1), human.** Six green nodes (six fact-checking orgs in s1) across the nation. Cascade c gets a green link from its nearest org at o_c + L.lognormalQuantile(q_c, 13, 20) h (Hoaxy lag, median ~13 h, typical 10-20 h used as p90 = 20; the q=0.1 value this gives is 8.5 h, a bit below the authors' 10 h, stated). Our cascade is the median: link lands at 13 h = t 17.6 s. At the freeze (14 h), 63 of 171 cascades (about a third) have a link; the rest are still waiting (late starts plus the 20 h tail). Late-starting cascades reach ~97% of truth by the end of the 60 h replay.

**Nation.** 170 other cascades (160 particles each, representing 1,500), same red and green curves, started at offsets o_c = 0.3-4 h (the claim reposted into other communities; the offsets are staging, stated here, not sourced). Our cascade o = 0.

**AI counterfactual (illustrative).** ai_counterfactual.aggregation_median = 1 h (matching a circulating claim to an existing verified ruling is a well-under-1-hour expert task, far inside the ~17.4 h METR 50% horizon in RATES.md; cost ~40x/yr cheaper makes screening affordable). Same spread shape: L.lognormalQuantile(q_c, 1, 20/13) = 0.65-1.54 h. Link lands at o_c + that. After the link, the correction is routed along the claim's own reshare path: each person gets it r_ai hours after the claim (same assumption as fifteen-hundred). Our cascade is fully reached by ~15 h, the whole nation by ~19 h (late-starting cascades), vs 60 h + offsets as it happened.
**Speed is not belief:** a person reached by both keeps a small red core inside a green ring, and the card says it. Reaching someone is not persuading them; people still decide.

## Numbers on screen (two, both sourced in the analog)
- "13 hours" (fact-check lag, s3)
- "60 hours" (true story to 1,500 people, s2)
No other numerals: scale gauge uses words ("one word ... a nation").

## Shot list and camera
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-1.3 | SC0 COLD OPEN, CLOSE | W 0.9 m on her face | flash-forward (h 10, "later"): her phone green, a red reshare line reaching her, red haze. "She already knew." |
| 1.3-2.8 | SC1 EXTREME CLOSE | W 2 cm on the word | a word typed in gray particles. "One word." |
| 2.8-4.4 | SC2 ZOOM OUT | 2 cm -> 1.4 m | post -> feed -> the person holding the phone |
| 4.6 | send | | the word ignites red, the phone lights his face red (h 0) |
| 5.0-12.0 | SC2 CONTINUOUS ZOOM OUT, accelerating with the red | 1.4 m -> 22 km | street -> city: red reshare tree explodes; green specks scattered. "The truth was already here." / "Too far apart." |
| 13.0-16.0 | SC2 cont. | 22 km -> 400 km | city -> nation of cascades; six fact-check nodes |
| 16.0-18.6 | SC3 WIDE HOLD | 400 km | fact-check links start landing, late. "Fact-checks: 13 hours behind." |
| 18.6-21.0 | FREEZE | | "We slowed it down so you could see it." |
| 21.0-30.0 | SC4 SNAP, two panels, locked wide | 420 km | as it happened vs AI-routed (illustrative), 0-60 h at 1 s = 10 h; "Truth: 60 hours." "Speed is not belief." |
| 30.0-34.0 | SC5 CONTINUOUS ZOOM IN | 400 km -> 0.24 m | fall back through the scales onto the protagonist, closer than frame 1. "This is the bottleneck." |
| 34.0-39.0 | END | | L.endCard, 5 s |
Zoom cycle: IN 0-4.4 (word) -> OUT 4.4-16 (seven decades) -> hold/snap -> IN+ 30-34 (to 0.24 m, closer than the 0.9 m cold open).

## 3D translation note
One continuous camera, no cuts inside the move. Start as a macro lens (100 mm, f/2.8) on the glass of a phone, a single word in soft focus; pull back through the phone into a dark bedroom, the face lit by the screen. Then a rocket crane straight up, perspective lens widening from 35 to 14 mm, height rising ~1 order of magnitude per 1.2 s, accelerating: rooftops, a city at night where every window is a person and red light-trails leap roof to roof along the reshare tree. Top out in near-orbital darkness: a country made of city-sized glowing clusters, six green beacons throwing slow green arcs. Freeze. Snap as two orthographic plates. The fall back in is a 4 s free-fall drop with a slight rotation, ending on a 135 mm close-up of her face lit green from below, red glow on the walls. Richer in 3D: parallax between scale layers, volumetric light from phones, depth of field hiding the scale transitions.

## Copy variants
- "She already knew." (used, cold open)
- "One word." (used)
- "The truth was already here." (used) / "The answer was already here."
- "Too far apart." (used)
- "Fact-checks: 13 hours behind." (used)
- "Truth: 60 hours." (used) / "Speed is not belief." (used)
- "Civilization has lag." / "Red travels by the power of ten. Green travels on foot."

## Tags
{"structure":"powers-of-ten-zoom","medium":"particle/data","family":"language","scale":"multi-scale zoom","pace":"accelerating","emotion":"vertigo","protagonist":"a green fragment","camera":"continuous zoom through scales","analog":"false-news-2018"}
Diversity check: OK (nearest two-days 0.67).
