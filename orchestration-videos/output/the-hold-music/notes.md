# The Hold Music

Tier: animatic
Slug: the-hold-music
Structure: wait-for-it (research/VIRAL_STRUCTURES.md #4)
Analog: cuban-missile-1962
Tags: medium bean cartoon · family music · scale between nations · pace stop-start · camera locked-off close-up with a single pull-out · emotion loneliness (changed from dread, see Diversity check) · protagonist an institution

## Logline
Two gray beans at two identical desks, each on hold to the other. The hold music loops on a long staff across a wide gray gulf. Each desk holds half of the way out, written in green notes with rests where the other half should go. Letters cross the staff as notes, and each crossing takes hours. Under it, a red crescendo climbs the score in steps. Wait for it: on day 12 the two halves finally sit in one bar and play together. Then the snap: frontier AI carrying and translating the letters gets there a bar sooner (illustrative, modest), and the direct line that ended the hold took 247 days.

The beans are institutions (two desks), not people we name. No leaders, countries, flags or party cues. The red is never named.

## Time mapping (one stated mapping for the race)
Race, film t = 1.5 s to 19.5 s: **1 film second = 8 hours**, linear. day(t) = 6 + (t - 1.5) / 3 (days after Oct 16, 1962 = analog t0). Day 6 at t 1.5, day 8 at 7.5, day 10 at 13.5, day 11 at 16.5, day 11.5 at 18.0, day 12 at 19.5.
- The score row (13 measures, one per day 0 to 12) is the calendar: one measure = one day, the current measure is lit.
- Hold music: a gray 8-note phrase scrolls along the line staff at one phrase per film second (= one phrase per 8 hours). It never changes, never stops before day 12: the sound of waiting.
- Frame 0 to 1.1 s is a cold open at the day-11 state (the same timeline, flash-forward), then a rewind cut to day 6.

## Speed math
**Threat (red = alert level, ordinal, analog threat.points).** extent 0.5 at day 6, 0.75 at day 8, still 0.75 at day 11 (closest point). Drawn as a stair-stepped crescendo hairpin under the score row: at each day-measure its half-height = extent x 120 px. It is a step function, not a ramp, because alert levels are discrete. The day-11 event is a red pulse with no level change, as in the data. These dates are standard record but flagged `verified: false` in the analog, so they drive motion only: no alert names, levels or dates appear on screen. De-escalation is undated in the analog, so the hairpin never closes on screen.

**Human aggregation (green, analog solution.fragments + message_latency_hours).**
| fragment | ready (day) | film t | route | latency | arrives t |
|---|---|---|---|---|---|
| f1 obsolete missiles to trade = the green notes already on the bottom desk's sheet | 0 | before frame 1 | already there | - | - |
| f2 first settlement letter (written on the top desk's sheet) | 10 | 13.5 | down the line staff | worst 12 h = 1.5 s | 15.0 |
| f3 second, public offer | 11 | 16.5 | down the line staff | typical 6 h = 0.75 s | 17.25 |
| f4 back channel assurance | 11.5 | 18.0 | a side path, in person (no line) | ~2 h = 0.25 s (evening meeting, not measured) | 18.25 |
| deal: both halves in one bar (aggregation median) | 12 | 19.5 | the sheet plays | - | 19.5 |
| f5 direct link agreed (aggregation p90) | 247 | snap | - | - | - |

The p10 of the aggregation block (day 10) is the first letter; the median (day 12) is the payoff; the p90 (day 247) is the structural fix shown in the long-line insert. The analog notes this distribution is derived from dated events, not measured.

**AI counterfactual (illustrative, deliberately modest).** From ai_counterfactual: only transport and translation speed up. Translating and summarizing a ~3,000-word letter is a minutes-scale task, far inside the ~17.4 h 50% task horizon (RATES.md, METR). Same exchanges, ~12 h less latency per round, so the halves meet on day 11 instead of day 12. On screen: two score panels, same red, same playhead speed (1 s = 5 days); the green bar lands one measure sooner in the lower panel, labeled "frontier AI carrying letters" and "illustrative". The 247-day direct line is shown as one shared long line: no claim that AI would have built it sooner. People still read, decide and sign; AI never touches a decision.

**Numbers on screen (two):** "12 hours" (s4: nearly 12 hours to receive and decode the settlement letter) and "247 days" (s5: direct-link agreement June 20, 1963 = day 247). Day 12 vs 11 is shown as measure positions, not numerals.

## Shot list (DUR 37.4 s)
| t | slate | camera | beat |
|---|---|---|---|
| 0.0-1.1 | SC1 CLOSE (cold open) | locked-off, zoom 2.6 on the bottom bean's face, phone at ear | red crescendo big behind the head, green half-melody on the stand. "Wait for it." |
| 1.1-1.5 | rewind | same | whoosh; red drains back to day 6 |
| 1.5-5.5 | SC1 CLOSE | locked-off | red steps up (hit, day 6). Gray hold notes drift out of the receiver. "On hold. To each other." |
| 5.5-8.5 | SC2 PULL-OUT | the single pull-out: 2.6 -> 1.0, ease in-out | reveal the gulf: top desk (identical), the line staff, the score row. Red steps again (day 8) as the frame opens |
| 8.5-17.5 | SC3 WIDE | hold | "Half the way out on each desk." f2 written and sent (day 10), crosses 1.5 s: "Each note: up to 12 hours." Red pulse (day 11). f3 sent |
| 17.5-19.5 | SC4 DOLLY IN | 1.0 -> 3.4 onto the bottom sheet and face | f3 lands, f4 slides in from the side path. "Wait for it..." |
| 19.5-21.0 | SC4 CLOSER | hold | day 12: the bar plays, green sweep, the hold music stops. Dead stop, silence. "There." |
| 21.0-23.4 | SC5 CARD | - | "We slowed it down so you could see it." |
| 23.4-28.0 | SC6 SNAP | full-frame panels, locked | freeze, silence, one hit. Two 940 px score panels: "as it was" / "frontier AI carrying letters" + "illustrative" (48 px). Playhead sweeps; green lands at measure 12 vs 11 |
| 28.0-31.0 | SC7 THE LONG LINE | full-frame, locked | the whole record, days 0-260 on one line; the crisis is a sliver; "The direct line took 247 days." |
| 31.0-33.4 | SC8 CLOSEST | full-frame fade back into the world, zoom 4.4 on the face, still holding the phone | "This is the bottleneck." |
| 33.4-37.4 | END | - | L.endCard, 4 s |

Zoom cycle: IN (2.6, 0-5.5) -> OUT (1.0, 5.5-17.5) -> IN+ (3.4, 17.5-21) -> [snap inserts] -> IN++ (4.4, 31-33.4). One pull-out only, per the assigned camera.

## 3D translation note
Locked-off 85 mm at seated eye height on a soft vinyl-toy bean, receiver pressed to its cheek, the red crescendo a huge glowing sculpture behind it (a stepped wedge of red light like a stage riser). The single pull-out is a slow dolly back and crane up (3 s, no shake) to reveal a tall empty hall: two identical desks at the top and bottom, a giant five-wire staff strung across the gulf like telegraph cables, gray note-heads sliding along it on the hold loop. The letters are green note-heads riding the wires. Dolly in on a 100 mm to the music stand; last shot a 135 mm on the bean's eyes with the full green sheet beside it and the receiver still at its ear. Richer in 3D: cable sag, the physical scale of the gulf, dust in the stand light, the hush when the hold loop stops.

## Copy variants
- Wait for it.
- On hold. To each other.
- Half the way out on each desk.
- Each note: up to 12 hours.
- There.
- The direct line took 247 days.
- Your call is important to us. (unused, too jokey for the tone)
- Two halves. One slow line. (unused)

## Diversity check
First pass with emotion "dread": TOO SIMILAR (nearest the-last-thirteen-days, 0.44, same analog, scale, pace and camera). Changed emotion to "loneliness" (two beans each alone on hold): OK, nearest the-last-thirteen-days at 0.56.

## Build log
- Preview 1: close-up framing clipped the handset on the left; the travelling green letters were too small in the wide; "Wait for it..." overlapped the bean during the dolly; outer red glow layer read as a rectangular patch; "direct line" label ran into the right UI column. Fixed: close centre x 580 -> 560, letter notes 11 -> 16 px with a larger glow, the caption moved over the red at the top, outer glow alpha cut, label right-aligned. Preview 2 clean.
- Render: 37.4 s (ffprobe), matches DUR.
- Known weaknesses: the wide shot is busy (two staffs, hairpin, two desks) and the letters cross fast at the true mapping; the snap's one-measure difference is honest but small; "Same red. Same letters." sits close to the panel tops.

## Scores
- Hook: 6 (big red crescendo, a worried face on the phone, green half-melody and "Wait for it." in frame 1; still a quiet image)
- Speed accuracy: 8 (one linear race mapping, documented dates and latencies, alert as a step function; unverified alert dates drive motion only)
- Snap impact: 5 (deliberately modest counterfactual; the 247-day long line carries the weight)
- Emotion: 6 (two lonely beans on hold is relatable; the payoff "There." lands, then the long line undercuts it)
- Originality: 7 (hold music as the latency metaphor, crescendo as escalation)
- Craft: 6 (clean bean cartoon, readable sheets; wide shot dense, snap panels plain)
- Honesty: 9 (no leaders, countries or flags; two on-screen numbers both sourced; AI gain kept to a day and labeled illustrative)
- Overall: 6.7
- Virality: 6% — the hold-music gag is instantly relatable and the wait-for-it promise helps retention, but the payoff is quiet and the snap intentionally small, so it is unlikely to break out from a small account.
