Tier: animatic

# The Storm Doc

**Logline.** A hushed nature documentary, rendered entirely in particles. The protagonist is the red itself, observed like a rare animal. We start at eye level in a kitchen at night: a person by the fridge, a green warning glowing on their phone, and the red massing just outside the window. The camera zooms out continuously through the scales (house, town, province, planet, a gray disc far away), and at every scale the red sits at the edge of the frame, about to arrive. Then the camera falls back in with it. It takes the province in 90 seconds, then one kitchen, where the fridge stops humming. The green pieces take hours, then years, to find each other.

- **Structure:** `nature-documentary` (research/VIRAL_STRUCTURES.md #14)
- **Analog:** `quebec-1989` (research/analogs/quebec-1989.json). The file is `verified: false` at the top level, so only individually sourced endpoints go on screen.
- **Medium / family / scale / pace / camera / emotion / protagonist:** particle/data / cosmos / multi-scale zoom / slow build / continuous zoom through scales / awe / the red itself
- Siblings on the same analog: `ninety-seconds` (topographic crane), `the-mind-grid` (x-ray split), `the-ballroom` (paper-cutout dance). I reuse their red fit and green lognormal so all four films agree.
- On screen the threat is only "the red" / "it". The distant source appears only as an unlabeled, desaturated gray disc.

## Time mapping (one mapping, drawn on screen as a "log time" ruler)
- Film t 0 to 14.0 s: **before the event, no clock.** The red's approach from the gray disc is staged, not timed. The analog's travel time (flare at about −80 h) is `verified: false`, so no speed or duration is claimed and the ruler is not on screen. The zoom only shows *where* the red is, never *how fast* it travels.
- Film t 14.0 to 27.6 s: E (seconds after 02:44) = 10^((t − 14) / 1.6). **Every 1.6 film seconds, ten times more real time passes.** Ruler ticks are words only: second, minute, hour, day, month, year.
- The clock freezes at t = 27.6 (E ≈ 3.2e8 s ≈ 10 years).
- After the snap (t ≥ 37) the kitchen is the present: an ordinary lit night.

## Speed math
**Threat (red).** `threat.points` source only the endpoints: 0 at 02:44, and the whole grid down about 90 s later (s2, s5; s1 says "less than a minute"). Following the director's note I don't draw a straight line between them. I fit a logistic through the endpoints, the same fit as the-mind-grid: share(E) = L.logistic(E, 6.78 s, 0.01), with s0 = 1% and 99% at E = 90 s. That gives e^(r·90) = 9801, r = 0.1022/s, and a doubling time of 6.78 s. **This fit is my assumption.** The province's particle lights are ranked by distance from the northern origin (on the transmission corridor), and ranks are scaled to 0 to 0.985 so every light has fallen by 90 s. A light falls when rank < share(E). It flashes red for 0.9 film s, then stays dim red while dark. On the clock, 90 s lands at t = 17.13 s, and most of the fall happens in the last 0.7 s.

**Our kitchen.** The kitchen, its house and its town sit in the south of the province. Their fall rank is the origin's distance rank (≈ 0.9, so the fridge goes quiet at E ≈ 66 s, t ≈ 16.9). The film shows this as silence when the camera arrives at t = 19.6.

**Restoration.** `threat.events` (s3): "more than 9 h to restore 83%". restored(E) = 0.83 × (E − 90) / (32400 − 90) from 90 s to 9 h, then the remaining 17% linearly by 24 h. **The tail is my assumption,** as in the siblings, and no number is shown for it. Which light comes back when is not sourced, so each light gets a seeded random restore rank. The kitchen's restore rank is set to 0.80 ("most lights back"): it comes back when restored(E) = 0.80, i.e. E ≈ 8.7 h, t = 21.19. That is when the fridge hums again.

**Human aggregation (green).** There are 5 fragments from `solution.fragments`: forecasters (f1), scientists (f2), engineers (f3), line crews (f4) and planners (f5, the lasting fix). They are lit on the province map from the start, because they already existed. They connect as a ring of 5 links, with arrival times `L.lognormalQuantile(q, 759 h, 64000 h)` at q = 0.1, 0.3, 0.5, 0.7, 0.9. These are the same values as the siblings:

| link | q | arrival | film t |
|---|---|---|---|
| engineers–line crews | 0.1 | 9.0 h (= p10, sourced: 83% restored) | 21.22 |
| line crews–scientists | 0.3 | 124 h (modelled) | 23.04 |
| scientists–forecasters | 0.5 | 759 h (modelled median, NEVER shown) | 24.30 |
| forecasters–planners | 0.7 | 4659 h (modelled) | 25.55 |
| planners–engineers | 0.9 | 64000 h (= p90, sourced: series compensation 1996, ~7 yr) | 27.38 |

The analog says its 759 h median is the geometric mean of p10 and p90, a modelling assumption. It only sets the spacing of the middle arrivals and never appears on screen. The phone's green warning in the kitchen is fragment f1 (forecasters). Its lead time (−24 h) is `verified: false`, so it is shown only as "already here", with no number. The 2026-style phone is a staging choice, not a claim about 1989.

**AI counterfactual (illustrative).** From `ai_counterfactual`: about 1 h to route the existing forecast, together with the known vulnerability of long lines, into one control room's operating posture. That is a short expert synthesis task, inside METR's ~17.4 h 50% task horizon (RATES.md). Because the forecast's lead time is unverified, the snap places the routed warning only in a "before" zone to the left of the ruler, with no number. The red is drawn unchanged ("Operators still decide."). The crews (hours) and the steel (years) stay where history put them ("Steel still takes years."). The concept's "9 h vs 1 h" snap line is **not** used on screen. The 1 h is warning-routing and the 9 h is physical restoration, so putting them side by side would compare two different things. The counterfactual is small, so I don't inflate it. The snap works through staging instead: a freeze, black, one hit, the true proportions, then two rulers.

**True proportions.** On a linear bar spanning the ~7 years to the lasting fix, 90 s is 90 / 2.3e8 of the bar, about 0.0004 px at 900 px. It is drawn as a 2 px hairline labeled "the dark: too thin to see".

**Zoom scales.** Frame width = 10^lev metres. The kitchen is ~2.5 m wide (lev 0.4), the house ~30 m, the town ~1 km, the province ~1,800 km (lev 6.25), the planet ~25,000 km (lev 7.4), and the gray disc plus the planet ~2.2e11 m (lev 11.35). Positions are to scale (the disc sits 1.5e11 m from the planet). At the last scale both bodies would be sub-pixel, so their **sizes are enlarged**, and the frame says so ("sizes enlarged").

## Numbers on screen (two, both sourced)
1. "90 seconds": s2 and s5 (s1: "less than a minute").
2. "7 years": 1989 to 1996, when series compensation was completed (s4).

"9 hours / 83%" appears only as a position (the "hour" tick, the fridge humming again), never as digits. The modelled median never appears.

## Shot list, DUR 44.0 s
| t | slate | camera (lev = log10 frame width in m) | beat |
|---|---|---|---|
| 0–3.0 | SC1 CLOSE EYE LEVEL | lev 0.48 → 0.40 slow push | Kitchen at night in particles. The fridge hums (rings of dots). A person holds a phone glowing green. The red swarms outside the window, big and bright. Lower third: "Observe the red." (frame 1 = thumbnail) |
| 3.0–10.0 | SC1 CONTINUOUS ZOOM OUT | 0.40 → 11.35 | Kitchen → house cutaway → town lights → province → planet with field lines → gray disc. At each scale the red is at the edge. "It gathers where no one looks." / "It crosses the dark in silence." / "It was born far away." |
| 10.0–10.9 | SC1 HOLD | 11.35 → 11.4 | The red cloud between the disc and the planet. |
| 10.9–13.8 | SC1 ZOOM IN | 11.4 → 6.25 | Following the red back down: the planet, then the province. "It hunts the long wires." |
| 13.8–17.4 | SC1 WIDE HOLD | 6.25 → 6.30 | The clock starts at 14.0. The logistic cascade runs from the north and every light goes red, then dark. "It takes a province / in 90 seconds." |
| 17.4–19.6 | SC1 ZOOM IN | 6.30 → 0.15 (closer than the opening 0.40) | Down to the kitchen. "Then, one kitchen." |
| 19.6–22.4 | SC1 CLOSE | 0.15 hold | Dark and silent; only the phone is green. "The fridge stops humming." The hum returns at 21.19 (~9 h). "The warning was already here." |
| 22.4–24.8 | SC1 PULL OUT | 0.15 → 6.30 | Back to the province while days pass; green links arrive. "The other pieces took longer." |
| 24.8–27.8 | SC1 WIDE | 6.30 → 6.45 | Months to years; the ring closes at 27.38. "The lasting fix took / 7 years." |
| 27.8–30.8 | SC1 HOLD | | "We slowed it down / so you could see it." |
| 30.8–37.0 | SC2 SNAP | flat | Freeze, black, hit. The true-proportions hairline, then two log rulers: as it happened / AI-routed warning (illustrative). "Operators still decide." "Steel still takes years." |
| 37.0–39.0 | SC3 DROP DOWN | 6.30 → −0.10 | A fall from the province into the kitchen, closer than ever. |
| 39.0–40.4 | SC3 EXTREME CLOSE | −0.10 → −0.15 | Face, phone and fridge. The fridge hums. "This is the bottleneck." |
| 40.0–44.0 | END | | L.endCard, 4 s |

**Zoom cycles:** OUT 3.0–10.0 (to the sun scale), IN 10.9–19.6 (ending at 0.15, closer than the opening 0.40); OUT 22.4–24.8 (province), IN 37.0–40.4 (ending at −0.15, the closest).

## 3D translation note
- **Opening:** a 50 mm lens at eye level in a dark kitchen. Everything is a point cloud: fridge edges, counter and floorboards as dense dots, the air as sparse dust. The only light is the fridge's small LED and the phone's green screen on a face. Outside the window a red particle swarm moves slowly, like a murmuration.
- **Zoom out:** one unbroken move with no cuts. It is a dolly back through the kitchen wall (dollhouse cutaway), then a drone rise over snowy roofs, then an orbital pull. The lens widens from 50 mm to 14 mm, and the speed is exponential (constant decades per second). Point density is preserved at every scale: houses become lights, towns become clusters, the province becomes a galaxy of dots. The field lines are volumetric dotted shells. The source is a matte gray sphere with no color.
- **Zoom in with the red:** the camera rides just behind the red front, like a wildlife camera tracking a predator. At the province it stops and lets the red run along the transmission corridors as emissive particles.
- **Drop into the kitchen:** a fast, eased dive through the roof into a quiet, dark room. The loss is silence: the hum rings stop, the LED goes out, and the dust stops glowing.
- **Richer in 3D:** real depth of field on the particles, a hum drawn as visible pressure waves, snow in the town shot, parallax in the town-light fields.

## Copy variants
- "Observe the red."
- "It gathers where no one looks." / "It crosses the dark in silence." / "It was born far away." / "It hunts the long wires."
- "It takes a province / in 90 seconds." / "Then, one kitchen." / "The fridge stops humming."
- "The warning was already here." / "The other pieces took longer." / "The lasting fix took / 7 years."
- "We slowed it down / so you could see it." / "Same pieces, routed first." / "Operators still decide." / "Steel still takes years."
- "This is the bottleneck."
- Alternates (unused): "It has no natural predators. Yet." / "Here, a rare specimen holds one piece." / "The herd never heard the warning."

## Tags
{"slug":"the-storm-doc","structure":"nature-documentary","medium":"particle/data","family":"cosmos","scale":"multi-scale zoom","pace":"slow build","emotion":"awe","protagonist":"the red itself","camera":"continuous zoom through scales","analog":"quebec-1989"}

Diversity check: OK (nearest two-days and seventeen-days, 0.56; the-mold-strikes-back, 0.67). No changes needed.
