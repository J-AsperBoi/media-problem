Tier: animatic

# The Warning Memo

**Logline.** A mockumentary in the style of a constructivist poster. A green warning memo is carried from desk to desk inside a vast utility tower at night. It gets stamped RECEIVED, routed to the other floor, stamped WRONG FLOOR and filed in the basement, while the control room at the top of the tower never sees it. Unnamed staff give deadpan interview captions. Then the camera pulls out and the red crosses the grid in 90 seconds. The lights come back within hours, and the lasting fix takes 7 years. The camera drops back to the clerk, closer than before, and there is no joke this time.

- **Structure:** `mockumentary` (research/VIRAL_STRUCTURES.md #8)
- **Analog:** `quebec-1989` (research/analogs/quebec-1989.json). The file is `verified: false` at the top level, so only the two individually sourced endpoints go on screen.
- **Tags:** constructivist poster / library / organization / stop-start / handheld chase / anger / a green fragment
- **Diversity change:** the assigned tags (family theater, protagonist an institution) came back TOO SIMILAR to the-department-of-later (0.33). I changed **family to library** (the memo is filed and archived, and the records room is the punchline) and **protagonist to a green fragment** (the memo itself is the hero we follow). The assigned structure, analog, medium, camera, pace and emotion are unchanged. The re-check came back at 0.56, OK.

## Honesty staging note (important)
The analog marks the warning fragment's issue time (f1, about −24 h) as **unverified**. The memo's journey through the tower is therefore **staging, not timed data**. No clock runs while it moves, it carries no time, and the snap never puts a number on "how early". The film says only that the warning existed before the red (sourced qualitatively in s3) and was not routed into one control room's posture (the analog's framing of the missing step). The satire targets routing, stamps and floors. The staff are competent and sincere, and every caption describes a correct procedure. No utility name, no place names, no real people, and the threat is never named.

## Time mapping (one mapping, labeled "log time" on screen)
Film t < 13 is the memo's night (untimed staging, before t0). From t0 onward: **event seconds after t0, E = 10^((t − 13) / 1.2)**, for 13 ≤ t ≤ 23.2. Every 1.2 film seconds, 10× more real time passes. A log ruler at the bottom of the wide shot has word ticks only: second, minute, hour, day, month, year.

## Speed math
**Threat (red).** `threat.points`: extent 0 at t0, and 1.0 (the whole grid dark) at 0.025 h = 90 s. Only the endpoints are sourced, so rather than drawing a straight line I fit a logistic through them: a logistic that is 0.1% at E = 0 and 99.9% at E = 90 s (implemented directly in the scene, rescaled to run from 0 to 1). That gives r = ln(998 000) / 90 = 0.1535 /s, so the doubling time is 4.52 s. This is a fit, not data. On the log clock the red crosses the grid between t = 13 and t = 15.35. Every grid segment, town and tower window has a normalized distance d from the entry corner (upper left), and it goes red and then dark when d < extent.

**Restoration.** `threat.events`: "more than 9 h to restore 83%" (s3). restored(E) = 0.83 × (E − 90) / (32 400 − 90) from 90 s to 9 h, and then linear to 100% by 24 h. **The tail to 24 h is my assumption, and no number is shown for it.** A place is dark while d < extent and d < 1 − restored. The lights are back at t ≈ 18.4.

**Human aggregation (green).** There are five fragments from `solution.fragments`, placed around the grid and lit from the moment the wide shot appears, because they already existed: forecasters (f1), scientists (f2), engineers (f3), line crews (f4) and planners (f5, the lasting fix). They connect in a loop of five edges. The edge arrival times are `L.lognormalQuantile(q, median 759 h, p90 64 000 h)` at q = 0.1, 0.3, 0.5, 0.7, 0.9:

| edge | q | arrival | film t |
|---|---|---|---|
| engineers–line crews | 0.1 | 9.0 h (p10, sourced: 83% restored) | 18.41 |
| line crews–scientists | 0.3 | 124 h (modelled) | 19.78 |
| scientists–forecasters | 0.5 | 759 h (modelled median, NEVER shown) | 20.72 |
| forecasters–planners | 0.7 | 4 659 h (modelled) | 21.67 |
| planners–engineers | 0.9 | 64 000 h (p90, sourced: series compensation done 1996, about 7 years) | 23.03 |

The median is the geometric mean of p10 and p90, a modelling assumption stated in the analog. It appears only as the spacing of the middle arrivals and is never shown on screen. When the ring closes, green bracing ("steel") appears on the transmission lines.

**AI counterfactual (illustrative).** From `ai_counterfactual`: about 1 h to route an existing forecast, together with the known vulnerability, into one control room's operating posture. That is a short synthesis task, far inside the ~17.4 h 50% METR time horizon (RATES.md). In the snap the AI lane shows only one change: the memo's path goes straight from intake to CONTROL and arrives **before the red**. That position is qualitative, because the issue time is unverified, so no number is attached. The red is drawn **unchanged** (still the whole grid, still 90 seconds), the caption reads "Operators still decide.", and the steel is still at "years" ("Steel still takes years."). The counterfactual is small and I did not inflate it. The snap lands through staging instead: a freeze, 0.4 s of silence, one stamp-hit, the true-proportion bar, and then the two lanes side by side.

