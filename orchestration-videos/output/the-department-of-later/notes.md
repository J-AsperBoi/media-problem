# The Department of Later

Tier: animatic
Slug: the-department-of-later
Structure: mockumentary (research/VIRAL_STRUCTURES.md #8)
Analog: gfc-2008 (research/analogs/gfc-2008.json)
DUR: 40 s, 1080x1920, 30 fps

## Logline
A mockumentary crew films over one bean's shoulder in a ministry meeting room: it holds a green sticky note, the red on the wall TV creeps up, and everyone around the table holds a green note too. Nobody reads anyone else's. Deadpan talking heads ("I did send the memo.") give way to a dead stop when the red jumps. The camera cranes out of the window to a whole city of ministries, each with a green light, then drops back in closer to the first bean, now angry at the routing, not at anyone. Snap: the same days at true proportions, then the same pieces found sooner (illustrative).

## On-screen numbers
None. The concept's "Day 426 vs 220" is not shown: in the analog file the Oct 8 2008 date (f5) is marked verified: false, and the 220 is a counterfactual. Time is shown as tear-off calendar pages and progress bars only.

## Time mapping (one mapping)
Race: **1 film second = 30 days, linear, from t = 0 = Aug 9 2007 (analog t0)**. day(t) = 30 t. The clock runs to day 584 (Mar 2009 trough) at t = 19.47 s, then freezes. The clock never stops during the race; the stop-start pace is the data's own (18 months of drift, then one month's jump) plus the characters freezing.
Snap: the same days 0-584 replayed at true proportions in 2.0 s per panel (292 days/s), both panels identical.

## Speed math
**Threat (red).** extent(day) = piecewise-linear interpolation of `threat.points` (share of the eventual peak-to-trough fall in the monthly-average S&P 500; (0,0) and (67,0) from the file). Drawn as a red area chart on every TV (room, interviews, snap panels) and as the share of ministry windows turned red in the city wide (window i goes red when extent >= rank_i, ranks from distance to one corner plus noise; timing is all data). Key film times: the drift reaches 0.41 at day 403 (t = 13.43, Lehman month), then 0.73 at day 433 (t = 14.43): the one-second jump the film is built around.

**Human aggregation (green).** Seven fragments from `solution.fragments`. Per-fragment connection day = max(ready_at, Q_h(q)), Q_h = L.lognormalQuantile(q, median 426, p90 1077) (sigma = ln(1077/426)/1.2816 = 0.724), q = (i+0.5)/7:
| fragment | holder in film | q | Q_h | ready_at | connects day | film t |
|---|---|---|---|---|---|---|
| f2 liquidity (TAF) | bean across table (interview 1) | 0.071 | 148 | 125 | 148 | 4.93 |
| f3 ad-hoc rescue | remote ministry (interview 2) | 0.214 | 240 | 220 | 240 | 8.0 |
| f4 capital fund law | remote ministry | 0.357 | 327 | 421 | 421 | 14.03 |
| f5 coordinated cut | bean across table | 0.500 | 426 | 426 | 426 | 14.2 |
| f6 leaders' summit | bean across table | 0.643 | 555 | 464 | 555 | 18.5 |
| f1 diagnosis ("who owes whom") | the protagonist | 0.786 | 755 | -730 | 755 | never in window |
| f7 reform law | remote ministry (interview 3) | 0.929 | 1230 | 1077 | 1230 | never in window |
The max() floor almost never binds, i.e. the lognormal reproduces the real response dates (TAF 125, rescue 220, TARP 421, rate cut 426). Five of seven notes reach the board by the trough; the protagonist's note never does. Its label reflects the analog's counterfactual basis: the missing piece was a shared map of who was exposed to whom.

**AI counterfactual (illustrative, labeled on screen).** From `ai_counterfactual`: the coordinated response (f5) is assembled at day 220 instead of 426. Same lognormal shape, median 220: Q_ai(q) = Q_h(q) x 220/426. The two laws (f4, f7) keep their human dates because the file says political decisions still take human time. AI connects (days): f2 76, f3 124, f5 220, f6 287, protagonist 390, f4 421, f7 1077 (not in window). Red is identical in both panels: the counterfactual does not claim the crisis is avoided. On screen: "Same pieces. Found sooner." + "illustrative". Basis: RATES.md METR time horizon (~17.4 h tasks) per institution's books + ~40x/yr cost fall (see analog file).

