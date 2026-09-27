# The Numb Hand (slug: the-numb-hand)

Tier: animatic

**Title:** Why Didn't It Hurt?
**Logline:** A bean-cartoon person has one hand resting on a burner and their eyes on a phone. We open on the moment the red arrives: the hand glowing, the face in alarm. Then we rewind. We zoom in through the skin to a nerve network that works like a power grid. Four nerves each carry a piece of the warning somewhere other than the reflex that could pull the hand away. The pain nerve, which is the alarm, went numb right at the start. The body is a metaphor for the grid, and it stays one: every time on screen comes from the blackout analog, and there are no neuroscience timings.

**Structure:** `reverse-chronology` (research/VIRAL_STRUCTURES.md #13). We open on the aftermath, rewind to t0 (the nerve going numb), freeze, then play forward at both speeds in the snap.
**Analog:** `blackout-2003`

## Diversity check
The first tags (emotion: dread) came back TOO SIMILAR to nineteen-days (distance 0.44: body/biology, body, accelerating, dread, one person). I kept the assigned structure and analog and changed **emotion from dread to vertigo**. The continuous zoom from a hand down into a whole grid of 50 million, and back out, is the emotional engine. Result: OK (nearest is nineteen-days at 0.56).

Tags: {"structure":"reverse-chronology","medium":"bean cartoon","family":"body/biology","scale":"body","pace":"accelerating","camera":"continuous zoom through scales","emotion":"vertigo","protagonist":"one person","analog":"blackout-2003"}

## Time mapping (one mapping, stated)
Event hours h are counted from the analog's t0 (14:14, when the control-room alarms began failing silently, s2).
- **Rewind: 1 film second = 15 minutes of event time** (0.25 h/s), linear and running backward. It runs from h = 2.0 at t = 4.5 to h = 0.85 at t = 9.1. Time then **freezes** for 1.2 s at the first verified line trip (h = 0.85). The rewind resumes from t = 10.3 and reaches h = 0 at t = 13.7. Freezes stop the clock and never change its rate.
- t = 0 to 4.5 is the aftermath held at h = 2.0 (the cold open plus the dolly in through the skin). t = 13.7 to 19 is held at h = 0.
- The on-screen clock (bottom left, no numerals) shows analog clock time 14:14 + h and spins backward during the rewind.
- The snap panels use one shared linear axis for both lanes: 0 to 2 h across 820 px.

## Speed math (reusing seven-minutes)
- **Threat (red).** Only the verified first trip is drawn: at h = 0.85 (15:05, Harding-Chamberlin, s6), one grid line at the skin contact turns red and a small red heat spot appears under the hand. The 15:32 and 15:41 trips are verified:false and **not drawn**.
  - The cascade is **L.logistic fitted through the analog's endpoints**: extent 0.01 at h = 1.87 and 0.99 at h = 1.98. From e^{r·0.11} = 9801 we get r = 83.6/h, so **doubling = 0.0083 h (about 30 s real time)**. Both endpoints are verified:false, so they drive **motion only** and never appear as numbers.
  - Played backward at the mapping, the cascade un-spreads in 0.44 s (t = 4.5 to 4.94). Grid lights come back on in rank order of distance from the first trip, with seeded jitter. A node is dark when rank < extent(h).
  - In the body view, the red glow radius under the hand is 70 + 420·extent(h) px, and the red creeps up the arm in proportion to extent.
- **Human aggregation (green).** Fragment ready times come from the analog's `solution.fragments` and map to nerves:
  - f1 (IT knew the alarm servers were failing): ready at h = 0.1. It is a nerve that ends in a loop at the elbow, so the warning stays inside.
  - f4 (neighbors saw the trips): ready at h = 0.85. Its nerve goes to the *other* hand, the one holding the phone. No exact time is shown because it is verified:false.
  - f2 (operators realize): ready at h = 1.5. This is the hand's own nerve, and it lights only at h = 1.5.
  - f3 (the state estimator, i.e. the map): ready at h = 1.83. Its nerve goes to the top of the head, where the map stays dark until 1.83.
  - The reflex node ("pull away" = shed about 1,500 MW, f5) **never lights**, because the pieces never assembled (analog aggregation notes).
  - Six brief links between fragments and the reflex connect at **L.lognormalQuantile((i+0.5)/6, median 1.5 h, p90 1.83 h)** = 1.210, 1.351, 1.452, 1.550, 1.665, 1.859 h. Each link grows over 0.05 h, holds for 0.12 h, then drops over 0.05 h (event-time durations, so they reverse correctly in the rewind). Pairs are assigned only once both ends are ready.
- **AI counterfactual (snap).** `ai_counterfactual.aggregation_median` = 0.25 h against the human median of 1.5 h. Basis, from the analog: every fragment was a machine-readable signal already in the control rooms. Joining "alarm dead + lines tripping + shed load" is a sub-1-hour expert reading task, far inside the ~17.4 h METR 50% time horizon (RATES.md). The routed lane lands at h = 0.25, before the 0.85 h first trip. The lane is **labeled "illustrative"**. Its cascade box is dashed and holds a large "?" with "outcome unknown": people still decide, and we claim nothing about prevention.

## On-screen numbers (max two)
1. "50 million" (people affected, s3, confirmed by snippets per the analog notes).
That is the only number. There is no "7 minutes" (unverified) and no clock numerals.

## Shot list (DUR 35 s)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.6 | SC0 CLOSE (aftermath) | z 1.6 on hand + face | Hand on the burner in a big red glow, face in alarm, four green glints under the skin. "Why didn't it hurt?" |
| 1.6-4.5 | SC1 DOLLY IN through skin | log zoom 1.6 -> 10 into the hand | The skin gives way to a nerve network that works like a grid: lights out, red front. "50 million people. Lights out." |
| 4.5-9.1 | SC2 INSIDE (rewind) | hold z 10 -> 10.8 | Rewind icon. Red recedes in 0.44 s and lights return. Green links flicker in reverse. "Rewind." / "The warning was there. In pieces." |
| 9.1-10.3 | SC2 FREEZE | hold | First burn (h 0.85): one red line at the contact. "First burn. No pain." |
| 10.3-13.7 | SC3 PULL OUT (zoom through scales) | 10.8 -> 0.95 wide, x-ray body | The whole body as one grid: numb pain nerve, four green nerves ending in the wrong places, the head scrolling. "The head was scrolling." |
| 13.7-16.5 | SC4 DOLLY IN, closer | 0.95 -> 3.0 on the face | t0 freeze: the pain nerve flickers alive, then goes numb. "Here, the pain nerve went numb." |
| 16.5-19.0 | SC4 HOLD | 3.0 -> 3.3 | "We slowed it down so you could see it." |
| 19.0-19.4 | dead stop | black | silence |
| 19.4-27.4 | SC5 INSERT: TWO TIMELINES | flat | Hit. Forward: "As it happened", then "Routed (illustrative)" on the same axis. "?" on the routed cascade. |
| 27.4-30.8 | SC6 CLOSEST | z 4.3 on the eyes | Routed (illustrative): a green signal arrives and the eyes leave the phone for the hand. "This is the bottleneck." |
| 30.8-35.0 | END | - | L.endCard, 4.2 s |

**Zoom cycles:** CLOSE 1.6 (0-1.6) -> IN through scales to 10 (1.6-4.5), the population reveal -> OUT to the whole body, 0.95 (10.3-13.7) -> IN+ to the face at 3.0 (13.7-16.5) -> [insert] -> IN++ on the eyes at 4.3 (27.4).

## 3D translation note
- **SC0:** 50 mm at counter height. A soft vinyl bean character, a matte ceramic hob, and a hand resting on a glowing coil. The red is emissive light only, with no skin damage. The face is lit cool from below by the phone.
- **SC1-SC2:** one unbroken macro push (an 8 s, eased, Powers-of-Ten style move). The skin turns translucent like wax, and inside is a luminous miniature grid of cell-towns with window lights and nerve cables that read as transmission lines. The rewind is a true reverse playback of particle flows.
- **SC3:** the pull back out lands on a stylized x-ray body with glass skin and glowing nerve fibers, framed like a subway map of the body.
- **SC4/SC6:** 85 mm, then a 100 mm macro on the eyes. The routed signal is a thin green filament climbing the arm. Depth of field carries the attention shift from the phone to the hand.
- What gets richer in 3D: subsurface scattering for "through the skin", real light falloff for red versus phone light, and the vertigo of a continuous scale change.

## Copy variants
- "Why didn't it hurt?" (hook)
- "50 million people. Lights out."
- "Rewind."
- "The warning was there. In pieces."
- "First burn. No pain."
- "The head was scrolling."
- "Here, the pain nerve went numb."
- Alternates: "Every nerve knew something." / "One body. No reflex." / "The signal took the scenic route." / "Pain is just routing."

Tags: body/biology, reverse-chronology, bean cartoon, continuous zoom, vertigo

## Build notes
- Rendered at 35.0 s (confirmed with ffprobe), 1080x1920, 30 fps. The camera is one continuous log-zoom world. The grid lives inside the hand at scale 0.1. Moving between scales is a full-frame overlay fade plus soft per-node edge falloff, so no rectangular patches show.
- Fixes after the first preview:
  - Moved the reflex node and its label, and the "pain nerve" label, so they no longer collide with the cards or the rewind clock.
  - Put dark backings behind the rewind and freeze indicators.
  - Added a 1 s hold on the wide body shot (12.7-13.7).
  - Reframed the face close so the phone stays in shot.
  - The routed green signal in SC6 now stops at the shoulder instead of cutting across the face.
- Known weak spots:
  - The wide x-ray body shot is short, and there is no red in it: the rewind is already before the first trip by then, which is true to the data.
  - A faint horizontal band from the counter is visible behind the grid at 97% overlay.
  - The "?" box in the routed lane is narrow because the cascade really is only 0.11 h wide.

## Scores
- Hook: 7. Frame 1 has a big red glow, a panicked bean face, green glints, and the line "Why didn't it hurt?"
- Speed accuracy: 8. One stated mapping (reversed), a logistic fit through the endpoints, lognormal links, and only the verified trip drawn.
- Snap impact: 6. Two lanes on the same axis; the routed lane ends in "?". The freeze, silence and hit help, but the panels are still a chart.
- Emotion: 6
- Originality: 7. The body-as-grid rewind through the skin is fresh.
- Craft: 6
- Honesty: 9. Outcome unknown, labeled illustrative, one sourced number, no injury shown.
Overall: 7.0
Virality: 8%. The hand-on-stove hook and the rewind are shareable and legible without sound, but the middle is an abstract grid and the payoff is a timeline chart, which is typical small-account territory.
