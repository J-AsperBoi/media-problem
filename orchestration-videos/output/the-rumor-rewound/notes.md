# The Rumor, Rewound

Tier: animatic
Slug: the-rumor-rewound
Structure: reverse-chronology (research/VIRAL_STRUCTURES.md #13)
Analog: false-news-2018 (Vosoughi, Roy & Aral, Science 2018; Hoaxy fact-check lag, Shao et al. 2016)
DUR: 36 s, 1080x1920, 30 fps

## Logline
A rumor rewound from 1,500 people back to the first thumb. Frame 1 is hour ten: one face lit red, everyone reached. Then the chalk tree is erased backward, share by share, with a handheld camera chasing the red edge home through the reshare tree, pulling out to see the whole audience un-spread, and dropping in on the first thumb. Along the way we see who already knew the truth and how far off their correction still was.

Fourth film on this analog (after fifteen-hundred, the-two-feeds, the-fact-check). This one is the rewind: the red is the protagonist, chalk is the medium, and the erasing is the story.

## Diversity check
Assigned tags (neon arcade, sprint) came back TOO SIMILAR to fifteen-hundred (distance 0.33: same medium, scale, pace, protagonist, camera, analog). Per the coordinator, structure and analog kept; changed **medium neon arcade -> chalkboard** (the rewind becomes literal erasing) and **pace sprint -> stop-start** (the reverse-chronology template's own pace: rewind runs, dead stops, runs). New check: OK, nearest fifteen-hundred 0.56, the-fact-check 0.67.

## Time mapping (one mapping per section, both linear)
- Rewind (t 2.0 to 15.2 s): **1 second = 1 hour, played backward.** h = 10 - (t - 2.0) until h = 5 at t 7.0; dead stop (the clock stops) 7.0 to 10.2; then h = 5 - (t - 10.2) to h = 0 at t 15.2. Holds are freezes, not time passing.
- Cold open (t 0 to 2.0) is hour 10 on the same timeline, held.
- Snap (t 20.3 to 26.3): **1 second = 4 hours, forward**, h = 4 (t - 20.3), covering 0 to 24 h, same mapping in both panels.
- The on-screen clock is a chalk 12-hour dial with ticks and no numerals; its hand is the hour.

## Speed math
**Threat (red).** The analog sources only endpoints (1 person at 0 h, 1,500 at ~10 h, s2). Reusing the-fact-check's fit, per director's notes: L.logistic with s0 = 1/1500 and share(10 h) = 0.99 gives r = ln(0.99 (1 - s0) / (0.01 s0)) / 10 = 1.19 /h, **doubling 0.58 h (a fit, not a sourced number)**. People reached: 3 at 1 h, 11 at 2 h, 109 at 4 h, 307 at 5 h, 687 at 6 h, 1,352 at 8 h, 1,485 at 10 h. Person of rank i turns red at the inverse logistic of (i + 0.5)/1500, along a random preferential-attachment reshare tree (parent = floor(u^2.2 * i)). Red chalk edges are the reshares (lines = real communication).
Layout (staging, not data): radial; person i sits at radius R sqrt(i/N) (so the red front is a disc whose area tracks the count), angle near its parent's.

**Green: people who already knew (f2, ready at 0 h).** 14 knowers placed among the 1,500 (the count is staging, stated here). Each knower k owns the nearest nodes (Voronoi) and has a correction lag lag_k = L.lognormalQuantile(q_k, 13, 20) h (Hoaxy: fact-check sharing lags misinformation by ~13 h, typically 10 to 20 h; p90 = 20 as in the analog file), q_k = (k + 0.5)/14 shuffled. Values: 7.1, 8.6, 9.5, 10.4, 11.1, 11.9, 12.6, 13.4, 14.2, 15.2, 16.3, 17.7, 19.7, 23.8 h (the lowest is a bit under the authors' 10 h floor; lognormal tail, stated). Around each knower a green chalk arc fills as h / lag_k: full circle = their correction starts moving. At hour 10 most arcs are 40 to 90% drawn; at hour 5 (the dead stop) they are well under half.
Correction reach follows Hoaxy's own measure (a lagged cross-correlation: the correction curve is the claim curve shifted by the lag): person i in knower k's region is reached by the correction at hC_i = hR_i + lag_k. Reached people keep their red core and gain a green ring. **Speed is not belief**: reaching someone is not persuading them.

**Timeline ruler** (dead stop, wide): 0 to 30 h (the 23.8 h tick is inside), red bar to the current hour, ghost red to hour 10 (where we came from), green ticks at the 14 lags, the median labeled.

**AI counterfactual (illustrative).** ai_counterfactual.aggregation_median = 1 h (matching a circulating claim to an existing verified ruling and routing it is a well-under-1-hour expert task, far inside the ~17.4 h METR 50% horizon in RATES.md; cost ~40x/yr cheaper makes screening affordable). Same spread shape scaled: lag_ai_k = L.lognormalQuantile(q_k, 1, 20/13) = 0.55 to 1.83 h. hC_ai_i = hR_i + lag_ai_k. The red still reaches everyone in both panels (we do not claim AI stops it); in the AI panel the green rings trail the red front by about an hour instead of ~13.

## Numbers on screen (two, both sourced in the analog)
- "1,500 people" (s2, the audience benchmark)
- "13 hours" (s3, fact-check lag median; card + ruler label)
No other numerals: the clock has no digits; snap panels say "as it happened" / "AI-routed (illustrative)". The concept's "13 vs 1 h" snap line is shown graphically (rings trailing by ~13 h vs ~1 h) rather than as a third and fourth number.

## Shot list and camera
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-2.0 | SC0 COLD OPEN, CLOSE | zoom 40 on a hour-10 leaf, handheld | one bean face lit red (reached at ~9.6 h), phone red; a knower beside him holding green, arc unfinished. "1,500 people have it." |
| 2.0-7.0 | SC1 HANDHELD CHASE BACKWARD / PULL OUT | zoom 42 -> 1, rotation drifts to 0.3 rad (vertigo), camera chases the red back along his ancestry path | rewind 10 -> 5 h: red edges retract into parents, faces go gray. "Rewind." / "Back through every share." |
| 7.0-10.2 | SC2 WIDE, DEAD STOP | locked, slight float | hour 5. Green knowers light up with arcs; timeline ruler. "They already knew." / "Correction ping: 13 hours." |
| 10.2-15.2 | SC3 CHASE IN | wide -> zoom 40 on the root, rotation unwinds | rewind 5 -> 0 h: tree collapses to one node. "Back to the first thumb." |
| 15.2-17.0 | SC4 CLOSE, hold | zoom 40 (closer than 22) | the first thumb over the phone, one red spark. "One thumb." |
| 17.0-19.4 | CARD | | "We slowed it down so you could see it." |
| 19.4-20.0 | FREEZE | black, silence | one sharp hit at 19.9 |
| 20.0-28.6 | SC5 SNAP, two panels (960 wide) | locked | forward 0-24 h at 1 s = 4 h: "as it happened" vs "AI-routed (illustrative)". "Speed is not belief." |
| 28.6-31.6 | SC6 EXTREME CLOSE | zoom 62-74 on the first thumb | closer than ever: the thumb, the red spark, the nearest knower's green hand at frame edge. "This is the bottleneck." |
| 31.6-36.0 | END | | L.endCard, 4.4 s |
Zoom cycle: IN 0-2 (zoom 40-42) -> OUT 2-7 (to the whole audience) -> IN+ 10.2-17.2 (zoom 40-44) -> snap wide -> IN++ 28.6-31.6 (zoom 62-74).

## 3D translation note
A real slate chalkboard the size of a wall, shot handheld on a 35 mm at eye level, inches from the chalk. Frame 1: a chalk-drawn face with red chalk dust glowing, the camera breathing. The rewind is the chalk un-drawing itself: red dust lifting off the board and flying back up the lines toward the parent, the camera running backward with it (Steadicam operator walking backward, slight roll). The pull-out is a crane back to 4 m from the board with a slow 15-degree roll: the whole tree on one wall, 1,500 marks. Dead stop: dust hangs in the air. The drop to the first thumb is a push-in to a 100 mm macro on a single chalk thumb, grain of the slate visible. Richer in 3D: floating chalk dust as the rewind particle, raking light across the slate, depth of field on the tree.

## Copy variants
- "1,500 people have it." (used, cold open)
- "Rewind." (used)
- "Back through every share." (used)
- "They already knew." (used)
- "Correction ping: 13 hours." (used)
- "Back to the first thumb." (used)
- "One thumb." (used)
- "Speed is not belief." (used, snap)
- unused: "Undo send.", "Everyone got it. Nobody got the fix.", "The patch was 13 hours out.", "Erase it back to one."

## Tags
{"slug":"the-rumor-rewound","structure":"reverse-chronology","medium":"chalkboard","family":"language","scale":"nation","pace":"stop-start","emotion":"vertigo","protagonist":"the red itself","camera":"handheld chase","analog":"false-news-2018"}

## Build log
- Preview 1: cold open too crowded (neighbours on top of the two faces), cards crossfading on top of each other, snap too fast to read the ~13 h vs ~1 h trailing. Fixed: cleared radius around the two close-up pairs (staging), cold open zoom 22 -> 40, cards no longer overlap, snap slowed to 1 s = 4 h over 0-24 h (DUR 35 -> 36).
- Preview 2: clean. Note the human panel shows green rings from ~h 10 onward because early-reached people get the correction early (hR + lag); that is the Hoaxy shifted-curve model, not an error. The AI panel's rings trail the red front by about an hour.

## Scores
- Hook: 7 (red-lit face, green fragment and unfinished arc, "1,500 people have it." in frame 1; chalk beans read instantly, but the stakes are abstract)
- Speed accuracy: 8 (fitted logistic from sourced endpoints, per-knower Hoaxy lognormal lags, same model in rewind, ruler and snap; layout and knower count are staging, stated)
- Snap impact: 6 (staged freeze + hit, two wide panels, but by h 12 both panels look green-heavy; the difference lives in the first ~2.5 s of the replay)
- Emotion: 6 (vertigo from the handheld pull-out with roll works; the first-thumb ending is quiet rather than moving)
- Originality: 7 (rewind as erasing on a chalkboard; the red is the protagonist retreating home)
- Craft: 7 (clean chalk look, clear cards, readable panels; tree at wide is a dense red blob, rewind pull-out frame is a red scribble for ~1 s)
- Honesty: 9 (two sourced numbers, AI labeled illustrative, red still reaches everyone in the AI panel, "Speed is not belief" on screen, topic never named)
Overall: 7.1
Virality: 7% - the rewind gimmick and cute chalk faces give a decent hook, but it is the fourth film on this analog and the payoff is a data panel rather than a feeling, so it most likely stalls well under 100k from a small account.
