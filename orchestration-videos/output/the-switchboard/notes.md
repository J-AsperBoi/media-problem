# The Switchboard (slug: the-switchboard)

Tier: animatic

**Title:** The Switchboard
**Logline:** POV of a quiet switchboard. Frontier AI is shown as an operator board, never as a face. Four control rooms each hold one piece of the picture. On the real night no board existed, so every wire runs to an empty socket, the calls drop, and the lights go out. In the counterfactual (illustrative) the board sees which lines should connect and lights them. The people at each end decide whether to pick up.

**Structure:** `pov` (research/VIRAL_STRUCTURES.md #6). The "you" in the POV is the board, and the camera is its signal. Frame 1 reads "POV: you're a switchboard." The next card turns it: "That night, you didn't exist."
**Analog:** `blackout-2003`
**Protagonist:** AI, shown only as a board of jacks and lamps. It has no face and no voice. It never touches the grid; all it does is light a wire. People pick up and decide.

## Diversity check
`node tools/diversity.js '{"structure":"pov","medium":"stick-figure animatic","family":"machine","scale":"organization","pace":"sprint","emotion":"resolve","protagonist":"AI","camera":"POV walk","analog":"blackout-2003"}'`
Result: OK (nearest the-worm 0.56, fifty-nine-days 0.67, the-worm-rewind 0.67). I kept all the assigned tags.

Tags: {"structure":"pov","medium":"stick-figure animatic","family":"machine","scale":"organization","pace":"sprint","emotion":"resolve","protagonist":"AI","camera":"POV walk","analog":"blackout-2003"}

## Time mapping (one mapping, stated)
The race runs from film t = 1.4 to 13.4 s. **Event hours h = (t - 1.4) / 6, so 1 film second = 10 minutes**, linear (the sprint pace). h = 0 is the analog's t0, when the control-room alarms began failing silently (s2).
The cold open (t < 1.4) is a flash-forward to h = 2.0 in the same room and framing, labeled "that evening".
The snap panels share one linear axis from 0 to 2 h.

## Speed math (reused from seven-minutes, re-timed to 1 s = 10 min)
- **Threat (red).**
  - The only line trip drawn is the verified one, at h = 0.85 (s6, film t = 6.5). The 15:32 and 15:41 trips are verified:false and are not drawn.
  - The cascade is **L.logistic fitted through the analog endpoints**, extent 0.01 at h = 1.87 and 0.99 at h = 1.98. That gives e^{r·0.11} = 9801, so r = 83.6/h and the **doubling time is 0.0083 h (about 30 s real, 0.05 s on screen)**. On screen it runs from t = 12.62 to 13.28. It is not linear.
  - Each grid line, town light and room has an outage rank: its distance from the first trip plus seeded jitter. An item goes dark when rank < extent(h).
  - The endpoint times are verified:false, so they drive motion only and are never shown.
- **Human aggregation (green).** Ready times come from `solution.fragments`, and brightness means attention.
  - IT desk (f1) is bright from h = 0.1 (t = 2.0), but no wire reaches the operators.
  - Neighbors (f4) are bright from h = 0.85 (t = 6.5). Their exact call times are unverified, so no time is shown.
  - Operators (f2) become aware at h = 1.5 (t = 10.4). Their face switches to panic and the lever brightens.
  - Coordinator (f3) gets the map (state estimator) back at h = 1.83 (t = 12.38).
  - Six person-to-person calls between rooms connect at **L.lognormalQuantile((i+0.5)/6, median 1.5 h, p90 1.83 h)**, which gives h ≈ 1.21, 1.35, 1.45, 1.55, 1.66 and 1.86. Each call grows for 0.35 s, holds green for 0.9 s, then drops. No call ever runs from the IT desk to the operators, because IT did not tell them (s2). The pieces never assemble.
- **AI counterfactual (the board).** `ai_counterfactual.aggregation_median` is 0.25 h, against a human median of 1.5 h. The basis comes from the analog: every fragment was a machine-readable signal already inside the control rooms. Reading them together is a sub-1-hour expert task, well inside the ~17.4 h 50% task horizon (METR, RATES.md, May–Aug 2026).
  - At h = 0.25 the board lights the IT-desk-to-operators line. At h = 0.85 it also lights the neighbors' line.
  - The operators pick up. People decide.
  - The cascade in this lane is drawn as a **dashed red outline with "?"**. We do not claim the blackout would have been prevented.
  - It is labeled "illustrative" on screen.

## On-screen numbers (max two)
1. "50 million" (people affected, s3, confirmed per analog notes)
2. "1.5 hours" (time for the pieces to notice: the aggregation median from sourced awareness times, s2. The analog notes call it a lower bound.)

"7 minutes", the line-trip times and the endpoint times are not on screen. No organization names are shown; the rooms are "IT desk", "neighbors", "operators" and "coordinator".

## Shot list (DUR 38 s)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.4 | SC0 COLD OPEN | CLOSE on the operator's stick face, zoom 8 | Flash-forward to h = 2: red window behind his head, green lever dim at hand, dead alarm lamps. "POV: you're a switchboard." |
| 1.4-4.4 | SC1 CLOSE | slow push, 8 → 8.6 | h = 0. The room is lit and calm. "That night, you didn't exist." |
| 4.4-7.9 | SC2 POV WALK | camera rides a gray signal pulse along his phone wire to the center, finds a dashed empty socket ("no board"), then rides the next wire to the neighbors' room | "Every line ran to nothing." The first trip (red) at 6.5; the neighbors see it and panic. |
| 7.9-9.8 | SC3 PULL OUT | 4.4 → 1.0, log-zoom | Four rooms around an empty center. "Each room held one piece." |
| 9.8-13.3 | SC3 WIDE, locked | 1.0 | Calls connect and drop. "No one saw the whole board." Cascade at 12.62-13.28. |
| 13.3-15.6 | SC4 DOLLY IN, closer | 1.0 → 11 on his face | Room dark, window red, sad face. "50 million people. Dark." |
| 15.6-18.2 | SC4 HOLD (dead stop) | locked | "We slowed it down so you could see it." |
| 18.2-26.4 | SC5 INSERT: TWO TIMELINES | flat full-frame panels, 900 px wide | Freeze, silence, one hit. "That night" sweeps 0 → 2 h in 1.6 s; then "With a board (illustrative)" sweeps the same axis. |
| 26.4-31.2 | SC6 POV WALK again, IN++ | camera at the board (now solid, lamps lit), rides the green signal from the IT desk wire through the board and down to the operator, ending at zoom 12 | "Now the board lights the line." He lifts the receiver. "They pick up. They decide." |
| 31.2-33.6 | SC6 CLOSEST hold | 12 | "This is the bottleneck." |
| 33.6-38.0 | END | - | L.endCard, 4.4 s |

**Zoom cycles:** IN from 0 to 7.9 (zoom 8, walk at 3.6-4.4) → OUT from 7.9 to 9.8 (zoom 1) → IN+ from 13.3 to 15.2 (zoom 11 > 8) → [flat insert] → IN++ from 26.4 to 31 (zoom 12, riding the lit line).

## 3D translation note
- **SC0/SC1:** 50 mm lens at eye level. A stick-figure operator (as a flat paper-cut plane) stands in a cutaway room. The window behind him is the main light source: cool at first, red later. The alarm lamps on the wall are real, and dead.
- **SC2 POV walk:** the camera becomes a small light traveling along a physical copper wire about 20 cm above a tabletop region model. Use a 24 mm lens and a slight handheld sway, moving at walking pace. At the center there is a board-shaped hole: a wireframe outline, and the signal fizzles into it.
- **SC3:** crane up to a high 35 mm view, looking almost straight down on four dollhouse rooms around the empty center. Call wires arc between rooms as fiber strands and snap. The cascade is a physical wave of window lights going out.
- **SC4:** a slow push back down into the operator's room, ending at 85 mm. The only light on his face is red.
- **SC6:** the board is now a real brass-and-bakelite switchboard at the center: jacks, lamps and patch cords, but no face and no screen. The camera rides the green lamp-light down the wire and arrives macro on his hand lifting the receiver.
- 3D gets richer through light traveling along the wires, which carries the POV.

## Copy variants
- "POV: you're a switchboard." (hook)
- "That night, you didn't exist."
- "Every line ran to nothing."
- "Each room held one piece."
- "No one saw the whole board."
- "50 million people. Dark."
- "Now the board lights the line."
- "They pick up. They decide."
- Alternates: "Four rooms. No switchboard." / "Everyone had a piece. Nobody had the picture." / "The lines existed. The routing didn't." / "It doesn't pull the lever. It rings the phone."

## Build notes
- Rendered at 38.0 s (ffprobe), 1080x1920, 30 fps.
- The real-night world and the counterfactual world share one layout. Only the board changes: a dashed "no board" outline on the real night, and a solid panel of jacks and lamps in the counterfactual. It never has a face.
- The POV walk is literal: the camera center tracks a signal pulse sampled along each wire (`wireAt`). Zooms use log-zoom interpolation.
- Fixes after preview:
  - Recentered the final close so the operator's face isn't cut off at the left edge.
  - Moved the "illustrative" label off the operator's body.
- Known weak spots:
  - At the wide zoom the rooms are small, so the operators' panic at h = 1.5 is tiny.
  - The receiver lift is stiff.
  - The frame-1 lever is dimmed because the room is out, so the green reads weaker than the red.

## Scores
- Hook: 7. "POV: you're a switchboard." over a sad face and a huge red window, with the green lever in frame. The green could be stronger.
- Speed accuracy: 8. One linear mapping (1 s = 10 min). Only the verified trip is drawn. The cascade is a fitted logistic, the calls use lognormal quantiles, and the board time comes from the analog.
- Snap impact: 6. The two lanes chart is clean and the routed line is legible. It is still a chart insert, but the lit-line POV walk afterward gives it a return to the world.
- Emotion: 6. "That night, you didn't exist." is the best line. The resolve beat (pick up, decide) is quiet rather than cathartic.
- Originality: 7. Showing the AI as a board that only lights wires, and a POV that is a signal running to an empty socket, are fresh for this analog (5th film on it).
- Craft: 7
- Honesty: 9. The AI never touches the grid; people pick up and decide. The routed cascade is shown dashed with "?" and labeled illustrative. Only "50 million" and "1.5 hours" appear, with no unverified times.

Overall: 7.1
Virality: 7%. The POV-switchboard hook and the "you didn't exist" turn are shareable, but it is the fifth take on the same blackout and the middle is a small wide shot of stick rooms, so it most likely stalls well short of 100k.
