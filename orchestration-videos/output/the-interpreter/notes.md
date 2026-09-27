# The Interpreter

Tier: animatic
Slug: the-interpreter
Structure: game-hud-run (research/VIRAL_STRUCTURES.md #10)
Analog: cuban-missile-1962
Tags: {"structure":"game-hud-run","medium":"embroidery","family":"language","scale":"between nations","pace":"one long take","camera":"locked-off close-up with a single pull-out","emotion":"tenderness","protagonist":"AI","analog":"cuban-missile-1962"}

## Logline
Two identical gray embroidered houses face each other across a stitched sea inside one embroidery hoop. At each house a small stitched figure holds a green thread. Every message between them is a thread that crosses the sea by hand, one stitch at a time, taking 6 to 12 hours. A gentle game HUD (patches, pips, a progress bar) tracks the run. Run 1 is the real one, by hand. Run 2 is illustrative: frontier AI is only the needle. It carries and translates thread faster, and it never writes a word, never decides, and never touches anything else. The deal moves by one day, honestly. The direct line took 247 days.

No leaders, no countries, no flags, no partisan cues. Both houses and both figures are the same gray. The red is never named. It is red cross-stitch creeping into the sea.

## Time mapping (one stated mapping)
Race (one long take): **1 film second = 6 story hours**, continuous, no stops. H = story hours after day 8 (days after t0 = Oct 16, 1962). H = -2 + (t - 1.4) * 6 for t in [1.4, 17.9], so H runs from -2 to 97.
Cold open (t < 1.4): flash-forward to H 74 (day 11), same framing and same state as the race at that moment, then cut back to H -2.
| event | day | H | film t |
|---|---|---|---|
| alert step (extent 0.5 -> 0.75) | 8 | 0 | 1.73 |
| f2 first settlement letter leaves B | 10 | 48 | 9.73 |
| f2 arrives at A (worst latency 12 h) | 10.5 | 60 | 11.73 |
| f3 second offer leaves B | 11 | 72 | 13.73 |
| day-11 red flash (unverified, motion only) | 11 | 74 | 14.07 |
| f3 arrives (typical latency 6 h) | 11.25 | 78 | 14.73 |
| f4 back channel (in person, no wire latency) | 11.5 | 84 | 15.73 |
| deal assembles (aggregation median) | 12 | 96 | 17.73 |

Snap A (message crossing) uses the SAME mapping, 1 s = 6 h: by hand, 12 h = 2.0 s; carried by frontier AI (illustrative), "minutes" taken as 10 min = 0.028 s.
Snap B (the whole record) is true proportional: day 0 to 260 swept in 1.8 s (1 s = 144 days).

## Speed math
**Threat (red, alert level, ordinal).** analog threat.points: extent 0.5 from day 6, 0.75 from day 8, still 0.75 at day 11. A step function (alert levels are discrete). The sea holds ~2,000 cross-stitch cells; each cell has a rank (closer to the hoop's side edges = lower rank, plus seeded jitter, with the central crossing channel ranked last). A cell is stitched red when rank < extent; new stitches appear over 0.6 s after a step (the needle stitching in). HUD alert meter: 4 pips lit = extent / 0.25. The day-11 event is a red brightening at H 74 with no level change. All of these are `verified: false`, so they drive motion only; no alert levels or dates on screen. De-escalation date is unconfirmed: red never steps down in the race; in the closing shot (after the snap, not tied to a date) the red cross-stitch dims gradually, matching the record strip.

**Human aggregation (green).** Documented fragments (solution.fragments) and latency (message_latency_hours, s4: typical ~6 h; the ~3,000-word settlement letter nearly 12 h to receive and decode).
- f1, the trade already in hand: A's green thread held between the figure's hands from frame 1 (ready day 0).
- f2: thread from B crawls across the sea stitch by stitch for 12 h (2.0 s), H 48 -> 60.
- f3: thread from B, 6 h (1.0 s), H 72 -> 78.
- f4: back channel, in person: a green stitch appears at once at H 84.
- Deal: H 96 (aggregation median, day 12). The threads tie into a green knot mid-sea.
- f5, direct line agreed day 247 (aggregation p90, s5): only in the record strip.
HUD "pieces" patches fill as each fragment reaches A (f1, then H 60, 78, 84), the knot at H 96.
Variance: in the record strip each lane draws the stitched curve L.lognormalCDF(day, median, p90) from analog aggregation (median 12, p90 247). The analog says this distribution is derived from dated events, not measured; used for curve shape only.

**AI counterfactual (illustrative, deliberately modest).** From ai_counterfactual: only transport and translation speed up. Translating/summarizing a ~3,000-word letter is a minutes-scale task, far inside the ~17.4 h 50% task horizon (RATES.md, METR). Assumed: same exchanges with ~12 h less latency per round, so the deal assembles day 11 instead of day 12. Lane 2 uses median 11 and the same p90 247: the film does not claim AI would have produced the direct line sooner. On screen: "RUN 2 · FRONTIER AI CARRIES" + "illustrative" (>= 44 px), and "People write. People decide." The needle is the only AI image: a gray needle; it has no face, no voice, and never touches a house, the red, or a decision.

**Numbers on screen (two, both sourced without a verified:false flag):** "12 hours" (s4) and "247 days" (s5, agreement June 20, 1963 = day 247). "A day sooner" is words (the 12 vs 11 is in notes only). The HUD has pips and patches, no numerals.

## Shot list (DUR 37.6 s)
| t | slate | camera | beat |
|---|---|---|---|
| 0.0-1.4 | SC1 CLOSE, COLD OPEN (day 11) | locked-off close on figure A's hands, zoom 3.0 | red cross-stitch fills the sea behind her; green thread in hand; an incoming thread mid-crossing. "Every word crossed by hand." |
| 1.4-6.4 | SC2 CLOSE, LOCKED-OFF | zoom 3.0, no move | back to day 8: alert step (hit). HUD "RUN 1 · BY HAND". "The way out, already in hand." "Waiting on the other shore." |
| 6.4-9.4 | SC3 PULL OUT (the single pull-out) | 3.0 -> 0.98, log-zoom ease | the whole hoop: house B identical, figure B holding green, red sea between. "The other house holds the same." |
| 9.4-12.4 | SC4 WIDE, HOOP | 0.98 hold | the letter crawls across the sea stitch by stitch, 2 s. "Nearly 12 hours to cross." |
| 12.4-14.4 | SC5 DOLLY IN | 0.98 -> 4.2 | back to A, closer than the start. "Stitch by stitch. Day by day." |
| 14.4-18.6 | SC6 CLOSER | 4.2 -> 4.4 | f3 arrives, red flash, f4, knot ties (deal). "Same words. Both shores." Dead stop at 17.9. |
| 18.6-21.0 | SC7 HOLD | freeze | "We slowed it down so you could see it." |
| 21.0-24.8 | SC8 SNAP: TWO RUNS | full-frame linen sheet, two 940 px hoops | freeze, one hit. RUN 1 by hand crosses in 2 s -> "12 hours"; RUN 2 frontier AI carries (illustrative) crosses at once -> "minutes". "It only carries. People decide." |
| 24.8-28.6 | SC9 THE WHOLE RECORD | full-frame sheet, two lanes | playhead day 0 -> 260. Knots nearly overlap. "A day sooner. Only that." -> "The direct line took 247 days." |
| 28.6-31.4 | SC10 CLOSEST | 5.6 -> 6.0 on the hands and the knot | IN++. "The words were always theirs." |
| 31.4-33.6 | SC10 hold | 6.0 | "This is the bottleneck." |
| 33.6-37.6 | END | - | L.endCard, 4 s |

Zoom cycles: IN (3.0, 0-6.4, locked-off) -> OUT (0.98, 6.4-12.4) -> IN+ (4.2-4.4, 12.4-18.6) -> [snap sheets] -> IN++ (5.6-6.0, 28.6-33.6).
Crossfades between the hoop and the snap sheets are full-frame layers (never rectangular patches).

## 3D translation note
A real embroidery hoop on a dark table, charcoal linen stretched tight, lit by one warm practical lamp from the upper left so every stitch casts a tiny shadow. Start on a 100 mm macro, locked off, at the stitched figure's hands: individual fibers of the green floss visible, the red cross-stitches out of focus in the sea behind. The single pull-out is a slow 3 s dolly back and crane up on a motion-control rig until the whole hoop (wood grain, brass clamp screw) fills frame at 50 mm, looking straight down. The crossing thread is a real needle pulled through the linen stitch by stitch (stop-motion rhythm, one stitch per beat). The return is a 150 mm macro push, closer than the start, ending on the knot. Richer in 3D: the tension of real thread, the shadow of the needle, the sheen of the green floss against matte gray, and the stillness of a locked-off shot while only thread moves. Run 2's needle is identical, just faster: no glow, no face.

## Copy variants
- "Every word crossed by hand." (hook)
- "The way out, already in hand."
- "Waiting on the other shore."
- "The other house holds the same."
- "Nearly 12 hours to cross."
- "Stitch by stitch. Day by day."
- "Same words. Both shores."
- "It only carries. People decide."
- "A day sooner. Only that."
- "The words were always theirs."
- Alternates: "Civilization has lag. Hand-stitched." / "Ping: half a day." / "Both houses. Same thread." / "The needle was the slow part."

## Diversity
`node tools/diversity.js` on the assigned tags: OK, distinct enough (nearest the-last-thirteen-days, ten-things-in-the-drawer, the-hold-music at 0.67). No changes needed.

## Build log
- Preview 1: the layout, HUD, snap sheets and end card all read correctly. The one fix: at zoom 4-6 the thread glow was 60+ px wide and looked crude. Thread and knot widths now scale with 1/zoom (the glow) and 1/sqrt(zoom) (the stitch). No second preview; I checked one frame from the render at t = 30.
- Timings were shifted slightly from the plan: snap B runs 24.8-29.0, IN++ 29.0-31.8, neck 31.8-34.0, and the end card 34.0-38.0 (4 s). DUR is 38 s.
- Final: 38.0 s (ffprobe), 1080x1920, 30 fps.
- Known weak spots: in the closer shots (IN+ / IN++) the red is mostly out of frame because the crossing channel is kept clear. The HUD text is small (34-46 px), and the stick figure is a stitched L.stick, not literal hands.

## Scores
- Hook: 7 (frame 1 shows a red-flashing cross-stitch sea, a stitched figure holding green thread, the game HUD and "Every word crossed by hand.". It is legible, but embroidery on charcoal reads quieter than a phone UI)
- Speed accuracy: 8 (one continuous mapping, 1 s = 6 h. The 12 h and 6 h latencies and the fragment days come from the analog. Unverified alert steps drive motion only. The record lanes use lognormalCDF with the analog's derived median and p90)
- Snap impact: 6 (the counterfactual is honestly tiny. A 2 s crossing vs an instant one, then two nearly identical curves, lands the "only a day" point, but not as a jolt)
- Emotion: 6 (the tenderness of two identical figures each holding green across the sea is there; the stick faces are simple)
- Originality: 8 (an embroidery hoop, messages as thread, and a HUD run over a stitched sea are new in the portfolio)
- Craft: 6 (the satin-stitch houses, weave and cross-stitch work; the snap sheets are flat and the HUD is small on a phone)
- Honesty: 9 (no leaders, countries or flags. The threat is never named. Only "12 hours" and "247 days" are on screen. The AI appears only as a needle, labeled illustrative and "translation only"; "People decide." The deal moves only a day)
- Overall: 7.1
- Virality: 6% (the hand-stitched look is distinctive and calm, but the history-and-latency payoff is deliberately modest and slow for a small account, so it most likely stays well under 100k)
