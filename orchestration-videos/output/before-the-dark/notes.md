Tier: animatic

# Before the Dark

**Logline.** A woodblock city on an August afternoon. On a street corner, one person holds a green phone: she knows the alarm computers are dead. Across the skyline, three more people each hold one more piece. The four almost talk. The camera cranes up over the rooftops while a red crack runs in along the power lines, then drops back down to her face as the windows go out behind her. Then the same afternoon runs again, "after (illustrative)": the pieces find each other in minutes, people decide, and the lights stay on.

- **Structure:** `before-after` (research/VIRAL_STRUCTURES.md #11)
- **Analog:** `blackout-2003` (research/analogs/blackout-2003.json). The file is `verified: false` at the top level, and several threat points are individually `verified: false`.
- **Tags:** medium woodblock / family city / scale city / pace stop-start / camera crane up and drop down / emotion awe / protagonist a crowd

## What stays off screen (per the coordinator's note and the analog)
- The threat points at 15:32, 15:41, 16:05:57 (1%) and the 16:10-16:13 cascade end are all `verified: false`. So the "4:09 / 4:17" times from the concept log, and "7 minutes" (1% to 100%, derived from two unverified points), are **not shown**. No clock times are on screen at all.
- "~50 million people" is sourced but left off so the film stays at two numbers.
- The motion of the cascade still follows the analog's points (including the unverified ones) because that is the best available shape. Only on-screen numbers must be verified.

## Time mapping (one mapping, both halves)
**1 film second = 10 minutes of the afternoon.** Event hours after 14:14 (the alarm failure, t0 in the analog): h = (t − T0) / 6.
- BEFORE: T0 = 1.4 s, runs to 13.4 s (h = 0 → 2.0).
- AFTER: T0 = 20.0 s, runs to 32.0 s (h = 0 → 2.0). Same mapping, same red.
- The cold open (0–1.4 s) is a flash-forward to h ≈ 1.93 (the middle of the cascade), labeled BEFORE, then the film cuts back to t0.
- The mapping itself is in notes only (it would be a third number on screen).

## Speed math
**Threat (red).** Analog `threat.points` (t in hours, extent = share of the eventual dark): 0.85 h first line trip (15:05, verified) → film 6.5 s / 25.1 s; 1.30 h and 1.45 h trips (unverified, motion only) → 9.2 s, 10.1 s; 1.87 h point of no return (extent 0.01) → 12.62 s; 1.98 h cascade complete (extent 1.0) → 13.28 s. Extent is interpolated linearly between points; each window has a distance d from the far-left line where the red comes in, and it goes dark when d < extent(h). Line trips show as red segments on the transmission line that grow toward the city. The whole skyline goes dark in about 0.66 film seconds: flat for 12 s, then everything at once, which is the real shape.

**Human aggregation (green).** Four people (the analog's f1–f4), plus the fix (f5 = shed load, a green lever at the substation).
Fragments light at their `ready_at`: f1 IT staff (street person, "knows the alarms are dead") 0.1 h → 2.0 s; f4 neighbors ("saw lines trip", ready 0.85 h, `verified: false` time, motion only) → 6.5 s; f2 operators ("can cut load") 1.5 h → 10.4 s; f3 coordinators ("has the map") 1.83 h → 12.38 s.
Links connect at `L.lognormalQuantile(q, median 1.5 h, p90 1.83 h)` (sigma = ln(1.83/1.5)/1.2816 = 0.155), but never before both ends are lit:
| link | q | quantile | used (max with ready) | film t |
|---|---|---|---|---|
| f1–f4 | 0.10 | 1.23 h | 1.23 h | 8.8 |
| f4–f2 | 0.35 | 1.41 h | 1.50 h | 10.4 |
| f2–f3 | 0.60 | 1.56 h | 1.83 h | 12.4 |
| all → fix | 0.95 | 1.94 h | 1.94 h | 13.0 (after the 1.87 h point of no return) |
Earlier attempts break: f1's call at ~0.2 h (the IT staff never told operators, s2) and f4's first call at ~0.9 h (operators' alarms were dead) are drawn as green lines that reach and snap. The analog says the pieces never actually assembled before 16:06, so the model is generous; the last link still lands after the point of no return.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median = 0.25 h`: about 15 min from the 14:14 alarm loss to a flagged, routed warning in front of the operators. Basis (analog): the fragments were machine-readable signals already inside control rooms; joining "alarms are dead + lines are tripping + shed load" is a sub-hour expert reading task, well inside the ~17.4 h 50%-success METR time horizon (RATES.md, May–Aug 2026). In the AFTER half: f1 lights at 0.1 h (20.6 s); thin fast green threads route to f2, f3, f4 and the fix; all links hold by 0.25 h (21.5 s). People still decide: the operators' window pulses and the fix lever is pulled when the first line trips (0.85 h, 25.1 s). The shed district goes gray (planned, not red); the red stays on its one line segment and fades. The analog says the shed itself would take minutes (unsourced), so the shed is drawn over ~1 film second and labeled "people still decide". No claim this would certainly have prevented the blackout; "after · illustrative" stays on screen for the whole half.

**Snap panels (16.4–20.0 s).** Freeze and silence 16.4–16.8, one hit, then two stacked timelines, each 900 px wide, same 2 h axis, swept together at the same speed (true proportions of the afternoon): BEFORE (red notch at 1.87 h; green pieces noticed ~1.5 h; assembly marker lands after the red) and AFTER · illustrative (green joins at 0.25 h, far left of the first red trip).

## Numbers on screen (two)
1. "1.5 h": aggregation median, fragment-awareness time for FE operators (s2, Practical Engineering summarizing the Task Force report; not flagged unverified). Shown as "~1.5 h to notice".
2. "15 min": the AI counterfactual (0.25 h), always labeled "illustrative".

## Shot list
| t | slate | camera | beat |
|---|---|---|---|
| 0–1.4 | SC1 CLOSE (flash-forward) | eye level, still | HOOK: person on the corner with a green phone; red crack across the skyline behind; half the windows dark. "BEFORE". Card: "Four people almost talked." |
| 1.4–4.6 | SC2 CLOSE | eye level, slow push | Cut back to t0: every window lit. Her phone turns green (2.0 s). Label "knows the alarms are dead". She calls; the green line reaches up and snaps. |
| 4.6–8.0 | SC2 CRANE UP | zoom 4.2 → 0.52, rise | Over the rooftops: the whole city, the crowd in the streets, transmission line in from the left. Card "The answer was here. In pieces." First red trip at 6.5 s; f4 lights. |
| 8.0–10.6 | SC2 WIDE | hold, slight drift | Links try, break, connect late. More red trips. f2 lights. |
| 10.6–12.3 | SC2 DROP DOWN | zoom 0.52 → 5.2 | Back to the street corner, closer than the opening. |
| 12.3–13.4 | SC2 CLOSE+ | slow push | Her face looking up (awe); the red sweeps the skyline behind her; windows go dark. |
| 13.4–14.0 | — | black | dead stop, silence |
| 14.0–16.4 | SC3 | still | "We slowed it down / so you could see it." |
| 16.4–20.0 | SC4 SNAP | flat | freeze, hit, two timelines side by side (panels 900 px, labels ≥ 44 px). |
| 20.0–21.3 | SC5 CLOSE | eye level | "AFTER · illustrative". Green threads route from her phone in seconds. |
| 21.3–24.0 | SC5 CRANE UP | faster rise | Four windows green and linked by 21.5 s; lines hold (glow). |
| 24.0–27.4 | SC5 WIDE | hold | First trip at 25.1 s; operators pull the fix; shed district goes gray; red fades on its segment. "people still decide". |
| 27.4–29.6 | SC5 DROP DOWN | zoom → 6.2 | back to her, closer than any earlier shot |
| 29.6–32.0 | SC5 CLOSE++ | slow push | her face, lit windows behind, the crowd lit. |
| 32.0–34.4 | SC6 | still | "This is the bottleneck." |
| 34.4–38.0 | END | | L.endCard (3.6 s); last 0.4 s dissolves to frame 1 composition for the loop. |

**Zoom cycles:** Cycle 1 OUT 4.6–8.0, IN 10.6–12.3 (closer than 1.4). Cycle 2 OUT 21.3–24.0, IN 27.4–29.6 (closest of all).

## 3D translation note
- **Street corner:** 50 mm lens at 1.6 m eye height, late-summer 4 pm light that is flat and gray. Carved-wood materials: every surface has a visible grain normal map and slightly chipped edges; printed ink colors only (four grays), red and green are the only emissive materials. The figure is a carved stick-figure puppet with a readable face.
- **Crane up:** a real crane rise that becomes a drone climb, ~3 m/s, ease in and out, tilting down to 35° as it clears the rooftops so the streets and the crowd read as a grid of tiny figures. The transmission line enters from the left horizon; the red travels as emissive light along the conductors.
- **Drop down:** faster than the rise (gravity feel), ending on a tighter 85 mm portrait so the second return is more intimate. In AFTER, the drop lands closer still.
- **Richer in 3D:** window light volumes switching off building by building; carved relief depth on the skyline layers; green threads as light pipes between control-room windows.

## Copy variants
- "Four people almost talked." (hook, used)
- "The answer was here. In pieces." (used)
- "The city had the fix. Nobody routed it."
- "Same afternoon. Better routing."
- "The grid had lag."

## Tags
{"structure":"before-after","medium":"woodblock","family":"city","scale":"city","pace":"stop-start","camera":"crane up and drop down","emotion":"awe","protagonist":"a crowd","analog":"blackout-2003"}
Diversity check: OK (nearest ninety-seconds 0.78).

## Build log (resumed)
- Resumed after a cutoff: the scene was complete but used `Path2D`, which node-canvas lacks. Replaced it with batched `rect` paths.
- Preview critique: the "Same pieces. Faster routing." title collided with the AFTER panel border (panels moved up 60–80 px), and the BEFORE/AFTER tag started at y 196, above the safe zone (moved to y 226). Nothing else was broken. The hook frame shows the red crack plus red lines, the green phone, and a face, and both zoom cycles read on the contact sheet.
- Render: 38.4 s (ffprobe 38.400000) = DUR.

## Scores
- Hook: 7
- Speed accuracy: 7 (the analog's shape, including unverified points, drives motion only; the links follow the lognormal; the flat-then-instant cascade is true to the data)
- Snap impact: 6
- Emotion: 6
- Originality: 7
- Craft: 6
- Honesty: 8
- Overall: 6.7
- Virality: 7% (the woodblock city and the before/after flip are distinctive and sound-off legible, but a gray, busy wide shot and a 38 s runtime from a small account rarely clear 100k)
