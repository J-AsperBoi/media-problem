Tier: animatic

# Ninety Seconds

**Logline.** One long take on a snowy street under a gray aurora. A woman at a window holds a green page. The screen says "Wait for it." The camera cranes up until the street is a dot on a topographic map of a province. A red pulse runs along the contour lines and the province goes dark in ninety seconds. Then a log-time clock starts to run: the lights come back within hours, and five green fragments close into one ring over years. At the end the camera drops back down, closer than before.

- **Structure:** `wait-for-it` (research/VIRAL_STRUCTURES.md #4)
- **Analog:** `quebec-1989` (research/analogs/quebec-1989.json). The file is marked `verified: false` at the top level, so on screen I use only the two individually sourced endpoints listed below.
- **Medium / family / scale / pace / camera / emotion / protagonist:** topographic map / cosmos / nation / one long take / crane up and drop down / vertigo / a crowd

## Time mapping (one mapping, stated on screen as "log time")
Race (film t = 3.0 s to about 20.3 s): event time E, in seconds after 02:44, equals 10^((t - 3) / 2). **Every 2 film seconds, 10 times more real time passes.** The ruler at the bottom of the screen is labeled "log time" and uses only word ticks: second, minute, hour, day, month, year, decade. The clock freezes at t = 20.3.

Before t = 3 the scene is pre-event (calm; the hook).

## Speed math
**Threat (red).** `threat.points` from the analog: extent 0 at t0 and 1.0 at 0.025 h (90 s). I interpolate linearly in event time: collapse(E) = clamp(E / 90 s). On the log clock that is film t = 3.0 to 6.91 s, and most of the darkening happens in the last second (E between 10 s and 90 s). Each contour segment and town light has a normalized distance d from the origin point in the north. It turns red or dark when d < collapse(E).

**Restoration.** `threat.events` from the analog: "more than 9 h to restore 83%" (s3, sourced). restored(E) = 0.83 × (E − 90) / (32400 − 90) from 90 s to 9 h. After that, the remaining 17% is assumed restored linearly by 24 h. **That last part is my assumption and is not in the data.** It only affects the small red remnant, and no number is shown for it. A region is dark while d < collapse and d < 1 − restored, so the red recedes from south to north. On the log clock the lights come back at t ≈ 12.0 s.

**Human aggregation (green).** There are 5 fragments, from the analog's `solution.fragments`: forecasters (f1), scientists (f2), engineers (f3), line crews (f4) and planners (f5, the lasting fix). They sit at points around the province and are all lit from frame 1, because they already existed. They connect as a loop of 5 edges. Edge arrival times are `L.lognormalQuantile(q, 759 h, 64000 h)` at q = 0.1, 0.3, 0.5, 0.7, 0.9:

| edge | q | arrival | film t |
|---|---|---|---|
| engineers–line crews | 0.1 | 9.0 h (= p10, sourced: 83% restored) | 12.02 |
| line crews–scientists | 0.3 | 124 h (modelled) | 14.30 |
| scientists–forecasters | 0.5 | 759 h (modelled median, NOT shown) | 15.87 |
| forecasters–planners | 0.7 | 4659 h (modelled) | 17.45 |
| planners–engineers | 0.9 | 64000 h (= p90, sourced: series compensation done 1996, ~7 yr) | 19.72 |

The analog notes that its median (759 h) is the geometric mean of p10 and p90, a modelling assumption. It therefore appears only as the spacing of the middle arrivals. No number for it is ever on screen. The ring closes when the last edge lands (the lasting fix, ~7 years).

**AI counterfactual (illustrative).** From `ai_counterfactual`: about 1 h to route an existing forecast plus the known vulnerability into one control room's operating posture. That is a short synthesis task, well inside METR's ~17.4 h 50% time horizon (RATES.md). The warning fragment's own time (f1 ready at −24 h) is `verified: false`, so the snap shows the routed warning only as "before" the red, with no number. The snap does not claim the collapse would have been prevented: the red is drawn unchanged, with the caption "Operators still decide." The physical fix still sits at "years" ("Steel still takes years."). The AI counterfactual here is small, so I did not inflate it. The snap works through staging instead: a freeze, silence, a hit, then the two log rulers side by side.

**True-speed panel.** On a linear bar spanning the ~7 years to the lasting fix, the 90-second red is 90 / (7.3 × 365 × 86400) of the bar. At 760 px wide that is about 0.0003 px, so it is drawn as a 2 px hairline and labeled "the dark: too thin to see".

## Numbers on screen (two, both sourced)
1. "90 seconds": s2 (Wikipedia) and s5 (Scientific American); s1 says "less than a minute". Used as "in 90 seconds".
2. "7 years": 1989 to 1996, when series compensation was completed (s4). The month is unsourced, but the span is about 7 years whatever the month.

"9 hours" (sourced) is shown only as a position on the log ruler (the "hour" tick) and as the lights coming back. It never appears as a digit, to keep to two numbers.

## Shot list (one long take plus a snap insert)
| t | slate | camera | beat |
|---|---|---|---|
| 0–1.6 | SC1 CLOSE | hold, slow push | Woman at window, green page, gray aurora, red glint on far pylon. "Wait for it." |
| 1.6–5.6 | SC1 CRANE UP | lev 0→1 (map zoom 40× → 1×, exponential) | Street shrinks into a town dot on the topo map. "Watch the green." |
| 5.6–12.5 | SC1 WIDE HOLD | hold | The log clock runs: red floods the contours (t 5–6.9) and the lights go out. "A province went dark / in 90 seconds." Lights back at ~12. |
| 12.5–21.5 | SC1 CRANE HIGHER | lev 1→1.35 (vertigo: planet limb, aurora oval) | Days to years; green edges close; "The lasting fix took / 7 years." |
| 21.5–24.6 | SC1 HOLD | | "We slowed it down / so you could see it." |
| 24.6–31.4 | SC2 SNAP | flat | Freeze + hit. True proportions bar, then side-by-side log rulers: as it happened vs AI-routed warning (illustrative). |
| 31.4–33.6 | SC3 DROP DOWN | lev 1 → −0.45 (closer than the opening) | Fall from the map back to the window. |
| 33.6–36 | SC3 EXTREME CLOSE | slow push | Face and hands; the green page now carries the closed ring. "This is the bottleneck." |
| 36–40 | END | | L.endCard, 4 s |

**Zoom cycles:** OUT 1.6–5.6 (and further out 12.5–21.5), IN 31.4–33.6, ending closer (−0.45) than the start (0).

## 3D translation note
- **SC1 close:** 50 mm at eye level, across a snowy street, looking at a lit third-floor window. Slow snowfall, a volumetric gray aurora with real parallax behind the power lines. A figure with a readable face holds a single green-lit page.
- **Crane up:** one continuous rise with no cut. It starts as a real crane (2 m/s), becomes a drone climb, then an orbital pull-back. The lens stays wide (24 mm) so the street curves into the map. The terrain becomes a relief model whose contour lines are real elevation bands. The red pulse travels as emissive light along the transmission lines laid on the contours.
- **Higher (vertigo):** the pull continues to the planet's limb. The aurora oval is a gray volumetric ring. Time-lapse cues (snow melting and returning, seasons) are the 3D way to sell the log clock.
- **Drop down:** a fast, eased fall (about 2 s) back through the aurora to an extreme close-up of the face. The page in her hands now shows the closed green ring. In 3D the fall should feel like a gentle zero-g dive, not a crash.
- **Richer in 3D:** real relief shading, emissive red on the grid lines, windows as a crowd of lit rooms that go dark as a wave.

## Copy variants
- "Wait for it." / "Watch the green."
- "A province went dark / in 90 seconds."
- "The fix already existed. / In pieces."
- "The lasting fix took / 7 years."
- "We slowed it down / so you could see it."
- "Same pieces, routed first." / "Operators still decide." / "Steel still takes years."
- "This is the bottleneck."
- Alternates (unused): "Ninety seconds of lag. Seven years of patch." / "The ping was already sent."

## Tags
{"slug":"ninety-seconds","structure":"wait-for-it","medium":"topographic map","family":"cosmos","scale":"nation","pace":"one long take","emotion":"vertigo","protagonist":"a crowd","camera":"crane up and drop down","analog":"quebec-1989"}

Diversity check: OK (nearest two-days and the-last-thirteen-days, distance 1.00). No changes needed.