## Shot list and camera
One world camera: the meeting room is drawn inside one tall window of the central ministry (room scale k = 0.06 of the city), so every zoom is continuous (log-zoom, center interpolated in 1/zoom so the focus point stays locked). No crossfades between scales.
| t | shot | camera | slate |
|---|---|---|---|
| 0.0-5.2 | SC1 over the shoulder: foreground bean's back, green note in hand, three beans across the table with their notes, TV with red top right, empty board top left. Card "Everyone here has a piece." Lower third "Office of Later". f2 note reaches the board at 4.93 | CLOSE OTS, slow push-in (z 16.7 -> 18) | SC1 CLOSE OTS |
| 5.2-10.0 | SC2 three talking heads (1.6 s each): "I did send the memo." / "It's on the agenda. Next quarter." / "We're scheduling the pre-meeting." Red TV behind each at the current day | CLOSE interview, locked-off | SC2 INTERVIEW |
| 10.0-13.43 | SC3 back to the room, invites and blah bubbles volleying; card "Agenda item one: the agenda." | MEDIUM OTS, slow drift | SC3 MEDIUM OTS |
| 13.43-14.9 | Red jumps (Lehman month). Everyone freezes. Card: "Did anyone read the others' notes?" Silence. | HOLD | SC3 HOLD |
| 14.9-18.3 | SC4 crane out through the window: the ministry, then a city of ministries, red spreading through windows, green lights scattered, lines trying to reach the room | CRANE UP / PULL OUT x17 | SC4 CRANE UP |
| 18.3-20.0 | wide hold. "Every office had a piece." / "No one had the map." | WIDE | SC4 WIDE |
| 20.0-21.8 | SC5 drop back into the same window, closer than SC1: note and hand fill the frame, room lights dimming, the bean turns in profile, angry | DROP DOWN x30 | SC5 DOLLY IN |
| 21.8-24.2 | "We slowed it down / so you could see it." | CLOSE hold | SC5 CLOSE |
| 24.2-31.2 | SC6 snap: black, one hit. Left panel "As it happened" replays days 0-584 in 2 s; right panel "Found sooner" (illustrative) replays the same in 2 s, thin green routing lines, protagonist's note lands | FLAT SPLIT | SC6 SNAP |
| 31.2-35.0 | SC7 extreme close on the protagonist's note, "who owes whom", trembling; "This is the bottleneck." | EXTREME CLOSE, push in | SC7 EXTREME CLOSE |
| 35.0-40.0 | end card (5 s), line "The bottleneck is us." | - | - |
Zoom cycles: IN (0-14.9) -> OUT (14.9-18.3) -> IN+ (20.0-24.2, closer than SC1); snap wide -> IN++ (31.2-35, closest).

## 3D translation note
- SC1: 35 mm over-the-shoulder at seated eye height, shoulder soft in the foreground, focus on the green note; the TV's red light is the only warm light in the room.
- SC2: 50 mm locked-off interview frames, flat office light, documentary handheld drift of a few pixels.
- SC4: the camera backs out through the window glass and cranes up a slow 4 s, 90 m, to a dusk city of identical stone ministries; red windows ripple across facades; green glints connected by thin light threads that fail mid-air.
- SC5: faster drop straight back into the same window, landing at 85 mm tighter than SC1; room practicals switching off one by one.
- SC7: 100 mm macro on the note and hand, rack focus from the red reflection on the note's edge to the handwriting.
Richer in 3D: soft sticky-note paper, felt table, the red chart light spilling across faces, parallax of the ministry rows.

## Copy
Used: "Everyone here has a piece." / "Office of Later" / "I did send the memo." / "It's on the agenda. Next quarter." / "We're scheduling the pre-meeting." / "Agenda item one: the agenda." / "Did anyone read the others' notes?" / "Every office had a piece." / "No one had the map." / "We slowed it down / so you could see it." / "As it happened" / "Found sooner" + "illustrative" / "Same pieces. Found sooner." / "This is the bottleneck." / end "The bottleneck is us."
Variants: "Reply-all is not a routing protocol." / "The patch was in someone's hand." / "Civilization has lag. Here is the meeting room." / "Out of office. Until the next crisis."

## Tags
{"slug":"the-department-of-later","structure":"mockumentary","medium":"bean cartoon","family":"theater","scale":"organization","pace":"stop-start","camera":"over-the-shoulder","emotion":"anger","protagonist":"an institution","analog":"gfc-2008"}

## Build notes
- Diversity check: OK, distinct enough (nearest two-days, distance 1.00).
