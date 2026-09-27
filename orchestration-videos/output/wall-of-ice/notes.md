Tier: animatic

# Wall of Ice

**Logline.** It is a winter night, drawn in layered paper cutout. A child pads down a dark hallway toward the kitchen with a torch in hand. Through the kitchen window, a red pulse runs down the pylon line from the far north. The house goes dark in seconds. The camera cranes up through the roof. The whole province is dark, and the green pieces of the answer are lit in buildings far apart: a warning office, a lab, a control room, a crew depot, a head office. The camera drops back into the kitchen, closer. The torch finds Maman's face as she laces her boots. Her helmet lamp is green: she is one of the pieces. The camera cranes up again and the clock runs on. The light comes back in hours; the lasting fix takes 7 years. Late reveal: "This happened. 1989."

- **Structure:** `based-on-a-true-story` (research/VIRAL_STRUCTURES.md #12)
- **Analog:** `quebec-1989` (research/analogs/quebec-1989.json). The file is `verified: false` at the top level, so on screen I use only individually sourced figures.
- **Medium / family / scale / pace / camera / emotion / protagonist:** paper cutout / weather/fluids / family / slow build / POV walk / tenderness / one person
- Siblings on this analog: ninety-seconds (topo), the-mind-grid (x-ray), the-ballroom (paper cutout, dance, nation), the-storm-doc. This film is the intimate, family-scale one. I reused the siblings' red fit and green lognormal so all the films agree.

## Time mapping (one mapping, drawn as a "log time" paper ruler, with two stated pauses)
Clock time: E (seconds after 02:44) = 10^((c - 2.4) / 1.6), where c is the running film clock. **Every 1.6 running seconds, ten times more real time passes.**
- Film t < 2.4 is pre-event, except the cold open (t 0 to 1.4), which is a flash-forward to E ≈ 60 s on the same timeline.
- c = t from 2.4 to 6.2. The clock is **paused** from t 6.2 to 16.2 (the ruler shows "paused") while the camera cranes up and drops into the kitchen. The kitchen scene is therefore still about 4 minutes into the dark. After that, c = t - 10, so E = 10^((t - 12.4) / 1.6). The clock freezes for good at t = 26.0 (E ≈ 10 years).

## Speed math
**Threat (red).** The analog sources only the endpoints: 0 at 02:44, and the whole grid down about 90 s later (s1, s2, s5). As the director's note asks, I don't draw a straight line between them. Instead I use the siblings' logistic fit: share(E) = L.logistic(E, 6.78 s, 0.01). That is 1% at t0 and 99% at 90 s; r = ln(9801)/90 = 0.102/s, so the doubling time is 6.78 s. **The fit is an assumption.** Rank = normalized distance from the northern origin along the lines, and a place falls when rank < share(E). The house sits at rank 0.90. It goes dark at E = 66 s, which is t = 5.32. The whole grid is down at E = 90 s, t = 5.53.

**Restoration.** From `threat.events`: 83% restored after more than 9 h (s3). restored(E) = 0.83 × (E − 90) / (32400 − 90) from 90 s to 9 h. The remaining 17% is restored linearly by 24 h. **That tail is my assumption,** and no number is shown for it. Places relight south first: a place is dark while rank < share and rank > 1 − restored... in practice, the south comes back first. The 9 h point lands at t = 19.62.

**Human aggregation (green).** There are 5 fragments, from `solution.fragments`: warning (f1, forecast centres), science (f2), control room (f3, Hydro-Quebec engineers), crews (f4, restoration crews; Maman's depot is in our town), and planners (f5, series compensation). All five are lit from frame 1 because they already existed. They close as a loop. Link arrivals are `L.lognormalQuantile(q, 759 h, 64000 h)` at q = .1, .3, .5, .7, .9:

| link | q | arrival | film t |
|---|---|---|---|
| control room–crews | 0.1 | 9.0 h (= p10, sourced: 83% back) | 19.62 |
| crews–science | 0.3 | 124 h (modelled) | 21.44 |
| science–warning | 0.5 | 759 h (modelled median, NEVER on screen) | 22.70 |
| warning–planners | 0.7 | 4659 h (modelled) | 23.96 |
| planners–control room | 0.9 | 64000 h (= p90, sourced: series compensation 1996, ~7 yr) | 25.78 |

Before each link lands, "attempt" dashes leave a fragment and die partway. These are rhythm only, not data.

**AI counterfactual (illustrative).** From `ai_counterfactual`: about 1 h to route an existing forecast, plus the known vulnerability of long lines, into one control room's operating posture. That is a short synthesis task, well inside METR's ~17.4 h 50% time horizon (RATES.md). The warning's own lead time (f1, −24 h) is `verified: false`, so the AI lane shows the routed warning only as "before" the red, with no number. The red lane is unchanged, and the film does not claim the collapse would have been prevented: "Operators still decide." The crews and the steel stay where history put them ("Steel still takes years."). The counterfactual is small and I did not inflate it. The snap works through staging instead: a freeze, silence, one hit, the true-scale hairline, then the two lanes.

**True-scale beat.** On a linear bar of about 7.3 years (2.3e8 s), the 90 s dark is 90 / 2.3e8 of the bar. At 900 px that is 0.0004 px, so it is drawn as a 2 px hairline labeled "the dark: too thin to see".

## Numbers on screen (two)
1. "7 years": 1989 to 1996, series compensation completed (s4).
2. "1989": the analog year (the based-on-a-true-story reveal counts it as a number).
"Dark in seconds" uses a word, not a number: 90 s per s2/s5, and "less than a minute" per s1. "Hours" is a word too; the 9 h (s3) appears only as the "hour" tick.

## Honesty of the reveal
The card says "This happened." / "1989.", with a 44px subline "the family is imagined". The province going dark in seconds, the light back within hours, and the 7-year fix all happened. The family is fiction, and the middle link spacing is modelled. The card never says "every timing is real".

## Shot list
| t | slate | camera | beat |
|---|---|---|---|
| 0–1.4 | SC1 COLD OPEN (CLOSE POV) | slow push at the kitchen doorway | Flash-forward (E ≈ 60 s): a red pulse at the nearest pylon outside the kitchen window. The child's hand and torch are at the bottom; Maman's green helmet lamp hangs on its hook. "The answer was already here." |
| 1.4–6.2 | SC2 POV WALK | walk forward down the hall (dolly, head bob) | "Moments earlier." The clock starts at 2.4. Red crawls down the pylon line; the lights die at 5.32; the torch clicks on. "Dark in seconds." |
| 6.2–10.2 | SC3 CRANE UP | tilt to the ceiling, full-frame crossfade to the roof, exponential zoom-out z 30→1 | The province is dark and red is on the lines. The five green pieces are lit in far buildings; attempts fail. The clock is paused. "The pieces were in different buildings." |
| 10.2–12.2 | SC4 DROP DOWN | zoom z 1→30 onto our roof, crossfade to the kitchen | |
| 12.2–16.2 | SC5 KITCHEN CLOSE (closer than SC2) | slow push on Maman's face in the torch beam | She looks up and smiles, lifts the green helmet lamp, and touches the child's head. "Maman was one of the pieces." |
| 16.2–26.0 | SC6 CRANE UP 2, then WIDE HIGHER | kitchen → roof → province (z 30→1), then a slow rise to z 0.86 | The clock resumes: the lights come back south-first at 19.6 and the crews link lands. Days to years: the loop closes at 25.8. "The light came back in hours." "The lasting fix took 7 years." |
| 26.0–28.6 | SC6 HOLD | | "We slowed it down / so you could see it." |
| 28.6–31.4 | SC7 REVEAL | flat paper | "This happened." then "1989." Subline: "the family is imagined". |
| 31.4–37.0 | SC8 SNAP | flat | Freeze flash and hit. The 7-year bar with the dark as a hairline, then two log lanes: as it happened vs warning routed (illustrative). "Operators still decide." |
| 37.0–39.6 | SC9 EXTREME CLOSE | push in on hands | The child's hand and Maman's glove on the green lamp, now a closed ring. "This is the bottleneck." |
| 39.6–43.6 | END | | L.endCard, 4 s |

**Zoom cycles:** Cycle 1: IN (POV hall, 1.4–6.2), OUT (6.2–10.2), IN+ (10.2–16.2, kitchen, closer). Cycle 2: OUT (16.2–26), IN++ (37–39.6, extreme close on the hands).

## 3D translation note
- **POV walk:** a handheld 24 mm at a child's eye height (about 1.1 m), stepping slowly down a narrow hallway. The paper-cutout walls are real layered card with visible thickness and soft contact shadows, and a torch cone does volumetric work in the dark. The kitchen window at the end frames a snowy field and a pylon line; the red pulse travels as emissive light along the conductors toward the house.
- **Crane up through the roof:** the camera tilts to the ceiling, passes through the paper layers (the ceiling card parts like a pop-up book), and rises over snowy roofs. It becomes a drone climb, then a pull-back to a province built as a paper relief. Speed ramps from walking pace to about 200 m/s, easing out.
- **Kitchen:** 50 mm, slightly low, at the child's height. The torch lights Maman's face from below and warm-gray; everything else stays blue-gray paper. Her helmet lamp is the only saturated light.
- **Crane 2:** the same rise, but the clock runs. Snow on the roofs melts and returns (seasons) to sell the log time. Lines turn from red back to gray, and a green thread runs from our roof to the control room.
- **Extreme close:** 100 mm macro on two hands, a mitten and a work glove, around the lamp; paper fibres visible.
- **Richer in 3D:** layered card parallax, torch volumetrics, falling paper snow, and the pop-up-book transitions.

## Copy variants
- "The answer was already here."
- "Moments earlier."
- "Dark in seconds."
- "The pieces were in different buildings."
- "Maman was one of the pieces."
- "The light came back in hours."
- "The lasting fix took 7 years."
- "We slowed it down / so you could see it."
- "This happened." / "1989." / "the family is imagined"
- "Operators still decide." / "Steel still takes years."
- "This is the bottleneck."
- Alternates: "The ping was already sent." / "Every piece had a porch light on."

## Tags
{"slug":"wall-of-ice","structure":"based-on-a-true-story","medium":"paper cutout","family":"weather/fluids","scale":"family","pace":"slow build","emotion":"tenderness","protagonist":"one person","camera":"POV walk","analog":"quebec-1989"}

Diversity check: OK (nearest day-three-hundred-five, the-warehouse, the-balcony; distance 0.56). Paper cutout kept.
