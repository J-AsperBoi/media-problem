# Keep the Lights (slug: keep-the-lights)

Tier: animatic

**Title:** Keep the Lights
**Logline:** One long take in a shadow-puppet theater. A city of cut-out towers glows on the screen, lit by one lamp behind it. Backstage, four puppeteers each hold one green piece of the same fix, separated by curtains; their strings reach for each other and tangle. For almost two hours nothing happens. Wait for it: the lamp goes out, and the whole city falls to shadow in front of the audience.

**Structure:** `wait-for-it` (research/VIRAL_STRUCTURES.md #4). The on-screen promise is "Watch the lamp." The payoff has two parts: the lamp dies (the cascade), and in the snap the four green pieces turn out to be the quarters of one shape, a breaker dial, which clicks together only in the routed (illustrative) timeline.
**Analog:** `blackout-2003`

## Diversity check
Tags: {"structure":"wait-for-it","medium":"shadow puppet","family":"theater","scale":"city","pace":"one long take","emotion":"vertigo","protagonist":"a crowd","camera":"locked-off close-up with a single pull-out","analog":"blackout-2003"}
Result: OK (nearest ninety-seconds 0.56, lights-of-ontario 0.56, before-the-dark 0.67). Nothing changed.

## Metaphor map
- The lamp behind the screen = the grid. The small red flicker in its filament = the hidden fault (the threat, never named).
- The shadow city on the screen = the ~50 million people's lights. Each lit window is a cut-out that the lamp shines through.
- The audience = the crowd (the protagonist). Their faces are lit only by the screen.
- The four puppeteers backstage = the analog's fragments (f1 IT staff, f4 neighbors, f2 operators, f3 coordinator). Each holds one quarter of a green dial on a rod.
- Strings between puppeteers = phone calls. They reach, hold green for a moment, then tangle and drop.

## Time mapping (one mapping, stated; the same as seven-minutes)
Race runs film t = 1.0 to 17.0 s. **Event hours h = (t - 1) x 0.125, so 1 film second = 7.5 minutes**, linear. h = 0 is the analog t0 (the control-room alarms start failing silently, s2). The cascade finishes at h = 1.98 (film t = 16.84).
The cold open (t < 1) is a flash-forward in the same framing to h = 1.93 (mid-cascade), labeled "later".
The snap panels share one linear axis, 0 to 2 h across 840 px.

## Speed math (reused from seven-minutes for consistency)
- **Threat (red).**
  - At h = 0 the lamp's filament has a small red flicker (the silent alarm failure, s2, verified).
  - At h = 0.85 (t = 7.8), the first verified line trip (s6): the flicker becomes a red crack in the lamp glass, and it pulses from here on.
  - The 15:32 and 15:41 trips are verified:false in the analog, so they are **not drawn**.
  - The cascade uses **L.logistic fitted through the analog endpoints**, extent 0.01 at h = 1.87 and 0.99 at h = 1.98: e^{r·0.11} = 9801, so r = 83.6 /h, and the **doubling time is 0.0083 h ≈ 30 s real time** (0.9 s on screen at this mapping).
  - Each of the ~300 window cut-outs on the screen gets an outage rank, ordered by distance from the lamp's crack plus seeded jitter. A window goes out when rank < extent(h). Each window's out-time comes from numerically inverting extent(h), so it flashes red for a moment and then goes dark. That red front sweeps across the city. The lamp's cream light is scaled by (1 - extent) and its red glow by 4·extent·(1 - extent).
  - The 1.87 and 1.98 endpoints are verified:false, so they drive motion only. No time appears on screen.
- **Human aggregation (green).** Each puppeteer's piece brightens at the fragment's `ready_at` (brightness means attention): f1 IT staff at h = 0.1 (right-lower bay, the glint in the opening close-up), f4 neighbors at 0.85 (left-lower), f2 operators at 1.5 (right-upper), f3 coordinator at 1.83 (left-upper).
  - Six strings connect at **L.lognormalQuantile(q, median 1.5 h, p90 1.83 h)** with q = (i + 0.5)/6, which gives h ≈ 1.21, 1.35, 1.45, 1.55, 1.66 and 1.86. Each string grows for 0.35 s, holds green for 0.9 s, then tangles into a gray knot and drops. They never all hold at once, because the pieces never assembled (analog aggregation notes).
  - Each piece also keeps a faint gray string reaching toward the center of the stage the whole time.
- **The window.** From h = 0.85 to the point of no return, "about 1 hour" (f5, s6). The card reads "The window: one hour."
- **AI counterfactual (snap).** `ai_counterfactual.aggregation_median` = 0.25 h against the human median of 1.5 h. Basis, from the analog: every fragment was a machine-readable signal already inside the control rooms. Joining them is a sub-1-hour expert reading task, well inside the ~17.4 h METR 50% time horizon (RATES.md). **Labeled "illustrative" on screen.** In the routed panel the four quarters fly together at h = 0.25 into one dial. The cascade band is drawn dashed with a "?", and the card says "People still decide." We do not claim the blackout would have been prevented.

## On-screen numbers (max two)
1. "one hour" (the window, f5/s6)
2. "50 million" (per the analog notes, confirmed by the s3 snippets)
"7 minutes" is not shown; the card says "In minutes."

## Shot list (DUR 38 s)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.0 | SC0 COLD OPEN | locked-off CLOSE on one audience face (zoom 2.3) | h = 1.93: lamp flaring red behind the screen, the city going dark, green glint through the curtain gap. "Watch the lamp." Label "later". |
| 1.0-6.0 | SC1 CLOSE LOCKED-OFF | hold | t0: warm screen, a tiny red flicker in the filament, and the face watching. The IT piece brightens at t = 1.8. Cards "One lamp lights the whole city." / "Backstage: four pieces of one fix." |
| 6.0-9.5 | SC2 PULL-OUT (the single pull-out) | zoom 2.3 -> 1.0, eased, 3.5 s | Reveals the screen, the four curtained bays and the whole audience. The lamp cracks red at 7.8. |
| 9.5-16.9 | SC3 WIDE hold (one long take) | locked | Strings reach, hold and tangle. Cards "The strings kept tangling." / "The window: one hour." Cascade 15.96-16.84: red front, windows out, lamp out, audience in dark. |
| 16.9-19.4 | SC4 DOLLY IN, closer | 1.0 -> 3.4 on the same face | Face in the dark, only an ember. "50 million people. In minutes." |
| 19.4-22.0 | SC4 hold (dead stop) | locked | "We slowed it down so you could see it." |
| 22.0-29.4 | SC5 INSERT: TWO SHOWS | flat panels, 920 px wide | Freeze, silence, one hit. "As it happened": the pieces never meet and the lamp dies. "Routed (illustrative)": the pieces snap into one dial at 0.25 h. |
| 29.4-33.2 | SC6 CLOSEST | zoom 4.2 on the face | Back inside: the face lit, and the assembled green dial glowing on the screen behind her (illustrative). "This is the bottleneck." |
| 33.2-38.0 | END | - | L.endCard, 4.8 s |

**Zoom cycles:** IN (locked close, zoom 2.3) 0-6 -> OUT 6.0-9.5 -> IN+ 16.9-19.4 (zoom 3.4) -> [flat insert] -> IN++ 29.4 (zoom 4.2).

## 3D translation note
- **SC0/SC1:** 85 mm at seat height, locked on a tripod. A real paper-and-muslin screen, the only key light. The audience member's face is warm-lit from the front, and the rows behind fall into dark. Through the right-hand curtain gap there is a green glint of a rod puppet. The lamp is a real tungsten bulb behind the muslin, and its filament hot spot shows through with a faint red flicker.
- **SC2:** one slow dolly-back and crane-up over the rows (about 4 s, eased), ending on a symmetrical proscenium wide where the side walls are cut away like a dollhouse, so the four puppeteer bays are visible.
- **SC3:** fully locked. The strings are real thread catching rim light and casting shadows on the muslin. The cascade is a physical wave of paper windows going dark, as the bulb browns out red and dies.
- **SC4/SC6:** push back to the face through the dark, 135 mm by SC6. The face is lit only by the screen, and later by the green dial's glow.
- 3D gets richer through light transport: every light in the film is the one lamp, so killing it kills everything.

## Copy variants
- "Watch the lamp." (hook / promise)
- "One lamp lights the whole city."
- "Backstage: four pieces of one fix."
- "The strings kept tangling."
- "The window: one hour."
- "50 million people. In minutes."
- Alternates: "The show went on. Until it didn't." / "Everyone had a piece. No one had the stage." / "The audience never saw the strings." / "The grid had lag."

## Tags
structure wait-for-it · medium shadow puppet · family theater · scale city · pace one long take · camera locked-off close-up with a single pull-out · emotion vertigo · protagonist a crowd · analog blackout-2003

## Build notes
- Rendered 38.0 s (ffprobe), 1080x1920, 30 fps. The race is one continuous camera: locked close (zoom 2.0) -> pull-out to 1.0 -> push back to 3.0 on the same face, with a slight roll for vertigo. Only the snap insert breaks the take, and it uses full-frame dips in and out.
- Fixes after the preview: the assembled dial had a handle and read as a search icon, so I made it a ring with a hub. The "illustrative" label in SC6 was invisible against the lit face, so I moved it onto a dark pill under the dial.
- Known weak spots: the puppeteers are small in the wide shot. The snap's mini-stages are about 400 px (the panels are 920 px). The SC6 face is flat and restrained, not happy, because the routed version is only illustrative.

## Scores
- Hook: 8. Frame 1 has the lamp flaring red across the whole screen, a lit face in panic, a green piece through the wing gap, and "Watch the lamp."
- Speed accuracy: 8. Same mapping and math as seven-minutes: the verified trip only, a logistic cascade with per-window out-times inverted from extent(h), lognormal-quantile strings, and the analog's AI figure.
- Snap impact: 6. The quarters clicking into one dial is a real reveal, but it is still a chart insert.
- Emotion: 7. The audience sits lit by one lamp and then sits in the dark with a single ember. The face does the work.
- Originality: 8. A shadow-puppet theater as the grid, with the audience as the crowd and strings as the calls.
- Craft: 7
- Honesty: 9. No names and no unverified times. The card says "In minutes." The routed panel shows the cascade dashed with "?" and "People still decide."

Overall: 7.6
Virality: 8% — the lamp flare makes a strong thumbnail and the wait-for-it promise pays off, but the 1.9 h quiet stretch is a retention leak and the snap is abstract, so reaching 100k from a small account is unlikely.
