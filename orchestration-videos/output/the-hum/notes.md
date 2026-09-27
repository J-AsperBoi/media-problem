# The Hum (slug: the-hum)

Tier: animatic

**Title:** The Hum
**Logline:** Every lit window in a city is a particle, and all of them sing one note together: the grid's hum, drawn as a standing wave strung across the sky. One voice goes wrong. Four listeners each hear it, and none of them has anyone to tell. Then the chord collapses across the city in minutes. The loop lands back on the hum, just as the wrong note starts.

**Structure:** `seamless-loop` (research/VIRAL_STRUCTURES.md #15)
**Analog:** `blackout-2003`

## Diversity check
The assigned tags (particle/data, music, city, one long take, crane up and drop down, **awe**, a crowd) came back TOO SIMILAR to before-the-dark (distance 0.44). That film shares city, awe, a crowd, crane up and drop down, and the analog.
I kept the assigned structure and analog and changed **emotion from awe to loneliness**, since the film is about four listeners who each heard the wrong note and had no one to tell. Result: OK (nearest before-the-dark, lights-of-ontario and keep-the-lights, each at 0.56). The crane still reaches for awe, but the emotional throughline is loneliness.

Tags: {"structure":"seamless-loop","medium":"particle/data","family":"music","scale":"city","pace":"one long take","camera":"crane up and drop down","emotion":"loneliness","protagonist":"a crowd","analog":"blackout-2003"}

## Time mapping (one mapping, stated)
The race runs from film t = 1.0 to 17.0 s. **Event hours h = (t - 1) x 0.125, so 1 film second = 7.5 minutes**, linear. This is the same mapping as seven-minutes. h = 0 is the analog's t0, when the control-room alarms began failing without anyone noticing (s2).
- **Cold open, t 0 to 1.0:** h = 0.85 + t x 0.125. This is the same timeline one lap later: the moment of the first verified line trip.
- **Loop tail, t 35.4 to 36.0:** h = 0.85 - (36 - t) x 0.125, so h runs from 0.775 up to 0.85. The last frame therefore flows straight into frame 1, and the wire trips exactly at the loop join.
- **Snap panels:** both panels share one linear axis, 0 to 2 h across 800 px, and both sweep in 2.0 s.

## Speed math
- **Threat (red).** Only the verified line trip is drawn: Harding-Chamberlin at h = 0.85 (s6), which is film t = 7.8. It is the wire outside the listener's window, and it turns red and flickers. The 15:32 and 15:41 trips are verified:false and are **not drawn**.
  - Cascade = **L.logistic fitted through the analog's endpoints**: extent 0.01 at h = 1.87 and 0.99 at h = 1.98. That gives e^{r x 0.11} = 9801, so r = 83.6 /h and the doubling time is 0.0083 h (about 30 s real time, 0.07 s on screen). Film t runs 15.96 to 16.84. The endpoints are verified:false, so they drive **motion only**. No time is shown, and cards say "in minutes".
  - Each of the city's roughly 3,000 light particles gets an outage rank: its distance from the trip point plus seeded jitter, normalised to 0..1. A particle goes dark when rank < extent(h). It flashes red for 0.5 s and then goes dark, so loss appears only as absence. The standing-wave string goes flat and dark over dead ground, ranked along X from the trip point.
- **Human aggregation (green).** There are four listeners, one per analog fragment, and each glints green (hears the wrong note) at its `ready_at`:
  - f1 IT staff (our listener at the window): h = 0.1, t = 1.8
  - f4 neighbors: h = 0.85, t = 7.8 (call times are verified:false, so no time is shown)
  - f2 operators: h = 1.5, t = 13.0
  - f3 coordinator: h = 1.83, t = 15.64
  - Six link attempts between listeners connect at **L.lognormalQuantile((i + 0.5)/6, median 1.5 h, p90 1.83 h)**, which gives h ≈ 1.21, 1.35, 1.45, 1.55, 1.66 and 1.86 (t ≈ 10.7, 11.8, 12.6, 13.4, 14.3, 15.9). Each link grows for 0.35 s, holds for 0.9 s and breaks. They never all hold at once, because the pieces never assembled into the load-shed decision (analog aggregation notes).
  - The window to act ran from h = 0.85 to about 1.87, "about one hour" (f5, s6). That is the only duration shown ("The window: one hour.").
- **AI counterfactual (snap).** `ai_counterfactual.aggregation_median` = 0.25 h against the human median of 1.5 h. Basis (analog): every fragment was a machine-readable signal already inside the control rooms, and joining them is a sub-1-hour expert reading task, well inside the ~17.4 h METR 50% time horizon (RATES.md). The routed warning lands about 36 min before the first trip. It is **labeled "illustrative"** on screen. The routed lane's cascade zone is a dashed red outline with a **"?"** and "people still decide", so the outcome is uncertain. We do not claim it would have been prevented.
- **The hum.** The singing (particles bobbing in a standing wave, and the string in the sky) is a symbol of grid synchrony, and its visible frequency is not a data value. Its amplitude carries meaning: it is full while the grid holds and zero where the grid has gone dark.

## On-screen numbers (max two)
1. "one hour" (the window; f5 and s6)
2. "50 million" (people affected; s3, confirmed in the analog notes)

"7 minutes" is not on screen: the card says "In minutes."

## Shot list (DUR 36 s), one long take except for the snap insert
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.0 | SC0 CLOSE, cold open | eye level, 3.5 m from the listener's face | The wire outside the window flickers red and a green glint shows in the listener's ear. The string has a red kink. Card: "One wrong note." Label: "later". |
| 1.0-4.2 | SC1 CLOSE, eye level | slow drift | t0: the city sings, the wire is gray. At t 1.8 the ear glints green (f1). Card: "A whole city, singing one note." |
| 4.2-7.6 | SC2 CRANE UP | height 31 m to 1,500 m, pitch 0 to -0.42, eased (log height) | The particle city reveals itself with the string over it. Card: "Someone heard it slip." |
| 7.6-16.9 | SC3 HIGH WIDE | slow push | Trip at 7.8. Cards: "Four heard a wrong note." / "No one to tell." / "The window: one hour." Links reach and break. Cascade 15.96 to 16.84. |
| 16.9-19.3 | SC4 DROP DOWN, closer | 1,500 m to 2.3 m from the face | The city is dark behind and the wire is red. Card: "50 million people. In minutes." |
| 19.3-21.9 | SC4 hold (dead stop) | locked | "We slowed it down so you could see it." |
| 21.9-29.2 | SC5 INSERT: TWO TIMELINES | flat, full-frame dip | Freeze, silence, hit. "As it happened" / "Routed (illustrative)", on the same axis. |
| 29.2-31.6 | SC6 CLOSEST | 1.6 m, then pushing in | Back at the window at h = 0.25 (routed, illustrative): a green link holds from the ear out to the city. "This is the bottleneck." |
| 31.6-35.4 | END | none | L.endCard, full for 3.4 s (fades in 31.6 to 31.9, out 35.0 to 35.4) |
| 35.4-36.0 | LOOP TAIL | SC0 framing | The city is singing and the wire is gray. At the join the wire trips, which is frame 1. |

**Zoom cycles:** IN (eye level, 3.5 m) 0 to 4.2, then OUT (crane up to 1.5 km) 4.2 to 7.6, then IN+ (drop to 2.3 m) 16.9 to 19.3, then [flat insert], then IN++ (1.6 m) 29.2 to 31.6, then the loop tail returns to IN.

## 3D translation note
- **SC0/SC1:** 35 mm lens, floating outside a tenement window at the listener's eye level, 3.5 m away. The listener is a soft vinyl bean leaning out, lit by warm interior spill. A real catenary wire crosses frame top-right into the distance. The city is a sea of window lights, and every light bobs in a standing wave that sweeps slowly across the rooftops. Above it, a luminous string vibrates across the sky.
- **SC2:** a true crane, rising about 1.5 km in 3.4 s with eased acceleration and the pitch tilting down to about 24 degrees. The lights stay volumetric points (instanced emissive spheres), so parallax does the work.
- **SC3:** a slow push at altitude. The four listeners are lights with a ring halo. Link attempts are glowing fibers arcing high over the city, and they snap and sag. The cascade is a wave of windows going dark outward from the tripped line, each flashing red for an instant.
- **SC4:** a single descending move back to the window, ending at 85 mm, closer than the start. The only light is the red wire.
- **SC6:** macro on the ear glint, with a fiber running out of frame into the city.
- In 3D the result gets richer through real depth of field, bloom on the string, and the sound of the hum dropping out region by region.

## Copy variants
- "One wrong note." (hook)
- "A whole city, singing one note."
- "Someone heard it slip."
- "Four heard a wrong note."
- "No one to tell."
- "The window: one hour."
- "50 million people. In minutes."
- Alternates: "The grid has a hum." / "Everyone heard a piece." / "Nobody had the chord." / "Out of tune, out of time."
