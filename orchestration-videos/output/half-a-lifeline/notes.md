# Half a Lifeline

Tier: animatic
Slug: half-a-lifeline
Structure: `two-phones` (research/VIRAL_STRUCTURES.md #17, man in a hole, stop-start)
Analog: `gfc-2008`
Medium: shadow puppet. A backlit paper screen (desaturated warm gray), black cut-out silhouettes on visible rods with pinned joints. Only the red (threat) and the green lifeline (solution fragments) are saturated. Phones are cut-outs whose screens are holes letting the gray lamp light through.

## Logline
Two phones in two dark offices on two continents, each held by an identical, unnamed shadow figure holding half of the same green lifeline. The red crosses the ocean on the real monthly market points; the call that would tie the halves together sits in a hold queue for months. Loss is only lights in windows going out.

Difference from the other two-phones films (`the-two-feeds`: one couch, typography; `six-to-twelve-hours`: missile crisis, typography): this one is shadow theatre across an ocean, the phones never show a message, only a queue; the thing that must join is a physical rope, cut in half by an ocean. Difference from the other gfc films: no pitches, no atlas, no drawer; two figures and one rope.

## Time mapping (one mapping)
- Race: film t = 2.2 s to 16.8 s <-> days 0 to 584 after the Aug 9 2007 fund freeze (t0, s1) to the Mar 2009 monthly-average trough. **1 s = 40 days, linear on average**, same as the-crash-call.
- Stop-start: the clock advances **one month at a time** (the data's own resolution: monthly averages). Month m = day/30.4; the displayed day is floor(m) plus an eased step over the first 30% of each month, so each month is a 0.23 s lurch followed by a 0.53 s hold. Average rate stays exactly 40 days/s; nothing is sped up or slowed within the race.
- Hook (0 to 1.8 s) is a labeled flash-forward ("LATER") to day 433 (Oct 2008 point), then a REWIND wipe to day 0.
- Snap: separate axis 0 to 1,100 days across two 920 px panels; one playhead sweeps both in 3.0 s (1 s = 367 days).

## Speed math
**Threat (red).** `threat.points` (s2, Shiller monthly S&P 500 averages, computed directly in the analog): extent = share of the eventual peak-to-trough fall, at mid-month. Piecewise linear between points (the analog has every month, so no fit is needed). Non-monotonic: the Dec 2007 and Apr-May 2008 rallies make the red recede and some lights come back on, as in the data.
- Map: two continents (one above, one below a dark ocean), 1,040 lit city windows. Each window gets a fixed rank = distance from an origin on the lower continent (plus jitter), sorted, rank = index / N. The red wash covers a window and its light goes out when extent(day) >= rank, so **dark windows = share of the fall**. Because the ranks run outward from one coast, the red crosses the ocean as the fall deepens.
- Office windows (close shots) use the same ranks for the skyline seen through the glass, and the red glow in the window rises to height = extent.

**Human aggregation (green lifelines).** Analog `solution.aggregation`: median 426, p10 125, p90 1,077 (derived from documented response dates; not verified). sigma = ln(1077/426)/1.2816 = 0.724. Thirteen office pairs across the ocean; stratified quantiles q = (i + 0.5)/13, arrival = `L.lognormalQuantile(q, 426, 1077)`:
118, 179, 227, 273, 320, 370, **426 (hero pair, q = 0.5)**, 490, 567, 665, 799, 1014, 1532 days.
A pair's two rope halves tie at its arrival day. Before the break (day 403, Lehman month) 6 of 13 are tied; by the trough (584) 9 of 13; the last two tie off-screen after the race. The hero pair is the median: its call connects at day 426, 23 days after the break, while its windows are already dark. Day 426 (verified:false) is never shown as a number; it appears only as a knot position on the snap axis.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 220 (the coordinated response assembled at the first large failure, day 220). Same quantiles and sigma, p90 = 220 x 1077/426 = 556:
61, 92, 117, 141, 165, 191, **220**, 253, 293, 343, 413, 524, 791.
Before the break: 10 of 13 tied (vs 6). Basis (analog + RATES.md): the missing fragment was a shared map of who was exposed to whom, spread across institutions' books; assembling it is document-heavy expert work inside the ~17.4 h METR 50% time horizon per institution, and the ~40x/year fall in AI cost at fixed capability (Epoch) makes running it across thousands of books cheap. The red curve is identical in both panels: the counterfactual does not assume the fall is avoided or softened. Political decisions still take human time; people still tie the knot (the IN++ shot is two human hands). On screen: "ROUTED - ILLUSTRATIVE" (48 px) and "Illustrative. People still decide."

**Numbers on screen:** none. The fall is shown as dark windows; the gap as knot positions; copy uses the word "half" only as the ratio 220/426 = 0.52 inside the illustrative panel caption.

## Shot list and camera (DUR 35 s)
| t (s) | slate | camera | beat / caption |
|---|---|---|---|
| 0.0-1.8 | SC1 OTS (flash-forward) | over figure A's shoulder, close | day 433: phone glowing ON HOLD, green half-rope in hand running out the window, red filling the window, skyline lights out. "Half a lifeline. On hold." tag "LATER" |
| 1.8-2.2 | wipe | | "REWIND" |
| 2.2-6.6 | SC2 OTS A | close, slow push | days 0-176. Queue satire on screen: "Your call is important." hold notes rise. Captions: "One office. Half a lifeline." / "The other half: an ocean away." |
| 6.6-10.4 | SC3 PULL OUT | dolly out through the window, crane up to the ocean map | days 176-328. Both coasts, 13 office pairs, rope halves reaching, gaps between. "Thirteen calls. One queue." -> "Two continents. Same red." |
| 10.4-13.4 | SC4 WIDE | locked, slow drift | days 328-448. The break (403): red crosses the ocean, windows go dark. Hero knot ties at 426. "Then it broke. Both shores." |
| 13.4-15.2 | SC5 DROP IN | fast dolly to figure B's office | days 448-520 |
| 15.2-17.2 | SC6 OTS B CLOSE+ | over B's shoulder, closer than SC1 | "CONNECTED" on the phone, the knot tied, windows dark. "Connected. After the dark." At 16.8 last lights out. |
| 17.2-19.8 | SC7 FREEZE | locked, dim | "We slowed it down / so you could see it." |
| 19.8-27.4 | SC8 SNAP | flat, two 920 px panels | 0.5 s silence, hit. AS IT HAPPENED vs ROUTED - ILLUSTRATIVE; same red; knots; playhead sweep at true proportional speed. "Same red. Half the wait." / "Illustrative. People still decide." |
| 27.4-30.4 | SC9 IN++ | extreme close on the two hands and the knot | two silhouette hands (A from top, B from bottom) pull the knot tight. "Nobody was careless. The queue was." then "This is the bottleneck." |
| 30.4-35.0 | END | | L.endCard, 4.6 s |

Zoom cycles: Cycle 1: IN (OTS A, zoom 1.0 -> 1.12) 0-6.6 -> OUT (through window to ocean, map zoom 9 -> 1) 6.6-13.4 -> IN+ (to B's office, closer than A: 1.3) 13.4-17.2. Cycle 2: OUT (snap axis, three years) 19.8-27.4 -> IN++ (hands at the knot, scale 2.2) 27.4-30.4.

## 3D translation note
- Keep it as a real shadow theatre in 3D: flat cut-out puppets (thin card with rivets and rods) pressed against a backlit muslin screen, one practical lamp behind. Camera on the audience side at eye level, 35 mm for the OTS shots; the puppets' edges soften slightly as they leave the screen (real penumbra).
- SC3 pull-out: the camera tracks back out of the office cut-out while the screen's second layer (the ocean map, cut in card with a layered wave rail) slides in behind; 4 s, ease-in-out, lamp flickers once.
- The rope: a real green thread lit from the audience side (the only front-lit object), so it reads as colour against the shadows; the red is a gel that rises behind the screen.
- Richer in 3D: window lights as pinholes in the card that are covered one by one; the wave rail actually rocking; the knot tied by two rod-puppet hands.

## Copy variants
- "Half a lifeline. On hold." (hook) / "Your call is important." (phone) / "One office. Half a lifeline." / "The other half: an ocean away."
- "Thirteen calls. One queue." (spelled out; not a data number: it is the count of drawn pairs) / "Two continents. Same red." / "Then it broke. Both shores."
- "Connected. After the dark." / "Nobody was careless. The queue was."
- Snap: "Same red. Half the wait." / "Illustrative. People still decide."
- Unused: "Please hold. The red won't." / "Estimated wait: one crisis." / "Ping across the ocean: months."

## Tags
{"slug":"half-a-lifeline","structure":"two-phones","medium":"shadow puppet","family":"market","scale":"between nations","pace":"stop-start","emotion":"loneliness","protagonist":"a green fragment","camera":"over-the-shoulder","analog":"gfc-2008"}
Diversity check: first try with protagonist "an institution" was TOO SIMILAR (six-to-twelve-hours 0.44). Changed protagonist to "a green fragment" (the lifeline itself is the character; the two figures are its two ends): OK (nearest ten-things-in-the-drawer 0.56, six-to-twelve-hours 0.56).
