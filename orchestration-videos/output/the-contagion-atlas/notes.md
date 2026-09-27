# The Contagion Atlas

Tier: animatic
Slug: the-contagion-atlas
Structure: `man-in-a-hole` (research/VIRAL_STRUCTURES.md #3), told as one fall (the crash) and a partial climb (the fall stops, the fixes arrive late), with the snap as the full climb out.
Analog: `gfc-2008`
Medium: stained glass (a cathedral rose window, lead came, stone; only red and green saturated)

## Logline
A great rose window is an atlas of markets: forty unnamed panes in two rings, joined by lead lines, the links along which exposure runs. Red crosses the lead from pane to pane at the real monthly pace of the 2007-09 fall. The fixes already exist: twelve keepers stand in twelve side chapels, each holding a green shard. A shard only counts once it has been carried across the nave and set into the rosette at the window's heart. At human speed the window goes red first.

## Time mapping (one mapping for the race; same speed math as the-crash-call)
- Race: film t = 2.1 s to 16.7 s <-> days 0 to 584 after the Aug 9 2007 fund freeze (t0, s1) to the Mar 2009 monthly-average trough. **1 s = 40 days, linear.** day(t) = 40 (t - 2.1). The clock keeps running at the same rate to day 700 (t = 19.6) for the climb.
- Lehman month (day 403 -> 433) lands at t = 12.18 -> 12.93 s. The pace "accelerates" only because the data does.
- Hook (0 to 1.5 s) is a flash-forward to day 433 (the month after the break), then a 0.6 s rewind to day 0. It is labeled "LATER" (no digits).
- Snap: its own labeled axis, 0 to 1,100 days across a 840 px axis; each sweep takes 3.0 s (1 s = 367 days). Both panels share the axis.

## Speed math
**Threat (red).** `threat.points` (s2, Shiller monthly S&P 500 averages): extent = share of the eventual peak-to-trough fall, at mid-month. Piecewise linear between the monthly points (the analog has every month, so no fit is needed). Non-monotonic: the Dec 2007 and Apr-May 2008 rallies make red panes recede, as in the data. After day 584 extent is held at 1.0: the analog has no sourced recovery points, so the red is never drawn retreating.
Window: 40 market panes (16 inner ring + 24 outer ring). Adjacency = shared lead line. Each pane's rank = breadth-first distance along lead lines from one origin pane plus seeded jitter, sorted, rank = (index + 0.5)/40. A pane is red when extent(day) >= rank, so **red area = share of the fall**, and it visibly crosses lead lines pane to pane (lead lines between a red pane and a gray neighbour glow red). The same ranks drive every zoom level, the chapel lancets (each mirrors one pane) and both snap panels.

**Human aggregation (green, carried).** `solution.aggregation`: median 426 days, p90 1,077 (derived from documented response dates; verified:false). sigma = ln(1077/426)/1.2816 = 0.724. Twelve keepers take stratified quantiles q = (i + 0.5)/12, arrival = `L.lognormalQuantile(q, 426, 1077)`:
122, 185, 237, 286, 338, 395, 460, 536, 634, 767, 979, 1492 days (identical to the-crash-call's twelve pitches).
A keeper starts walking 45 days before arrival and the shard rises into the rosette in the last 12 days; petals fill clockwise in order of arrival. The first (122) sits beside the one sourced fragment date, the Dec 12 2007 coordinated liquidity (day 125, s3). By the trough (day 584) 8 of 12 are set (lognormalCDF(584) = 0.67). The hero keeper (nearest left chapel) takes the tail: 1,492 days, off the race. The oculus at the centre lights only when all twelve are set.
Day 426 itself (verified:false) never appears as a number.

**AI-speed counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 220 days. Same quantiles and sigma, p90 = 220 x 1077/426 = 556:
63, 96, 122, 148, 175, 204, 237, 277, 327, 396, 506, 770 days.
Before the break (day 403): human 6 of 12, routed 10 of 12. Basis (analog + RATES.md): the missing fragment was a shared map of who was exposed to whom, sitting in separate institutions' books; assembling it is document-heavy expert work inside the ~17.4 h METR 50% time horizon per institution, and the ~40x/year fall in AI cost at fixed capability (Epoch) makes it cheap across thousands of books. It changes coordination timing only: the red is identical in both lanes, and the counterfactual does not assume the fall is avoided or softened. People still carry the shard: the IN++ shot is two keepers' hands on one shard, with a pale (unsaturated) thread showing the route.

**Numbers on screen:** none. The snap axis and rosette pips carry the comparison; labels are words.

## Shot list and camera (zoom = canvas scale)
| t (s) | slate | camera | beat / card |
|---|---|---|---|
| 0.0-1.5 | SC1 CLOSE (flash-forward) | eye level on the hero keeper, zoom 3.2 | day 433. Face lit red by the chapel lancet (one pane), green shard in hands. "The fix was one aisle away." tag LATER |
| 1.5-2.1 | SC1 REWIND | same | rewind streaks, day 433 -> 0 |
| 2.1-6.5 | SC2 CLOSE | zoom 3.2 -> 3.0 | days 0-176. "Every chapel kept a fix." / "Nobody carried it across." |
| 6.5-10.0 | SC3 CRANE UP | zoom 3.0 -> 0.86, ease in-out, log-zoom | days 176-316. The whole rose. "Each pane, a market." / "Each lead line, a debt." |
| 10.0-14.0 | SC4 WIDE | locked, 0.86, shake grows with red slope | days 316-476. "Slow drift." / "Then the drop." (Lehman month at 12.18) |
| 14.0-16.0 | SC5 DROP DOWN | 0.86 -> 4.3 onto the hero | days 476-556 |
| 16.0-19.6 | SC6 CLOSE+ | zoom 4.3 -> 4.6, closer than SC1 | trough at 16.7: red stops. Rosette green light grows on the face. "The fall stopped." / "Most fixes came after." |
| 19.6-22.0 | SC7 FREEZE | held | "We slowed it down / so you could see it." |
| 22.0-30.0 | SC8 SNAP | flat, two 920 px panels | 0.5 s black silence, hit. As it happened (true speed, alone), then beside Faster routing - illustrative; same red. "True speed." / "Same red. Faster routing." |
| 30.0-33.6 | SC9 EXTREME CLOSE | 1.4 -> 7.5, drop from rosette to the aisle foot | two keepers' hands on one shard. "Same keepers. Found sooner." / "This is the bottleneck." |
| 33.6-38.0 | END | | L.endCard 4.4 s |

Zoom cycles: Cycle 1: IN (3.2) 0-6.5 -> OUT (crane to 0.86) 6.5-14 -> IN+ (4.3-4.6) 14-19.6. Cycle 2: OUT (snap, whole three years) 22-30 -> IN++ (crane down to 7.5 on hands) 30-33.6.

## 3D translation note
- SC1/SC2: 50 mm at 1.6 m eye height inside the nearest side chapel, shallow depth of field; the lancet's red falls across one cheek, the shard's green across the hands. Volumetric light shafts through the lancet.
- SC3: one continuous crane up and back along the nave axis to the west wall (about 25 m), 3.5 s ease in-out, ending square to the rose window; the chapels recede either side of the frame.
- SC5: a faster crane down (2 s) that lands closer than SC1 (85 mm); SC9 is a macro on two hands meeting on the shard at the altar step, the rose far above out of focus.
- Characters/props: keepers as simple gray bean figures in robes; shards as emissive green glass; lead came as dark metal with real thickness; stone tracery.
- Richer in 3D: red light actually spreading across the nave floor pane by pane; lead lines heating as the red crosses them; the rosette throwing green light down the aisle as petals are set.

## Copy variants (register: sublime + networking)
- "The fix was one aisle away." / "Every chapel kept a fix." / "Nobody carried it across."
- "Each pane, a market." / "Each lead line, a debt."
- "Slow drift." / "Then the drop." / "The fall stopped." / "Most fixes came after."
- "Same red. Faster routing." / "Same keepers. Found sooner."
- Unused: "The glass was one window." / "Latency: one nave." / "Forty panes. One lead."

## Tags
{"slug":"the-contagion-atlas","structure":"man-in-a-hole","medium":"stained glass","family":"market","scale":"between nations","pace":"accelerating","emotion":"awe","protagonist":"an institution","camera":"crane up and drop down","analog":"gfc-2008"}
Diversity check: OK (nearest the-crash-call 0.67, seventeen-days 0.67).
