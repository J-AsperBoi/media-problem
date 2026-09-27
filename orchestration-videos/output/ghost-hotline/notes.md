Tier: animatic

# The Ghost Line (slug: ghost-hotline)

**Logline.** Two gray houses face each other across dark water, painted in ink wash. A clerk at one window holds a spool of green thread; across the water a red lamp is lit. A gentle ghost (hindsight, not AI) walks back through the crisis and then back through the 247 days it took to agree a direct line, and shows where the line could have been strung all along. At the snap, the only AI in the film appears: a modest, illustrative faster courier (transport and translation only), deal a day sooner, people still decide.

- **Structure:** ghost-rewind (research/VIRAL_STRUCTURES.md #18). Difference from earlier ghost-rewinds: in the-worm-rewind and ghost-rewind-covid the ghost layer *was* the AI timeline, revealed at the snap. Here the ghost is **hindsight**: its pale thread across the water is the direct line that really was agreed later (day 247). The reveal is "the ghost was hindsight", and the AI counterfactual is a separate, smaller thing shown only in the snap.
- **Analog:** cuban-missile-1962. Never named. No leaders, countries, flags, languages or party cues: two identical gray houses on two shores.
- **Protagonist:** an institution (the two houses and their message machinery; the clerk is its hand).
- **Medium:** ink wash on muted rice paper: black-ink washes, dry-brush water, misty mountains; only the red lamps and the green thread/letters are saturated. The ghost is a pale, soft, desaturated wash figure with a kind face (not scary).
- **DUR:** 40.5 s, 1080x1920, 30 fps. Scene: scenes/ghost-hotline.js

## Time mapping (one mapping per section, stated)
- **Race (t 2.8 to 17.4 s): 1 film second = 1 day** (days after the analog t0, Oct 16 1962). Pace is stop-start: the clock *freezes* (everything stops, no days pass) three times: at day 8 (0.8 s), day 10 (0.8 s), day 11 (1.0 s). Holds never stretch days.
  - day(t) = t - 2.8 for t < 10.8; 8 for 10.8-11.6; 8 + (t - 11.6) to day 10 at 13.6; hold to 14.4; to day 11 at 15.4; hold to 16.4; day 12 at 17.4.
  - On screen the clock is a row of ink tally strokes (one per day, no numerals).
- **Cold open (0-1.6 s):** frozen flash-forward to day 11 (the closest point in the analog's sequence), then the ghost rewinds the ink to day 0 (1.6-2.8 s). Same timeline, visibly rewound (washes un-bleed, lamps go dark).
- **Snap A, whole record to scale (t 20.6-23.2): 1 s = 100 days**, days 0 -> 260, uniform (day 247 lands at t 23.07). The 12-day crisis is a sliver at the left; the direct line lands at day 247.
- **Snap B, side by side (t 26.3-29.3): 1 s = 4 days**, days 0 -> 12, same rate in both panels.

## Speed math
**Threat (red = alert level, ordinal, from analog threat.points).** extent: 0 at day 0, 0.5 at day 6, 0.75 at day 8 and still 0.75 at day 11. Each house has a column of 4 windows; lit red windows = extent / 0.25 as a step function (2 lit from day 6, 3 from day 8), identical in both houses (mutual escalation, no side is the villain). Day 11 (closest point) is a flicker of the lamps, no level change, as in the data. These dates are standard record but `verified: false` in the analog, so they **drive motion only; no alert numbers or dates on screen.** De-escalation date is unconfirmed, so the lamps never step down during the race; in the whole-record strip the red simply fades after day 12, without a date.

**Human aggregation (green, analog solution.fragments + message_latency_hours, s4).**
| fragment | ready (day) | race t | shown as | latency | arrives |
|---|---|---|---|---|---|
| f1 obsolete missiles that could be traded | 0 | 2.8 | a small green token on the near house's sill, unconnected | none | - |
| f2 first settlement letter (s2) | 10 | 13.6 (hold) | green paper boat leaves the far house | ~12 h worst (s4) = 0.5 s | 14.9 |
| f3 second, public offer (s6) | 11 | 15.4 (hold) | green paper boat | ~6 h typical = 0.25 s | 16.65 |
| f4 back channel (unverified, s3) | 11.5 | 16.9 | a small green lantern carried by hand, no boat | in person | 16.9 |
| deal (aggregation median, day 12, s1) | 12 | 17.4 | the green pieces knot at her window | - | - |
| f5 direct line agreed (s5, verified) | 247 | snap A | the green thread strung across the water | - | - |
Aggregation from the analog: p10 = 10, median = 12, p90 = 247 days. Because the analog's aggregation is a set of documented dates, not a population, the film uses the documented dates directly rather than sampling L.lognormalQuantile (there are 5 fragments, not a crowd). Variance is shown as the documented spread: first offer day 10, deal day 12, structural fix day 247.
Boats move at constant speed across the water over their latency; at 1 s = 1 day a 12-hour crossing is 0.5 s. This is honest and small: the film's argument is not the crossing time but that the fix for it took 247 days to agree.

**The ghost (hindsight, not AI).** A pale desaturated gray-green thread hangs across the water from frame 1, exactly where the real green line is later strung (day 247). It never carries messages faster during the race; it only marks where the line could have been. At snap A the real line is drawn at day 247 over the ghost thread, and the ghost walks the strip back from day 247 to day 0 (card: "The ghost was hindsight."). The film does not claim that an earlier line would have changed the outcome.

**AI counterfactual (snap B only, labelled illustrative, deliberately modest).** From ai_counterfactual: aggregation_median = 11 days. Basis: the ~12 h to receive and decode a ~3,000-word letter (s4) is transport and translation, a minutes-scale task for frontier AI, far inside the ~17.4 h 50% METR time horizon (RATES.md). Assumed: same exchanges, ~12 h less latency per round, deal ~1 day sooner. In the AI panel boats cross in ~0 time (minutes) and the knot is placed at day 11 (analog endpoint); the intermediate send times are shifted by the same day (illustrative). The clerk still ties the knot: people decide, AI only carries and clarifies. No AI near any decision.

**Numbers on screen (1):** "247 days" (hotline agreement June 20 1963, s5, verified). Deviation from concept.json's snap "Day 12 vs 11": showing day 12 and day 11 as numerals would make three numbers with 247, and the alert-adjacent days read like dates; instead each snap panel is a row of day tallies (countable, no numerals) with the knot on the 12th vs the 11th tally, plus the words "a day sooner" and "illustrative".

## Shot list and camera
| t (s) | shot | camera | beat |
|---|---|---|---|
| 0.0-1.6 | SC1 CLOSE (cold open) | eye level, through her window, clerk three-quarter in foreground, spool with green thread; far house with 3 red windows and red reflections across the water; ghost beside her | "She held the line." |
| 1.6-2.8 | SC1 REWIND | slight push | ghost raises a hand; lamps go dark; ink un-bleeds; tally strokes vanish |
| 2.8-5.2 | SC2 CLOSE | slow push 1.0 -> 1.08 | clock runs; ghost steps onto the water with the pale thread; "Two houses. Dark water." |
| 5.2-9.0 | SC3 CRANE UP | full-frame fade from the window comp into the landscape world; world zoom 2.6 -> 0.62, rising | both shores, both houses, misty mountains; red steps to 2 at day 6 (t 8.8) |
| 9.0-13.6 | SC4 WIDE | hold, slow drift | stop at day 8 (red to 3); letters only by boat; "Every word crossed by boat." |
| 13.6-17.4 | SC5 DROP DOWN | world zoom 0.62 -> 3.2 onto her window, full-frame fade into the window comp at scale 1.35 (closer than SC1) | f2 boat arrives, stop day 11 (lamp flicker, silence), f3, f4 lantern; knot at day 12 |
| 17.4-20.2 | SC6 FREEZE | still | "We slowed it down so you could see it." |
| 20.2-26.0 | SC7 SNAP A, whole record | flat scroll | hit; 0.4 s black; days 0-260 to scale; red sliver; green line at day 247 (t 23.07); ghost walks back to day 0 (24.2-25.6); "The direct line took 247 days." / "The ghost was hindsight." |
| 26.0-30.2 | SC8 SNAP B | two stacked panels 960 px | as it happened vs "frontier AI carries + translates" / "people still decide"; knot on the 11th tally (t 29.05) vs 12th (t 29.3); "illustrative" 56 px, "a day sooner" |
| 30.2-33.0 | SC9 EXTREME CLOSE | window comp 1.55 -> 1.9, on hands | back at day 0 (lanterns dark); ghost hand guides hers; she ties the thread, it turns green and taut across the water; "Build the line before you need it." |
| 33.0-35.4 | SC9 hold | slow push to 2.0 | "This is the bottleneck." |
| 35.4-40.5 | END | - | L.endCard 5.1 s ("The bottleneck is us.") |

Zoom cycles: cycle 1 IN 0-5.2 -> OUT (crane up) 5.2-9.0, hold to 13.6 -> IN+ (drop down) 13.6-17.4 (1.35x vs 1.0x). Cycle 2: OUT (flat snap) 20.2-30.2 -> IN++ 30.2-33.0 (1.9x, then 2.0x).

## 3D translation note
A foggy night lake as a physical ink painting: two small gray timber houses on opposite shores, far shore under layered misty ridges. SC1 is an 50 mm eye-level shot from inside her room, window frame soft in the foreground, the far lamps blooming red on wet air with long reflections. The crane up is a slow 4 s vertical rise on a 24 mm through the roof into the mist until both shores fit, ending locked-off (a hanging-scroll composition); ink "bleeds" as volumetric fog. Paper boats are tiny practical models with wakes. The drop down is faster (3.8 s) and ends at 85 mm, closer than the opening. The ghost is a soft emissive volume with no hard edges and a kind face; its thread is a thin, barely visible filament catching light, and the real green thread is a taut emissive line. Richer in 3D: wet-ink diffusion on water, parallax between mist layers, the thread's catenary sag and tension when she ties it.

## Copy variants
- "She held the line." (hook, used)
- "Two houses. Dark water." (used)
- "Every word crossed by boat." (used)
- "The direct line took 247 days." (used)
- "The ghost was hindsight." (used)
- "Build the line before you need it." (used)
- Unused: "The thread was already on the spool." / "Hindsight walks back." / "Latency is a choice." / "Legacy code: paper boats."

## Tags
{"slug":"ghost-hotline","structure":"ghost-rewind","medium":"ink wash","family":"myth/ritual","scale":"between nations","pace":"stop-start","emotion":"awe","protagonist":"an institution","camera":"crane up and drop down","analog":"cuban-missile-1962"}

Diversity check: with the assigned scale "history" it was TOO SIMILAR to ghost-rewind-covid (0.44). Changed scale to "between nations" (more literal: two houses across water). Result: OK (nearest ghost-rewind-covid, the-hold-music, the-contagion-atlas at 0.56).

## Build notes
- Rendered 40.5 s (ffprobe 40.500), matches DUR. Preview once, then fixed: the spool covered the clerk's eye in frame 1 (moved clerk and spool down); in SC9 her arms stretched across the frame (she now steps to the sill).
- Debug: f2 arrives t 14.9, f3 t 16.65, deal t 17.4, direct line in snap A t 23.07.
- Frame 1 (thumbnail): clerk's worried face (red rim light), green spool in her hands, three red lanterns with long red reflections across the water, the pale ghost beside her, "She held the line."
- Crane up and drop down are full-frame crossfades between the window comp and the landscape world, during camera moves (no rectangular patches).
- Only one numeral on screen ("247 days"). The day tallies are countable but carry no numerals; alert dates drive motion only.
- Known weaknesses: the world wide is small for a phone (houses ~100-180 px, lanterns tiny, but the red reflections carry); the snap is quiet by design (a one-day, illustrative gain); IN++ returns to day 0, a mythic image that is a lesson, not a claim; the ghost's arm drawing is simple.

## Scores
Hook 7, Speed accuracy 7, Snap impact 5, Emotion 7, Originality 8, Craft 7, Honesty 9
Overall: 7.1
Virality: 6% - A handsome ink-wash myth with a clear red-lamp/green-thread thumbnail and an open-loop ghost, but a quiet, history-heavy piece with a deliberately modest snap from a small account will most likely stay well under 100k.
