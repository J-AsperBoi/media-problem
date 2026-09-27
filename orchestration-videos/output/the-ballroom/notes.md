Tier: animatic

# The Ballroom

**Logline.** A grid is a ballroom: hundreds of cut-paper couples turning in perfect sync, every step on the same beat. One missed step at the edge, and the whole floor falls out of time in 90 seconds. Green: a few dancers who know the recovery step, scattered across the room, never close enough to lead. The film is a circle: its last frame is its first, the same couple and the same missed step, so auto-replay starts the night again.

- **Structure:** `seamless-loop` (research/VIRAL_STRUCTURES.md #15)
- **Analog:** `quebec-1989` (research/analogs/quebec-1989.json). The file is `verified: false` at the top level; only the individually sourced endpoints go on screen.
- **Medium / family / scale / pace / camera / emotion / protagonist:** paper cutout / dance / nation / stop-start / crane up and drop down / tenderness / a crowd
- Siblings on the same analog: `ninety-seconds` (topographic crane), `the-mind-grid` (x-ray split). This one is the dance metaphor: grid synchronization as a ballroom in perfect time (the irony of perfect synchronization).

## Time mapping (one mapping, drawn on screen as a "log time" ruler)
- Film t 0 to 3.0 s: the first missed step, E = 0 (02:44, protection starts tripping). The first instant is held for 3 film seconds (the hook). The red at the edge in frame 1 is the logistic's starting 1%, not a flash-forward.
- Film t 3.0 to 17.5 s: E (seconds after 02:44) = 10^((t - 3) / 1.7). **Every 1.7 film seconds, ten times more real time passes.** Ruler ticks are words only: second, minute, hour, day, month, year, decade.
- The clock freezes at t = 17.5 (E ≈ 3.4e8 s ≈ 11 years).
- The dance's turning (one turn per 1.85 film s) is the shared beat, i.e. the grid's common frequency. It is a symbol, not a speed claim, and it is not on the event clock.

## Speed math
**Threat (red).** `threat.points` source only the endpoints: 0 at 02:44, the whole grid down ~90 s later (s2, s5; s1 "less than a minute"). Following the director's note I do not draw a straight line between them. I fit a logistic through the endpoints (same fit as the-mind-grid): share(E) = L.logistic(E, 5.53 s, 1/808), i.e. one couple of the floor's 808 (the one missed step) at t0 and 99% at 90 s (doubling 5.53 s). **This fit is my assumption** (s0 = one dancer rather than the mind-grid's 1%, so frame 1 shows exactly one couple out of time). Each couple has a rank = its distance from the edge couple that missed the step (normalized order). A couple falls out of time when rank < share(E). On the film clock: 90 s lands at t = 6.32; most of the floor falls between t ≈ 5.6 and 6.3. Most of the floor falls in the last second.

Falling out of time is drawn as: a bright red stumble for 0.4 film s, then the couple stands still, dim red, frozen at the phase where it fell. The ballroom's light dims with the share out of time. Loss = absence of motion and light only.

**Restoration.** `threat.events` (s3): "more than 9 h to restore 83%". restored(E) = 0.83 × (E − 90)/(32400 − 90) from 90 s to 9 h; the remaining 17% linearly by 24 h. **That tail is my assumption** (as in the siblings), no number shown. Couples come back in reverse rank order (the far side first; the edge last). On the clock: 9 h at t = 10.67, 24 h at t = 11.39. A couple back in time rejoins the global phase (back in sync).

**Human aggregation (green).** 5 fragments from `solution.fragments`, each drawn as one dancer holding a green ribbon (the ones who know the recovery step): the warning / forecasters (f1, the protagonist couple at the south edge), the science (f2), the control room (f3), the crews (f4), the planners (f5, the lasting fix). All lit from frame 1 because they already existed. They connect as a ring of 5 ribbons; arrival times `L.lognormalQuantile(q, 759 h, 64000 h)`:

| ribbon | q | arrival | film t |
|---|---|---|---|
| control room–crews | 0.1 | 9.0 h (= p10, sourced) | 10.67 |
| crews–warning | 0.3 | 124 h (modelled) | 12.60 |
| warning–science | 0.5 | 759 h (modelled median, NEVER shown) | 13.94 |
| science–planners | 0.7 | 4659 h (modelled) | 15.28 |
| planners–control room | 0.9 | 64000 h (= p90, sourced: series compensation 1996, ~7 yr) | 17.22 |

The analog says its 759 h median is the geometric mean of p10 and p90 (a modelling assumption); it only sets the spacing of the middle arrivals and never appears on screen. Before each arrival a ribbon reaches out partway and falls back: visual rhythm, not data. It grows to full over the last 0.8 film s before its arrival.

**AI counterfactual (illustrative).** From `ai_counterfactual`: ~1 h to route the existing forecast, together with the known vulnerability of long lines, into one control room's operating posture: a short expert synthesis task inside METR's ~17.4 h 50% horizon (RATES.md). The forecast's own lead time (f1, −24 h) is `verified: false`, so the snap puts the routed warning only in a "before" zone left of the ruler, with no number. 1 h + (well under 24 h) still lands before t0 if the forecast existed a day ahead; that is why it is drawn as "before", and why it is labeled illustrative. The red block is drawn unchanged; the caption says "People still decide." The crews (hours) and the steel (years) stay where history put them. The counterfactual is small and is not inflated: the snap lands through staging (freeze, black, one hit, true proportions, then two rulers).

**True-proportions beat.** On a linear bar of the ~7 years to the lasting fix, the 90-second fall is 90 / 2.3e8 of the bar: ~0.0004 px at 900 px. Drawn as a 2 px hairline labeled "the fall: too thin to see". The 9 h recovery is also a hairline (0.13 px).

## Numbers on screen (two, both sourced)
1. "90 seconds": s2 and s5 (s1: "less than a minute").
2. "7 years": 1989 to 1996, series compensation completed (s4).
"9 hours / 83%" is shown only as a position (the "hour" tick, "most lights back") and as the floor re-lighting, never as digits.

## Shot list (one long take + snap insert + loop tail), DUR 37.0 s
| t | slate | camera | beat |
|---|---|---|---|
| 0–2.6 | SC1 CLOSE | eye level, slow push | A couple turns; she holds a green ribbon. At the left edge a red dancer misses the step, a red ripple on the floor. "One missed step." (frame 1 = thumbnail = loop point) |
| 2.6–6.2 | SC1 CRANE UP | zoom 22 → 0.85 (log-eased), tilt eye-level → top-down | The couple shrinks into a floor of ~800 couples shaped like a province. "Everyone on the same beat." The red wave runs out from the edge; the floor falls out of time. |
| 6.2–11.2 | SC1 WIDE | hold | "Out of time / in 90 seconds." Ruler runs. Green ribbons reach and fall back. "Some knew / the recovery step." Lights come back from the far side (t 9–11.4). |
| 11.2–17.6 | SC1 CRANE HIGHER | zoom 0.85 → 0.74 | Days to years; ribbons arrive one by one. "Never close enough / to lead." "The lasting fix took / 7 years." |
| 17.6–19.8 | SC1 HOLD | | "We slowed it down / so you could see it." |
| 19.8–26.5 | SC2 SNAP | flat | Freeze, black, hit. True proportions bar; then two log rulers: as it happened / warning routed first (illustrative). |
| 26.5–29.6 | SC3 DROP DOWN | zoom 0.74 → 30 (closer than the opening 22) | Fall back into the floor, to the couple. She ties the green ribbon round his wrist. "This is the bottleneck." |
| 30.4–34.4 | END | | L.endCard ("Help close the gap."), 4.0 s at full |
| 34.4–37.0 | SC1 CLOSE (loop tail) | | Card dissolves to frame 1: same couple, same phase, same missed step, "One missed step." At t = 37 = t 0. |

**Zoom cycles:** OUT 2.6–6.2 (and higher 11.2–17.6), IN 26.5–29.6 ending closer (30) than the start (22); the loop tail returns to the opening close.

**Loop.** The dance phase is 2π·t/1.85 and 37.0/1.85 = 20 turns, so the phase at t = 37 equals the phase at t = 0. The tail draws the close shot with the same function and state as t = 0 (E = 0).

## 3D translation note
- **Close:** 50 mm at eye level on a polished parquet, paper-cutout couples as thick card stock with visible edges, soft top light from paper chandeliers. The red dancer at the left edge of frame is out of focus, his ripple a thin red ring on the floor.
- **Crane up:** one continuous rise from eye level to straight down (tilt 0 → 90°), 24 mm, slow at first then accelerating; the chandeliers pass the lens. The floor's outline is a province; each couple is a small paper disc turning in unison, the whole floor a moiré of synchronized motion. The red wave is emissive and travels outward from the edge in ~1 s of screen time.
- **Higher:** the rise continues slowly (vertigo), the ballroom becomes a lit territory in darkness; green ribbons as real cloth strips pulled across the floor by unseen hands, falling short.
- **Drop down:** a gentle 3 s fall back through the chandeliers, ending at a tighter 85 mm on the two faces and the ribbon being tied. Should feel like settling, not crashing.
- **Richer in 3D:** real parallax of the crowd, paper grain and edge shadows, light going out table by table as absence, the synchronized turning as a mesmerising pattern.

## Copy variants
- "One missed step." / "Everyone on the same beat."
- "Out of time / in 90 seconds."
- "Some knew / the recovery step." / "Never close enough / to lead."
- "The lasting fix took / 7 years."
- "We slowed it down / so you could see it."
- "Warning routed first" / "People still decide." / "Steel still takes years."
- "This is the bottleneck." / End: "Help close the gap."
- Alternates (unused): "Perfect sync. Zero slack." / "The whole room had the same lag." / "The step existed. The lead didn't."

## Tags
{"slug":"the-ballroom","structure":"seamless-loop","medium":"paper cutout","family":"dance","scale":"nation","pace":"stop-start","emotion":"tenderness","protagonist":"a crowd","camera":"crane up and drop down","analog":"quebec-1989"}

Diversity check: first run with pace "one long take" was TOO SIMILAR (ninety-seconds, 0.44). Changed pace to **stop-start** (the dance literally stops and restarts; the snap is a dead stop). Re-run: OK (nearest ninety-seconds 0.56).

## Build notes
- Preview 1: protagonist couple was inside the initial 1% and read as red; fixed by starting the logistic at one couple (s0 = 1/N) and moving the missed step to the couple one row behind-left. Close shot enlarged (z 22), return close z 30.
- Snap panel B fade used L.label's own alpha (ignores ctx.globalAlpha), so it showed early; fixed with overlay fades.
- tools/verify.js: PASS (dur 37.00, stray 0%, QR found). Loop: frame at t = 36.967 matches t = 0 (same camera, phase, red couple, card).
- Known weak spots: in the opening the couple turns, so their faces are hidden for part of each turn (the render's poster at t = 0.6 shows backs of heads; frame 1 at t = 0 shows faces). The crane-up middle frames (billboard figures seen from above) are busy. The wide floor dots are small on a phone.

## Scores
- Hook: 7 (big red stumbling couple + green ribbon + "One missed step." in frame 1; crowd busy)
- Speed accuracy: 8 (logistic fit through sourced endpoints, sourced 9 h restore, lognormal ribbons; one stated log clock; median never shown)
- Snap impact: 6 (honest, small counterfactual; staging carries it)
- Emotion: 6 (tender tie-the-ribbon close; faces small in the crowd)
- Originality: 8 (grid sync as a ballroom, a real loop back into the missed step)
- Craft: 6
- Honesty: 9
Overall: 7.1
Virality: 8% — the synchronized-crowd image and the loop are shareable, but the snap is abstract and paper-cutout crowds read small on a phone, so a small account likely stalls well under 100k.
