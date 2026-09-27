# The Relay

Tier: animatic
Slug: the-relay
Structure: `sports-play-by-play` (research/VIRAL_STRUCTURES.md #9)
Analog: `wannacry-2017`
Medium: constructivist poster (cream / black / grays, bold diagonals, flat blocks, big type; only red and green saturated)

## Logline
Commentators call a one-day global outbreak like a stadium relay. The red takes one seat at the gun and floods the stands. At hour 7.3 a fan vaults out of the front row with a green baton: one person, partly luck. Every lane's own baton had been lying at the exchange zone for 59 days. When he gets to the line, there is nobody to hand it to.

## Time mapping (one mapping for the race)
- Race: film t = 2.3 s to 14.3 s <-> hours 0 to 24 after the outbreak. **1 s = 2 h, linear.** hours(t) = 2 (t - 2.3). Kill switch 7.3 h -> t = 5.95 s (freeze frame there).
- Hook (0 to 1.9 s) is a flash-forward to the end of day one (hour 24, stands fully red, dial full), labeled "END OF DAY ONE", then a REWIND slab back to hour 0.
- Snap: separate, labeled true-proportion axis, 0 to 168 h (one week) across a 940 px panel; swept in 3.0 s (1 s = 56 h). Both panels share the axis.

## Speed math
**Threat (red).** The analog sources only endpoints: 0 at 0 h and >230,000 systems (extent 1.0) at 24 h (s2); no doubling time. Fit (not data): `L.logistic(h, D, s0)` with s0 = 1/230,000 (one machine at the gun) and 99% of the 24 h total at 24 h, which gives **D = 24 ln2 / ln(99 x 229,999) = 0.982 h** (r = 0.706 /h). Cross-check: a logistic's peak rate is rK/4 = 0.706 x 230,000 / 4 = ~40,600 systems/hour, consistent with Kryptos Logic's "tens of thousands of infected systems per hour" at the peak (s3). Values: 7.3 h 0.08%, 9.8 h 0.4%, 12 h 2%, 16 h 26%, 18.6 h 69%, 20.6 h 90%, 24 h 99%.
Caveat, stated honestly: with a one-machine start the fit puts most of the day's count after the 7.3 h kill switch. That split is not sourced either way (the analog says so), and the film makes no claim about it: no caption links the fan's grab to the red count, and the red is never shown slowing or not slowing because of him.
The stadium has 24 sectors x 60 seats = 1,440 seats (each ~160 machines). Each seat has a fixed rank (angular distance from the origin sector + jitter, then sorted); a seat is red when share(h) > rank. The stands behind the runner in the close shots are the same 60 seats of the origin sector, so the red is identical at every zoom.

**Green fragments.**
| fragment | ready_at | on screen |
|---|---|---|
| f1 patch (vendor) | -1,416 h (59 days, s5, verified) | the "team baton" lying at every lane's exchange zone from frame 2; "59 days" is one of the two numbers |
| f2 alerts | ~-1,440 h (unverified) | not shown as a number; folded into the lying batons |
| f3 kill switch, one independent researcher | 7.3 h (s1) -> t = 5.95 | the fan in the front row; baton lights, freeze frame "HOUR 7.3"; caption "One person. Partly luck." |
| f4 emergency patch for old systems | ~20 h (unverified) | not shown |
| f5 the unpatched machines | clear by ~168 h | the lanes that have not connected; right end of the snap axis |

**Human aggregation (the lanes).** 24 lanes (one per sector), stratified quantiles q = (i + 0.5)/24 shuffled with L.rng, arrival `max(7.3, L.lognormalQuantile(q, 20, 168))` h: median 20 h and p90 168 h from the analog, floored at 7.3 h (the earliest documented stop; the analog's p10). sigma = ln(168/20)/1.2816 = 1.66. Arrivals: 7 lanes at 7.3 h, then 8.9, 10.7, 12.9, 15.4, 18.3, 21.8, 26, 31, 37, 45, 55, 69, 87, 115, 162, 256, 589 h. Within the 24 h race 13 of 24 lanes connect (a runner appears, the baton lights, a line reaches the infield); 11 are still waiting at day's end, some for weeks.

**AI-speed counterfactual (illustrative).** aggregation_median = 1 h (analog `ai_counterfactual`), same quantiles and sigma, so p90 = 1 x 168/20 = 8.4 h; no floor (the analog assumes the patch fragment was routed before t0). Arrivals 0.03 h to 29 h; 23 of 24 inside the first 13 h. Basis (from the analog, RATES.md): spotting a hard-coded domain in a sample is a few-hour expert task inside the ~17.4 h METR 50% time horizon; matching unpatched machines to a 59-day-old critical patch and routing the alert to whoever can apply it is inventory work made cheap by ~40x/year cost decline at fixed capability (Epoch). People still apply the patch: the IN++ shot is one human hand passing the baton to another. Labeled "ILLUSTRATIVE" at 48 px on the panel and "Illustrative. Not a promise." as a caption. No claim the event would have been prevented.

**Numbers on screen (two):** "59 DAYS" (verified, s5) and "HOUR 7.3" (s1). The race clock is a dial with no digits; the snap axis is labeled in words ("the gun", "one week").

## Shot list and camera
| t (s) | slate | camera | beat / caption |
|---|---|---|---|
| 0.0-1.9 | SC1 CLOSE | locked, tilted -6 deg, slight push | Flash-forward, end of day one: fan's face, green baton up by his cheek, stands behind fully red. "AND WE'RE LIVE." |
| 1.9-2.3 | wipe | diagonal black slab | "REWIND" |
| 2.3-5.95 | SC2 TRACKSIDE | side view, slow dolly right along the track, diagonal stands | Hour 0: one red seat. "Hour zero. Red's off the line." Team baton lying in the lane, dusty: "Team baton: here 59 days." Fan in the front row. |
| 5.95-7.2 | SC2 FREEZE | push in 1.0 -> 1.25, freeze | Fan vaults to the track with a lit baton. Freeze-frame stamp "HOUR 7.3". "HE'S ON THE TRACK!" |
| 7.2-11.6 | SC3 CRANE UP | top-down, zoom 4.2 -> 0.78, rotate -0.35 -> -0.12 rad, ease in-out | Whole stadium = the world: 24 sectors flooding red at the fit; lanes lighting at lognormal times. "One person. Partly luck." / "Every lane had a baton." / "Rest of the team: 59 days late." |
| 11.6-12.6 | SC4 DROP DOWN | top-down zoom 0.78 -> 5 onto the fan | falling back into the lane |
| 12.4-15.2 | SC4 CLOSE+ | side view, closer than SC1 (head 1.35x), slow push | Fan at the exchange line, baton held out, nobody there, stands red. "Nobody to hand it to." At 14.3 (hour 24) the stadium lights go out; commentary stops cold. |
| 15.2-17.6 | SC5 REPLAY | locked, frozen gray frame | "INSTANT REPLAY" bug. "We slowed it down / so you could see it." |
| 17.6-25.0 | SC6 SNAP | locked, two 940 px panels | Hit. AS IT HAPPENED (24 pips over a week, stack at 7.3 labeled "one fan", baton arrow "sat 59 days") vs ROUTED, ILLUSTRATIVE (pips inside hours). "Same batons. Faster handoffs." / "Illustrative. Not a promise." |
| 25.0-31.0 | SC7 EXTREME CLOSE | locked, push 1.0 -> 1.15 | Two human hands: the baton passes. "AI finds the hand. People run." then "This is the bottleneck." |
| 31.0-35.0 | END | | L.endCard, 4.0 s |

Zoom cycles: Cycle 1: IN (face) 0-1.9, trackside 2.3-7.2 -> OUT (crane up to the whole stadium) 7.2-11.6 -> IN+ (drop down, closer face) 11.6-15.2. Cycle 2: OUT (snap axis, a whole week) 17.6-25 -> IN++ (hands, closest) 25-31.

## 3D translation note
- SC1/SC4: 85 mm lens at 1.2 m, shallow depth, the red stands a soft wall behind the face; SC4 is 20% tighter and slower. Dutch angle kept (constructivist diagonal).
- SC2: 35 mm tracking dolly at hip height along the lane at walking speed; the freeze at hour 7.3 is a true time-freeze with a slow 1.5 m push (bullet-time lite).
- SC3: one continuous crane from 3 m over the fan to ~400 m over the stadium (bowl reads as a world map ring), 4.4 s ease-in-out with a slow rotation; SC4 reverses it faster, like a drop, and lands closer than it started.
- Characters/props: flat-shaded low-poly athletes with poster-print textures; the fan in a gray hoodie, the team runners in gray vests; batons are emissive green cylinders; seats are flat block tiles that flip to red.
- Richer in 3D: the red wave rolling around the bowl like a stadium wave; stadium floodlights switching off bank by bank at hour 24; the green lines as arcs over the infield globe.

## Copy
Used: "AND WE'RE LIVE." / "REWIND" / "Hour zero. Red's off the line." / "Team baton: here 59 days." / "HE'S ON THE TRACK!" / "One person. Partly luck." / "Every lane had a baton." / "Rest of the team: 59 days late." / "Nobody to hand it to." / "We slowed it down so you could see it." / "Same batons. Faster handoffs." / "Illustrative. Not a promise." / "AI finds the hand. People run." / "This is the bottleneck."
Variants (not used): "Dropped baton. Fifty-nine days." / "The exchange zone is empty." / "Great run. Wrong relay." / "Lag at the handoff." / "The fix was warming up in the parking lot."

## Diversity
Assigned tags were TOO SIMILAR to fifty-nine-days (distance 0.44; same analog, scale, pace, emotion, protagonist). Changed **pace: sprint -> stop-start** (the race sprints but is cut by the hour-7.3 freeze frame, the lights-out stop, and the instant replay). Kept structure and analog as assigned.

Tags: {"slug":"the-relay","structure":"sports-play-by-play","medium":"constructivist poster","family":"sport","scale":"between nations","pace":"stop-start","emotion":"resolve","protagonist":"one person","camera":"crane up and drop down","analog":"wannacry-2017"}

## Scores
- Hook: 7 (frame 1: resolved face, lit green baton, wall of red seats, "AND WE'RE LIVE."; strong poster read, but the sports frame isn't obvious until the stands register)
- Speed accuracy: 7 (red now saturates by the 7.3 h kill switch, matching the direction of the only sourced timing evidence (Kryptos Logic House testimony); peak ~69,000/h fits "tens of thousands per hour"; lognormal lanes from the analog; the shape inside 0-7.3 h is unsourced and stated as such. See "Data fix (red curve)".)
- Snap impact: 6 (freeze, silence, hit, then two 940 px panels on one axis; but the human stack at 7.3 h looks a lot like the AI stack at a glance)
- Emotion: 6 (the search face at the empty exchange line works; the hands shot is abstract)
- Originality: 7 (stadium as world, fan-on-the-track as the lone researcher, constructivist poster look)
- Craft: 6 (clean flat blocks and diagonals; figures are simple, the crane's midpoint is busy, caption slabs a bit small in the top view)
- Honesty: 9 (fan framed as one person, partly luck; "Illustrative. Not a promise."; no threat or company names; two numbers, both sourced)
Overall: 6.9
Virality: 6% — distinctive poster look and a legible sports-commentary hook, but the story needs two viewings to decode (two kinds of baton, a snap chart), which caps shares from a small account.

## Data fix (red curve)
*2026-09-27.* The original red was a logistic from one machine (s0 = 1/230,000) fitted to 99% of 230,000 at 24 h (D = 0.982 h). It put only 0.08% of the day's infections before the 7.3 h kill switch and the rest after, which implied the stop did nothing. That split was unsourced, and the only sourced timing evidence points the other way:

- **Salim Neino (CEO, Kryptos Logic), prepared testimony to the US House Committee on Science, Space & Technology, June 15, 2017:** "between 1-2 million systems may have been affected in the hours prior to activating the kill-switch", and the attack "propagated freely for hours" before the kill switch was activated. Sources: https://www.congress.gov/115/meeting/house/106120/witnesses/HHRG-115-SY21-Wstate-NeinoS-20170615.pdf ; hearing record https://www.govinfo.gov/content/pkg/CHRG-115hhrg26234/html/CHRG-115hhrg26234.htm . I read these through search-engine snippets of the testimony, not a full re-read, because direct fetch is blocked by the sandbox proxy.

"Affected" is a different unit from the 230,000 "infected" (s2), so the 1-2 million figure is not fitted and not shown. It is used only for direction: most of the spread came **before** 7.3 h. This is the same treatment as output/the-worm-rewind/notes.md.

**New red model (the-worm-rewind's parameters, reused unchanged):** share(h) = (σ(h) − σ(0)) / (σ(7.3) − σ(0)), σ(h) = 1/(1+e^(−1.16 (h − 4.0))), 0 at the gun, 1 from 7.3 h on (flat: the initial variant stops at the kill switch, s1; still consistent with ">230,000 within 24 h", s2). Values: 1 h 2%, 2 h 8%, 3 h 24%, 4 h 51%, 5 h 78%, 6 h 93%, 7 h 99%, 7.3 h 100%. Peak rate = 1.16/4 × 230,000 / 0.969 ≈ 69,000 systems/hour, consistent with Kryptos Logic's "tens of thousands per hour" at the peak (s3). The midpoint and steepness are **not** sourced; they are an illustrative shape that meets the sourced constraints.

**What changed on screen:** only the red. The seats (same ranks, same 1,440 seats) now fill during the 2.3-5.95 s trackside dolly and are fully red at the "HOUR 7.3" freeze. The fan's green baton arrives after the damage, not before it. The crane-up shows a fully red stadium while the lanes light, and the snap panels' red area rises within 0-7.3 h and stays flat to 24 h. Lanes, AI counterfactual, time mapping, camera, captions and the two on-screen numbers are unchanged. Superseded text above: the "Threat (red)" fit, its values, and the "Caveat" paragraph in Speed math.

**Caption check:** none contradicts the curve. "Hour zero. Red's off the line." (0 h), "HE'S ON THE TRACK!" / "HOUR 7.3" (stands already red), "One person. Partly luck.", "Nobody to hand it to." make no claim that red kept spreading after the fan, or that he stopped it. The "one fan" tick on the snap panel now sits where the red has already plateaued, which matches the data.

**Render:** preview contact sheet and frames at 4.0 / 6.2 / 23.0 s inspected; full render output/the-relay/the-relay.mp4, ffprobe 36.0 s (= DUR). Speed accuracy stays 7: the curve now agrees with the sourced direction, but the shape inside 0-7.3 h is still illustrative (the same score the-worm-rewind got for this model). Overall unchanged at 6.9 ((7+7+6+6+7+6+9)/7 = 6.86).
