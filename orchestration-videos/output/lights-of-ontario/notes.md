Tier: animatic

# Lights of Ontario

**Logline.** A subway map at night: every station a lit window. On one platform a person holds a green phone; the wall map behind her has one red station nobody is looking at. One long take pulls out through the station to the whole network (a nation of lit stations), where four green stations try to draw a line to each other and never do. Then the camera falls into a different platform as the map goes dark station by station. The snap replays the afternoon beside a routed version (illustrative). The end card fades into the re-lit map and the first platform, so the replay is continuous.

- **Structure:** `seamless-loop` (research/VIRAL_STRUCTURES.md #15)
- **Analog:** `blackout-2003` (research/analogs/blackout-2003.json; top-level `verified: false`, several threat points individually `verified: false`)
- **Tags:** medium subway map / family city / scale nation / pace one long take / camera continuous zoom through scales / emotion vertigo / protagonist a crowd
- **Diversity check:** OK: distinct enough (nearest ninety-seconds 0.56, before-the-dark 0.67).

## Kept off screen
- "7 minutes" (1% to 100%): derived from the 16:05:57 and 16:10-16:13 points, both `verified: false`. Not shown. No clock times on screen.
- The cascade *motion* still follows the analog's points (the best available shape); only on-screen numbers must be verified.
- "~50 million" is sourced but left off to stay at two numbers.

## Time mapping (one mapping)
**1 film second = 10 minutes.** Event hours after 14:14 (analog t0): h = 0.1 + t / 6 for the race, t in [0, 11.4] s → h in [0.1, 2.0].
Frame 1 is h = 0.1 (14:20, when FE IT staff, fragment f1, already knows the alarm servers are failing), so the first frame already has green in it. The seed station is red from h = 0: the analog's t0 event is the alarm system failing silently.
The snap panels are a proportional timeline of the same 2 hours (both panels swept at the same speed, 2 s per hour); no axis numbers.
The end tail re-lights the map: that is the loop reset back to frame 1 (h = 0.1), not a claim about restoration speed (real restoration took ~7 h to ~4 days, analog `deploy`).

## Speed math
**Threat (red).** `threat.points` (hours, extent = share of the eventual dark, interpolated linearly): 0.85 h first line trip (15:05, verified) → t = 4.5 s; 1.30 h, 1.45 h trips (unverified, motion only) → 7.2 s, 8.1 s; 1.87 h point of no return, extent 0.01 → 10.62 s; 1.98 h complete, extent 1.0 → 11.28 s. Each station has a rank by shortest-path distance along the lines from the red seed; station i goes dark when extent(h) > rank_i / N (extent = share of stations, standing in for share of people). So the map is flat for ~10 s and then the whole network goes dark in ~0.66 film s: the real shape (1% → 100% in ~0.11 h). Line trips are red segments on the lines leaving the seed.

**Human aggregation (green).** Four green stations = fragments f1–f4 (f5, the fix, is what an assembled line would have enabled; shown only in the routed panel as "people still decide"). Each lights at its `ready_at`: f1 IT staff "knows the alarms are dead" 0.1 h → 0 s; f4 neighbors "saw lines trip" 0.85 h (time unverified, motion only) → 4.5 s; f2 operators "can cut the load" 1.5 h → 8.4 s; f3 coordinators "has the map" 1.83 h → 10.4 s.
Line attempts (dashed green lines drawn toward another green station, stopping partway and fading) happen at documented moments and at lognormal quantiles of aggregation (median 1.5 h, p90 1.83 h, sigma = ln(1.83/1.5)/1.2816 = 0.155):
| attempt | basis | h | film t |
|---|---|---|---|
| f1 → f2 | IT never told operators (s2) | 0.16 | 0.36 |
| f4 → f2 | neighbor calls (unverified time, motion only) | 0.90 | 4.8 |
| f2 → f3 | q = 0.60 → 1.56 h | 1.56 | 8.8 |
| f2 → f4 | q = 0.80 → 1.69 h | 1.69 | 9.5 |
| f3 → f1 | q = 0.90 → 1.80 h, but f3 ready 1.83 | 1.83 | 10.4 |
None completes: the analog says the pieces never assembled into the load-shed decision before 16:06 (t = 1.87 h). The title promise, "no line between", is the data.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median = 0.25 h` (~15 min from the 14:14 alarm loss to a flagged, routed warning to the operators). Basis in the analog: the fragments were machine-readable signals already inside control rooms; joining them is a sub-hour expert reading task, well inside the ~17.4 h 50%-success METR time horizon (RATES.md, May–Aug 2026). In the routed panel, solid green lines run from f1 to f2, f3, f4 between 0.1 h and 0.25 h. At the first trip (0.85 h) the red segment appears; the operators' station pulses and the red segment goes gray (planned shed) by 1.0 h: "people still decide". The map stays lit. Labeled "illustrative" for the whole panel. No claim that this would certainly have prevented the blackout.

## Numbers on screen (two)
1. "~1.5 h to notice": aggregation median (s2, not flagged unverified).
2. "15 min, illustrative": the AI counterfactual (0.25 h).

## Shot list (one long take for the race; slates change with framing)
| t | slate | camera | beat |
|---|---|---|---|
| 0–2.4 | SC1 CLOSE | platform, locked | HOOK / loop frame: person with a green phone, wall map behind with one red station. Card "Four stations. / No line between." |
| 2.4–6.2 | SC1 PULL OUT | continuous zoom, log-zoom 6 → 0 | out of the platform, through the lit station dot, to the whole network. First red trip at 4.5 s. Card "Every station, a lit window." |
| 6.2–10.85 | SC1 WIDE | hold, slow drift | green stations light, try to draw lines, fail. Card "The answer was here. / In pieces." The cascade starts at 10.62 s in the wide. |
| 10.85–11.6 | SC1 FALL IN | log-zoom 0.15 → 7, accelerating | the cascade finishes sweeping the network (11.28 s) while the camera falls into f2's platform, already dark when we land. |
| 11.6–12.4 | SC2 CLOSE+ | locked | dead stop. Silence. Only her green phone is lit. |
| 12.4–15.0 | SC2 | slow push | "We slowed it down / so you could see it." |
| 15.0–15.3 | — | black | freeze, silence |
| 15.3–21.0 | SC3 SNAP | flat | hit. Two 920 px panels, same 2 h, same sweep: as it happened (~1.5 h to notice, map goes dark) / routed · illustrative (15 min, lines drawn, map stays lit). |
| 21.0–24.6 | SC4 CLOSE++ | push to her face (log-zoom 7.2 → 7.7) | "This is the bottleneck." |
| 24.6–28.6 | END | — | end card (full for 3.6 s) "Help close the gap." + QR |
| 28.6–31.0 | LOOP | map re-lights under the card fade; zoom in 2.5 → 6 onto the first platform | last frame = frame 1 |

**Zoom cycles:** OUT 2.4–6.2 (platform → nation), IN 10.85–11.6 (nation → a different platform, closer), IN++ 21.0–24.6 (closer again). Loop tail 28.6–31.0 re-enters the first platform to meet frame 1.

## 3D translation note
One unbroken camera. Start at eye height on a tiled platform, 35 mm, the person's green phone lighting her face, the backlit network map on the wall behind. Pull out slowly and straight back through the tunnel mouth and up through the street, the station becoming a lit window among thousands of windows, then an abstract glowing dot on a continental transit map floating in black (the map is the landscape: extruded gray lines, stations as windows with warm interior light). Hold high and still. Then fall: a long accelerating drop with a slight lens-breathing toward a second station while the windows go dark in a wave around it, landing at 50 mm on a second face as the ceiling lights click off. The end card sits over the black; behind it the windows re-light one by one and the camera glides down into the first platform, matching frame 1 exactly. Richer in 3D: real interior light spilling from windows, crowd silhouettes on each platform, depth in the map layers (vertigo from parallax on the fall).

## Copy
- Hook: "Four stations. / No line between."
- "Every station, a lit window."
- "The answer was here. / In pieces."
- "We slowed it down / so you could see it."
- "This is the bottleneck."
- End: "Help close the gap."
- Variants: "Every line was one call away." / "The map was lit. The lines weren't drawn." / "Nobody drew the line." / "Same map. Different routing."

## Build notes
- Loop check: frame t=0 and the last frame (t = 30.967) compared pixel by pixel in a scratch script, mean abs diff 0.000. The replay is continuous.
- At deep zoom the green fragment rings fade out (log-zoom 2.6–4.2), so the station reads as a plain lit window before the platform fades in (full-frame layer, no rectangles).
- The "Every station, a lit window." card moved to the bottom (y 1330) so it doesn't collide with the green ring during the pull-out.
- Known weaknesses: the fall-in frames (11.0–11.4) are a blur of huge rings (vertigo, but noisy). Frame 1's red is the seed station on the wall poster (about 45 px glow), which reads but isn't big. Snap panels are legible but the mini maps are small.

## Scores
- Hook: 6
- Speed accuracy: 8
- Snap impact: 6
- Emotion: 6
- Originality: 7
- Craft: 6
- Honesty: 9
Overall: 6.9
Virality: 7% (the seamless loop and the subway-map look are shareable, but the hook's red is small and the cascade flashes by in under a second, so a cold feed scroll probably doesn't stop.)
