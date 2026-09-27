# The Long Season (slug: the-long-season)

Tier: animatic
Slug: the-long-season
Structure: sports-play-by-play (research/VIRAL_STRUCTURES.md #9)
Analog: penicillin-resistance-1946 (research/analogs/penicillin-resistance-1946.json)
Medium: stained glass (lead came, pane glass with highlights; only red and green saturated)
DUR: 39 s, 1080x1920, 30 fps

## Logline
Two commentators call a fifteen-season match from a stained-glass press box, as sound-off captions in play-by-play register. The red side scores every few months on a great rose-window scoreboard (odds doubling about every 7 months, derived). The green side's twelve players each sit on their own bench in their own little stadium, and the pass lines between them light one by one on a lognormal clock. The equalizer arrives in year 13, and red answers it in year 15. One fan in a green scarf sat through every season of it.

## Diversity change (logged)
Assigned emotion "resolve" came back TOO SIMILAR (nearest one-in-eight, 0.44: same analog, scale, camera, protagonist, emotion). Per the coordinator, structure and analog stayed; **emotion changed to tenderness** (the fan who never left; the ending ties the crowd's scarves into one green line). Result: OK, nearest ghost-rewind-covid / one-in-eight at 0.56.

## On-screen numbers (two)
1. "13" (year of the equalizer) = f3.ready_at, new compound in clinical use 1959, 13 years after t0 Apr 1946 (s5).
2. "15" (year it was answered) = f4.ready_at, 1961 (s5).
Not on screen: 59% (unverified), 12.5% / 38%, the 0.56-yr doubling, the 2.5-yr counterfactual (position only on the replay's season bar, no numeral), 69 (p90 rests on s6, verified:false; used only as the spread parameter, never shown). The season ruler is 15 unnumbered pennants (one per year).

## Time mapping (one mapping)
**1 film second = 1 season (year), linear, while the clock runs** (film 3.0-18.0 = years 0-15).
- Cold open 0-1.6: flash-forward to year 4 on the same board (4 of 15 pennants lit, board ~95% red by the fit), then a rewind to year 0.
- 1.6-3.0: hold at year 0 (1 in 8 panes red: 12.5%, the first measurement).
- 3.0-18.0: years 0 -> 15.
- Replay (snap): years 0-15 in 3 s, same uniform speed in both panels.

## Speed math
**Threat (red panes on the rose-window scoreboard).** 60 panes = one hospital's samples; pane k (random rank) turns red when extent(y) >= (k+0.5)/60, extent(y) = L.logistic(y, 0.56, 0.125). Doubling time 0.56 yr is DERIVED in the analog file (logistic through 12.5% Apr 1946 and 38% Jun 1947: r = 1.245/yr; ln2/r = 0.56 yr; this is the doubling of the odds, early phase). Checks: 0.378 at 1.17 yr (data 0.38); 0.555 at 1.75 yr. Beyond ~1.75 yr the curve is an extrapolation: board is labeled "one hospital's samples · fit". Values: y0 0.125, y1 0.33, y2 0.63, y3 0.85, y4 0.95, y5 0.99. Each newly red pane flashes = "red scores".

**Human aggregation (green pass lines).** 12 players, each on a separate bench in a separate stadium roundel around the central pitch. Player i's pass line reaches the pitch at Q((i+0.5)/12) = L.lognormalQuantile(q, median 13, p90 69), sigma = ln(69/13)/1.2816 = 1.302. Quantiles (yr): 1.36, 2.91, 4.51, 6.36, 8.58, 11.34, 14.90, 19.69, 26.56, 37.44, 58.16, 124.0. By year 13: 6 of 12 connected; by year 15: 7 of 12. (p10 of the file is 1.5 = the surveillance warning, matched by the first link at 1.36.) The p90 of 69 rests on an unverified source (WHO plan 2015); used only as spread, never shown.
**Equalizer:** the green star (f3, new compound) lights on the central pitch at year 13 (s5). **Answer:** at year 15 (f4, s5) red pieces appear on the star's rim and its green drains to gray (loss as absence).

**AI counterfactual (illustrative, labeled on screen, no numeral).** ai_counterfactual.aggregation_median = 2.5 yr (the file's assumption: a routed stewardship response ~1 year after the warning). Same sigma: Q_ai = Q x 2.5/13 = 0.26, 0.56, 0.87, 1.22, 1.65, 2.18, 2.86, 3.79, 5.11, 7.20, 11.18, 23.85. By year 15: 11 of 12. Basis: turning surveillance from many hospitals into routed policy is analysis and communication work well inside the ~17.4 h 50% METR task horizon (RATES.md), cheap to repeat (Epoch: ~40x/yr cost fall at fixed capability). It does NOT move the chemistry: the star still lights at 13 in both panels, and still gets answered at 15; the red board is identical in both panels. On screen: "Passes routed sooner", "Illustrative", "The chemistry still takes years." The replay's season bar marks the human median tick at 13 and the illustrative median tick at the 2.5 position, unlabeled.
Snap ratio (notes only): 13 vs 2.5 yr median, ~5x.

## Shot list (camera = two-layer parallax crane: crowd layer + field/board layer, both eased keyframes)
| t | shot | camera | slate |
|---|---|---|---|
| 0.0-1.6 | COLD OPEN year 4: fan's face at eye level, green scarf, rose-window board ~all red behind her, red glow on her face. "AND WE'RE LIVE." | CLOSE eye level (crowd z 3.3) | SC1 CLOSE (FLASH-FORWARD) |
| 1.6-3.0 | Rewind to year 0: 1 in 8 panes red. "Season one. Red's on the board." | CLOSE | SC2 CLOSE |
| 3.0-6.0 | Years 0-3; panes flash red. "Red scores again." / "Every few months now." | CLOSE, slow push | SC2 CLOSE |
| 6.0-10.0 | CRANE UP over the stands: the board, the pitch, twelve separate stadiums each with one green player on a bench. "Where's green?" / "All here. Separate benches." | crowd z 3.3 -> 1, field z 1.25 -> 1 | SC3 CRANE UP |
| 10.0-14.0 | WIDE: pass lines light at lognormal times. "Separate stadiums." / "Nobody's passing." / "Long season, folks." | WIDE hold, slight drift | SC3 WIDE |
| 14.0-16.0 | DROP DOWN to the fan, closer than before. "She hasn't missed a game." | crowd z 1 -> 4.2 | SC4 DROP DOWN |
| 16.0-19.5 | Year 13: star lights, fan rises. "YEAR 13. THE EQUALIZER." Year 15: star drains. "Year 15. Answered." Commentary stops. | CLOSE+ hold | SC4 CLOSE+ |
| 19.5-21.8 | Silence. "We slowed it down so you could see it." (instant-replay styling) | CLOSE+ hold, dimmed | SC5 REPLAY |
| 21.8-30.4 | Freeze, one hit. Two 940-px panels: "AS IT HAPPENED" (runs alone, 3 s) then with "PASSES ROUTED SOONER / ILLUSTRATIVE" (both 3 s). "The chemistry still takes years." | flat SPLIT | SC6 SNAP |
| 30.4-33.8 | IN++: extreme close on the fan's hand tying her scarf to her neighbor's; a green line runs down the row. "This is the bottleneck." | DROP IN (crowd z 5.5) | SC7 EXTREME CLOSE |
| 33.8-39.0 | L.endCard (5.2 s) | - | - |

Zoom cycles: IN 0-6 (z 3.3) -> OUT 6-14 (z 1, crane) -> IN+ 14-21.8 (z 4.2) -> snap (flat) -> IN++ 30.4-33.8 (z 5.5).

## 3D translation note
A real stained-glass stadium: a vaulted nave whose floor is a football pitch, lit from outside so every pane glows. Shot 1: 50 mm at eye height on one fan in the front row, the rose-window scoreboard enormous and soft-focus behind her, red light raking her face. Crane up: 4 s on a 10 m jib, tilting down and widening to 20 mm; the parallax between the stands and the floor should feel like rising through the cathedral; the twelve stadiums turn out to be separate glass chapels along the aisles, each with one lit player on a bench, their pass lines as lead came that fills with green light when a pass lands. Drop down: 2 s, faster and lower, landing at 85 mm on the fan. Rich in 3D: refracted colored light moving across faces as panes flip, dust in the beams, the lead lines as physical relief. The final scarf-tying close-up at macro distance, with the green line of knotted scarves racking focus down the row.

## Copy variants
- "Civilization has lag. Fifteen seasons of it." / "Green has every player. None on the same pitch." / "Red scores. Green is still in the locker room." / "Pass it. Anyone. Please." / "The answer is already here. On twelve benches." / "Same crowd. Same pieces. Routed sooner."

## Tags
{"structure":"sports-play-by-play","medium":"stained glass","family":"sport","scale":"history","pace":"slow build","emotion":"tenderness","protagonist":"a crowd","camera":"crane up and drop down","analog":"penicillin-resistance-1946"}

## Build notes
- Preview 1: board-label collided with the top stadium in the wide; neighbors' scarves competed with the hero's; final close put the "bottleneck" card over faces. Fixed (board moved up/smaller, league ring flattened, neighbor scarves dimmed until tied, IN++ reframed, card raised). Preview 2 clean. Rendered 39.0 s (ffprobe).
- Known weaknesses: the board is ~95% red by year 4 (true to the fit, but it reads as "static red" for most of the race); the fan's raised arms are blocky; snap panels' league networks are small on a phone (panels are 940 px wide, labels 44-48 px).

## Scores
Hook: 7
Speed accuracy: 8
Snap impact: 6
Emotion: 7
Originality: 6
Craft: 7
Honesty: 9
Overall: 7.1
Virality: 7% — the stained-glass fan under a blazing red rose window is a strong thumbnail and the play-by-play captions give sound-off viewers a reason to stay, but it is the seventh film on this analog and a second sports-commentary film, and the snap's difference (more green lines) is subtle on a phone.
