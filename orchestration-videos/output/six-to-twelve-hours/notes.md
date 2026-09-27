# Six to Twelve Hours

Tier: animatic
Slug: six-to-twelve-hours
Structure: two-phones (research/VIRAL_STRUCTURES.md #17)
Analog: cuban-missile-1962
Tags: medium text-only typography · family language · scale between nations · pace stop-start · camera over-the-shoulder · emotion dread · protagonist an institution

## Logline
A deliberate anachronism: 1962 rendered as a modern chat. Two identical gray phones face each other across a vast gray gulf. Each one's contact is called "Them". Each one has the same green words typed in the box: "We both step back." One side finally sends its long letter, and the typing indicator on the other phone runs for half a day while the red alert strip at the top of both screens stays lit. Nearly 12 hours to receive and decode. The deal lands on day 12. The direct line that fixed the pipe was agreed on day 247.

Both sides are gray, unnamed and identical. There are no leaders, no countries, no flags and no party cues. The red is never named. It is an alert strip and a glow.

## Time mapping (one stated mapping)
Race: **1 film second = 6 story hours** while the clock runs. Pace is stop-start: at three message events the story clock **stops** (the status-bar clock freezes) for about 1 s, then resumes at the same rate. Story time never runs at any other rate.
H = story hours after day 8 (days after the analog's t0 of Oct 16, 1962).
| film t | story | state |
|---|---|---|
| 0.0-1.4 | H 74 (day 11) | COLD OPEN flash-forward, frozen: letter delivered, second offer in transit, red at its peak flash |
| 1.4-9.8 | H -2.4 -> 48 | run (the alert step lands at H 0, t 1.8) |
| 9.8-10.8 | H 48 | STOP: the long letter is sent (day 10) |
| 10.8-12.8 | H 48 -> 60 | run: letter crosses the gulf, 12 h = 2 s |
| 12.8-13.8 | H 60 | STOP: delivered |
| 13.8-16.8 | H 60 -> 78 | run: second offer sent H 72 (day 11), 6 h = 1 s in transit; red flash at H 74 |
| 16.8-17.6 | H 78 | STOP: delivered |
| 17.6-20.8 | H 78 -> 97.2 | run: private line at H 84 (day 11.5); deal at H 96 (day 12, t 20.6) |
| 20.8-24.0 | H 97.2 | dead stop, then "We slowed it down so you could see it." |

The status bar has a small clock with no numerals: the hour hand turns once per 12 story hours (2 film s), and the minute hand spins as a faint disc while running. A row of day tallies (no numerals) counts days.

Snap: (a) two chat panels at the **same** mapping (1 s = 6 h): the letter's decode bar fills in 2 s as it was, and in about 0.03 s in the illustrative lane. (b) The whole record, day 0 to 260, swept in 1.6 s (about 1 s = 160 days, true proportional), so the 12-day crisis is a sliver next to the 247-day fix.

## Speed math
**Threat (red = alert level, ordinal).** From analog threat.points: extent 0.5 at day 6 and 0.75 at day 8, still 0.75 at day 11. Alert levels are discrete, so the 4-segment strip at the top of both phones lights by extent / 0.25 as a step function: 2 segments before day 8 and 3 from day 8 (H 0, t 1.8, with a hit). The red edge glow of each screen and the red haze in the gulf scale with extent. The day-11 event (U-2) is a red flash with no level change, placed at H 74, inside day 11 (the analog gives the day, not the hour). These points are `verified: false`, so they drive motion only. No alert numbers or dates are on screen. The de-escalation date is unconfirmed, so the strip never steps down in the race. In the record strip the red fades out gradually after day 12, with no date.

**Human aggregation (green).** Documented fragments (analog solution.fragments). Latency comes from message_latency_hours (s4): typical ~6 h, and the ~3,000-word settlement letter took nearly 12 h to receive and decode.
| fragment | ready (day) | H | on screen | arrives |
|---|---|---|---|---|
| f1 the trade already in hand (A's typed, unsent draft) | 0 | before film | green draft in A's input box the whole race | sent at H 96 (deal) |
| f2 first settlement letter (B) | 10 | 48 | long green bubble, "Sent"; green line crawls across the gulf | H 60 (12 h), "Delivered" |
| f3 second, public offer (B) | 11 | 72 | "Ours out. Yours out too."; A shows "Them is typing (decoding)" | H 78 (typical 6 h) |
| f4 private back channel | 11.5 | 84 | green banner "private line: yes, quietly." (in person, no wire latency) | H 84 |
| deal assembles (aggregation median) | 12 | 96 | A's draft finally sent; green bridge across the gulf | H 96 |
| f5 direct link agreed (aggregation p90) | 247 | — | record strip | — |

Variance: in the record strip each lane's green curve is L.lognormalCDF(day, median, p90) from the analog aggregation block (median 12, p10 10, p90 247). The analog says this distribution comes from dated events, not measurement, so it is used only for the curve's shape.

**AI counterfactual (illustrative, deliberately modest).** From ai_counterfactual. Only transport and translation speed up. Translating and summarizing a ~3,000-word letter is a minutes-scale task, far inside the ~17.4 h 50% task horizon (RATES.md, METR). The assumption is the same exchanges with ~12 h less latency per round, so the deal assembles on day 11 instead of day 12. Lane 2 of the record uses median 11 and the same p90 of 247: the film does not claim AI would have built the direct line sooner. In the chat panels, "minutes" is taken as 10 min = 0.028 film s at 1 s = 6 h. AI never touches a decision. The caption reads "People still read. People decide."

**Numbers on screen (two, both from sources with no `verified:false` flag):** "12 hours" (s4) and "247 days" (s5, agreement June 20, 1963 = day 247). The 12 hours appears twice: in the race ("Nearly 12 hours to decode.") and in the snap panel ("Delivered · 12 hours").

## Shot list (DUR 39 s)
| t | slate | camera | beat |
|---|---|---|---|
| 0.0-1.4 | SC1 OTS CLOSE, COLD OPEN (later) | over A's right shoulder, zoom 4.9 | red flash on the strip, "Them is typing (decoding)", green draft. Card: "Still typing. For hours." |
| 1.4-5.0 | SC2 OTS CLOSE | 4.73 -> 5.0 slow push | cut back to day 8: the alert step (hit). "The way out is typed." / "Typed. Not sent." |
| 5.0-8.6 | SC3 PULL OUT | 5.0 -> 0.92, log-zoom ease | OUT: the second phone, upside down and facing us across the gulf, identical. "Same words. Both screens." |
| 8.6-12.8 | SC4 WIDE, THE GULF | 0.92 -> 0.97 hold | STOP: "Sent." Letter crawls the gulf for 2 s: "Nearly 12 hours to decode." |
| 12.8-14.8 | SC5 DOLLY IN | 0.97 -> 5.8 | IN+: back over A's shoulder, closer; letter delivered |
| 14.8-20.8 | SC6 OTS CLOSER | 5.8 -> 6.2 | "Alarms are instant." Second offer decoding, red flash, stop, private line, "Same words. Typed all along." Deal at t 20.6 |
| 20.8-24.0 | SC7 FREEZE | hold | dead stop (silence) -> "We slowed it down so you could see it." |
| 24.0-27.6 | SC8 SNAP: TWO CHATS | full-frame sheet | freeze, one hit. "as it was" bar 2 s -> "Delivered · 12 hours"; "frontier AI translating / illustrative" instant -> "Delivered · minutes". "People still read. People decide." |
| 27.6-30.4 | SC9 THE WHOLE RECORD | full-frame sheet | two lanes, playhead day 0 -> 260; shared line at 247; "The direct line took 247 days." |
| 30.4-35.0 | SC10 OTS CLOSEST | 6.6 -> 7.1 on A's green sent bubble | IN++. "The words were never the problem." -> "This is the bottleneck." |
| 35.0-39.0 | END | — | L.endCard, 4 s |

Zoom cycles: IN (4.9-5.0, 0-5) -> OUT (0.92, 5-12.8) -> IN+ (5.8-6.2, 12.8-24) -> [snap sheets] -> IN++ (6.6-7.1, 30.4-35).

## 3D translation note
Two real phones on two plain gray desks, set impossibly far apart on a dark gray plain, like a salt flat at dusk. The gulf floor is covered in faint engraved words (encode, wire, relay, decode, translate). Start with a 50 mm over-the-shoulder shot at seated height behind a figure whose silhouette is made of lettering. The screen is the only light, with red practical light from the alert strip. The pull-out is a slow 4 s crane back and up (no shake) until the second phone appears, upside down from our view, lit identically. The letter is a thin ribbon of green glyphs crawling along the floor across the gulf, at its real slow pace. The dolly in goes back over the same shoulder on an 85 mm lens, closer than the start. The last shot is a 100 mm macro on the green bubble and the word "Sent". Richer in 3D: the scale of the gulf, the reflection of red on glass, and the stillness during stops, when nothing moves except a blinking cursor.

## Copy variants
- "Still typing. For hours." (hook)
- "The way out is typed."
- "Same words. Both screens."
- "Nearly 12 hours to decode."
- "Alarms are instant."
- "Same words. Typed all along."
- "The words were never the problem."
- Alternates: "Read receipts, 1962." / "Delivered: tomorrow." / "Civilization has lag." / "Both sides called the other 'Them'."

## Diversity
`node tools/diversity.js` on the assigned tags: OK, distinct enough (nearest: the-last-thirteen-days, the-two-feeds, the-hold-music, each at distance 0.56). No changes were needed.

## Build log
- Preview 1: the deal bubble drew as a solid blurred green bar (its shadow sat under a translucent fill), and the deal's alpha was 0 because the clock stopped exactly at H 96. Fixes: the bubble now has a dark fill with a glow on the stroke only, and the last run extends to H 97.2 at the same rate (dead stop from 20.8). The closest shot was reframed to 6.6-7.1 so the green sent bubble and "Sent" sit inside the safe zone. The neck of the silhouette was joined, and the cold-open card was moved off the letter.
- Final: 39.0 s (ffprobe), 1080x1920, 30 fps.

## Scores
- Hook: 8 (frame 1 is a red-lit chat with "Them is typing" and the green draft in the box; "Still typing. For hours." reads instantly)
- Speed accuracy: 8 (one mapping, 1 s = 6 h, with stops stated; the 12 h and 6 h latencies and the fragment days come from the analog; the alert steps are unverified and used for motion only; the lognormal lanes are derived, not measured)
- Snap impact: 6 (the counterfactual is honestly small; the staging (freeze, a bar that takes 2 s vs one that is instantly done, then 247 days) carries it, but the sheets are flat)
- Emotion: 7 (the symmetry of "Them"/"We both step back." on both screens lands; the dread comes from the red strip and the stops)
- Originality: 7 (the anachronism of a 1962 chat with 12-hour read receipts is fresh, though it shares the two-phone and typography grammar with the-two-feeds)
- Craft: 6 (the UI is legible, but the wide shot's phones are small, the snap sheets are plain, and the silhouettes are simple)
- Honesty: 9 (no leaders, countries or flags; the threat is never named; only "12 hours" and "247 days" are on screen; the AI helps only with translation and is labeled illustrative; "People decide.")
- Overall: 7.3
- Virality: 8% (the chat-UI anachronism is instantly recognizable and share-worthy, but the history-plus-typography format and its subtle payoff limit reach from a small account)
