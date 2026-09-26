Tier: animatic

# The Mind Grid

**Logline.** Split screen. Top: an x-ray of one control-room engineer's head, with neurons drawn as a network. Bottom: one province's power grid, drawn as the same network with the same nodes and wires. A red cascade takes both down in 90 seconds. The green pieces of the fix are lit in both halves from the start (the warning, the science, the control room, the crews, the planners). Their signals keep firing and dying before they reach the part that can act. The metaphor is "signals that don't reach the part that can act." It is a metaphor only: no neural timing is claimed. The head runs on the grid's clock.

- **Structure:** `split-screen-race` (research/VIRAL_STRUCTURES.md #2)
- **Analog:** `quebec-1989` (research/analogs/quebec-1989.json). The file is marked `verified: false` at the top level, so on screen I use only the individually sourced endpoints.
- **Medium / family / scale / pace / camera / emotion / protagonist:** x-ray / body/biology / mind / sprint / locked-off close-up with a single pull-out / vertigo / one person
- Sibling: `ninety-seconds` uses the same analog as a topographic crane shot. This film is the neuroscience version.

## Time mapping (one mapping, drawn as the split line itself)
The horizontal line that splits the screen is the time ruler, labeled "log time". Its ticks are words only: second, minute, hour, day, month, year.
Race (film t = 6.5 s to 19.3 s): event time E, in seconds after 02:44, equals 10^((t - 6.5) / 1.5). **Every 1.5 film seconds, ten times more real time passes.** Before t = 6.5 the scene is pre-event. The clock freezes at t = 19.3 (E ≈ 3.6e8 s, just past the ~7-year fix).

## Speed math
**Threat (red).** The analog's `threat.points` source only the endpoints: 0 at 02:44 and the whole grid down about 90 s later. Following the director's note, I don't draw a straight line between them. I fit a logistic through the endpoints: share(E) = L.logistic(E, 6.78 s, 0.01). With s0 = 0.01 and a 99% share at E = 90 s, e^(r·90) = 9801, so r = 0.102/s and the doubling time is 6.78 s. **This fit is my assumption.** The cascade order is the network's hop distance from the origin node at the top/north. A node falls when its rank/N < share(E), so the red visibly travels along the wires. On the clock the fall runs from t = 6.5 to about 9.4 s, and most of it lands in the last 0.7 s.

**Restoration.** `threat.events` from the analog says "more than 9 h to restore 83%" (s3). restored(E) = 0.83 × (E − 90) / (32400 − 90) from 90 s to 9 h. The remaining 17% is restored linearly by 24 h. **That tail is my assumption,** and no number is shown for it. Nodes come back in reverse cascade order. On the clock the lights return at t ≈ 13.3 s.

**Human aggregation (green).** There are 5 fragments, from `solution.fragments`: forecasters (f1), scientists (f2), control room / engineers (f3), line crews (f4) and planners (f5, the lasting fix). They are lit in both halves from frame 1. They connect as a loop of 5 routed signals, each running along the shortest network path between two fragments. Arrival times are `L.lognormalQuantile(q, 759 h, 64000 h)` at q = 0.1, 0.3, 0.5, 0.7, 0.9:

| link | q | arrival | film t |
|---|---|---|---|
| control room–crews | 0.1 | 9.0 h (= p10, sourced: 83% restored) | 13.27 |
| crews–science | 0.3 | 124 h (modelled) | 14.97 |
| science–forecast | 0.5 | 759 h (modelled median, NEVER shown) | 16.16 |
| forecast–planners | 0.7 | 4659 h (modelled) | 17.34 |
| planners–control room | 0.9 | 64000 h (= p90, sourced: series compensation 1996, ~7 yr) | 19.04 |

The analog says its 759 h median is a modelling assumption (the geometric mean of p10 and p90). It appears only as the spacing of the middle arrivals and is never on screen. Before each arrival, "attempt" pulses leave a fragment and die partway along the path. This is visual rhythm, not data: signals that don't reach.

**AI counterfactual (illustrative).** From `ai_counterfactual`: about 1 h to route an existing forecast, plus the known vulnerability of long lines, into one control room's operating posture. That is a short synthesis task, well inside METR's ~17.4 h 50% time horizon (RATES.md). The forecast's own lead time (f1, −24 h) is `verified: false`, so the AI lane shows the routed warning only in a "before" zone to the left of the ruler, with no number. The red lane is drawn unchanged, and the snap does not claim the collapse is prevented ("Operators still decide."). The crews and the steel stay where history put them: hours, and years ("Steel still takes years."). The counterfactual is small and is not inflated. The snap works through staging instead: a freeze, a hit, true scale, then three lanes.

**True-scale beat.** On a linear bar spanning the ~7 years to the lasting fix, the 90-second fall is 90 / 2.3e8 of the bar. At 900 px that is about 0.0004 px, so it is drawn as a 2 px hairline labeled "the fall (too thin to see)".

## Numbers on screen (two, both sourced)
1. "90 seconds": s2 and s5 (s1: "less than a minute").
2. "7 years": 1989 to 1996, series compensation completed (s4).

"9 hours" (sourced) appears only as the "hour" tick, where the lights come back. The ~1 h AI routing is never shown as a number.

## Shot list
| t | slate | camera | beat |
|---|---|---|---|
| 0–3.0 | SC1 CLOSE (locked-off) | hold on the eyes, z 3.2 | X-ray face. A green warning lamp on the console lights the eyes. A red pulse at the top-left frame edge, with red wires already lit there (a cold open of the arriving cascade). "The warning was already here." |
| 3.0–6.3 | SC1 PULL OUT | z 3.2 → 1 (eased), and the split opens | The head sits in the top half; the grid rises into the bottom half with the same wiring. "One head. One grid. Same wiring." |
| 6.3–19.3 | SC1 WIDE SPLIT (locked-off) | hold | The log clock runs along the split line. The red cascade (t 6.5–9.4): "Both fall in 90 seconds." "The signal never reaches the hand." Lights back at about 13.3. The green links close from 13.3 to 19.0: "The lasting fix took 7 years." |
| 19.3–22.3 | SC1 PUSH IN | z 1 → 4.6 on the eyes (closer than the opening) | Freeze; the ring is closed in the cranium. |
| 22.3–24.8 | SC1 EXTREME CLOSE | hold | "We slowed it down / so you could see it." |
| 24.8–27.4 | SC2 SNAP: TRUE SCALE | flat | Freeze-flash plus a hit. A 7-year linear bar; the fall is a hairline. |
| 27.4–31.6 | SC2 SNAP: THREE LANES | flat | Red (true) / human routing / AI-routed (illustrative) on a shared log ruler. The AI warning lands before the red. "Operators still decide." "Steel still takes years." |
| 31.6–33.6 | SC3 | flat | "This is the bottleneck." |
| 33.6–37.6 | END | | L.endCard, 4 s |

**Zoom cycle:** OUT 3.0–6.3 (the single pull-out), IN 19.3–22.3, ending closer (z 4.6) than the start (z 3.2).

## 3D translation note
- **SC1 close:** a locked-off 85 mm at eye level, across the console. The engineer's face is rendered as a medical x-ray: translucent skin, bone as soft white emissive, eyeballs catching a single green lamp. A red glow bleeds in from the top-left of frame like weather outside the room. No camera movement until the pull.
- **Pull-out:** one smooth dolly back plus a lens change to about 35 mm. As the head settles into the top half, a hard horizontal split slides open and the province's grid rises from below. In 3D the two networks should be literally the same mesh: the neural graph inside the skull and the transmission graph on the terrain share vertex IDs, so the cascade can ripple through both in lockstep.
- **Wide split:** locked-off. The split line is a glowing ruler; the playhead sweeps and accelerates (log time). Red travels as emissive current along axons and along power lines; dark nodes go matte.
- **Push in:** a slow push to an extreme close on the eyes (about 135 mm), with the closed green ring glowing through the skull behind them. It should feel like vertigo: a dolly-zoom (dolly in, zoom out) on the push.
- **Richer in 3D:** volumetric scattering inside the skull, and real terrain under the grid. Synapse sparks for the failed attempts: pulses that fizzle mid-axon.

## Copy variants
- "The warning was already here."
- "One head. One grid. Same wiring."
- "Both fall in 90 seconds."
- "The signal never reaches the hand."
- "The lasting fix took 7 years."
- "We slowed it down / so you could see it."
- "At true scale, the fall is invisible." / "Operators still decide." / "Steel still takes years."
- "This is the bottleneck."
- Alternates (unused): "Civilization has lag. So does a skull." / "Seen. Not routed." / "The ping never reached the hand."

## Tags
{"slug":"the-mind-grid","structure":"split-screen-race","medium":"x-ray","family":"body/biology","scale":"mind","pace":"sprint","emotion":"vertigo","protagonist":"one person","camera":"locked-off close-up with a single pull-out","analog":"quebec-1989"}

Diversity check: OK (nearest the-last-thirteen-days, ninety-seconds, the-mold-strikes-back; distance 0.78). No changes needed.

## Build notes
- Preview 1: the hook card faded in from alpha 0, so frame 1 had no text. It now starts fully visible. The head's red storm glow sat outside the close-up frame, and the grid's glow was bleeding into the top half. The head glow now sits at the top-left of the close frame, and the grid glow is drawn under the top panel. Checked t=0 and t=8.8 as stills.
- Known roughness: the ruler tick labels "hour" and "day" sit on the province outline and the lamp glow, and the x-ray hand bones overlap the ruler at the console edge. Network: 41 nodes and 55 edges (an MST plus near neighbours), the same graph in both halves.
- Final render: 37.6 s (ffprobe 37.600000).

## Scores
- Hook: 7 (a big red wash and green eyes-and-lamp on a skull face in frame 1, with a clear line; the face reads more cartoon than grave)
- Speed accuracy: 8 (logistic fit through the sourced 90 s endpoints, 83% at 9 h, lognormal links between the sourced p10 and p90, one stated log mapping; the fit and the 24 h tail are assumptions and are noted)
- Snap impact: 6 (freeze, true-scale hairline, then three lanes; the AI effect is honestly small, so the snap is quiet)
- Emotion: 6 (the vertigo of the head falling in lockstep with a province lands; the eyes help)
- Originality: 8 (the same graph as neurons and as substations is a fresh image for this analog)
- Craft: 6 (clean read; some label collisions near the split line; the wide shot is busy)
- Honesty: 9 (no neural timings claimed, median never shown, two sourced numbers, AI shown only as the warning arriving "before", with "Operators still decide")
Overall: 7.1
Virality: 7% — the neuroscience split is a strong, shareable image for a niche that loves brain-as-network visuals, but the log-time ruler and a quiet snap ask a lot of a cold scroller.