**True-speed bar.** On a linear bar spanning the ~7 years, the 90-second red is 90 / (7.3 × 365 × 86 400) ≈ 3.9e-7 of the bar. At 900 px that is about 0.0004 px, so it is drawn as a 2 px hairline labeled "the dark: too thin to see".

## Numbers on screen (two, both sourced)
1. **"90 seconds"**: s2 and s5 ("less than a minute" in s1).
2. **"7 years"**: 1989 to 1996, completion of series compensation (s4).
No floor numbers, form numbers or clock times appear anywhere. The 9 h restoration appears only as the "hour" tick on the log ruler and as the lights coming back.

## Shot list (constructivist tower world, one camera, handheld jitter from L.noise)
| t | slate | camera | beat |
|---|---|---|---|
| 0–1.4 | SC1 CLOSE COLD OPEN | handheld on the clerk's face | Flash-forward: the clerk holds the green memo, and a huge red diagonal crosses the window behind. "The warning was already here." |
| 1.4–3.6 | SC2 CLOSE HANDHELD | zoom 10 on the intake desk | "Earlier." Stamp RECEIVED. Caption: "Stamped it received. Very promptly." (intake) |
| 3.6–6.2 | SC2 HANDHELD CHASE | pan along the floor | The memo is handed to routing. Stamp OTHER FLOOR. "Right form. Wrong floor. Standard." (routing) |
| 6.2–8.6 | SC2 CHASE DOWN | tilt down the stairwell | The other floor. Stamp WRONG FLOOR. "Not ours. We sent it down." |
| 8.6–10.8 | SC2 CHASE DOWN | basement | Records. Stamp FILED. "It's filed. It's extremely safe." |
| 10.8–13 | SC3 CRANE UP | zoom 10 → 1.6 | Interviewer card: "Who was it actually for?" The control room at the top of the tower comes into view, inbox empty. Comedy ends here. |
| 13–15.4 | SC3 WIDE | zoom 1.6 → 0.5 | The red runs the grid diagonally (logistic fit) and every window goes dark. |
| 15.4–23.2 | SC3 WIDE HOLD | slow drift | "The grid fell / in 90 seconds." The lights come back (hour); green edges close; steel. "The lasting fix / took 7 years." |
| 23.2–25.6 | SC4 DOLLY IN | 0.5 → 16 (closer than SC2's 10) | Back to the intake clerk, no joke: "It reached every desk but one." |
| 25.6–28.4 | SC4 HOLD | | "We slowed it down / so you could see it." |
| 28.4–36.2 | SC5 SNAP | flat poster | Freeze + stamp-hit + silence. True-proportion bar, then two lanes: "As it happened" (the zigzag down to FILED) vs "AI-routed warning (illustrative)" (straight to CONTROL, before the red; red unchanged; steel still years). |
| 36.2–38.6 | SC6 EXTREME CLOSE | zoom 26 on the hands and memo | The memo stamped ROUTED, in green. "This is the bottleneck." |
| 38.6–42.6 | END | | L.endCard, 4 s |

**Zoom cycles.** Cycle 1: IN 1.4–10.8 (zoom 10) → OUT 10.8–15.4 (to 0.5) → IN+ 23.2–25.6 (zoom 16). Cycle 2: the snap as a flat pull-back, then IN++ 36.2 (zoom 26 on the hands).

## 3D translation note
- **Tower:** a cutaway concrete skyscraper in the constructivist style, with slanted red-free gray planes, black steel diagonals and cream paper textures. Each floor is a lit stage with desks and filing cabinets. The mockumentary crew is implied by a handheld 35 mm lens at desk height, with slight breathing and whip-pans between desks.
- **Chase:** the camera follows the green paper hand to hand and then drops down the stairwell with a wire-cam feel (fast, 3 m/s, easing into each stop). Each stamp is a hard stop with a two-frame shake.
- **Pull-out:** one continuous crane and drone rise from a single floor to the whole tower, then to the grid across the snow: long lines on pylons in bold diagonal compositions. The red is emissive light racing along the conductors, and each town's glow goes out as it passes.
- **Return:** a slow 85 mm dolly into the clerk's face, shallow depth of field, the office lights back on behind them.
- **What gets richer in 3D:** the real vertical scale of the organization (the control room genuinely out of reach at the top), volumetric night, and the paper memo as a physical object.

## Copy variants
- "The warning was already here."
- "Right form. Wrong floor."
- "It reached every desk but one."
- "Filed. Extremely safe."
- "Civilization has a routing problem."
- "The answer was in the building."

## Scores
Render: output/the-warning-memo/the-warning-memo.mp4, 44.0 s (DUR 44), confirmed with ffprobe.
- Hook: 7 (frame 1: a face, the green memo, a big red grid through the window, one line of text)
- Speed accuracy: 8 (logistic fit through the sourced endpoints, lognormal edges, one log mapping; the memo journey is untimed staging, as it should be)
- Snap impact: 6 (the counterfactual is small and not inflated; the lanes are clear but dense for a phone)
- Emotion: 6 (the pivot from stamps to the dark tower works; the sad return is small)
- Originality: 7 (constructivist tower cutaway plus a paper-trail chase)
- Craft: 6 (the stairwell transitions are brief empty frames; the grid towns are simple)
- Honesty: 9
Overall: 7.0
Virality: 8% — the stamp gags and the "Right form. Wrong floor." caption are relatable office humor that could travel, but the data-heavy second half and the poster abstraction will lose most casual viewers before the snap.
