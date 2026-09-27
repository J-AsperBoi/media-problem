# The Orchestra

Tier: animatic

**Logline.** A national orchestra plays the summer program in perfect sync, every bow on the same beat, and the beat is the red: its tempo is the fitted curve of the 2003 heat, speeding toward the peak and slowing after it. Scattered through the seats, a few players hold green pages (a doctor, a neighbor with a key, a forecaster): the pieces of the one score that matters. Their lines reach toward the podium and break. Wait for it: the doctor's page, the plan, reaches the podium on day 12, after the peak. The chair beside her is already empty.

- Structure: `wait-for-it` (research/VIRAL_STRUCTURES.md #4). Promise in frame 1 ("Watch the green page."), payoff at day 12 (it arrives, and it is late), then the snap reveals how fast the pieces could have clicked.
- Analog: `heatwave-2003` (France, Aug 1-20, 2003)
- Medium: ink wash (gray paper, ink strokes and gray washes; only red heat and green pages saturated)
- Differs from the other films on this analog (day-three-hundred-five reverse / children's-book; the-balcony POV / shadow puppet; nineteen-days x-ray heartbeat; the-heat-map topographic zoom): a crowd, not one person; music, not a body or map; the irony of perfect synchronization on the wrong thing. It satirizes the program nobody can interrupt, not the musicians.

## Time mapping (one mapping, stated)
- Race (t = 1.5 to 20.5 s): **1 film second = 1 day**, day d = t - 1.5, days 0 (Aug 1) to 19 (Aug 20). Linear.
- Cold open (t 0 to 1.5): flash-forward to day 11.5 (the peak) on the same timeline, then a cut back to day 0.
- Snap (t 24.4 to 28.9): the same 19 days in **4.5 s**, same red in both lanes.

## Speed math
**Threat (red).** Same fit as nineteen-days / the-heat-map / the-balcony, for consistency. The analog sources only endpoints (extent 0 on day 0; 1.0 = all ~14,800 excess deaths by day 19, s2) plus the peak (daily excess > 1,000 on days 11-12, s2). No straight line: `L.logistic` fitted through them.
- Midpoint at day 11.5 (sourced peak); extent 0.99 at day 19: k = ln(99)/7.5 = 0.613/day, early doubling ln2/k = **1.13 days**, s0 = 0.00086, normalized so E(0)=0, E(19)=1.
- E(d): d3 0.005, d5 0.018, d8 0.105, d10 0.29, d11.5 0.505, d12 0.58, d13 0.72, d15 0.90.
- Heat curve rho(d) = 4 s(1-s) (s the raw logistic): 0.003 d0, 0.07 d5, 0.38 d8, 0.82 d10, 1.0 d11.5, 0.82 d13, 0.38 d15, 0.04 d19.

**What the red drives on screen.**
- **The tempo.** Bow strokes per film second f(d) = 0.6 + 1.4 rho(d): 0.60 on day 0, 1.13 day 8, 2.0 at the peak, 1.13 day 15, 0.66 day 19. Stroke phase is the integral of f (about 20 strokes over the 19-day race). Every bow in the nation and the conductor's baton use that one phase; the pulse sound (bonk cues) sits on the same integer phases. The tempo is the fitted curve, not a real tempo of anything.
- Red wash over the hall and the nation: alpha proportional to rho(d), the same field at every zoom level.
- **Loss as absence.** 14 of the 93 chairs in the main hall (15%) empty when E(d) crosses thresholds spread evenly from 0.08 to 0.92: the player fades, the stand lamp goes out, the page goes dark. The chair beside the protagonist empties at E = 0.53 (day ~11.7, just after the peak). Other halls in the nation lose lamps at the same thresholds. The share is symbolic, not a death count; the timing is the curve. No bodies.

**Human aggregation (green).** Analog aggregation median 12, p10 9.5, p90 305 (days). Two-sided lognormal (as in the-balcony / nineteen-days): sigma_low = ln(12/9.5)/1.2816 = 0.182, sigma_high = ln(305/12)/1.2816 = 2.525. Eight green pages in the hall at quantiles 0.06 / 0.2 / 0.35 / 0.5 / 0.65 / 0.8 / 0.9 / 0.95:
- arrival days 9.0 / **10.3 (a neighbor with a key)** / 11.2 / **12.0 (a doctor: the protagonist violinist; the median = Plan Blanc, Aug 13, verified f4)** / 31.7 / **100.4 (a forecaster)** / 305 / 763.
- Four reach the podium inside the film, all within three days of the peak; four never do. Before its day each page's line reaches part way toward the podium and breaks (attention elsewhere: the attempt rhythm is a vibe, the arrival days are data). On arrival the page flies down the line to the conductor's stand.
- Labels are roles only. Unverified dates (the ER doctors' alarm ~day 9.5, the forecasts ~day 1, foreign warning systems) never appear on screen; the forecaster is placed by the lognormal quantile, not by an unverified date.
- Other halls in the nation: two green pages each, arrival days drawn from the same lognormal (quantiles from the seeded RNG).

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 3 days (basis in the analog: joining a known forecast with the heat-mortality relationship and routing a warning to hospitals and home care is a short expert task, inside the ~17.4 h METR 50% task horizon in RATES.md). Same lognormal shape scaled 3/12: 2.3 / 2.6 / 2.8 / **3.0** / 7.9 / 25.1 / 76 / 191 days. So in the AI lane five pages arrive within the 19 days (four before day 3.0, one at 7.9), three still never do. Day 3 is before the peak (rho(3) = 0.02). Labeled illustrative on screen; the red wash, tempo and emptied chairs are drawn **identically** in both lanes: only when the pieces meet changes, no outcome is claimed.

**On-screen numbers (two):** "day 12" (the plan, verified: Plan Blanc Aug 13 = t 12) and "day 3" (illustrative).

## Shot list and camera (crane up and drop down)
World: one concert hall seen from behind the conductor, 93 players in six arcs, podium at the bottom center; the hall sits in a loose ink outline of a nation with 36 other halls.

| t | shot | camera (center, zoom) | content |
|---|---|---|---|
| 0.0-1.5 | SC1 CLOSE, cold open (day 11.5) | her stand, zoom 7 | violinist at eye level, green page glowing on her stand, bows sawing at peak tempo, red wash. "Watch the green page." |
| 1.5-6.5 | SC2 CLOSE | zoom 7 -> 7.3 creep | day 0-5: slow bows, calm. "Every bow on the same beat." / "Her page can't reach the podium." (her line reaches out of frame and breaks) |
| 6.5-8.5 | SC3 CRANE UP | 7.3 -> 0.78 (whole hall) | reveal the orchestra, green pages scattered, lines breaking. |
| 8.5-9.5 | SC3 WIDE HOLD | 0.78 | labels: a neighbor with a key / a doctor / a forecaster. "Perfect time. Wrong score." |
| 9.5-10.7 | SC4 CRANE UP++ | 0.78 -> 0.27 (the nation) | every hall on the same beat, red over all. |
| 10.7-11.8 | SC4 NATION HOLD | 0.27 | "Every hall. The same beat." (days 9.2-10.3) |
| 11.8-12.8 | SC5 DROP DOWN | 0.27 -> 0.9 | back to the hall at the peak. |
| 12.8-14.2 | SC5 HALL | 0.9 | "Wait for it." Day 12.0 (t 13.5): her page reaches the podium. Stamp: "Day 12. The plan arrives." |
| 14.2-16.0 | SC6 DROP DOWN | 0.86 -> 9.5 | down past her to the empty chair beside her, closer than SC2. |
| 16.0-20.5 | SC6 CLOSE++ | 9.5 -> 10 creep | the chair, lamp out; the tempo slows as the red recedes. "After the peak." / "Some lamps were already out." |
| 20.5-23.0 | SLOW | hold, darken | "We slowed it down so you could see it." |
| 23.0-23.6 | freeze, silence | | |
| 23.6-31.0 | SC7 SNAP | two stacked 920 px panels | 19 days in 4.5 s each; same red, same chairs. People: day 12 (after the peak) / Frontier AI: day 3, illustrative. |
| 31.0-36.0 | SC8 DOLLY IN+ | podium, zoom 1 -> 5.5 | the conductor's stand: the pieces laid together as one green score over the gray program. "The score was already here." / "This is the bottleneck." |
| 36.0-40.0 | END | | end card, 4 s. |

Zoom cycles: IN 0-6.5 -> OUT 6.5-8.5 (hall) -> OUT++ 9.5-10.7 (nation) -> IN 11.8-12.8 (hall) -> IN++ 14.2-16.0 (zoom 9.5, closer than start 7); cycle 2: snap wide 23.6-31 -> IN+ 31-36 (podium).

## 3D translation note
A real concert hall in sumi-e: ink-textured shaders on gray paper, volumetric red haze pooling under the ceiling. SC1-SC2: 50 mm at seated eye height inside the second desk of the violins, shallow depth so neighboring bows cross the frame as soft ink strokes in sync. SC3: a single slow crane (2 s) rising straight up and back over the conductor's shoulder to a 24 mm top-down wide of the hall, then (SC4) continuing up through the roof to a satellite-high ortho view of the nation where every hall is a pulsing ring of lamps on one beat. The drop (SC5-SC6) is faster and lands at 85 mm on the empty chair, a dark lamp and a closed page. Snap is flat 2D panels on black. Richer in 3D: bow shadows strobing in unison on the stage floor, parallax between tiers, the green page's glow on her face, lamps going out as small smoke curls.

## Copy variants
- Watch the green page. / Every bow on the same beat. / Her page can't reach the podium. / Perfect time. Wrong score. / Every hall. The same beat. / Wait for it. / Day 12. The plan arrives. / After the peak. / Some lamps were already out. / We slowed it down so you could see it. / Same days. Full speed. / The score was already here. / This is the bottleneck.
- Alternates: "Nobody stops the program." / "In time. Out of time." / "The tempo is the red." / "Civilization plays in sync. Just not together."

## Tags
{"structure":"wait-for-it","medium":"ink wash","family":"music","scale":"nation","pace":"slow build","camera":"crane up and drop down","emotion":"grief","protagonist":"a crowd","analog":"heatwave-2003"}
Diversity check: OK (nearest ninety-seconds / day-three-hundred-five at 0.56).

## Scores (after render; 40.0 s confirmed by ffprobe)
- Hook: 6 (frame 1: red-washed section of violinists, one glowing green page with its line reaching out of frame, "Watch the green page."; the faces are small stick faces, so it reads more as a pattern than a person)
- Speed accuracy: 8 (same logistic fit as the sibling films; bow tempo, red wash and emptied chairs all run on the fitted curve; lognormal page arrivals; one stated mapping; the tempo is labeled in notes as a fitted curve, not a measurement)
- Snap impact: 6 (black freeze and hit, two 920 px panels with identical red and a heat strip; the green tick lands before the hump in one lane and after it in the other; the difference is 9 days and is staged, not inflated)
- Emotion: 6 (the empty chair beside her, her face turning to it, and lamps going dark on the beat carry the grief; the stick-figure look undercuts it a little)
- Originality: 7 (the tempo of a whole nation's orchestra is the heat curve: perfect sync on the wrong score; crane up to a nation of halls pulsing on one beat)
- Craft: 6 (ink-wash paper and washes work; the nation wide is legible; the figures are generic sticks and the snap halls are dense at phone size)
- Honesty: 9 (two numbers: day 12, verified, and day 3, illustrative; roles only, no unverified dates; chairs emptying is symbolic and stated; same red in both lanes, no outcome claimed)
- Overall: 6.9
- Virality: 6% (the "wait for it" promise and the synchronized-bows irony are a good hook, but a stick-figure orchestra is slow to read at thumbnail size and the payoff, a nine-day gap, is subtle for a casual scroll.)

Fix pass after the preview: brought the camera closer in both close shots (zoom 7 at the start, 9.5 on the empty chair) so faces read, fixed the "sad" brows (they read as angry), and moved the "SUMMER PROGRAM" title off the green slots.
