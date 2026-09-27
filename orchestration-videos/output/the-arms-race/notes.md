# The Arms Race

Tier: animatic
Slug: the-arms-race
Structure: split-screen-race
Analog: penicillin-resistance-1946
DUR: 36s, 1080x1920, 30fps. Scene: scenes/the-arms-race.js

## Logline
A neon two-player versus screen. Top lane: the red, one player, learns the answer (1 in 8 samples at the start, odds doubling ~every 7 months, derived). Bottom lane: everyone else, nine players each holding one green piece of the same controller, who never get to share it. The next answer needs 13 years; the red beats it again about two years later.

## Time mapping (one mapping)
Race: **1 film second = 1 year**, linear, t_film 3.6 s = year 0 (April 1946) to t_film 18.6 s = year 15 (1961).
Cold open (0-1.5 s) is a labeled flash-forward ("later") to year 4 of the same timeline, then a rewind to year 0.
Snap: the same 15 years replayed at a compressed but still proportional scale (15 years in 2.4 s), human and AI panels on the same axis.

## Speed math
**Threat (top lane, 8x8 grid = one hospital's samples, and the red HUD bar on the divider).**
extent(y) = L.logistic(y, 0.56, 0.125). The 0.56-year doubling is *derived* in the analog file (logistic fit through 12.5% Apr 1946 and 38% Jun 1947, r = 1.245/yr), not published; stated on screen as "derived fit". Values: y0 12.5%, y1.17 37.8%, y1.75 55.5%, y2.5 75.9%, y4 95.3%.
Measured range ends at y = 1.17 (38%). The 59% at 1948 is **unverified and never shown**. Beyond y = 1.75 the curve is extrapolation: grid cells whose index exceeds extent(1.75)*64 = 35.5 are drawn lighter (outlined, low alpha), and the bar segment past that point is dashed and labeled "fit".
Year 13 (1959): the new answer arrives; red cells go gray (answered). Year 15 (1961): the red beats it again (s5) — shown as a handful of red cells returning with the label "Beaten again." No share is claimed for the counter-move (none is sourced).

**Human aggregation (bottom lane).** Nine players, piece i connects at L.lognormalQuantile((i+0.5)/9, median 13, p90 69):
1.63, 3.69, 6.03, 9.0, **13.0**, 18.8, 28.0, 45.8, 103.5 years.
The controller works when a majority (5 of 9) is plugged in, which by construction is the median: year 13 (methicillin, 1959, s5). The hero holds piece #5 and plugs in at year 13. Four players are still holding their pieces when the race ends at year 15 (real variance: some connect absurdly late).
Note: p90 = 69 rests on the WHO 2015 plan (s6, unverified); it only shapes the late tail, never shown as a number.

**AI counterfactual (snap, labeled "illustrative").** From ai_counterfactual: a routed coordination response at year 2.5 instead of the 13-year median (about 1 year after Barber's warning, ~1.5). Basis: turning surveillance from many hospitals into a routed policy is analysis/communication work inside the ~17.4 h 50% task horizon (RATES.md, METR), repeated cheaply (Epoch cost trend). 2.5 is an assumption: no numeral on screen, only position on the shared axis. On screen: "routed response · illustrative" and "chemistry still takes years" — it does NOT claim a faster drug, and the red bar in the AI panel is identical (no claim that the red stops).

**Numbers on screen (2):** "1 in 8" (s1, verified) and "13 years" (s5, methicillin 1959). No year numerals, no percentages. "Player"/P labels carry no digits.

## Shot list (camera: handheld chase = noise shake whose amplitude grows with the pace)
| t | shot | slate | what |
|---|---|---|---|
| 0.0-1.5 | COLD OPEN, CLOSE | SC1 CLOSE | Flash-forward (year 4, "later"): hero's face lit red from the top lane, green piece in hand, grid nearly full red above. Card: "It learns faster than we meet." |
| 1.5-1.9 | REWIND glitch | SC1 REWIND | Scanline slice-shift back to year 0. |
| 1.9-3.6 | CLOSE (hold) | SC2 CLOSE | Versus card: THE RED vs EVERYONE ELSE. |
| 3.6-6.0 | CLOSE handheld | SC3 CLOSE | Race starts (year 0-2.4). HUD "1 in 8". Card: "It learns the answer. Alone." |
| 6.0-8.4 | PULL OUT (chase whip) | SC4 DOLLY OUT | Out to the full split arena. |
| 8.4-12.4 | WIDE | SC5 WIDE | Years 5-9. Links form one by one. Cards: "We hold the pieces. Separately." / "Nobody passes the controller." |
| 12.4-14.6 | PUSH IN | SC6 DOLLY IN | Back in on the hero, closer than SC3. |
| 14.6-16.4 | EXTREME CLOSE | SC7 ECU | Years 11-12.8, angry face, piece shaking. |
| 16.4-18.4 | QUICK PULL OUT (medium) | SC8 MEDIUM | Year 13: hero plugs in, controller works, green beam grays the red. Card: "13 years. The next answer." |
| 18.4-20.0 | SLAM IN (closest) | SC9 ECU | Year 15: red returns. Card: "Beaten again." |
| 20.0-22.4 | FREEZE, silence | SC10 | "We slowed it down so you could see it." |
| 22.4-29.6 | SNAP, locked wide | SC11 SNAP | Hit cue. Two stacked 920px panels, same axis: human (green at the 13-year mark, red flash after) vs routed (green at the illustrative mark). |
| 29.6-32.0 | | SC12 | "This is the bottleneck." |
| 32.0-36.0 | END | SC13 END | L.endCard, 4 s. |

Zoom cycles: IN (0-6.0, zoom 2.4) -> OUT (6.0-8.4 to zoom 1.0) -> IN+ (12.4-16.4, zoom 3.2) -> OUT (16.4-17.2, zoom 1.6) -> IN++ (18.4-19.0, zoom 4.0). Two out-and-in cycles, each return closer.

## 3D translation note
Arena as a real dark arcade stage split by a glowing horizontal divider: top a wall of invader-glyph sample tiles, bottom a floor with nine players in pools of their own screen-light. Hero close-ups on a 50 mm handheld at seated eye height, lit only by red spill from above and green from the piece; pull-outs are a fast Steadicam/drone retreat (24 mm, rising 3-4 m in ~2 s) with a whip-shake settling at the wide; push-ins accelerate each time (85 mm on the final slam). Richer in 3D: volumetric glow haze, the green links as physical light cables that sag and fail, the controller slots physically clicking in, the red wall re-lighting tile by tile.

## Copy variants (register: arcade/network)
- "It learns faster than we meet." (hook, used)
- "THE RED vs EVERYONE ELSE" (versus card, used)
- "It learns the answer. Alone." / "We hold the pieces. Separately." / "Nobody passes the controller." (used)
- "13 years. The next answer." / "Beaten again." (used)
- Unused: "Single player vs. no multiplayer." / "Our lag is the red's head start." / "Insert coordination." / "Player two never got the controller."

## Tags
{"structure":"split-screen-race","medium":"neon arcade","family":"game","scale":"history","pace":"accelerating","emotion":"anger","protagonist":"one person","camera":"handheld chase","analog":"penicillin-resistance-1946"}
Diversity: the assigned tags (protagonist "the red itself") were TOO SIMILAR to fifteen-hundred (0.44: same structure, medium, camera, emotion, protagonist). Changed protagonist to "one person" (the hero player carries every close-up) -> OK, nearest fifteen-hundred at 0.56.

## Scores (after render; duration 36.0 s confirmed by ffprobe)
- Hook: 7 (frame 1: angry face lit red, green piece in hand, near-full red invader wall, "It learns faster than we meet.")
- Speed accuracy: 8 (logistic from the derived 0.56-yr doubling with the extrapolated part drawn lighter and labeled; lognormal quantiles 13/69; 13 and 15 from sources; 59% never shown; 2.5 is position only)
- Snap impact: 6 (freeze, silence, hit, two panels on one axis; honest but the AI gain is coordination only, so it lands softly)
- Emotion: 7 (hero's face across three closer returns; plug-in at 13 then "Beaten again" slam-in)
- Originality: 6 (invader wall vs. controller pieces is fresh for this analog, but the split-screen neon arcade look has a sibling in fifteen-hundred)
- Craft: 6 (clean vector glow and readable cards with plates; stick figures are basic, panels a little text-dense)
- Honesty: 9 (one hospital labeled, derived fit labeled, "illustrative" and "chemistry still takes years" on screen, red identical in both panels)
Overall: 7.0
Virality: 8% — the versus-screen arcade framing and the "beaten again" twist are shareable, but it's a data explainer with stick figures from a small account, and the snap's payoff is subtle.

Post-preview fixes: cards moved clear of the hero's body with a backing plate; cold-open camera widened so the red wall fills the upper half of frame 1; lane label moved off close-ups; snap panels re-centered; end card line changed to "The bottleneck is us." so it doesn't repeat the NECK card.
