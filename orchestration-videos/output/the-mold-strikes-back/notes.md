# The Mold Strikes Back

Tier: animatic
Slug: the-mold-strikes-back
Structure: nature-documentary (research/VIRAL_STRUCTURES.md #14)
Analog: penicillin-resistance-1946
Tags: medium x-ray · family ecology · scale body · pace accelerating · camera locked-off close-up with a single pull-out · emotion awe · protagonist the red itself

## Logline
Hushed nature-documentary captions over an x-ray petri world. A gloved hand (seen as bones through a translucent glove) holds one green-lit dish. The red is the animal being observed: in one hospital its colonies go from 1 in 8 to more than half in under two years. The camera pulls out once: the dish becomes one lab in one hospital, and far away a room of biochemists and a room of chemists each hold a piece of the answer. The links between them form on a lognormal clock; the pieces meet after 13 years, and within two more the red adapts again. The snap: the same record at true proportional speed, and beside it routed coordination (illustrative, coordination only) meeting at about 2.5 years.

The red is never named. No "bacteria", "antibiotic", "penicillin" or "resistance" on screen; it is only "the red".

## Time mapping (one stated mapping for the race)
Race runs film t = 1.4 s to 16.0 s over analog years 0 to 15 (Apr 1946 to the 1961 counter-move), on a **log time scale**: film_t = 1.4 + L.mapTime(year, 15, 14.6, 'log'), i.e. 14.6 * log10(1 + year) / log10(16). This is why the pace is "accelerating": early months crawl, later years fly. Stated on screen by a small hand-lettered axis note "log time" in the wide shot; stated fully here.
Key placements: year 1.17 (Jun 1947) at t 5.5; year 1.5 (the hospital warning) at t 6.2; year 2.5 (AI counterfactual) at t 8.0; year 13 (new drug, 1959) at t 15.3; year 15 (the red adapts, 1961) at t 16.0.
Cold open (t 0 to 1.3) is a flash-forward to year 1.75 on the same curve, labeled "later"; then an exposure flash cuts back to year 0.

Snap: both lanes at **true proportional (linear) speed**, 0 to 15 years in 3.0 s (1 s = 5 years), side by side.

## Speed math
**Threat (red).** L.logistic(year, doubling_time 0.56, s0 = 0.125) from the analog. The 0.56-year doubling time is **derived, not published**: the analog fits a logistic through 12.5% (Apr 1946) and 38% (Jun 1947), r = 1.245/yr, ln2/r = 0.56 yr. Check: the fit gives 0.378 at year 1.17 (data 0.38) and 0.555 at year 1.75 (reported 59%, month unverified). The dish and the wards hold the same 40 samples, each with a fixed threshold q_i = (i + 0.5)/40 (shuffled by L.rng at setup); a sample is red when the logistic share exceeds its threshold, so the count of red colonies is the share: 5 of 40 (= 1 in 8) at year 0, 15 at year 1.17, 22 at year 1.75. One hospital's isolates, not the world. The logistic runs toward 100%; real hospital shares plateaued below that, so after about year 3 the red count is model extrapolation (noted, not labeled on screen). After year 13 the red colonies go gray (the new drug works on them), and at year 15 two colonies return red: a qualitative "first reports" staging of the 1961 counter-move, not a measured share.

**Human aggregation (green).** 10 links between the fragment holders (Oxford biochemists f1, lit from before frame 1 since the enzyme was known in 1940; the hospital lab f2, brightening at year 1.5 when the warning is ready; pharmaceutical chemists f3, lit at year 13; three other hospitals' surveillance labs). Link i connects at L.lognormalQuantile((i + 0.5)/10, median 13, p90 69) years: 1.4, 3.5, 5.6, 8.0, 10.9, 15.5, 22, 30, 48, 120. Before connecting, each link shows a flickering dashed reach that breaks (attention elsewhere). By year 13 half the links are in, as the analog's median says; the rest are still out when the race ends. The analog's aggregation distribution is derived from dated events (p10 1.5, median 13, p90 69), not measured; the fitted lognormal's p10 is 2.4 vs the documented 1.5. The pieces "meet" (the three main rooms flash together) at the median, year 13 (methicillin 1959, s5).

**AI counterfactual (illustrative, coordination only).** From analog ai_counterfactual: aggregation median 2.5 years instead of 13, same lognormal spread (sigma = ln(69/13)/1.2816 = 1.30, so p90 = 13.3). Basis: turning many hospitals' surveillance into a routed prescribing / infection-control response is analysis and communication work well inside the ~17.4 h 50% task horizon (RATES.md, METR), repeatable cheaply (RATES.md, Epoch cost trend). It does NOT assume faster drug discovery: trials, manufacturing and the red's own evolution still take years. On screen: bottom lane labeled "routed coordination" + "illustrative" + "coordination only". The red curve is identical in both lanes; AI does not slow the red.

**Numbers on screen (two):** "1 in 8" (12.5% in April 1946, s1) and "13 years" (methicillin in clinical use 1959, s5, 13 years after t0). All other quantities are shown as counts of colonies, positions on axes, or tick marks without numerals.

## Shot list (DUR 37 s)
| t | slate | camera | beat |
|---|---|---|---|
| 0.0-1.3 | SC1 CLOSE · COLD OPEN | locked zoom 13 on the dish in the gloved x-ray hand | flash-forward ("later"): 22 of 40 colonies red, green rim lit. "Watch the red." |
| 1.3-6.4 | SC1 CLOSE · LOCKED-OFF | locked | exposure flash, back to spring: "Spring. One in eight." Colonies turn red one by one; "It does not hurry." |
| 6.4-9.4 | SC2 THE PULL-OUT | single pull-out, zoom 13 to 1, log-eased, 3 s | dish -> lab -> hospital wards (same 40 samples as beds) -> distant rooms. "Its habitat: every ward." |
| 9.4-12.8 | SC3 WIDE | hold | links reach and break; "Three rooms hold the answer." "They rarely hear each other." |
| 12.8-15.3 | SC4 DOLLY IN | zoom 1 to 16, onto the dish, closer than frame 1 | pieces meet at year 13: green rim closes; red goes gray. "At last, the pieces meet." |
| 15.3-17.0 | SC4 CLOSER | hold | year 15: two colonies turn red again. "The red adapts." Dead stop at 16.2, silence |
| 17.0-19.4 | SC5 CARD | hold | "We slowed it down so you could see it." |
| 19.4-26.2 | SC6 THE SNAP | full-frame x-ray film, two lanes 940 px wide | freeze, silence, one hit; both lanes sweep 0-15 years in 3 s; "13 years." over the top lane; bottom lane green at 2.5, "illustrative", "coordination only" |
| 26.2-29.2 | SC7 CLOSEST | full-frame fade back into the dish, zoom 20 | green rim whole, the hand. "The pieces were already here." |
| 29.2-32.0 | SC7 | hold | "This is the bottleneck." |
| 32.0-37.0 | END | — | L.endCard, 5 s |

Zoom cycle: IN (13, 0-6.4) -> OUT (1, 6.4-12.8) -> IN+ (16, 12.8-19.4) -> [snap insert] -> IN++ (20, 26.2-32). One pull-out only, per the assigned camera.

## 3D translation note
Shot as a real x-ray/fluoroscope world: a locked-off 100 mm macro on the gloved hand under a light box, the glove a faint cyan shell, bones glowing, the dish's agar a pale disk with colonies as small luminous domes, red ones softly pulsing. The single pull-out is a 3 s continuous dolly back and crane up through the lab ceiling (a cutaway x-ray of the hospital: beds as bright rectangles, 40 of them each a tiny red or gray point), holding high above as green filaments stretch between distant lit rooms and snap. Return is a slow drop straight down to the dish on a 135 mm macro, closer than the opening. Snap: two lanes on a real light box as x-ray film strips. Richer in 3D: volumetric glow, the depth between glove and agar, dust in the light.

## Copy variants
- Watch the red.
- Spring. One in eight.
- It does not hurry.
- Its habitat: every ward.
- Three rooms hold the answer.
- They rarely hear each other.
- At last, the pieces meet.
- The red adapts.
- The pieces were already here.
- (unused) Here, the red feeds in silence.
- (unused) A rare specimen: someone who shares.

## Diversity check
`node tools/diversity.js` -> OK: distinct enough (nearest two-days and the-last-thirteen-days, distance 0.89). No changes needed.

## Build log
- Preview 1: at macro zoom the world-space link lines and the ward red haze became giant green/red beams across the close-ups; snap red area was scaled by 0.55 (misleading); "13 years." collided with the "pieces meet" label. Fixed: links and haze fade by zoom (visible only below zoom ~4), red area drawn at true share, labels moved. Preview 2 clean.
- Render: 37.0 s (ffprobe), matches DUR.
- Known weaknesses: the stick-figure lab worker is tiny in the wide, so the only emotional face is barely legible; the colonies turning red is a count, which is subtle on a phone; the snap's lower half of frame is empty; the returned-red at year 15 is qualitative staging (noted above).

## Scores
- Hook: 7 (frame 1: glowing x-ray hand, big red colonies, green rim, "Watch the red." — striking thumbnail)
- Speed accuracy: 8 (logistic with the analog's derived 0.56 y doubling, 40 fixed samples so count = share, lognormal link times, one stated log mapping; logistic extrapolates past ~year 3)
- Snap impact: 6 (clean two-lane true-speed sweep, "13 years." lands; honest coordination-only framing limits the punch)
- Emotion: 6 (awe from the x-ray macro and the single pull-out; little character emotion)
- Originality: 7 (x-ray nature-doc petri world is fresh in the portfolio)
- Craft: 6 (readable, consistent zooms; animatic-level hand and figures)
- Honesty: 9 (threat never named, verified numbers only, illustrative and coordination-only labels, derived doubling time disclosed)
- Overall: 7.0
- Virality: 7% — the x-ray hand thumbnail and nature-doc captions are distinctive, but the petri-dish subject is quiet and the payoff is abstract charts, so from a small account it most likely stays well under 100k.
