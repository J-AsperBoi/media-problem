# The Last Thirteen Days

Tier: animatic
Slug: the-last-thirteen-days
Structure: ticking-clock (research/VIRAL_STRUCTURES.md #1)
Analog: cuban-missile-1962
Tags: medium blueprint · family machine · scale between nations · pace stop-start · camera locked-off close-up with a single pull-out · emotion dread · protagonist one person

## Logline
A translator at a gray desk. Her desk clock spins; alert lamps on the blueprint wall step up in red. The pieces of a settlement already exist, but each one has to crawl through a slow machine (encode, wire, decode, translate) before it reaches her hands. It lands after the closest day. Then the snap: frontier AI translating would have saved hours per letter (about a day, illustrative), and the direct line that fixed the pipe took 247 days.

Two sides are two identical gray desks. No leaders, no countries, no flags, no party cues. The red is never named.

## Time mapping (one stated mapping for the race)
Race, t = 1 s to 17 s: **1 film second = 6 hours**, linear. day(t) = 8 + (t - 1) / 4, so day 8 at t = 1 and day 12 at t = 17 (days after Oct 16, 1962 = t0 of the analog). Frame 0 is day 7.75.
- Desk clock: 12-hour face; the hour hand turns once every 2 film seconds (12 h). The minute hand is a blur (6 turns a second) and is drawn as a faint disc.
- Wall calendar: 13 gray day boxes, crossed off as each day passes (tally, no numerals).

Snap: (a) two clocks at the SAME mapping (1 s = 6 h); (b) the whole record, day 0 to day 260, replayed at a uniform 1 s ~ 100 days so the 12-day crisis is a sliver next to the 247-day fix. Stated here; on screen it reads as "the whole record, to scale".

## Speed math
**Threat (red = alert level, ordinal).** From analog threat.points: extent 0.5 at day 6, 0.75 at day 8, still 0.75 at day 11 (closest point). Alert levels are discrete steps, so the wall meter lights 4 segments by extent (0.25 each) as a step function, not a ramp: 2 lit before day 8, 3 lit from day 8 (t = 1.0, the hook's first action). The day-11 U-2 event (t = 13) is a red flash with no level change, as in the data. These dates are standard record but flagged `verified: false` in the analog, so they drive motion only; no alert numbers appear on screen. De-escalation date is unconfirmed, so the meter never steps down on screen; in the full-record strip the red fades out gradually after day 12 without a date.

**Human aggregation (green).** Documented fragments (analog solution.fragments), with the documented latency (message_latency_hours, s4: typical ~6 h, the ~3,000-word settlement letter nearly 12 h):
| fragment | ready (day) | film t | how it travels | arrives t |
|---|---|---|---|---|
| f1 obsolete missiles that could be traded (folder on her desk) | 0 | before frame 1 | already there, unconnected | — |
| f2 first settlement letter | 10 | 9.0 | through the machine, 12 h | 11.0 |
| f3 second, public offer | 11 | 13.0 | through the machine, typical 6 h | 14.0 |
| f4 back channel assurance | 11.5 | 15.0 | slid across the desk in person (bypasses the machine) | 15.0 |
| deal assembles (aggregation median) | 12 | 17.0 | four pieces click into one | 17.0 |
| f5 direct link agreed (aggregation p90) | 247 | snap strip | — | — |

Variance: in the full-record strip the green "assembled" curve is L.lognormalCDF(day, median 12, p90 247) from the analog aggregation block: half assembled by day 12, the structural fix at the far tail (247). The p10 (day 10) matches the first letter. The analog notes that this distribution is derived from dated events, not measured; it is used only as the curve's shape.

**AI counterfactual (illustrative, deliberately modest).** From ai_counterfactual: only transport and translation speed up. Translating and summarizing a ~3,000-word letter is a minutes-scale task, far inside the ~17.4 h 50% task horizon (RATES.md, METR). Same exchanges, ~12 h less latency per round, so the deal assembles on day 11 instead of day 12. On screen: the left clock turns a full 12 h while the letter decodes; the right clock (labeled illustrative) moves a sliver (taken as ~10 min = 0.03 film s at the same mapping). In the full-record strip the illustrative lane's deal dot sits one day-tick earlier, shown in a loupe because at true scale it is barely visible. The 247-day fix is drawn as a shared line across both lanes: the counterfactual does not claim AI would have built it sooner. AI never touches a decision; people still read, decide and sign.

**Numbers on screen (two, both from sources without a `verified:false` flag):** "12 hours" (s4, nearly 12 hours to receive and decode the settlement letter) and "247 days" (s5, direct-link agreement June 20, 1963 = day 247). Day 11 vs 12 is shown as tick positions, not numerals.

## Shot list (DUR 38 s)
| t | shot / slate | camera | beat |
|---|---|---|---|
| 0.0-5.6 | SC1 CLOSE LOCKED-OFF | locked at zoom 2.6 on her desk: face, clock, green folder, red meter above | HOOK: "The answer is in the mail." Meter steps up at t 1.0 (hit). "Alarms are instant. Letters aren't." |
| 5.6-8.6 | SC2 PULL-OUT | the single pull-out: zoom 2.6 -> 1.0, ease in-out, 3 s | reveal the wall: the other gray desk far up top, the long machine between (encode, wire, decode, translate), calendar |
| 8.6-13.4 | SC3 WIDE | hold | "Two desks. One slow machine." f2 leaves at t 9 and crawls 2 s. "Nearly 12 hours to decode." Red flash t 13 (closest day). |
| 13.4-16.0 | SC4 DOLLY IN | 1.0 -> 3.4 onto her hands, closer than frame 1 | "The closest day came first." f3 drops at 14, f4 slides in at 15 |
| 16.0-18.6 | SC4 CLOSER | hold 3.4 | deal clicks at t 17 (green whole). Dead stop 17.2-18.6: frozen clock, silence |
| 18.6-21.2 | SC5 CARD | hold | "We slowed it down so you could see it." |
| 21.2-24.6 | SC6 INSERT: TWO CLOCKS | full-frame sheet, locked | the snap: freeze, silence, one hit. Left: "as it was" hand turns 12 h. Right: "frontier AI translating" hand barely moves; labeled illustrative |
| 24.6-29.2 | SC7 THE WHOLE RECORD | full-frame sheet, slow push in on the loupe | two lanes, playhead day 0 to 260 in 2.5 s; red sliver; deal dots; loupe shows one tick sooner; "The direct line took 247 days." |
| 29.2-31.4 | SC8 CLOSEST | full-frame fade back into world at zoom 4.2 on her face + green in her hands | return, closer than ever |
| 31.4-33.8 | SC8 | hold | "This is the bottleneck." |
| 33.8-38.0 | END | — | L.endCard, 4.2 s |

Zoom cycle: IN (2.6, 0-5.6) -> OUT (1.0, 5.6-13.4) -> IN+ (3.4, 13.4-18.6) -> [snap inserts] -> IN++ (4.2, 29.2-33.8). One pull-out only, per the assigned camera.

## 3D translation note
Locked-off 85 mm at seated eye height across the desk, shallow depth of field on her face with the clock in the foreground; the red lamps are practical lights on the wall behind her. The single pull-out is a slow dolly back and crane up (about 3 s, no shake) through the office wall into a cutaway "blueprint" set: two identical gray desks in one tall, dim room, joined by a huge brass-and-paper machine of rollers, cipher wheels and pneumatic tubes, with the letter a small green capsule crawling through it. Dolly in on a 100 mm lens to her hands; last shot a 135 mm macro of the green piece and her eyes. Snap inserts are drafting-table overlays, top-down, with a real clock hand. Richer in 3D: the physical weight of the machine, dust in the lamp light, the silence of the freeze.

## Copy variants
- The answer is in the mail.
- Alarms are instant. Letters aren't.
- Two desks. One slow machine.
- Nearly 12 hours to decode.
- The closest day came first.
- Ping: twelve hours. (unused, too gamey)
- The fix for the pipe took longer than the crisis.

## Diversity check
`node tools/diversity.js` -> OK: distinct enough (nearest two-days, distance 1.00). No changes needed.

## Build log
- Preview 1: stick legs showed through the thin desk, red wall wash overwhelmed the close-up, green pieces too small for the thumbnail. Fixed: desk modesty panels, wash cut to 0.05 + 0.13 x extent (meter stays the main red), pieces 18 -> 24 world px. Preview 2 clean.
- Render: 38.0 s (ffprobe), matches DUR.
- Known weaknesses: the snap's full-record strip is small type on a phone; the day-11 vs day-12 difference only reads in the loupe (honest, but low impact); "The closest day came first." briefly overlaps a station label during the dolly.

## Scores
- Hook: 6 (face, green piece, red meter and a clear line at frame 1, but a stick figure at a desk is a quiet thumbnail)
- Speed accuracy: 8 (one linear race mapping, documented dates and latencies, alert as a step function; alert dates are flagged unverified in the analog and drive motion only)
- Snap impact: 5 (deliberately modest counterfactual; the clock contrast lands, the 247-day line carries the weight)
- Emotion: 6
- Originality: 7 (blueprint message machine between two gray desks)
- Craft: 6
- Honesty: 9 (no leaders, countries, or flags; AI only carries and translates; the 247-day fix not credited to AI; two numbers, both sourced)
- Overall: 6.7
- Virality: 5% — historically grounded and restrained, but the modest snap and small-type record strip give little shareable payoff for a cold audience.
