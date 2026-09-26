# The Crash Call

Tier: animatic
Slug: the-crash-call
Structure: `sports-play-by-play` (research/VIRAL_STRUCTURES.md #9)
Analog: `gfc-2008`
Medium: isometric (gray slab world, raised pitches, glass boundary walls; only red and green saturated)

## Logline
Captions call a market season like a final. The world is a grid of twelve isometric pitches, each an unnamed institution playing its own game (soccer lines, tennis boxes, a court key, a ledger grid) behind low glass walls. Every pitch has one player with a green ball. The red floods the grid tile by tile at the real monthly pace of the fall, crossing every line; the green players keep kicking passes into their own glass. Then the red breaks through: 32% of the whole fall in one month.

## Time mapping (one mapping for the race)
- Race: film t = 2.2 s to 16.8 s <-> days 0 to 584 after the Aug 9 2007 fund freeze (t0, s1) to the Mar 2009 monthly-average trough. **1 s = 40 days, linear.** day(t) = 40 (t - 2.2).
- Lehman month (day 403 -> 433) lands at t = 12.28 -> 13.03 s: the red's jump is 0.75 s of film. The pace "accelerates" only because the data does: 18 months of drift, then the cliff.
- Hook (0 to 1.8 s) is a labeled flash-forward to day 433 (the month after the break), then a REWIND wipe to day 0.
- Snap: separate, labeled axis 0 to 1,100 days across a 920 px panel; each panel's playhead sweeps it in 3.0 s (1 s = 367 days). Both panels share the axis.

## Speed math
**Threat (red).** `threat.points` (s2, Shiller monthly S&P 500 averages, computed directly in the analog): extent = share of the eventual peak-to-trough fall, at mid-month. Piecewise linear between monthly points (data, not a fit; the analog has every month, so no logistic needed). Non-monotonic: the Dec 2007 and Apr-May 2008 rallies make red tiles recede, as in the data.
Grid: 26 x 23 isometric cells (12 pitches of 8 x 5 cells plus the gaps between them), 598 cells. Each cell gets a fixed rank: distance from the red's origin corner plus jitter, sorted, rank = index / 598. A cell is red when extent(day) >= rank, so **red area = share of the fall**. The same ranks drive every zoom level, the scoreboard bar, and the cold open.
On screen number 1: **"32% of the whole fall. In one month."** = extent 0.73 (Oct 2008) - 0.412 (Sep 2008) = 0.318 (s2, sourced; computed in the analog's threat.points and gap_summary).

**Human aggregation (green passes).** Analog `solution.aggregation`: median 426 days, p90 1,077 (derived from documented response dates; not verified). sigma = ln(1077/426)/1.2816 = 0.724. Twelve pitches get stratified quantiles q = (i + 0.5)/12 (shuffled with L.rng; the hero's pitch takes the last), arrival = `L.lognormalQuantile(q, 426, 1077)`:
122, 185, 237, 286, 338, 395, 460, 536, 634, 767, 979, 1492 days.
The first (122) sits next to the one sourced fragment date, the Dec 12 2007 coordinated central-bank liquidity (day 125, s3). By the trough (day 584) 8 of 12 have passed (lognormalCDF(584) = 0.67); the hero's pitch is the absurdly late tail (1,492 days, off the race). A "pass" = ball crosses the glass, a green line runs to the hub ring above the grid; one ring segment per pitch.
Day 426 itself (verified:false) is never shown as a number; it is only a pip position on the snap axis.

**AI-speed counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 220 days (the Bear Stearns failure, i.e. the coordinated response assembled at the first large failure). Same quantiles and sigma, p90 = 220 x 1077/426 = 556:
63, 96, 122, 148, 175, 204, 237, 277, 327, 396, 506, 770 days.
Before the break (day 403): human 6 of 12, routed 10 of 12. Basis (from the analog and RATES.md): the missing fragment was a shared map of who was exposed to whom, sitting in separate institutions' books; assembling it is document-heavy expert work inside the ~17.4 h METR 50% time horizon per institution, and the ~40x/year fall in AI cost at fixed capability (Epoch) makes running it across thousands of books cheap. The red curve is identical in both panels: the counterfactual does not assume the fall is avoided or softened. People still pass: the IN++ shot is two human players and one ball. Labeled "ROUTED - ILLUSTRATIVE" at 48 px and "Illustrative. Not a promise." as a caption.

**Numbers on screen:** one: "32%" (s2). Scoreboard uses bars and pips, no digits; the snap axis is labeled in words.

## Shot list and camera
| t (s) | slate | camera | beat / caption |
|---|---|---|---|
| 0.0-1.8 | SC1 CLOSE (flash-forward) | zoom 10 on the hero, handheld shake | day 433 held. Hero's face (angry), green ball at feet, red tiles filling the top of frame. "AND WE'RE LIVE." tag "LATER THIS SEASON" |
| 1.8-2.2 | wipe | full-frame slab | "REWIND" |
| 2.2-7.0 | SC2 HANDHELD CHASE | zoom 7 -> 5.5, follows the hero dribbling toward his glass wall | days 0-192. "Opening whistle. Green has the ball." / "Looks for the pass..." / kick, glass bonk, ball returns / "Off the glass. Nobody there." |
| 7.0-10.5 | SC3 CRANE UP | zoom 6 -> 1.05, rotate eases out | days 192-332. The grid: twelve pitches, twelve games; red drifting from one corner; early passes light the hub. "Every pitch has a ball." / "Nobody passes across the lines." |
| 10.5-13.4 | SC3 WIDE | locked wide, shake grows with the red's slope | days 332-448. "Red's been drifting all season." / break at 12.28: "RED BREAKS THROUGH!" |
| 13.4-15.2 | SC4 DROP DOWN | zoom 1.05 -> 13 onto the hero | big stat card 13.5-16.0: "32% / of the whole fall / in one month." |
| 15.2-17.9 | SC4 CLOSE+ | zoom 13, closer than SC1 | hero surrounded by red, kicks into the glass again. "Still holding the ball." Day 584 (t 16.8): lights go gray, only the green ball keeps color; commentary stops: "...and that's the season." |
| 17.9-20.4 | SC5 REPLAY | frozen gray wide | "INSTANT REPLAY" bug. "We slowed it down / so you could see it." |
| 20.4-28.0 | SC6 SNAP | locked, two 920 px panels | 0.5 s silence, hit. AS IT HAPPENED vs ROUTED - ILLUSTRATIVE; same red; pips. "Same players. Faster passes." / "Illustrative. Not a promise." |
| 28.0-31.4 | SC7 EXTREME CLOSE | zoom 16 at the glass between two pitches | the glass drops, the ball crosses to the other player. "AI finds the open player. People pass." / "This is the bottleneck." |
| 31.4-36.0 | END | | L.endCard, 4.6 s |

Zoom cycles: Cycle 1: IN (zoom 10 -> 7) 0-7 -> OUT (crane to 1.05) 7-13.4 -> IN+ (zoom 13) 13.4-17.9. Cycle 2: OUT (snap axis, three years) 20.4-28 -> IN++ (zoom 16, hands/feet at the glass) 28-31.4.

## 3D translation note
- SC1/SC4: 50 mm handheld at eye level of a small figure on a tabletop-scale grid (tilt-shift miniature look), the red tiles a rising glossy flood behind the face; SC4 is tighter, slower, with more breathing shake.
- SC2: operator running behind the player like a sideline steadicam, 1 m height; the glass bonk is a real refraction flash.
- SC3: one continuous crane from 1 m to a true isometric (orthographic, 35 deg down) overhead in 3.5 s, ease-in-out; the drop in SC4 is faster and lands closer.
- Characters/props: bean players in gray kits, soft rubber look; emissive green balls; pitches as raised felt blocks with painted lines of different sports; glass walls as thin acrylic.
- Richer in 3D: the red as liquid actually pouring over pitch edges and across gaps; floodlights going off bank by bank at the trough; the hub ring hanging over the grid like a scoreboard.

## Copy variants (register: play-by-play + networking)
- "AND WE'RE LIVE." / "Opening whistle. Green has the ball." / "Off the glass. Nobody there."
- "Twelve pitches. Twelve rulebooks. One flood."
- "The red doesn't respect the lines."
- "Every player open. No one passing."
- "Same players. Faster passes." / "AI finds the open player. People pass."
- Unused: "Market's in overtime." / "Pass rejected: wrong pitch." / "Ping from the other pitch: 400 days."

## Tags
{"slug":"the-crash-call","structure":"sports-play-by-play","medium":"isometric","family":"sport","scale":"economy","pace":"accelerating","emotion":"anger","protagonist":"an institution","camera":"handheld chase","analog":"gfc-2008"}
Diversity check: OK (nearest the-department-of-later 0.67).

## Build log
- Timeline shifted +0.2 s after SC4 so "...and that's the season." holds 1.25 s: replay 18.1-20.6, snap 20.6-28.2 (hit 21.1), IN++ 28.2-31.6, end card 31.6-36.0 (4.4 s). DUR 36, ffprobe 36.0 s.
- Preview fixes: wide zoom 0.95 -> 1.05 (grid read too small); stat card raised and shortened to clear the hero's face on the drop-in.
- Handheld shake amplitude = 7 + 2200 x (red slope per day), capped: the camera shakes hardest in the Lehman month because the data does.

## Scores
- Hook: 7 (frame 1 is a big red flood over a worried face with a green ball and "AND WE'RE LIVE."; legible, but bean + isometric reads cute before it reads grave)
- Speed accuracy: 8 (red is the monthly data verbatim, including the rallies; one linear mapping; lognormal passes from the analog; only the 32% is on screen)
- Snap impact: 6 (0.5 s silence, hit, two 920 px panels with the same red; the AI shift is ~2x, honestly small, and the panel graph is quieter than the pitch world)
- Emotion: 6 (anger at the glass walls lands in the kick-bonk beats; lights-out with only the ball colored is the strongest image)
- Originality: 7 (institutions as separate sports pitches behind glass, each playing a different game, is a fresh satire of silos)
- Craft: 7 (clean isometric world, continuous camera through scales with data-driven shake; wide shot players tiny, replay frame dark)
- Honesty: 9 (no unverified number on screen, day 426 only as a pip position, same red in both panels, "Illustrative. Not a promise.")
Overall: 7.1
Virality: 8% - the sports-caption hook and the red flood are thumbnail-legible and the glass-wall bonk is a shareable joke about silos, but finance plus a quiet snap chart will lose most casual viewers before the payoff.
